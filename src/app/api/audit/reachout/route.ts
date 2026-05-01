import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auditSession';
import { sendLeadEmail } from '@/lib/leadEmail';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

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

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests.' } },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return validationError('INVALID_JSON', 'Request body must be valid JSON.');
  }

  const data = body as Record<string, unknown>;

  const session_id = data.session_id;
  const email = data.email;
  const best_time = data.best_time;
  const phone = data.phone;

  if (!session_id || typeof session_id !== 'string' || session_id.trim() === '') {
    return validationError('MISSING_SESSION_ID', 'session_id is required.');
  }
  if (session_id.length > 128) {
    return validationError('INVALID_SESSION_ID', 'session_id must be ≤ 128 characters.');
  }

  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return validationError('INVALID_EMAIL', 'A valid email address is required.');
  }
  if (email.length > 254) {
    return validationError('INVALID_EMAIL', 'Email address is too long.');
  }

  if (!best_time || typeof best_time !== 'string' || best_time.trim() === '') {
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

  const session = getSession(session_id.trim());
  if (!session || !session.brief) {
    return NextResponse.json(
      { error: { code: 'SESSION_NOT_FOUND', message: 'Session not found or has no brief.' } },
      { status: 400 }
    );
  }

  await sendLeadEmail(session, {
    email: email.trim(),
    best_time: best_time.trim(),
    phone: phone ? String(phone).trim() : undefined,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
