import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Resend as a class constructor
const mockSend = vi.fn()
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mockSend }
  },
}))

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      body,
      status: init?.status ?? 200,
    }),
  },
}))

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('RESEND_API_KEY', 'test_key')
  })

  async function callRoute(body: Record<string, unknown>) {
    const { POST } = await import('@/app/api/contact/route')
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return POST(request) as any
  }

  it('returns 400 when name is missing', async () => {
    const res = await callRoute({ email: 'a@b.com', message: 'hi' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Missing required fields')
  })

  it('returns 400 when email is missing', async () => {
    const res = await callRoute({ name: 'Test', message: 'hi' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Missing required fields')
  })

  it('returns 400 when message is missing', async () => {
    const res = await callRoute({ name: 'Test', email: 'a@b.com' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Missing required fields')
  })

  it('returns 200 on successful send', async () => {
    mockSend.mockResolvedValue({ data: { id: 'msg_123' }, error: null })
    const res = await callRoute({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello',
    })
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.messageId).toBe('msg_123')
  })

  it('returns 500 when Resend returns an error', async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: 'fail' } })
    const res = await callRoute({
      name: 'Test',
      email: 'test@example.com',
      message: 'Hello',
    })
    expect(res.status).toBe(500)
    expect(res.body.error).toBe('Failed to send email')
  })

  it('includes company and service interest in email when provided', async () => {
    mockSend.mockResolvedValue({ data: { id: 'msg_456' }, error: null })
    await callRoute({
      name: 'Test',
      email: 'test@example.com',
      company: 'Acme Corp',
      serviceInterest: 'ai-adoption',
      message: 'Interested',
    })
    const callArgs = mockSend.mock.calls[0][0]
    expect(callArgs.html).toContain('Acme Corp')
    expect(callArgs.html).toContain('AI Adoption')
  })

  it('escapes HTML in user input to prevent XSS', async () => {
    mockSend.mockResolvedValue({ data: { id: 'msg_789' }, error: null })
    await callRoute({
      name: '<script>alert("xss")</script>',
      email: 'test@example.com',
      message: 'Hello',
    })
    const callArgs = mockSend.mock.calls[0][0]
    expect(callArgs.html).not.toContain('<script>')
    expect(callArgs.html).toContain('&lt;script&gt;')
  })
})
