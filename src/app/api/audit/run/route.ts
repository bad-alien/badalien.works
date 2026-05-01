import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getSession, setInputs, setBrief } from '@/lib/auditSession';
import { runAudit, calculateAuditCostUSD } from '@/lib/auditClient';
import { fetchPageText, isPrivateHostname } from '@/lib/auditFetch';
import { checkAuditRateLimit, isBudgetExceeded, recordAuditCost } from '@/lib/auditRateLimit';
import { sendAuditEmail } from '@/lib/leadEmail';

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
            if (!recordAuditCost(costUSD)) {
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

          // Send audit email via leadEmail (non-blocking, errors swallowed)
          const updatedSession = getSession(session_id);
          if (updatedSession) {
            sendAuditEmail(updatedSession).catch((e) => {
              console.error('[audit/run] email send error:', e instanceof Error ? e.message : e);
            });
          }
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
