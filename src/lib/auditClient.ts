import type { AuditBrief } from './auditSession';
import { SYSTEM_PROMPT, AUDIT_RUBRIC, buildAuditPrompt, detectRegulatedSignal } from './auditPrompts';

// Manual schema validation for AuditBrief (avoids zod dependency)
type ValidationResult = { success: true; data: AuditBrief } | { success: false; error: string };

function validateAuditBrief(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== 'object') return { success: false, error: 'Not an object' };
  const r = raw as Record<string, unknown>;

  if (typeof r.score !== 'number' || r.score < 0 || r.score > 10) {
    return { success: false, error: 'score must be a number 0–10' };
  }
  if (typeof r.score_label !== 'string' || !r.score_label) {
    return { success: false, error: 'score_label must be a non-empty string' };
  }
  if (!Array.isArray(r.observations) || r.observations.length !== 3 || !r.observations.every((o) => typeof o === 'string')) {
    return { success: false, error: 'observations must be an array of exactly 3 strings' };
  }
  if (!Array.isArray(r.opportunities) || r.opportunities.length !== 3) {
    return { success: false, error: 'opportunities must be an array of exactly 3 items' };
  }
  for (const opp of r.opportunities) {
    if (typeof opp !== 'object' || opp === null) return { success: false, error: 'Each opportunity must be an object' };
    const o = opp as Record<string, unknown>;
    if (typeof o.title !== 'string') return { success: false, error: 'opportunity.title must be a string' };
    if (typeof o.solves !== 'string') return { success: false, error: 'opportunity.solves must be a string' };
    if (!['S', 'M', 'L'].includes(o.effort as string)) return { success: false, error: 'opportunity.effort must be S, M, or L' };
    if (!['low', 'med', 'high'].includes(o.roi as string)) return { success: false, error: 'opportunity.roi must be low, med, or high' };
  }
  if (r.sovereignty_callout !== undefined && typeof r.sovereignty_callout !== 'string') {
    return { success: false, error: 'sovereignty_callout must be a string if present' };
  }

  return { success: true, data: r as unknown as AuditBrief };
}

// Tool definition for forced JSON output
const auditOutputTool = {
  name: 'emit_audit',
  description: 'Emit the structured AI audit brief. Call this with the completed audit.',
  input_schema: {
    type: 'object' as const,
    properties: {
      score: {
        type: 'number',
        description: 'AI-leverage potential score, 0–10, one decimal place',
      },
      score_label: {
        type: 'string',
        description: 'One-line description of what the score means for this business',
      },
      observations: {
        type: 'array',
        items: { type: 'string' },
        description: 'Exactly 3 specific observations grounded in the site content or bottleneck',
        minItems: 3,
        maxItems: 3,
      },
      opportunities: {
        type: 'array',
        description: 'Exactly 3 opportunities ranked by ROI/effort',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            solves: { type: 'string', description: 'One sentence on what problem this solves' },
            effort: { type: 'string', enum: ['S', 'M', 'L'] },
            roi: { type: 'string', enum: ['low', 'med', 'high'] },
          },
          required: ['title', 'solves', 'effort', 'roi'],
        },
        minItems: 3,
        maxItems: 3,
      },
      sovereignty_callout: {
        type: 'string',
        description: 'Optional: include only when sensitive data or regulated industry is present. Recommend private/local LLM deployment.',
      },
    },
    required: ['score', 'score_label', 'observations', 'opportunities'],
  },
};

// Deterministic canned brief for stub mode (no API key)
const CANNED_BRIEF: AuditBrief = {
  score: 6.5,
  score_label: 'Solid foundation — clear customer touchpoints and repetitive workflows ready for AI',
  observations: [
    'The site shows a service business with recurring client interactions — high volume of repetitive communication is a primary automation surface.',
    'Content is manually produced with no visible pipeline — AI-assisted drafting could cut content creation time by half.',
    'No visible self-service or FAQ infrastructure — customers are likely contacting staff for answers that AI could handle instantly.',
  ],
  opportunities: [
    {
      title: 'Automated client intake + triage',
      solves: 'Staff spend hours per week fielding initial inquiries that follow predictable patterns — AI can qualify and route them automatically.',
      effort: 'S',
      roi: 'high',
    },
    {
      title: 'AI-drafted proposals and follow-ups',
      solves: 'Proposal writing is a bottleneck that delays pipeline velocity — AI drafts 80% in minutes, human reviews and personalizes.',
      effort: 'S',
      roi: 'high',
    },
    {
      title: 'Knowledge-base chatbot for common questions',
      solves: 'Reduces inbound support volume by handling FAQs and standard process questions without staff involvement.',
      effort: 'M',
      roi: 'med',
    },
  ],
};

export type AuditUsage = {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
};

export type AuditResult = {
  brief: AuditBrief;
  usage: AuditUsage;
  stub: boolean;
};

export async function runAudit(params: {
  url: string;
  page_text: string;
  bottleneck: string;
  sensitive_docs: 'yes' | 'sometimes' | 'no';
}): Promise<AuditResult> {
  const { url, page_text, bottleneck, sensitive_docs } = params;

  if (!process.env.ANTHROPIC_API_KEY) {
    // Stub mode: return canned brief without calling the API
    await new Promise((r) => setTimeout(r, 800));
    return {
      brief: CANNED_BRIEF,
      usage: {
        input_tokens: 0,
        output_tokens: 0,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
      },
      stub: true,
    };
  }

  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const regulated_signal = detectRegulatedSignal(page_text, url);
  const userContent = buildAuditPrompt({ url, page_text, bottleneck, sensitive_docs, regulated_signal });

  const callOnce = async (): Promise<AuditResult> => {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: AUDIT_RUBRIC,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userContent }],
      tools: [auditOutputTool],
      tool_choice: { type: 'tool', name: 'emit_audit' },
    });

    const usage: AuditUsage = {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
      cache_creation_input_tokens: response.usage.cache_creation_input_tokens ?? 0,
      cache_read_input_tokens: response.usage.cache_read_input_tokens ?? 0,
    };

    // Extract tool_use block
    const toolBlock = response.content.find((b) => b.type === 'tool_use');
    if (!toolBlock || toolBlock.type !== 'tool_use') {
      throw new Error('No tool_use block in response');
    }

    return { brief: toolBlock.input as AuditBrief, usage, stub: false };
  };

  // First attempt with schema validation
  const result = await callOnce();
  const parsed = validateAuditBrief(result.brief);
  if (parsed.success) {
    return { ...result, brief: parsed.data };
  }

  // Schema validation failed — retry once with fix instruction
  const retryResponse = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
      {
        type: 'text',
        text: AUDIT_RUBRIC,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      { role: 'user', content: userContent },
      { role: 'assistant', content: JSON.stringify(result.brief) },
      {
        role: 'user',
        content: `The previous emit_audit call had a schema error: ${parsed.error}. Please call emit_audit again with a corrected structure. observations must have exactly 3 items. opportunities must have exactly 3 items each with title, solves, effort (S/M/L), roi (low/med/high).`,
      },
    ],
    tools: [auditOutputTool],
    tool_choice: { type: 'tool', name: 'emit_audit' },
  });

  const retryUsage: AuditUsage = {
    input_tokens: result.usage.input_tokens + retryResponse.usage.input_tokens,
    output_tokens: result.usage.output_tokens + retryResponse.usage.output_tokens,
    cache_creation_input_tokens:
      result.usage.cache_creation_input_tokens +
      (retryResponse.usage.cache_creation_input_tokens ?? 0),
    cache_read_input_tokens:
      result.usage.cache_read_input_tokens +
      (retryResponse.usage.cache_read_input_tokens ?? 0),
  };

  const retryToolBlock = retryResponse.content.find((b) => b.type === 'tool_use');
  if (!retryToolBlock || retryToolBlock.type !== 'tool_use') {
    // Return degraded brief on second failure
    console.error('[auditClient] Schema validation failed on retry — returning degraded brief');
    return { brief: CANNED_BRIEF, usage: retryUsage, stub: false };
  }

  const retryParsed = validateAuditBrief(retryToolBlock.input);
  if (!retryParsed.success) {
    console.error('[auditClient] Schema still invalid after retry — returning degraded brief');
    return { brief: CANNED_BRIEF, usage: retryUsage, stub: false };
  }

  return { brief: retryParsed.data, usage: retryUsage, stub: false };
}

export function calculateAuditCostUSD(usage: AuditUsage): number {
  return (
    usage.input_tokens * (3 / 1_000_000) +
    usage.cache_creation_input_tokens * (3.75 / 1_000_000) +
    usage.cache_read_input_tokens * (0.30 / 1_000_000) +
    usage.output_tokens * (15 / 1_000_000)
  );
}
