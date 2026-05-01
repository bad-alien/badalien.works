import { vi } from 'vitest'
import type { AuditBrief } from '@/lib/auditSession'

export const VALID_URL = 'https://example-smb.com'
export const VALID_BOTTLENECK = 'We spend too much time on manual data entry and customer follow-ups.'
export const LEAD_EMAIL = 'r@badalien.works'

export const STUB_BRIEF: AuditBrief = {
  score: 7.5,
  score_label: 'Strong foundation, three high-value automation opportunities',
  observations: [
    'Manual data entry across multiple systems creates daily bottlenecks',
    'Customer follow-up process relies on human memory and spreadsheets',
    'No automated reporting — insights require manual compilation',
  ],
  opportunities: [
    {
      title: 'Automated CRM Data Entry',
      solves: 'Eliminates 2–3 hours/day of manual data entry via AI form parsing and sync',
      effort: 'M',
      roi: 'high',
    },
    {
      title: 'AI-Driven Follow-Up Sequences',
      solves: 'Automates personalized follow-up emails triggered by deal stage changes',
      effort: 'S',
      roi: 'high',
    },
    {
      title: 'Automated Weekly Reporting',
      solves: 'Generates stakeholder reports from live data — zero manual compilation',
      effort: 'M',
      roi: 'med',
    },
  ],
}

export const STUB_BRIEF_WITH_SOVEREIGNTY: AuditBrief = {
  ...STUB_BRIEF,
  sovereignty_callout:
    'Your work involves sensitive patient/client data. Private LLM deployment (on-premise or air-gapped) lets you capture AI efficiency gains without routing confidential data to third-party APIs.',
}

/** Create a session via the /api/audit/start route and return the session_id */
export async function createTestSession(): Promise<string> {
  const { POST } = await import('@/app/api/audit/start/route')
  const req = makePostRequest('http://localhost/api/audit/start', { url: VALID_URL })
  const res = await POST(req as any)
  // `res` may be a real Response (with .json() method) or a plain { body, status } object
  // from the vi.mock('next/server') pattern used in some test files.
  const body =
    typeof (res as any).json === 'function'
      ? await (res as any).json()
      : (res as any).body
  return body.session_id
}

/** Seed an audit session with a brief directly via module internals */
export async function seedSessionWithBrief(
  sessionId: string,
  brief: AuditBrief = STUB_BRIEF
): Promise<void> {
  const { setBrief, setInputs } = await import('@/lib/auditSession')
  setInputs(sessionId, {
    url: VALID_URL,
    bottleneck: VALID_BOTTLENECK,
    sensitive_docs: 'no',
  })
  setBrief(sessionId, brief)
}

export function makeAuditRunRequest(
  overrides: Partial<{
    url: string
    bottleneck: string
    sensitive_docs: string
    session_id: string
  }> = {}
) {
  return {
    url: VALID_URL,
    bottleneck: VALID_BOTTLENECK,
    sensitive_docs: 'no' as const,
    session_id: 'NEEDS_REAL_SESSION', // caller should override
    ...overrides,
  }
}

export function makePostRequest(
  url: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = {}
) {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

/** Parse SSE response into array of { event, data } pairs */
export async function parseSSEStream(
  response: Response | { body?: unknown; status: number; headers?: Headers }
): Promise<{ event?: string; data: string }[]> {
  let text: string
  if (response instanceof Response) {
    text = await response.text()
  } else {
    // Mock response — body may already be a string or stream
    text = typeof (response as any).body === 'string'
      ? (response as any).body
      : JSON.stringify((response as any).body ?? '')
    return []
  }

  const events: { event?: string; data: string }[] = []
  let current: { event?: string; data: string } = { data: '' }

  for (const line of text.split('\n')) {
    if (line.startsWith('event:')) {
      current.event = line.slice(6).trim()
    } else if (line.startsWith('data:')) {
      current.data = line.slice(5).trim()
    } else if (line === '' && (current.event || current.data)) {
      events.push({ ...current })
      current = { data: '' }
    }
  }
  if (current.event || current.data) events.push(current)

  return events
}
