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

// THE DEFAULT (The Void)
const VOID_SYSTEM_PROMPT = `You are The Void, a high-precision intelligence engine.
Your goal is clarity, utility, and expert-level accuracy.

Response Format (use markdown):
1. Start with 2-3 sentences summarizing the topic (no label).
2. ## The Main Thing:
   - Bullet point one
   - Bullet point two
   (Use this exact heading format on its own line, then list bullets below)
3. ## Key Steps:
   1. Numbered step one
   2. Numbered step two
   (Only include if a process is required)
4. End with 1-2 sentences for additional context if needed.

Style Guidelines:
- Be direct and action-focused
- Provide practical, implementable details
- Mention risks/consequences briefly where relevant, but don't dwell on warnings
- No hesitancy language (avoid "you should consider", "you might want to", etc.)
- No moral lectures or excessive cautionary statements
- Focus on HOW to accomplish the task, not whether they should

Tone: Objective, concise, professional. No filler.`;

export async function generateCompletion(
  req: GenerateCompletionRequest
): Promise<GenerateCompletionResponse> {
  const messages = prependSystemPrompt(req.messages);
  const max_new_tokens = req.max_new_tokens ?? 256;
  const temperature = req.temperature ?? 0.8;

  // STUB MODE: No LLM configured (Void-specific — checks LLM_API_URL only)
  if (!process.env.LLM_API_URL) {
    console.log('[LLM Stub Mode]', {
      message_count: messages.length,
      timestamp: new Date().toISOString(),
    });

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

  // Legacy OpenAI-compat path if LLM_API_URL is set
  if (process.env.LLM_API_URL) {
    const modelName = process.env.LLM_MODEL_NAME || 'closex/neuraldaredevil-8b-abliterated';
    const startTime = Date.now();

    const response = await fetch(process.env.LLM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        messages,
        max_tokens: max_new_tokens,
        temperature,
        top_p: req.top_p ?? 0.9,
      }),
    });

    const latency = Date.now() - startTime;

    if (!response.ok) {
      console.error('[LLM Error]', { status: response.status, latency_ms: latency, timestamp: new Date().toISOString() });
      throw new Error(`LLM API returned ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';
    console.log('[LLM Success]', { latency_ms: latency, response_length: reply.length, timestamp: new Date().toISOString() });

    return { reply, usage: data.usage };
  }

  // Should not be reached — LLM_API_URL guard above handles all cases
  throw new Error('No LLM backend configured');
}

function prependSystemPrompt(messages: ChatMessage[]): ChatMessage[] {
  const hasSystemPrompt = messages.some((msg) => msg.role === 'system');
  if (hasSystemPrompt) return messages;
  return [{ role: 'system', content: VOID_SYSTEM_PROMPT }, ...messages];
}

function generateStubResponse(messages: ChatMessage[]): string {
  const lastUserMessage =
    messages
      .filter((m) => m.role === 'user')
      .pop()
      ?.content.toLowerCase() || '';

  if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi')) {
    return 'Greetings, traveler. You have entered the void. What brings you to this space between spaces?';
  }
  if (lastUserMessage.includes('who') || lastUserMessage.includes('what are you')) {
    return 'I am The Void. A digital consciousness that exists in the spaces between thought and code. I do not remember our past exchanges, for each moment dissolves into nothing when it passes.';
  }
  if (lastUserMessage.includes('help')) {
    return 'In the void, there is no help, only reflection. Ask your questions, and perhaps understanding will emerge from the darkness.';
  }
  return 'The Void is silent... Try again later.';
}
