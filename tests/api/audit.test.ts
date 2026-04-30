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

// DNS mock: in the sandbox there is no outbound DNS. The route's isPrivateHostname()
// returns false on DNS failure, so public hostnames (example-smb.com) pass the SSRF
// guard automatically. We only need to intercept for SSRF tests that use literal
// private IP literals — those fail URL protocol/format validation before DNS is hit.
// No vi.mock('dns') needed here — real dns module + sandbox = DNS timeout → false → passes.

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
    usage: { input_tokens: 1200, output_tokens: 300, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 },
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
  vi.stubEnv('ANTHROPIC_API_KEY', 'test-key-abc')
  vi.stubEnv('RESEND_API_KEY', 'test-resend-key')
  tmpLogDir = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-logs-'))
  vi.stubEnv('AUDIT_LOG_DIR', tmpLogDir)
  vi.stubEnv('AUDIT_DAILY_BUDGET_USD', '10')
  mockResendSend.mockResolvedValue({ data: { id: 'email-123' }, error: null })
  mockFetchHtml('<html><body><h1>Example SMB</h1><p>We provide accounting services.</p></body></html>')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  try { fs.rmSync(tmpLogDir, { recursive: true, force: true }) } catch { /* ignore */ }
})

// ── /api/audit/start ───────────────────────────────────────────────────────

describe('POST /api/audit/start', () => {
  it('returns session_id for a valid URL', async () => {
    const { POST } = await import('@/app/api/audit/start/route')
    const req = makePostRequest('http://localhost/api/audit/start', { url: VALID_URL })
    const res = await POST(req as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(typeof body.session_id).toBe('string')
    expect(body.session_id.length).toBeGreaterThan(0)
  })

  it('returns 400 for a missing URL', async () => {
    const { POST } = await import('@/app/api/audit/start/route')
    const req = makePostRequest('http://localhost/api/audit/start', {})
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('returns 400 for a non-http URL', async () => {
    const { POST } = await import('@/app/api/audit/start/route')
    const req = makePostRequest('http://localhost/api/audit/start', { url: 'ftp://example.com' })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })
})

// ── /api/audit/run ─────────────────────────────────────────────────────────

describe('POST /api/audit/run', () => {
  describe('happy path', () => {
    it('streams status events reading_url → analyzing → drafting → done and returns brief', async () => {
      mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF))
      const session_id = await createTestSession()

      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id, sensitive_docs: 'no' }),
        { 'x-forwarded-for': '1.2.3.4' }
      )
      const res = await POST(req as any)

      expect(res.status).toBe(200)
      expect(res.headers.get('content-type')).toMatch(/text\/event-stream/)

      const events = await parseSSEStream(res)
      // Check status events are present
      const statusEvents = events.filter((e) => e.event === 'status')
      const statusValues = statusEvents.map((e) => JSON.parse(e.data).status)
      expect(statusValues).toContain('reading_url')
      expect(statusValues).toContain('analyzing')
      expect(statusValues).toContain('drafting')

      const doneEvent = events.find((e) => e.event === 'done')
      expect(doneEvent).toBeDefined()
      const doneData = JSON.parse(doneEvent!.data)
      const brief = doneData.brief
      expect(typeof brief.score).toBe('number')
      expect(brief.observations).toHaveLength(3)
      expect(brief.opportunities).toHaveLength(3)
      expect(brief.sovereignty_callout).toBeUndefined()
    })
  })

  describe('sovereignty trigger', () => {
    it('trigger A: sensitive_docs=yes → sovereignty_callout present in brief', async () => {
      mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF_WITH_SOVEREIGNTY))
      const session_id = await createTestSession()

      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id, sensitive_docs: 'yes' }),
        { 'x-forwarded-for': '1.2.3.5' }
      )
      const res = await POST(req as any)
      const events = await parseSSEStream(res)
      const doneData = JSON.parse(events.find((e) => e.event === 'done')!.data)
      expect(doneData.brief.sovereignty_callout).toBeTruthy()
    })

    it('trigger B: sensitive_docs=no but HTML contains HIPAA → sovereignty_callout present', async () => {
      mockFetchHtml('<html><body><p>HIPAA-compliant patient records management for medical practices.</p></body></html>')
      mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF_WITH_SOVEREIGNTY))
      const session_id = await createTestSession()

      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id, sensitive_docs: 'no' }),
        { 'x-forwarded-for': '1.2.3.6' }
      )
      const res = await POST(req as any)
      const events = await parseSSEStream(res)
      const doneData = JSON.parse(events.find((e) => e.event === 'done')!.data)
      expect(doneData.brief.sovereignty_callout).toBeTruthy()
    })

    it('trigger B: sensitive_docs=no but HTML contains "patient records" → sovereignty_callout present', async () => {
      mockFetchHtml('<html><body><p>We manage patient records for healthcare providers.</p></body></html>')
      mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF_WITH_SOVEREIGNTY))
      const session_id = await createTestSession()

      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id, sensitive_docs: 'no' }),
        { 'x-forwarded-for': '1.2.3.7' }
      )
      const res = await POST(req as any)
      const events = await parseSSEStream(res)
      const doneData = JSON.parse(events.find((e) => e.event === 'done')!.data)
      expect(doneData.brief.sovereignty_callout).toBeTruthy()
    })
  })

  describe('validation', () => {
    it('returns 400 for invalid URL shape', async () => {
      const session_id = await createTestSession()
      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id, url: 'not-a-url' }),
        { 'x-forwarded-for': '1.2.3.100' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })

    it('returns 400 when URL is missing', async () => {
      const session_id = await createTestSession()
      const { POST } = await import('@/app/api/audit/run/route')
      const { url: _, ...body } = makeAuditRunRequest({ session_id })
      const req = makePostRequest('http://localhost/api/audit/run', body as any, {
        'x-forwarded-for': '1.2.3.101',
      })
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })

    it('returns 400 when bottleneck exceeds 1000 chars', async () => {
      const session_id = await createTestSession()
      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id, bottleneck: 'x'.repeat(1001) }),
        { 'x-forwarded-for': '1.2.3.102' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })

    it('returns 400 when bottleneck is missing', async () => {
      const session_id = await createTestSession()
      const { POST } = await import('@/app/api/audit/run/route')
      const { bottleneck: _, ...body } = makeAuditRunRequest({ session_id })
      const req = makePostRequest('http://localhost/api/audit/run', body as any, {
        'x-forwarded-for': '1.2.3.103',
      })
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })

    it('returns 400 when sensitive_docs is missing', async () => {
      const session_id = await createTestSession()
      const { POST } = await import('@/app/api/audit/run/route')
      const { sensitive_docs: _, ...body } = makeAuditRunRequest({ session_id })
      const req = makePostRequest('http://localhost/api/audit/run', body as any, {
        'x-forwarded-for': '1.2.3.104',
      })
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })

    it('returns 404 when session_id is not found', async () => {
      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id: 'nonexistent-session-xyz' }),
        { 'x-forwarded-for': '1.2.3.105' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(404)
    })
  })

  describe('SSRF rejection', () => {
    // Each test uses a unique IP to avoid triggering the 3/24h per-IP audit rate limit.
    const ssrfCases = [
      { url: 'http://127.0.0.1', desc: 'loopback IPv4', ip: '10.0.0.201' },
      { url: 'http://10.0.0.1', desc: 'private class A', ip: '10.0.0.202' },
      { url: 'http://192.168.1.1', desc: 'private class C', ip: '10.0.0.203' },
      { url: 'http://[::1]', desc: 'loopback IPv6', ip: '10.0.0.206' },
      { url: 'file:///etc/passwd', desc: 'file protocol', ip: '10.0.0.204' },
      { url: 'ftp://example.com', desc: 'ftp protocol', ip: '10.0.0.205' },
    ]

    ssrfCases.forEach(({ url, desc, ip }) => {
      it(`returns 400 for SSRF URL: ${desc}`, async () => {
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

  describe('URL fetch failure fallback', () => {
    it('returns a brief even when URL fetch returns 404', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Not Found', { status: 404 })))
      mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF))
      const session_id = await createTestSession()

      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id }),
        { 'x-forwarded-for': '1.2.3.50' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      const events = await parseSSEStream(res)
      const doneEvent = events.find((e) => e.event === 'done')
      expect(doneEvent).toBeDefined()
      expect(JSON.parse(doneEvent!.data).brief).toBeTruthy()
    })

    it('returns a brief even when fetch throws a network error', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')))
      mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF))
      const session_id = await createTestSession()

      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id }),
        { 'x-forwarded-for': '1.2.3.51' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      const events = await parseSSEStream(res)
      expect(events.find((e) => e.event === 'done')).toBeDefined()
    })
  })

  describe('rate limiting', () => {
    it('returns 429 on the 4th audit from the same IP within 24h', async () => {
      mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF))
      const ip = '9.9.9.9'
      const { POST } = await import('@/app/api/audit/run/route')

      for (let i = 0; i < 3; i++) {
        const session_id = await createTestSession()
        const req = makePostRequest(
          'http://localhost/api/audit/run',
          makeAuditRunRequest({ session_id }),
          { 'x-forwarded-for': ip }
        )
        const res = await POST(req as any)
        // Drain the stream so it completes
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

  describe('budget kill switch', () => {
    it('returns 503 BUDGET_EXCEEDED when daily spend exceeds the limit', async () => {
      vi.stubEnv('AUDIT_DAILY_BUDGET_USD', '0') // $0 limit → immediately exceeded
      const session_id = await createTestSession()
      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id }),
        { 'x-forwarded-for': '8.8.8.8' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(503)
      const body = await res.json()
      expect(body.error.code).toBe('BUDGET_EXCEEDED')
    })
  })

  describe('Resend email on brief completion', () => {
    it('fires Resend with [Audit] subject to r@badalien.works after every brief', async () => {
      mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF))
      const session_id = await createTestSession()

      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id }),
        { 'x-forwarded-for': '1.2.3.9' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      await parseSSEStream(res)

      // Email is fired after stream close — give it a tick
      await new Promise((r) => setTimeout(r, 50))

      expect(mockResendSend).toHaveBeenCalledTimes(1)
      const callArgs = mockResendSend.mock.calls[0][0]
      expect(callArgs.to).toContain(LEAD_EMAIL)
      expect(callArgs.subject).toMatch(/\[Audit\]/i)
    })
  })

  describe('transcript logging', () => {
    it('writes JSONL file with events after brief completion', async () => {
      mockMessagesCreate.mockResolvedValue(makeToolUseResponse(STUB_BRIEF))
      const session_id = await createTestSession()

      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id }),
        { 'x-forwarded-for': '1.2.3.10' }
      )
      const res = await POST(req as any)
      await parseSSEStream(res)
      await new Promise((r) => setTimeout(r, 100))

      // Walk the project's audit_logs dir (cwd-relative as the route uses process.cwd())
      const logRoot = path.join(process.cwd(), 'audit_logs')
      const findJsonl = (dir: string): string[] => {
        if (!fs.existsSync(dir)) return []
        const out: string[] = []
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name)
          if (entry.isDirectory()) out.push(...findJsonl(full))
          else if (entry.name.endsWith('.jsonl')) out.push(full)
        }
        return out
      }
      const files = findJsonl(logRoot)
      expect(files.length).toBeGreaterThan(0)

      const content = fs.readFileSync(files[0], 'utf-8')
      const lines = content.trim().split('\n').filter(Boolean)
      expect(lines.length).toBeGreaterThan(0)
      lines.forEach((line) => expect(() => JSON.parse(line)).not.toThrow())
    })
  })

  describe('stub mode (no ANTHROPIC_API_KEY)', () => {
    it('returns deterministic canned brief without calling Anthropic SDK', async () => {
      vi.useFakeTimers()
      vi.stubEnv('ANTHROPIC_API_KEY', '')
      const session_id = await createTestSession()

      const { POST } = await import('@/app/api/audit/run/route')
      const req = makePostRequest(
        'http://localhost/api/audit/run',
        makeAuditRunRequest({ session_id }),
        { 'x-forwarded-for': '1.2.3.11' }
      )
      const resPromise = POST(req as any)
      await vi.runAllTimersAsync()
      const res = await resPromise
      vi.useRealTimers()

      expect(res.status).toBe(200)
      const events = await parseSSEStream(res)
      const doneEvent = events.find((e) => e.event === 'done')
      expect(doneEvent).toBeDefined()
      const brief = JSON.parse(doneEvent!.data).brief
      expect(typeof brief.score).toBe('number')
      expect(brief.observations).toHaveLength(3)
      expect(brief.opportunities).toHaveLength(3)
      expect(mockMessagesCreate).not.toHaveBeenCalled()
    })
  })
})
