import { NextRequest } from 'next/server';
import { JSDOM } from 'jsdom';
import { promises as fs } from 'fs';
import path from 'path';
import dns from 'dns';
import { Resend } from 'resend';
import { getSession, setInputs, setBrief, type AuditBrief } from '@/lib/auditSession';
import { runAudit, calculateAuditCostUSD } from '@/lib/auditClient';

const dnsPromises = dns.promises;

// ---------------------------------------------------------------------------
// Per-IP audit rate limit: 3 per 24h
// ---------------------------------------------------------------------------
const auditRateMap = new Map<string, { count: number; resetTime: number }>();
const AUDIT_RATE_LIMIT = 3;
const AUDIT_RATE_WINDOW_MS = 24 * 60 * 60 * 1000;

function checkAuditRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = auditRateMap.get(ip);
  if (!record || now > record.resetTime) {
    auditRateMap.set(ip, { count: 1, resetTime: now + AUDIT_RATE_WINDOW_MS });
    return true;
  }
  if (record.count >= AUDIT_RATE_LIMIT) return false;
  record.count++;
  return true;
}

// ---------------------------------------------------------------------------
// Daily budget kill switch
// ---------------------------------------------------------------------------
let dailySpendUSD = 0;
let budgetResetAt = nextMidnightUTC();

function nextMidnightUTC(): number {
  const now = new Date();
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return midnight.getTime();
}

function checkBudget(costUSD: number): boolean {
  const now = Date.now();
  if (now > budgetResetAt) {
    dailySpendUSD = 0;
    budgetResetAt = nextMidnightUTC();
  }
  const limit = parseFloat(process.env.AUDIT_DAILY_BUDGET_USD || '10');
  if (dailySpendUSD >= limit) return false;
  dailySpendUSD += costUSD;
  return true;
}

function isBudgetExceeded(): boolean {
  const now = Date.now();
  if (now > budgetResetAt) {
    dailySpendUSD = 0;
    budgetResetAt = nextMidnightUTC();
  }
  const limit = parseFloat(process.env.AUDIT_DAILY_BUDGET_USD || '10');
  return dailySpendUSD >= limit;
}

// ---------------------------------------------------------------------------
// SSRF guard: resolve hostname, reject private/loopback ranges
// ---------------------------------------------------------------------------
const PRIVATE_RANGES = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^::1$/,
  /^fc[0-9a-f]{2}:/i,
  /^fd[0-9a-f]{2}:/i,
  /^fe[89ab][0-9a-f]:/i,
];

async function isPrivateHostname(hostname: string): Promise<boolean> {
  // Strip brackets from IPv6 literals (e.g. "[::1]" → "::1") and check directly
  // before DNS lookup — dns.promises.lookup rejects bracketed hostnames with ENOTFOUND,
  // which would let IPv6 loopback/private addresses slip through.
  const bare = hostname.startsWith('[') && hostname.endsWith(']')
    ? hostname.slice(1, -1)
    : hostname;

  if (PRIVATE_RANGES.some((re) => re.test(bare))) return true;

  try {
    const result = await dnsPromises.lookup(bare);
    return PRIVATE_RANGES.some((re) => re.test(result.address));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Fetch page text with SSRF guards
// ---------------------------------------------------------------------------
async function fetchPageText(url: string): Promise<{ text: string; blocked: boolean }> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { text: '', blocked: true };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { text: '', blocked: true };
  }

  if (await isPrivateHostname(parsed.hostname)) {
    return { text: '', blocked: true };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AuditBot/1.0)' },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return { text: '', blocked: false };
    }

    // Cap at 2 MB
    const reader = response.body?.getReader();
    if (!reader) return { text: '', blocked: false };

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    const MAX_BYTES = 2 * 1024 * 1024;

    while (true) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      totalBytes += value.length;
      if (totalBytes > MAX_BYTES) break;
      chunks.push(value);
    }
    reader.cancel();

    const html = Buffer.concat(chunks).toString('utf-8');

    // Parse with jsdom and extract clean text
    const dom = new JSDOM(html, { url });
    const doc = dom.window.document;

    // Remove noisy elements
    for (const tag of ['script', 'style', 'nav', 'footer', 'header', 'noscript', 'iframe', 'svg']) {
      for (const el of doc.querySelectorAll(tag)) {
        el.remove();
      }
    }

    const text = (doc.body?.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000);

    return { text, blocked: false };
  } catch {
    return { text: '', blocked: false };
  }
}

// ---------------------------------------------------------------------------
// Transcript logging
// ---------------------------------------------------------------------------
async function appendTranscriptEvent(session_id: string, event: Record<string, unknown>): Promise<void> {
  try {
    const date = new Date().toISOString().slice(0, 10);
    const dir = path.join(process.cwd(), 'audit_logs', date);
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, `${session_id}.jsonl`);
    await fs.appendFile(file, JSON.stringify(event) + '\n', 'utf-8');
  } catch (e) {
    console.error('[audit/run] transcript log error:', e instanceof Error ? e.message : e);
  }
}

// ---------------------------------------------------------------------------
// Resend email on brief completion
// ---------------------------------------------------------------------------
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"'/]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;' }[c] || c)
  );
}

async function sendAuditEmail(params: {
  url: string;
  bottleneck: string;
  sensitive_docs: string;
  brief: AuditBrief;
  session_id: string;
  ip: string;
}): Promise<void> {
  try {
    const { url, bottleneck, sensitive_docs, brief, session_id } = params;
    const hostname = (() => { try { return new URL(url).hostname; } catch { return url; } })();

    const opportunitiesHtml = brief.opportunities
      .map(
        (o, i) =>
          `<li><strong>${i + 1}. ${escapeHtml(o.title)}</strong><br/>${escapeHtml(o.solves)}<br/><em>Effort: ${o.effort} · ROI: ${o.roi}</em></li>`
      )
      .join('');

    const html = `
      <h2>[Audit] ${escapeHtml(hostname)} — score ${brief.score}/10</h2>
      <p><strong>URL:</strong> ${escapeHtml(url)}</p>
      <p><strong>Bottleneck:</strong> ${escapeHtml(bottleneck)}</p>
      <p><strong>Sensitive docs:</strong> ${escapeHtml(sensitive_docs)}</p>
      <p><strong>Score:</strong> ${brief.score}/10 — ${escapeHtml(brief.score_label)}</p>
      <h3>Observations</h3>
      <ul>${brief.observations.map((o) => `<li>${escapeHtml(o)}</li>`).join('')}</ul>
      <h3>Opportunities</h3>
      <ol>${opportunitiesHtml}</ol>
      ${brief.sovereignty_callout ? `<h3>Data Sovereignty Note</h3><p>${escapeHtml(brief.sovereignty_callout)}</p>` : ''}
      <hr/>
      <p><small>Session: ${escapeHtml(session_id)} · ${new Date().toISOString()}</small></p>
    `;

    await getResend().emails.send({
      from: 'Audit Bot <r@badalien.works>',
      to: 'r@badalien.works',
      subject: `[Audit] ${hostname} — score ${brief.score}/10`,
      html,
    });
  } catch (e) {
    console.error('[audit/run] email send error:', e instanceof Error ? e.message : e);
  }
}

// ---------------------------------------------------------------------------
// SSE helper
// ---------------------------------------------------------------------------
function sseEvent(event: string, data: Record<string, unknown>): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // Budget pre-check before any processing
  if (isBudgetExceeded()) {
    return new Response(
      JSON.stringify({ error: { code: 'BUDGET_EXCEEDED', message: 'Daily audit budget exhausted. Try again tomorrow.' } }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!checkAuditRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Maximum 3 audits per day per IP.' } }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'Invalid JSON body.' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { session_id, url, bottleneck, sensitive_docs } = body as {
    session_id?: string;
    url?: string;
    bottleneck?: string;
    sensitive_docs?: string;
  };

  // Validate inputs
  if (!session_id || typeof session_id !== 'string') {
    return new Response(
      JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'session_id is required.' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!url || typeof url !== 'string') {
    return new Response(
      JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'url is required.' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // URL validation
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return new Response(
      JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'url must be a valid URL.' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return new Response(
      JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'url must use http or https.' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // SSRF: reject private/loopback before streaming starts
  if (await isPrivateHostname(parsedUrl.hostname)) {
    return new Response(
      JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'url resolves to a private or loopback address.' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!bottleneck || typeof bottleneck !== 'string') {
    return new Response(
      JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'bottleneck is required.' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (bottleneck.length > 1000) {
    return new Response(
      JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'bottleneck must be ≤ 1000 characters.' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!sensitive_docs || !['yes', 'sometimes', 'no'].includes(sensitive_docs)) {
    return new Response(
      JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'sensitive_docs must be yes, sometimes, or no.' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const session = getSession(session_id);
  if (!session) {
    return new Response(
      JSON.stringify({ error: { code: 'SESSION_NOT_FOUND', message: 'Session not found or expired.' } }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Persist inputs to session
  setInputs(session_id, {
    url,
    bottleneck,
    sensitive_docs: sensitive_docs as 'yes' | 'sometimes' | 'no',
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const enqueue = (event: string, data: Record<string, unknown>) => {
        try {
          controller.enqueue(encoder.encode(sseEvent(event, data)));
        } catch {
          // Stream may have been closed
        }
      };

      (async () => {
        try {
          // Log inputs
          await appendTranscriptEvent(session_id, {
            event: 'inputs',
            session_id,
            url,
            bottleneck,
            sensitive_docs,
            ip,
            ts: new Date().toISOString(),
          });

          // Step 1: Fetch URL
          enqueue('status', { status: 'reading_url', message: `Reading ${parsedUrl.hostname}…` });
          await appendTranscriptEvent(session_id, { event: 'status', status: 'reading_url', ts: new Date().toISOString() });

          const { text: page_text, blocked } = await fetchPageText(url);

          // Step 2: Analyze
          enqueue('status', { status: 'analyzing', message: 'Analyzing AI opportunities…' });
          await appendTranscriptEvent(session_id, {
            event: 'status',
            status: 'analyzing',
            page_text_length: page_text.length,
            fetch_blocked: blocked,
            ts: new Date().toISOString(),
          });

          // Step 3: Draft
          enqueue('status', { status: 'drafting', message: 'Drafting your brief…' });
          await appendTranscriptEvent(session_id, { event: 'status', status: 'drafting', ts: new Date().toISOString() });

          const result = await runAudit({
            url,
            page_text,
            bottleneck,
            sensitive_docs: sensitive_docs as 'yes' | 'sometimes' | 'no',
          });

          // Track budget
          if (!result.stub) {
            const costUSD = calculateAuditCostUSD(result.usage);
            if (!checkBudget(costUSD)) {
              enqueue('error', { code: 'BUDGET_EXCEEDED', message: 'Daily audit budget exhausted.' });
              controller.close();
              return;
            }
          }

          // Persist brief to session
          setBrief(session_id, result.brief);

          // Log to transcript
          await appendTranscriptEvent(session_id, {
            event: 'brief',
            session_id,
            brief: result.brief,
            usage: result.usage,
            stub: result.stub,
            ts: new Date().toISOString(),
          });

          // Step 4: Done
          enqueue('done', { status: 'done', brief: result.brief });

          // Send email (non-blocking, errors swallowed)
          sendAuditEmail({
            url,
            bottleneck,
            sensitive_docs,
            brief: result.brief,
            session_id,
            ip,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Unknown error';
          console.error('[audit/run] pipeline error:', message);
          await appendTranscriptEvent(session_id, {
            event: 'error',
            message,
            ts: new Date().toISOString(),
          });
          try {
            controller.enqueue(encoder.encode(sseEvent('error', { code: 'INTERNAL_ERROR', message })));
          } catch {
            // ignore
          }
        } finally {
          try {
            controller.close();
          } catch {
            // ignore
          }
        }
      })();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
