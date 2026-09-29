import { NextRequest, NextResponse } from 'next/server';
import type { AuditSession } from '@/lib/auditSession';
import { verifyAuditToken } from '@/lib/auditToken';
import { sendLeadEmail } from '@/lib/leadEmail';

// Each accepted request sends an email, so keep the per-IP budget tight.
// In-memory and per-instance: a speed bump, not a hard guarantee.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY_BYTES = 32 * 1024;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// E.164-ish: optional + then 7-15 digits, spaces/dashes/parens allowed
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

function validationError(code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status: 400 });
}

// Collapse newlines/control chars — best_time ends up in the email subject line
function singleLine(text: string): string {
  return text.replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Try again in a few minutes.' } },
      { status: 429 }
    );
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body is too large.' } },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return validationError('INVALID_JSON', 'Request body must be valid JSON.');
  }

  const data = (body ?? {}) as Record<string, unknown>;

  const { session_id, audit_token, email, best_time, phone, website } = data;

  // Honeypot: real visitors never see this field. Pretend success so bots move on.
  if (typeof website === 'string' && website.trim() !== '') {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (session_id !== undefined && session_id !== null && session_id !== '') {
    if (typeof session_id !== 'string' || session_id.length > 128) {
      return validationError('INVALID_SESSION_ID', 'session_id must be a string ≤ 128 characters.');
    }
  }

  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return validationError('INVALID_EMAIL', 'A valid email address is required.');
  }
  if (email.length > 254) {
    return validationError('INVALID_EMAIL', 'Email address is too long.');
  }

  if (!best_time || typeof best_time !== 'string' || singleLine(best_time) === '') {
    return validationError('MISSING_BEST_TIME', 'best_time is required.');
  }
  if (best_time.length > 200) {
    return validationError('INVALID_BEST_TIME', 'best_time must be ≤ 200 characters.');
  }

  if (phone !== undefined && phone !== null && phone !== '') {
    if (typeof phone !== 'string' || !PHONE_RE.test(String(phone).trim())) {
      return validationError('INVALID_PHONE', 'Phone number format is not valid.');
    }
    if (String(phone).length > 30) {
      return validationError('INVALID_PHONE', 'Phone number is too long.');
    }
  }

  // Audit context is optional: FAQ-only visitors are still leads. An invalid or
  // expired token just means the email goes out without the brief.
  const audit = verifyAuditToken(audit_token);
  const context: AuditSession = audit
    ? {
        session_id: audit.sid,
        url: audit.url,
        bottleneck: audit.bottleneck,
        sensitive_docs: audit.sensitive_docs,
        brief: audit.brief,
      }
    : { session_id: typeof session_id === 'string' ? session_id.trim() : '' };

  await sendLeadEmail(context, {
    email: email.trim(),
    best_time: singleLine(best_time),
    phone: phone ? String(phone).trim() : undefined,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
