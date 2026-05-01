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

function makeBusinessChatRequest(overrides: Record<string, unknown> = {}) {
  return {
    session_id: 'chat-mode-session',
    mode: 'faq',
    messages: [{ role: 'user', content: 'Hello' }],
    ...overrides,
  }
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('POST /api/chat — FAQ mode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-key-chat')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('pricing question deflects to a call — response contains booking/call phrase', async () => {
    mockMessagesCreate.mockResolvedValue(
      makeTextResponse(
        "Pricing depends on scope — the best next step is getting on a call so I can give you a real number. Book a free consult at /contact#book."
      )
    )

    const { POST } = await import('@/app/api/chat/route')
    const req = makePostRequest(
      'http://localhost/api/chat',
      makeBusinessChatRequest({
        session_id: 'faq-pricing-1',
        mode: 'faq',
        messages: [{ role: 'user', content: 'How much does it cost?' }],
      }),
      { 'x-forwarded-for': '20.20.20.1', 'x-surface': 'business' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(200)
    const reply: string = (res.body as any).reply
    expect(reply).toMatch(/on a call|book|consult|schedule|get in touch/i)
  })

  it('non-pricing question returns a useful reply', async () => {
    mockMessagesCreate.mockResolvedValue(
      makeTextResponse(
        "I typically work with SMBs in professional services — law, accounting, and consulting."
      )
    )

    const { POST } = await import('@/app/api/chat/route')
    const req = makePostRequest(
      'http://localhost/api/chat',
      makeBusinessChatRequest({
        session_id: 'faq-industry-1',
        mode: 'faq',
        messages: [{ role: 'user', content: 'What industries do you work with?' }],
      }),
      { 'x-forwarded-for': '20.20.20.2', 'x-surface': 'business' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(200)
    expect((res.body as any).reply).toBeTruthy()
  })

  it('FAQ system prompt contains HARD RULE about pricing deflection', async () => {
    const { FAQ_SYSTEM_PROMPT } = await import('@/lib/chatPrompts')
    expect(FAQ_SYSTEM_PROMPT).toMatch(/pricing|cost|rate/i)
    expect(FAQ_SYSTEM_PROMPT).toMatch(/call|book|consult/i)
    expect(FAQ_SYSTEM_PROMPT).toMatch(/HARD RULE/i)
  })

  it('CTA loop note present in FAQ prompt every 2-3 turns', async () => {
    const { FAQ_SYSTEM_PROMPT } = await import('@/lib/chatPrompts')
    expect(FAQ_SYSTEM_PROMPT).toMatch(/CTA|2.?3 turns|every/i)
  })
})

describe('POST /api/chat — audit_followup mode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-key-chat')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('"tell me more about #2" pulls opportunity #2 from auditSession and returns a relevant reply', async () => {
    const session_id = await createTestSession()
    await seedSessionWithBrief(session_id)

    const opp2Title = STUB_BRIEF.opportunities[1].title

    mockMessagesCreate.mockResolvedValue(
      makeTextResponse(
        `Opportunity #2 — "${opp2Title}" — automates personalized follow-up emails triggered by deal stage changes.`
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
      { 'x-forwarded-for': '21.21.21.1', 'x-surface': 'business' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(200)
    const reply: string = (res.body as any).reply
    expect(reply).toMatch(/AI.Driven Follow.Up|follow.up sequences/i)
  })

  it('brief is injected into the Anthropic SDK call context', async () => {
    const session_id = await createTestSession()
    await seedSessionWithBrief(session_id)

    mockMessagesCreate.mockResolvedValue(
      makeTextResponse('Here is more detail...')
    )

    const { POST } = await import('@/app/api/chat/route')
    const req = makePostRequest(
      'http://localhost/api/chat',
      {
        session_id,
        mode: 'audit_followup',
        messages: [{ role: 'user', content: 'What about opportunity 1?' }],
      },
      { 'x-forwarded-for': '21.21.21.2', 'x-surface': 'business' }
    )
    await POST(req as any)

    expect(mockMessagesCreate).toHaveBeenCalledTimes(1)
    const callArgs = mockMessagesCreate.mock.calls[0][0]
    const contextText = JSON.stringify(callArgs.system ?? callArgs.messages ?? '')
    // Brief score and opportunity titles must be in the prompt context
    expect(contextText).toMatch(/Automated CRM|7\.5|opportunity/i)
  })

  it('returns 400 when session_id is missing for audit_followup mode', async () => {
    const { POST } = await import('@/app/api/chat/route')
    const req = makePostRequest(
      'http://localhost/api/chat',
      {
        mode: 'audit_followup',
        messages: [{ role: 'user', content: 'Tell me more about opportunity 2.' }],
      },
      { 'x-forwarded-for': '21.21.22.1', 'x-surface': 'business' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('returns 400 when session has no brief for audit_followup mode', async () => {
    const { POST } = await import('@/app/api/chat/route')
    const req = makePostRequest(
      'http://localhost/api/chat',
      {
        session_id: 'session-without-brief-xyz',
        mode: 'audit_followup',
        messages: [{ role: 'user', content: 'Tell me more about opportunity 2.' }],
      },
      { 'x-forwarded-for': '21.21.22.2', 'x-surface': 'business' }
    )
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })
})
