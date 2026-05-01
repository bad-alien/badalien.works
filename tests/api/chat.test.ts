import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  STUB_BRIEF,
  makePostRequest,
  createTestSession,
  seedSessionWithBrief,
} from './_helpers'

// ── Mocks ──────────────────────────────────────────────────────────────────

const mockMessagesCreate = vi.fn()
vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = { create: mockMessagesCreate }
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

// ── Helpers ────────────────────────────────────────────────────────────────

function makeTextResponse(text: string) {
  return {
    id: 'msg_test',
    type: 'message',
    role: 'assistant',
    content: [{ type: 'text', text }],
    model: 'claude-sonnet-4-6',
    stop_reason: 'end_turn',
    usage: { input_tokens: 800, output_tokens: 150 },
  }
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-key-abc')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('Void backward compatibility', () => {
    it('responds when no X-Surface header is present (existing Void request shape)', async () => {
      // No X-Surface header → original Void code path. LLM_API_URL empty → stub mode.
      vi.stubEnv('LLM_API_URL', '')

      const { POST } = await import('@/app/api/chat/route')
      const req = makePostRequest(
        'http://localhost/api/chat',
        {
          session_id: 'void-session-1',
          messages: [{ role: 'user', content: 'hello' }],
        },
        { 'x-forwarded-for': '1.2.3.4' }
        // No X-Surface header — Void path
      )

      vi.useFakeTimers()
      const resPromise = POST(req as any)
      await vi.runAllTimersAsync()
      const res = await resPromise
      vi.useRealTimers()

      expect(res.status).toBe(200)
      expect((res.body as any).reply).toBeTruthy()
      // Void path uses llmClient.ts, not the Anthropic SDK
      expect(mockMessagesCreate).not.toHaveBeenCalled()
    })
  })

  describe('business FAQ mode', () => {
    it('deflects pricing questions — response contains a booking phrase', async () => {
      mockMessagesCreate.mockResolvedValue(
        makeTextResponse(
          "Pricing depends heavily on scope — the best next step is getting on a call so I can give you an accurate number."
        )
      )

      const { POST } = await import('@/app/api/chat/route')
      const req = makePostRequest(
        'http://localhost/api/chat',
        {
          session_id: 'faq-session-price-1',
          mode: 'faq',
          messages: [{ role: 'user', content: 'How much does it cost?' }],
        },
        {
          'x-forwarded-for': '1.2.3.10',
          'x-surface': 'business',
        }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      const reply: string = (res.body as any).reply
      expect(reply).toMatch(/on a call|book|consult|schedule|get in touch/i)
    })

    it('returns 200 for a non-pricing FAQ question', async () => {
      mockMessagesCreate.mockResolvedValue(
        makeTextResponse(
          "I typically work with SMBs in professional services — law firms, accounting practices, and consultancies."
        )
      )

      const { POST } = await import('@/app/api/chat/route')
      const req = makePostRequest(
        'http://localhost/api/chat',
        {
          session_id: 'faq-session-industry-1',
          mode: 'faq',
          messages: [{ role: 'user', content: 'What industries do you work with?' }],
        },
        {
          'x-forwarded-for': '1.2.3.11',
          'x-surface': 'business',
        }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      expect((res.body as any).reply).toBeTruthy()
    })
  })

  describe('business audit_followup mode', () => {
    it('returns 400 when session_id is missing for audit_followup', async () => {
      const { POST } = await import('@/app/api/chat/route')
      const req = makePostRequest(
        'http://localhost/api/chat',
        {
          mode: 'audit_followup',
          messages: [{ role: 'user', content: 'Tell me more about opportunity 2.' }],
        },
        { 'x-forwarded-for': '1.2.3.20', 'x-surface': 'business' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })

    it('returns 400 when the session has no associated brief', async () => {
      const { POST } = await import('@/app/api/chat/route')
      const req = makePostRequest(
        'http://localhost/api/chat',
        {
          session_id: 'nonexistent-session-for-followup',
          mode: 'audit_followup',
          messages: [{ role: 'user', content: 'Tell me more about opportunity 2.' }],
        },
        { 'x-forwarded-for': '1.2.3.21', 'x-surface': 'business' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(400)
    })

    it('references brief opportunity title in response when session has a brief', async () => {
      const session_id = await createTestSession()
      await seedSessionWithBrief(session_id)

      mockMessagesCreate.mockResolvedValue(
        makeTextResponse(
          `Opportunity #2 — "AI-Driven Follow-Up Sequences" — automates personalized follow-up emails triggered by deal stage changes. High ROI, small effort.`
        )
      )

      const { POST } = await import('@/app/api/chat/route')
      const req = makePostRequest(
        'http://localhost/api/chat',
        {
          session_id,
          mode: 'audit_followup',
          messages: [{ role: 'user', content: 'Tell me more about opportunity 2.' }],
        },
        { 'x-forwarded-for': '1.2.3.22', 'x-surface': 'business' }
      )
      const res = await POST(req as any)
      expect(res.status).toBe(200)
      const reply: string = (res.body as any).reply
      expect(reply).toMatch(/AI.Driven Follow.Up|follow.up sequences/i)
    })

    it('injects the brief into the Anthropic API call context', async () => {
      const session_id = await createTestSession()
      await seedSessionWithBrief(session_id)

      mockMessagesCreate.mockResolvedValue(
        makeTextResponse('Here is more detail about that opportunity...')
      )

      const { POST } = await import('@/app/api/chat/route')
      const req = makePostRequest(
        'http://localhost/api/chat',
        {
          session_id,
          mode: 'audit_followup',
          messages: [{ role: 'user', content: 'What about opportunity 1?' }],
        },
        { 'x-forwarded-for': '1.2.3.23', 'x-surface': 'business' }
      )
      await POST(req as any)

      expect(mockMessagesCreate).toHaveBeenCalledTimes(1)
      const callArgs = mockMessagesCreate.mock.calls[0][0]
      const contextText = JSON.stringify(callArgs.system ?? callArgs.messages ?? '')
      // Brief score or opportunity title must be in the prompt context
      expect(contextText).toMatch(/Automated CRM|7\.5|opportunity/i)
    })
  })

  describe('rate limiting', () => {
    it('returns 429 on the 31st request from the same IP within one minute', async () => {
      vi.useFakeTimers()
      mockMessagesCreate.mockResolvedValue(makeTextResponse('Reply text'))

      const ip = '5.5.5.5'
      const { POST } = await import('@/app/api/chat/route')

      const promises: Promise<any>[] = []
      for (let i = 0; i < 30; i++) {
        const req = makePostRequest(
          'http://localhost/api/chat',
          {
            session_id: `rl-chat-${i}`,
            mode: 'faq',
            messages: [{ role: 'user', content: 'Hello' }],
          },
          { 'x-forwarded-for': ip, 'x-surface': 'business' }
        )
        promises.push(POST(req as any))
        await vi.runAllTimersAsync()
      }
      await Promise.all(promises)

      const req31 = makePostRequest(
        'http://localhost/api/chat',
        {
          session_id: 'rl-chat-overflow',
          mode: 'faq',
          messages: [{ role: 'user', content: 'Hello' }],
        },
        { 'x-forwarded-for': ip, 'x-surface': 'business' }
      )
      const res31 = await POST(req31 as any)
      vi.useRealTimers()
      expect(res31.status).toBe(429)
    }, 15000)
  })

  describe('stub mode (no ANTHROPIC_API_KEY)', () => {
    it('returns a reply for faq mode without calling Anthropic SDK', async () => {
      vi.useFakeTimers()
      vi.stubEnv('ANTHROPIC_API_KEY', '')
      vi.stubEnv('LLM_API_URL', '') // ensure stub mode for the Void path too

      const { POST } = await import('@/app/api/chat/route')
      const req = makePostRequest(
        'http://localhost/api/chat',
        {
          session_id: 'stub-faq-session',
          mode: 'faq',
          messages: [{ role: 'user', content: 'What services do you offer?' }],
        },
        { 'x-forwarded-for': '1.2.3.40', 'x-surface': 'business' }
      )
      const resPromise = POST(req as any)
      await vi.runAllTimersAsync()
      const res = await resPromise
      vi.useRealTimers()

      expect([200, 207]).toContain(res.status)
      expect((res.body as any).reply).toBeTruthy()
      expect(mockMessagesCreate).not.toHaveBeenCalled()
    })

    it('returns a reply for audit_followup mode without calling Anthropic SDK', async () => {
      vi.useFakeTimers()
      vi.stubEnv('ANTHROPIC_API_KEY', '')
      vi.stubEnv('LLM_API_URL', '')
      const session_id = await createTestSession()
      await seedSessionWithBrief(session_id)

      const { POST } = await import('@/app/api/chat/route')
      const req = makePostRequest(
        'http://localhost/api/chat',
        {
          session_id,
          mode: 'audit_followup',
          messages: [{ role: 'user', content: 'Tell me more.' }],
        },
        { 'x-forwarded-for': '1.2.3.41', 'x-surface': 'business' }
      )
      const resPromise = POST(req as any)
      await vi.runAllTimersAsync()
      const res = await resPromise
      vi.useRealTimers()

      expect([200, 207]).toContain(res.status)
      expect((res.body as any).reply).toBeTruthy()
      expect(mockMessagesCreate).not.toHaveBeenCalled()
    })
  })
})
