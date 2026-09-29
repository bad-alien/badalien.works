import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  STUB_BRIEF,
  makePostRequest,
  LEAD_EMAIL,
  createTestSession,
  makeAuditToken,
} from './_helpers'

// ── Mocks ──────────────────────────────────────────────────────────────────

const mockResendSend = vi.fn()
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mockResendSend }
  },
}))

vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      body,
      status: init?.status ?? 200,
    }),
  },
}))

// ── Tests ──────────────────────────────────────────────────────────────────

describe('POST /api/audit/reachout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.stubEnv('RESEND_API_KEY', 'test-resend-key')
    mockResendSend.mockResolvedValue({ data: { id: 'lead-email-123' }, error: null })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('happy path', () => {
    it('returns 200 ok=true and fires Resend with [Lead] subject to r@badalien.works', async () => {
      const session_id = await createTestSession()
      const audit_token = await makeAuditToken(session_id)

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        {
          session_id, audit_token,
          email: 'prospect@company.com',
          best_time: 'Tuesday afternoons or Thursday mornings',
        },
        { 'x-forwarded-for': '1.2.3.4' }
      )
      const res = await POST(req as any)

      expect(res.status).toBe(200)
      expect((res.body as any).ok).toBe(true)
      expect(mockResendSend).toHaveBeenCalledTimes(1)
      const callArgs = mockResendSend.mock.calls[0][0]
      expect(callArgs.to).toContain(LEAD_EMAIL)
      expect(callArgs.subject).toMatch(/\[Lead\]/i)
    })

    it('email body includes brief content and lead details', async () => {
      const session_id = await createTestSession()
      const audit_token = await makeAuditToken(session_id)

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        {
          session_id, audit_token,
          email: 'prospect@company.com',
          best_time: 'Tuesday afternoons',
          phone: '+1-555-0100',
        },
        { 'x-forwarded-for': '1.2.3.5' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)

      const callArgs = mockResendSend.mock.calls[0][0]
      const emailBody = (callArgs.html ?? '') + (callArgs.text ?? '')
      expect(emailBody).toContain('prospect@company.com')
      expect(emailBody).toContain('Tuesday afternoons')
      // Should reference the brief score or an opportunity title
      expect(emailBody).toMatch(/7\.5|Automated CRM|Follow.Up|reporting/i)
    })

    it('accepts a request without optional phone field', async () => {
      const session_id = await createTestSession()
      const audit_token = await makeAuditToken(session_id)

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        {
          session_id, audit_token,
          email: 'no-phone@company.com',
          best_time: 'Any weekday morning',
        },
        { 'x-forwarded-for': '1.2.3.6' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      expect((res.body as any).ok).toBe(true)
    })
  })

  describe('validation', () => {
    it('returns 400 for an invalid email address', async () => {
      const session_id = await createTestSession()
      const audit_token = await makeAuditToken(session_id)

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id, audit_token, email: 'not-an-email', best_time: 'Tuesday' },
        { 'x-forwarded-for': '1.2.3.10' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })

    it('returns 400 for an empty best_time', async () => {
      const session_id = await createTestSession()
      const audit_token = await makeAuditToken(session_id)

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id, audit_token, email: 'a@b.com', best_time: '' },
        { 'x-forwarded-for': '1.2.3.11' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })

    it('accepts a lead with no session_id or audit token (FAQ-only visitor)', async () => {
      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { email: 'a@b.com', best_time: 'Tuesday' },
        { 'x-forwarded-for': '1.2.3.12' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      expect(mockResendSend).toHaveBeenCalledTimes(1)
    })

    it('returns 400 when email is missing', async () => {
      const session_id = await createTestSession()
      const audit_token = await makeAuditToken(session_id)

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id, audit_token, best_time: 'Tuesday' },
        { 'x-forwarded-for': '1.2.3.13' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })
  })

  describe('audit context', () => {
    it('session without an audit token → 200, lead email sent without a brief', async () => {
      const session_id = await createTestSession()

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id, email: 'faq@b.com', best_time: 'Tuesday' },
        { 'x-forwarded-for': '1.2.3.20' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      const { html, text } = mockResendSend.mock.calls[0][0]
      expect(text).toMatch(/no audit/i)
      expect(html).not.toContain('Automated CRM')
      expect(text).toContain(session_id)
    })

    it('tampered audit token → 200 but the forged brief is not trusted', async () => {
      const session_id = await createTestSession()
      const audit_token = await makeAuditToken(session_id)
      const [payload, sig] = audit_token.split('.')
      const forged = JSON.parse(Buffer.from(payload, 'base64url').toString())
      forged.brief.opportunities[0].title = 'Injected Title'
      const tampered = `${Buffer.from(JSON.stringify(forged)).toString('base64url')}.${sig}`

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id, audit_token: tampered, email: 'a@b.com', best_time: 'Tuesday' },
        { 'x-forwarded-for': '1.2.3.21' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      const { html, text } = mockResendSend.mock.calls[0][0]
      expect(html + text).not.toContain('Injected Title')
      expect(text).toMatch(/no audit/i)
    })
  })

  describe('abuse hardening', () => {
    it('filled honeypot → 200 ok but no email is sent', async () => {
      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { email: 'bot@spam.com', best_time: 'now', website: 'http://spam.example' },
        { 'x-forwarded-for': '1.2.3.22' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      expect((res.body as any).ok).toBe(true)
      expect(mockResendSend).not.toHaveBeenCalled()
    })

    it('collapses newlines in best_time before it reaches the email subject', async () => {
      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { email: 'a@b.com', best_time: 'Tuesday\r\nBcc: victim@example.com' },
        { 'x-forwarded-for': '1.2.3.23' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      const { subject } = mockResendSend.mock.calls[0][0]
      expect(subject).not.toMatch(/[\r\n]/)
    })

    it('rejects oversized bodies with 413', async () => {
      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { email: 'a@b.com', best_time: 'Tuesday', filler: 'x'.repeat(40_000) },
        { 'x-forwarded-for': '1.2.3.24', 'content-length': '40100' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(413)
      expect(mockResendSend).not.toHaveBeenCalled()
    })
  })

  describe('Resend failure resilience', () => {
    it('returns ok=true even when Resend throws — endpoint must not crash', async () => {
      const session_id = await createTestSession()
      const audit_token = await makeAuditToken(session_id)
      mockResendSend.mockRejectedValue(new Error('Resend API is down'))

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id, audit_token, email: 'a@b.com', best_time: 'Tuesday' },
        { 'x-forwarded-for': '1.2.3.30' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      expect((res.body as any).ok).toBe(true)
    })
  })

  describe('rate limiting', () => {
    it('returns 429 on the 6th request from the same IP within ten minutes', async () => {
      const ip = '7.7.7.7'
      const { POST } = await import('@/app/api/audit/reachout/route')

      for (let i = 0; i < 5; i++) {
        const session_id = await createTestSession()
        const audit_token = await makeAuditToken(session_id)
        const req = makePostRequest(
          'http://localhost/api/audit/reachout',
          { session_id, audit_token, email: `user${i}@example.com`, best_time: 'Anytime' },
          { 'x-forwarded-for': ip }
        )
        const res = await POST(req as any)
        expect(res.status).not.toBe(429)
      }

      const session_id = await createTestSession()
      const audit_token = await makeAuditToken(session_id)
      const req6 = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id, audit_token, email: 'overflow@example.com', best_time: 'Anytime' },
        { 'x-forwarded-for': ip }
      )
      const res6 = await POST(req6 as any)
      expect(res6.status).toBe(429)
    }, 15000)
  })
})
