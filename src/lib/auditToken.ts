import { createHmac, timingSafeEqual } from 'crypto';
import type { AuditBrief } from '@/lib/auditSession';

// Stateless audit context: the server signs the audit inputs + brief and hands
// the token to the client, which sends it back to /api/chat and
// /api/audit/reachout. Survives serverless instance hopping without a store,
// and the HMAC stops clients from injecting their own brief into prompts/emails.

export type AuditContext = {
  sid: string;
  url: string;
  bottleneck: string;
  sensitive_docs: 'yes' | 'sometimes' | 'no';
  brief: AuditBrief;
  iat: number;
};

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
export const MAX_TOKEN_LENGTH = 16_384;

const DEV_SECRET = 'dev-only-audit-signing-secret';

function getSecret(): string | null {
  const secret = process.env.AUDIT_SIGNING_SECRET;
  if (secret) return secret;
  return process.env.NODE_ENV === 'production' ? null : DEV_SECRET;
}

export function isAuditSigningConfigured(): boolean {
  return getSecret() !== null;
}

function hmac(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function signAuditContext(ctx: Omit<AuditContext, 'iat'>): string {
  const secret = getSecret();
  if (!secret) throw new Error('AUDIT_SIGNING_SECRET is not set');
  const payload = Buffer.from(JSON.stringify({ ...ctx, iat: Date.now() })).toString('base64url');
  return `${payload}.${hmac(payload, secret)}`;
}

export function verifyAuditToken(token: unknown): AuditContext | null {
  if (typeof token !== 'string' || token.length === 0 || token.length > MAX_TOKEN_LENGTH) return null;
  const secret = getSecret();
  if (!secret) return null;

  const [payload, sig, ...rest] = token.split('.');
  if (!payload || !sig || rest.length > 0) return null;

  const expected = Buffer.from(hmac(payload, secret));
  const actual = Buffer.from(sig);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const ctx = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as AuditContext;
    if (typeof ctx.iat !== 'number' || Date.now() - ctx.iat > TOKEN_TTL_MS) return null;
    if (!ctx.brief || !Array.isArray(ctx.brief.opportunities)) return null;
    return ctx;
  } catch {
    return null;
  }
}
