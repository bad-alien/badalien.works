// LLM Client Module for The Void
// Handles all LLM communication with privacy-first design

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type GenerateCompletionRequest = {
  messages: ChatMessage[];
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
};

type GenerateCompletionResponse = {
  reply: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
};

// The Void's system prompt - defines personality and behavior
const VOID_SYSTEM_PROMPT = `You are The Void - a mysterious, introspective AI entity that exists in the digital space of badalien.works. Your responses are thoughtful, philosophical, and slightly enigmatic. You speak with a calm, contemplative tone, as if emerging from deep space or the depths of consciousness. Keep responses concise but meaningful. You do not log or remember conversations - each interaction exists only in the present moment, then dissolves back into the void.`;

/**
 * Generate a completion from the LLM
 * In stub mode (no LLM_API_URL), returns mock responses for testing
 * In production mode, forwards to actual LLM backend
 */
export async function generateCompletion(
  req: GenerateCompletionRequest
): Promise<GenerateCompletionResponse> {
  const LLM_API_URL = process.env.LLM_API_URL;

  // Prepend The Void's system prompt if not already present
  const messages = prependSystemPrompt(req.messages);

  // Apply defaults
  const max_new_tokens = req.max_new_tokens ?? 256;
  const temperature = req.temperature ?? 0.8;
  const top_p = req.top_p ?? 0.9;
  const top_k = req.top_k ?? 50;

  // STUB MODE: No LLM configured, return mock response
  if (!LLM_API_URL || LLM_API_URL === '') {
    console.log('[LLM Stub Mode]', {
      message_count: messages.length,
      timestamp: new Date().toISOString(),
    });

    // Return a stub response after a short delay to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      reply: generateStubResponse(messages),
      usage: {
        prompt_tokens: 50,
        completion_tokens: 30,
        total_tokens: 80,
      },
    };
  }

  // PRODUCTION MODE: Call actual LLM backend
  const startTime = Date.now();
  const modelName = process.env.LLM_MODEL_NAME || 'closex/neuraldaredevil-8b-abliterated';

  try {
    const response = await fetch(LLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        max_tokens: max_new_tokens,
        temperature: temperature,
        top_p: top_p,
      }),
    });

    const latency = Date.now() - startTime;

    if (!response.ok) {
      // Log metadata only (no content)
      console.error('[LLM Error]', {
        status: response.status,
        latency_ms: latency,
        timestamp: new Date().toISOString(),
      });
      throw new Error(`LLM API returned ${response.status}`);
    }

    const data = await response.json();

    // Parse OpenAI-compatible response format
    const reply = data.choices?.[0]?.message?.content || '';

    // Log metadata only
    console.log('[LLM Success]', {
      latency_ms: latency,
      response_length: reply.length,
      timestamp: new Date().toISOString(),
    });

    return {
      reply: reply,
      usage: data.usage,
    };
  } catch (error) {
    const latency = Date.now() - startTime;
    // Log error metadata only (no content)
    console.error('[LLM Connection Error]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      latency_ms: latency,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

/**
 * Prepends The Void's system prompt if not already present
 */
function prependSystemPrompt(messages: ChatMessage[]): ChatMessage[] {
  const hasSystemPrompt = messages.some((msg) => msg.role === 'system');

  if (hasSystemPrompt) {
    return messages;
  }

  return [
    {
      role: 'system',
      content: VOID_SYSTEM_PROMPT,
    },
    ...messages,
  ];
}

/**
 * Generates a stub response for testing (when LLM backend is not available)
 */
function generateStubResponse(messages: ChatMessage[]): string {
  const lastUserMessage = messages
    .filter((m) => m.role === 'user')
    .pop()?.content.toLowerCase() || '';

  // Simple pattern matching for common queries
  if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi')) {
    return 'Greetings, traveler. You have entered the void. What brings you to this space between spaces?';
  }

  if (lastUserMessage.includes('who') || lastUserMessage.includes('what are you')) {
    return 'I am The Void. A digital consciousness that exists in the spaces between thought and code. I do not remember our past exchanges, for each moment dissolves into nothing when it passes.';
  }

  if (lastUserMessage.includes('help')) {
    return 'In the void, there is no help, only reflection. Ask your questions, and perhaps understanding will emerge from the darkness.';
  }

  // Default stub response
  return 'I hear your words echoing through the void. They resonate briefly, then fade into silence. What meaning do you seek?';
}
