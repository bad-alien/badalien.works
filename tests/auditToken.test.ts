import { describe, it, expect, vi, afterEach } from 'vitest'
import { signAuditContext, verifyAuditToken, isAuditSigningConfigured } from '@/lib/auditToken'
import { STUB_BRIEF, VALID_URL, VALID_BOTTLENECK } from './api/_helpers'

const ctx = {
  sid: 'sid-1',
  url: VALID_URL,
  bottleneck: VALID_BOTTLENECK,
  sensitive_docs: 'no' as const,
  brief: STUB_BRIEF,
}

describe('auditToken', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.useRealTimers()
  })

  it('round-trips a signed context', () => {
    const out = verifyAuditToken(signAuditContext(ctx))
    expect(out).toMatchObject(ctx)
  })

  it('rejects a token signed with a different secret', () => {
    vi.stubEnv('AUDIT_SIGNING_SECRET', 'secret-a')
    const token = signAuditContext(ctx)
    vi.stubEnv('AUDIT_SIGNING_SECRET', 'secret-b')
    expect(verifyAuditToken(token)).toBeNull()
  })

  it('rejects malformed input', () => {
    for (const bad of [undefined, null, 42, '', 'abc', 'a.b.c', 'x'.repeat(20_000)]) {
      expect(verifyAuditToken(bad)).toBeNull()
    }
  })

  it('rejects tokens older than 24h', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-01T00:00:00Z'))
    const token = signAuditContext(ctx)
    vi.setSystemTime(new Date('2026-09-02T00:00:01Z'))
    expect(verifyAuditToken(token)).toBeNull()
  })

  it('is unconfigured in production without AUDIT_SIGNING_SECRET, and never falls back to the dev secret', () => {
    const devToken = signAuditContext(ctx)
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('AUDIT_SIGNING_SECRET', '')
    expect(isAuditSigningConfigured()).toBe(false)
    expect(verifyAuditToken(devToken)).toBeNull()
    expect(() => signAuditContext(ctx)).toThrow(/AUDIT_SIGNING_SECRET/)
  })
})
