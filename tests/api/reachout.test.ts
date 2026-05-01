import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  STUB_BRIEF,
  makePostRequest,
  LEAD_EMAIL,
  createTestSession,
  seedSessionWithBrief,
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
      await seedSessionWithBrief(session_id)

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        {
          session_id,
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
      await seedSessionWithBrief(session_id)

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        {
          session_id,
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
      await seedSessionWithBrief(session_id)

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        {
          session_id,
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
      await seedSessionWithBrief(session_id)

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id, email: 'not-an-email', best_time: 'Tuesday' },
        { 'x-forwarded-for': '1.2.3.10' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })

    it('returns 400 for an empty best_time', async () => {
      const session_id = await createTestSession()
      await seedSessionWithBrief(session_id)

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id, email: 'a@b.com', best_time: '' },
        { 'x-forwarded-for': '1.2.3.11' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })

    it('returns 400 when session_id is missing', async () => {
      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { email: 'a@b.com', best_time: 'Tuesday' },
        { 'x-forwarded-for': '1.2.3.12' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })

    it('returns 400 when email is missing', async () => {
      const session_id = await createTestSession()
      await seedSessionWithBrief(session_id)

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id, best_time: 'Tuesday' },
        { 'x-forwarded-for': '1.2.3.13' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })
  })

  describe('session errors', () => {
    it('returns 400 SESSION_NOT_FOUND when session does not exist', async () => {
      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id: 'nonexistent-xyz', email: 'a@b.com', best_time: 'Tuesday' },
        { 'x-forwarded-for': '1.2.3.20' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
      expect(JSON.stringify((res.body as any))).toMatch(/SESSION_NOT_FOUND/i)
    })

    it('returns 400 SESSION_NOT_FOUND when session exists but has no brief', async () => {
      const session_id = await createTestSession()
      // Do NOT seed a brief — session exists but brief is undefined

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id, email: 'a@b.com', best_time: 'Tuesday' },
        { 'x-forwarded-for': '1.2.3.21' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })
  })

  describe('Resend failure resilience', () => {
    it('returns ok=true even when Resend throws — endpoint must not crash', async () => {
      const session_id = await createTestSession()
      await seedSessionWithBrief(session_id)
      mockResendSend.mockRejectedValue(new Error('Resend API is down'))

      const { POST } = await import('@/app/api/audit/reachout/route')
      const req = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id, email: 'a@b.com', best_time: 'Tuesday' },
        { 'x-forwarded-for': '1.2.3.30' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      expect((res.body as any).ok).toBe(true)
    })
  })

  describe('rate limiting', () => {
    it('returns 429 on the 31st request from the same IP within one minute', async () => {
      const ip = '7.7.7.7'
      const { POST } = await import('@/app/api/audit/reachout/route')

      for (let i = 0; i < 30; i++) {
        const session_id = await createTestSession()
        await seedSessionWithBrief(session_id)
        const req = makePostRequest(
          'http://localhost/api/audit/reachout',
          { session_id, email: `user${i}@example.com`, best_time: 'Anytime' },
          { 'x-forwarded-for': ip }
        )
        const res = await POST(req as any)
        expect(res.status).not.toBe(429)
      }

      const session_id = await createTestSession()
      await seedSessionWithBrief(session_id)
      const req31 = makePostRequest(
        'http://localhost/api/audit/reachout',
        { session_id, email: 'overflow@example.com', best_time: 'Anytime' },
        { 'x-forwarded-for': ip }
      )
      const res31 = await POST(req31 as any)
      expect(res31.status).toBe(429)
    }, 15000)
  })
})
