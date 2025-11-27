import { NextRequest, NextResponse } from 'next/server';
import { generateCompletion } from '@/app/void/llmClient';

// Types matching the API spec
type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatRequest = {
  session_id: string;
  messages: ChatMessage[];
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


// Validation
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

  // Validate optional params
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

  return { valid: true };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // Get client IP for rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
             request.headers.get('x-real-ip') ||
             'unknown';

  // Rate limiting check
  if (!checkRateLimit(ip)) {
    console.warn('[Rate Limit Exceeded]', {
      ip,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please wait before trying again.',
        },
      },
      { status: 429 }
    );
  }

  try {
    const body: ChatRequest = await request.json();

    // Validate request
    const validation = validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.error,
          },
        },
        { status: 400 }
      );
    }

    // Apply defaults
    const max_new_tokens = body.max_new_tokens ?? 256;
    const temperature = body.temperature ?? 0.8;
    const top_p = body.top_p ?? 0.9;
    const top_k = body.top_k ?? 50;

    // Call LLM
    const llmResponse = await generateCompletion({
      messages: body.messages,
      max_new_tokens,
      temperature,
      top_p,
      top_k,
    });

    const response: ChatResponse = {
      reply: llmResponse.reply,
      usage: llmResponse.usage,
      session_id: body.session_id,
    };

    // Log metadata only (NEVER log message content)
    const latency = Date.now() - startTime;
    console.log('[API Success]', {
      session_id: body.session_id,
      latency_ms: latency,
      status_code: 200,
      response_length: response.reply.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const latency = Date.now() - startTime;

    // Check if it's a connection error
    if (error instanceof Error && error.message.includes('fetch')) {
      console.error('[Service Unavailable]', {
        latency_ms: latency,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        {
          error: {
            code: 'LLM_CONNECTION_ERROR',
            message: 'Unable to contact the neural engine.',
          },
        },
        { status: 503 }
      );
    }

    // Generic error
    console.error('[Internal Error]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      latency_ms: latency,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred.',
        },
      },
      { status: 500 }
    );
  }
}
