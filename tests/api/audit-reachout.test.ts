import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
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

describe('POST /api/audit/reachout — happy path', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.stubEnv('RESEND_API_KEY', 'test-resend-key')
    mockResendSend.mockResolvedValue({ data: { id: 'lead-email-ok' }, error: null })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('valid submit → 200 ok=true, Resend called once with [Lead] subject to lead email', async () => {
    const session_id = await createTestSession()
    await seedSessionWithBrief(session_id)

    const { POST } = await import('@/app/api/audit/reachout/route')
    const req = makePostRequest(
      'http://localhost/api/audit/reachout',
      {
        session_id,
        email: 'prospect@company.com',
        best_time: 'Tuesday afternoons',
      },
      { 'x-forwarded-for': '11.11.11.11' }
    )
    const res = await POST(req as any)

    expect(res.status).toBe(200)
    expect((res.body as any).ok).toBe(true)
    expect(mockResendSend).toHaveBeenCalledTimes(1)
    const callArgs = mockResendSend.mock.calls[0][0]
    expect(callArgs.to).toContain(LEAD_EMAIL)
    expect(callArgs.subject).toMatch(/\[Lead\]/i)
  })

  it('email body contains brief content and lead details', async () => {
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
      { 'x-forwarded-for': '11.11.11.12' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(200)

    const callArgs = mockResendSend.mock.calls[0][0]
    const emailBody = (callArgs.html ?? '') + (callArgs.text ?? '')
    expect(emailBody).toContain('prospect@company.com')
    expect(emailBody).toContain('Tuesday afternoons')
    expect(emailBody).toMatch(/7\.5|Automated CRM|Follow.Up|reporting/i)
  })

  it('optional phone omitted → 200 ok=true', async () => {
    const session_id = await createTestSession()
    await seedSessionWithBrief(session_id)

    const { POST } = await import('@/app/api/audit/reachout/route')
    const req = makePostRequest(
      'http://localhost/api/audit/reachout',
      { session_id, email: 'nophone@company.com', best_time: 'Any morning' },
      { 'x-forwarded-for': '11.11.11.13' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(200)
    expect((res.body as any).ok).toBe(true)
  })
})

describe('POST /api/audit/reachout — missing session / no brief → error', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.stubEnv('RESEND_API_KEY', 'test-resend-key')
    mockResendSend.mockResolvedValue({ data: { id: 'ok' }, error: null })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('nonexistent session_id → 400 SESSION_NOT_FOUND', async () => {
    const { POST } = await import('@/app/api/audit/reachout/route')
    const req = makePostRequest(
      'http://localhost/api/audit/reachout',
      { session_id: 'no-such-session', email: 'a@b.com', best_time: 'Tuesday' },
      { 'x-forwarded-for': '11.11.12.1' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(400)
    expect(JSON.stringify(res.body)).toMatch(/SESSION_NOT_FOUND/i)
  })

  it('session exists but no brief → 400 SESSION_NOT_FOUND', async () => {
    const session_id = await createTestSession()
    // No brief seeded — session has no brief

    const { POST } = await import('@/app/api/audit/reachout/route')
    const req = makePostRequest(
      'http://localhost/api/audit/reachout',
      { session_id, email: 'a@b.com', best_time: 'Tuesday' },
      { 'x-forwarded-for': '11.11.12.2' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })
})

describe('POST /api/audit/reachout — validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.stubEnv('RESEND_API_KEY', 'test-resend-key')
    mockResendSend.mockResolvedValue({ data: { id: 'ok' }, error: null })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('invalid email format → 400', async () => {
    const session_id = await createTestSession()
    await seedSessionWithBrief(session_id)

    const { POST } = await import('@/app/api/audit/reachout/route')
    const req = makePostRequest(
      'http://localhost/api/audit/reachout',
      { session_id, email: 'not-an-email', best_time: 'Tuesday' },
      { 'x-forwarded-for': '11.11.13.1' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('empty best_time → 400', async () => {
    const session_id = await createTestSession()
    await seedSessionWithBrief(session_id)

    const { POST } = await import('@/app/api/audit/reachout/route')
    const req = makePostRequest(
      'http://localhost/api/audit/reachout',
      { session_id, email: 'a@b.com', best_time: '' },
      { 'x-forwarded-for': '11.11.13.2' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('missing session_id → 400', async () => {
    const { POST } = await import('@/app/api/audit/reachout/route')
    const req = makePostRequest(
      'http://localhost/api/audit/reachout',
      { email: 'a@b.com', best_time: 'Tuesday' },
      { 'x-forwarded-for': '11.11.13.3' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('missing email → 400', async () => {
    const session_id = await createTestSession()
    await seedSessionWithBrief(session_id)

    const { POST } = await import('@/app/api/audit/reachout/route')
    const req = makePostRequest(
      'http://localhost/api/audit/reachout',
      { session_id, best_time: 'Tuesday' },
      { 'x-forwarded-for': '11.11.13.4' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })
})
