import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import {
  STUB_BRIEF,
  STUB_BRIEF_WITH_SOVEREIGNTY,
  makeAuditRunRequest,
  makePostRequest,
  parseSSEStream,
  createTestSession,
  LEAD_EMAIL,
  VALID_URL,
} from './_helpers'

// ── Mocks ──────────────────────────────────────────────────────────────────

const mockResendSend = vi.fn()
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mockResendSend }
  },
}))

const mockMessagesCreate = vi.fn()
vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = { create: mockMessagesCreate }
  },
}))

// ── Helpers ────────────────────────────────────────────────────────────────

function makeToolUseResponse(brief: typeof STUB_BRIEF) {
  return {
    id: 'msg_test',
    type: 'message',
    role: 'assistant',
    content: [
      {
        type: 'tool_use',
        id: 'tool_test',
        name: 'emit_audit',
        input: brief,
      },
    ],
    model: 'claude-sonnet-4-6',
    stop_reason: 'tool_use',
    usage: {
      input_tokens: 1200,
      output_tokens: 300,
      cache_creation_input_tokens: 0,
      cache_read_input_tokens: 0,
    },
  }
}

function mockFetchHtml(html: string, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(html, { status, headers: { 'Content-Type': 'text/html' } })
    )
  )
}

let tmpLogDir: string

beforeEach(() => {
  vi.clearAllMocks()
  vi.unstubAllEnvs()
  vi.stubEnv('ANTHROPIC_API_KEY', 'test-key-audit-run')
  vi.stubEnv('RESEND_API_KEY', 'test-resend-key')
  tmpLogDir = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-run-logs-'))
  vi.stubEnv('AUDIT_DAILY_BUDGET_USD', '10')
  mockResendSend.mockResolvedValue({ data: { id: 'email-123' }, error: null })
  mockFetchHtml('<html><body><h1>Example SMB</h1><p>We provide accounting services.</p></body></html>')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  try { fs.rmSync(tmpLogDir, { recursive: true, force: true }) } catch { /* ignore */ }
})

// ── /api/audit/run ─────────────────────────────────────────────────────────

describe('POST /api/audit/run — audit happy path', () => {
  it('valid url+bottleneck+sensitive_docs=no → brief has score, 3 obs, 3 opps, no sovereignty_callout', async () => {
    mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF))
    const session_id = await createTestSession()

    const { POST } = await import('@/app/api/audit/run/route')
    const req = makePostRequest(
      'http://localhost/api/audit/run',
      makeAuditRunRequest({ session_id, sensitive_docs: 'no' }),
      { 'x-forwarded-for': '2.3.4.5' }
    )
    const res = await POST(req as any)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toMatch(/text\/event-stream/)

    const events = await parseSSEStream(res)
    const statusValues = events.filter((e) => e.event === 'status').map((e) => JSON.parse(e.data).status)
    expect(statusValues).toContain('reading_url')
    expect(statusValues).toContain('analyzing')
    expect(statusValues).toContain('drafting')

    const doneEvent = events.find((e) => e.event === 'done')
    expect(doneEvent).toBeDefined()
    const brief = JSON.parse(doneEvent!.data).brief
    expect(typeof brief.score).toBe('number')
    expect(brief.score).toBeGreaterThanOrEqual(0)
    expect(brief.score).toBeLessThanOrEqual(10)
    expect(brief.observations).toHaveLength(3)
    expect(brief.opportunities).toHaveLength(3)
    expect(brief.sovereignty_callout).toBeUndefined()
  })
})

describe('POST /api/audit/run — sovereignty triggers', () => {
  it('sovereignty A: sensitive_docs=yes → sovereignty_callout present', async () => {
    mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF_WITH_SOVEREIGNTY))
    const session_id = await createTestSession()

    const { POST } = await import('@/app/api/audit/run/route')
    const req = makePostRequest(
      'http://localhost/api/audit/run',
      makeAuditRunRequest({ session_id, sensitive_docs: 'yes' }),
      { 'x-forwarded-for': '2.3.4.6' }
    )
    const res = await POST(req as any)
    const events = await parseSSEStream(res)
    const doneData = JSON.parse(events.find((e) => e.event === 'done')!.data)
    expect(doneData.brief.sovereignty_callout).toBeTruthy()
  })

  it('sovereignty B: sensitive_docs=no but page contains HIPAA → sovereignty_callout present', async () => {
    mockFetchHtml('<html><body><p>HIPAA-compliant patient records for medical practices.</p></body></html>')
    mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF_WITH_SOVEREIGNTY))
    const session_id = await createTestSession()

    const { POST } = await import('@/app/api/audit/run/route')
    const req = makePostRequest(
      'http://localhost/api/audit/run',
      makeAuditRunRequest({ session_id, sensitive_docs: 'no' }),
      { 'x-forwarded-for': '2.3.4.7' }
    )
    const res = await POST(req as any)
    const events = await parseSSEStream(res)
    const doneData = JSON.parse(events.find((e) => e.event === 'done')!.data)
    expect(doneData.brief.sovereignty_callout).toBeTruthy()
  })
})

describe('POST /api/audit/run — validation', () => {
  it('invalid URL shape → 400 with explicit code', async () => {
    const session_id = await createTestSession()
    const { POST } = await import('@/app/api/audit/run/route')
    const req = makePostRequest(
      'http://localhost/api/audit/run',
      makeAuditRunRequest({ session_id, url: 'not-a-url' }),
      { 'x-forwarded-for': '2.3.100.1' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error.code).toBeTruthy()
  })

  it('missing url field → 400', async () => {
    const session_id = await createTestSession()
    const { POST } = await import('@/app/api/audit/run/route')
    const { url: _, ...body } = makeAuditRunRequest({ session_id })
    const req = makePostRequest('http://localhost/api/audit/run', body as any, {
      'x-forwarded-for': '2.3.100.2',
    })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('missing bottleneck → 400', async () => {
    const session_id = await createTestSession()
    const { POST } = await import('@/app/api/audit/run/route')
    const { bottleneck: _, ...body } = makeAuditRunRequest({ session_id })
    const req = makePostRequest('http://localhost/api/audit/run', body as any, {
      'x-forwarded-for': '2.3.100.3',
    })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('missing sensitive_docs → 400', async () => {
    const session_id = await createTestSession()
    const { POST } = await import('@/app/api/audit/run/route')
    const { sensitive_docs: _, ...body } = makeAuditRunRequest({ session_id })
    const req = makePostRequest('http://localhost/api/audit/run', body as any, {
      'x-forwarded-for': '2.3.100.4',
    })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('bottleneck > 1000 chars → 400', async () => {
    const session_id = await createTestSession()
    const { POST } = await import('@/app/api/audit/run/route')
    const req = makePostRequest(
      'http://localhost/api/audit/run',
      makeAuditRunRequest({ session_id, bottleneck: 'x'.repeat(1001) }),
      { 'x-forwarded-for': '2.3.100.5' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('non-existent session_id → 404', async () => {
    const { POST } = await import('@/app/api/audit/run/route')
    const req = makePostRequest(
      'http://localhost/api/audit/run',
      makeAuditRunRequest({ session_id: 'no-such-session-xyz' }),
      { 'x-forwarded-for': '2.3.100.6' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(404)
  })
})

describe('POST /api/audit/run — SSRF', () => {
  const ssrfCases = [
    { url: 'http://127.0.0.1', desc: 'loopback IPv4', ip: '3.0.0.1' },
    { url: 'http://10.0.0.1', desc: 'private class A', ip: '3.0.0.2' },
    { url: 'http://192.168.1.1', desc: 'private class C', ip: '3.0.0.3' },
    { url: 'http://[::1]', desc: 'loopback IPv6', ip: '3.0.0.4' },
  ]

  ssrfCases.forEach(({ url, desc, ip }) => {
    it(`${desc} (${url}) → 400`, async () => {
      const session_id = await createTestSession()
      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id, url }),
        { 'x-forwarded-for': ip }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })
  })
})

describe('POST /api/audit/run — rate limit', () => {
  it('4th request from same IP within 24h → 429', async () => {
    mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF))
    const ip = '4.4.4.44'
    const { POST } = await import('@/app/api/audit/run/route')

    for (let i = 0; i < 3; i++) {
      const session_id = await createTestSession()
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id }),
        { 'x-forwarded-for': ip }
      )
      const res = await POST(req as any)
      await parseSSEStream(res)
      expect(res.status).not.toBe(429)
    }

    const session_id = await createTestSession()
    const req4 = makePostRequest(
      'http://localhost/api/audit/run',
      makeAuditRunRequest({ session_id }),
      { 'x-forwarded-for': ip }
    )
    const res4 = await POST(req4 as any)
    expect(res4.status).toBe(429)
  }, 30000)
})

describe('POST /api/audit/run — budget kill switch', () => {
  it('AUDIT_DAILY_BUDGET_USD exceeded → 503 BUDGET_EXCEEDED', async () => {
    vi.stubEnv('AUDIT_DAILY_BUDGET_USD', '0')
    const session_id = await createTestSession()
    const { POST } = await import('@/app/api/audit/run/route')
    const req = makePostRequest(
      'http://localhost/api/audit/run',
      makeAuditRunRequest({ session_id }),
      { 'x-forwarded-for': '5.5.5.5' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body.error.code).toBe('BUDGET_EXCEEDED')
  })
})

describe('POST /api/audit/run — URL fetch failure', () => {
  it('URL returns 404 → fallback brief still returned (degraded-confidence)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Not Found', { status: 404 })))
    mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF))
    const session_id = await createTestSession()

    const { POST } = await import('@/app/api/audit/run/route')
    const req = makePostRequest(
      'http://localhost/api/audit/run',
      makeAuditRunRequest({ session_id }),
      { 'x-forwarded-for': '6.6.6.6' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(200)
    const events = await parseSSEStream(res)
    const doneEvent = events.find((e) => e.event === 'done')
    expect(doneEvent).toBeDefined()
    expect(JSON.parse(doneEvent!.data).brief).toBeTruthy()
  })

  it('network error on URL fetch → fallback brief still returned', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')))
    mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF))
    const session_id = await createTestSession()

    const { POST } = await import('@/app/api/audit/run/route')
    const req = makePostRequest(
      'http://localhost/api/audit/run',
      makeAuditRunRequest({ session_id }),
      { 'x-forwarded-for': '6.6.6.7' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(200)
    const events = await parseSSEStream(res)
    expect(events.find((e) => e.event === 'done')).toBeDefined()
  })
})

describe('POST /api/audit/run — Resend email', () => {
  it('fires Resend with [Audit] subject to lead email after every brief', async () => {
    mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF))
    const session_id = await createTestSession()

    const { POST } = await import('@/app/api/audit/run/route')
    const req = makePostRequest(
      'http://localhost/api/audit/run',
      makeAuditRunRequest({ session_id }),
      { 'x-forwarded-for': '7.7.7.7' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(200)
    await parseSSEStream(res)

    await new Promise((r) => setTimeout(r, 50))

    expect(mockResendSend).toHaveBeenCalledTimes(1)
    const callArgs = mockResendSend.mock.calls[0][0]
    expect(callArgs.to).toContain(LEAD_EMAIL)
    expect(callArgs.subject).toMatch(/\[Audit\]/i)
  })
})
