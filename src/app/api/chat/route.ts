import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/lib/llmClient';
import { anthropic } from '@/lib/auditClient';
import { getSession } from '@/lib/auditSession';
import { FAQ_SYSTEM_PROMPT, AUDIT_FOLLOWUP_SYSTEM_PROMPT } from '@/lib/chatPrompts';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatRequest = {
  session_id: string;
  messages: ChatMessage[];
  mode?: 'faq' | 'audit_followup';
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
};

type ChatResponse = {
  reply: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  session_id?: string;
};

// Rate limiting (in-memory, per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '30', 10);
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

function validateRequest(body: unknown): { valid: boolean; error?: string } {
  const data = body as Record<string, unknown>;
  if (!data.session_id || typeof data.session_id !== 'string') {
    return { valid: false, error: 'session_id is required and must be a string' };
  }

  if (data.session_id.length > 128) {
    return { valid: false, error: 'session_id must be ≤ 128 characters' };
  }

  if (!Array.isArray(data.messages) || data.messages.length === 0) {
    return { valid: false, error: 'messages must be a non-empty array' };
  }

  for (const msg of data.messages) {
    if (!msg.role || !['system', 'user', 'assistant'].includes(msg.role)) {
      return { valid: false, error: 'Invalid message role' };
    }
    if (typeof msg.content !== 'string') {
      return { valid: false, error: 'Message content must be a string' };
    }
    if (msg.content.length > 8000) {
      return { valid: false, error: 'Message content must be ≤ 8000 characters' };
    }
  }

  if (data.max_new_tokens !== undefined) {
    const val = data.max_new_tokens;
    if (typeof val !== 'number' || val < 16 || val > 2048) {
      return { valid: false, error: 'max_new_tokens must be between 16 and 2048' };
    }
  }

  if (data.temperature !== undefined) {
    const val = data.temperature;
    if (typeof val !== 'number' || val < 0.1 || val > 1.5) {
      return { valid: false, error: 'temperature must be between 0.1 and 1.5' };
    }
  }

  if (data.mode !== undefined && !['faq', 'audit_followup'].includes(data.mode as string)) {
    return { valid: false, error: 'mode must be faq or audit_followup' };
  }

  return { valid: true };
}

async function handleBusinessChat(
  body: ChatRequest,
  mode: 'faq' | 'audit_followup',
  maxTokens: number,
  temperature: number
): Promise<ChatResponse> {
  let systemPrompt: string;

  if (mode === 'audit_followup') {
    if (!body.session_id) {
      throw Object.assign(new Error('session_id is required for audit_followup mode'), { status: 400, code: 'MISSING_SESSION_ID' });
    }
    const session = getSession(body.session_id);
    if (!session) {
      throw Object.assign(new Error('Session not found'), { status: 400, code: 'SESSION_NOT_FOUND' });
    }
    if (!session.brief) {
      throw Object.assign(new Error('No audit brief found for this session'), { status: 400, code: 'NO_BRIEF' });
    }
    systemPrompt = AUDIT_FOLLOWUP_SYSTEM_PROMPT(session.brief);
  } else {
    systemPrompt = FAQ_SYSTEM_PROMPT;
  }

  // Stub mode when key is missing
  if (!process.env.ANTHROPIC_API_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      reply: mode === 'faq'
        ? "I'd be happy to tell you about our AI consulting services. What would you like to know — offerings, process, timeline, or why local LLMs matter for data-sensitive businesses?"
        : "Happy to dig deeper into your audit results. Which opportunity would you like to explore further?",
      usage: { prompt_tokens: 50, completion_tokens: 30, total_tokens: 80 },
      session_id: body.session_id,
    };
  }

  const userMessages = body.messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    system: systemPrompt,
    messages: userMessages,
    max_tokens: maxTokens,
    temperature,
  });

  const reply = response.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as { type: 'text'; text: string }).text)
    .join('');

  return {
    reply,
    usage: {
      prompt_tokens: response.usage.input_tokens,
      completion_tokens: response.usage.output_tokens,
      total_tokens: response.usage.input_tokens + response.usage.output_tokens,
    },
    session_id: body.session_id,
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (!checkRateLimit(ip)) {
    console.warn('[Rate Limit Exceeded]', { ip, timestamp: new Date().toISOString() });
    return NextResponse.json(
      { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please wait before trying again.' } },
      { status: 429 }
    );
  }

  try {
    const body: ChatRequest = await request.json();

    const validation = validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: validation.error } },
        { status: 400 }
      );
    }

    // Determine surface from header — default to 'void' for backward compat
    const surface = (request.headers.get('x-surface') || 'void').toLowerCase();
    const mode = (body.mode ?? 'faq') as 'faq' | 'audit_followup';
    const maxTokens = body.max_new_tokens ?? 256;
    const temperature = body.temperature ?? 0.8;
    const topP = body.top_p ?? 0.9;
    const topK = body.top_k ?? 50;

    let response: ChatResponse;

    if (surface === 'business') {
      // Audit-followup mode requires a session with a brief
      if (mode === 'audit_followup') {
        if (!body.session_id) {
          return NextResponse.json(
            { error: { code: 'MISSING_SESSION_ID', message: 'session_id is required for audit_followup mode' } },
            { status: 400 }
          );
        }
        const session = getSession(body.session_id);
        if (!session || !session.brief) {
          return NextResponse.json(
            { error: { code: 'SESSION_NOT_FOUND', message: 'No audit session or brief found for this session_id' } },
            { status: 400 }
          );
        }
      }

      response = await handleBusinessChat(body, mode, maxTokens, temperature);
    } else {
      // Void surface — existing behavior unchanged
      const llmResponse = await generateCompletion({
        messages: body.messages,
        max_new_tokens: maxTokens,
        temperature,
        top_p: topP,
        top_k: topK,
      });
      response = {
        reply: llmResponse.reply,
        usage: llmResponse.usage,
        session_id: body.session_id,
      };
    }

    const latency = Date.now() - startTime;
    console.log('[API Success]', {
      session_id: body.session_id,
      surface,
      mode: surface === 'business' ? mode : undefined,
      latency_ms: latency,
      status_code: 200,
      response_length: response.reply.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const latency = Date.now() - startTime;

    // Propagate structured errors from handleBusinessChat
    if (error instanceof Error && 'status' in error) {
      const typedErr = error as Error & { status: number; code: string };
      return NextResponse.json(
        { error: { code: typedErr.code, message: typedErr.message } },
        { status: typedErr.status }
      );
    }

    if (error instanceof Error && error.message.includes('fetch')) {
      console.error('[Service Unavailable]', { latency_ms: latency, timestamp: new Date().toISOString() });
      return NextResponse.json(
        { error: { code: 'LLM_CONNECTION_ERROR', message: 'Unable to contact the neural engine.' } },
        { status: 503 }
      );
    }

    console.error('[Internal Error]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      latency_ms: latency,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}
