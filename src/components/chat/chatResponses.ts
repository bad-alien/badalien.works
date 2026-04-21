/**
 * Phase 1: Scripted chat responses with keyword matching
 * Phase 2: Replace with AI backend via Vercel AI SDK
 */

type ResponseMatch = {
  keywords: string[];
  response: string;
};

const responses: ResponseMatch[] = [
  // Services / How I help
  {
    keywords: ['services', 'what do you do', 'offerings', 'help with', 'provide', 'problems', 'solve'],
    response: `Three ways I help businesses put AI to work:

**AI Strategy & Implementation** — I find the highest-impact AI opportunities in your workflow and build them out. From proof-of-concept to production.

**AI-Powered Automation** — Custom automation using LLMs and agentic workflows. Intelligent data pipelines, automated analysis, smart document processing — systems that replace hours of manual work.

**Technical Enablement** — Hands-on workshops that teach your team to work effectively with tools like Claude, ChatGPT, and Cursor. Tailored to your actual workflow.

Which area is closest to what you need? Or [book a free 15-minute consult](/contact#book) and we can figure it out together.`,
  },

  // Strategy / Approach
  {
    keywords: ['strategy', 'planning', 'roadmap', 'approach', 'how do you work', 'methodology'],
    response: `I keep it simple and outcome-focused:

1. **Discovery** — I assess your current workflows and find the highest-ROI AI opportunities
2. **Proof of Concept** — We validate the approach with a small-scale pilot before committing
3. **Implementation** — I build and deploy the solution, with your team involved throughout
4. **Enablement** — I train your team to maintain and extend what we've built

No black-box handoffs. You understand what was built and why. I've run this playbook across finance, healthcare, and defense.

Want to walk through how this would look for your business? [Grab a free 15-minute consult](/contact#book) — available Monday through Friday, 9am-6pm.`,
  },

  // Automation
  {
    keywords: ['automation', 'workflow', 'pipeline', 'agentic', 'llm'],
    response: `I build intelligent automation systems using frontier AI models like Claude and GPT-4.

Recent builds:
- **HomeAI** — ML pipeline for home inspection analysis (computer vision + document extraction)
- **Webscope** — Agentic web scraper using Playwright + Claude to reverse-engineer applications
- **Custom RAG chatbots** — Domain-specific knowledge systems for legal, medical, and technical docs

These aren't chatbot wrappers — they're production systems that replace hours of manual work every day.

Got a workflow that's eating up your team's time? [Book a free 15-minute consult](/contact#book) and I'll tell you if it's a good fit for automation.`,
  },

  // Enablement / Training
  {
    keywords: ['training', 'enablement', 'teach', 'workshop', 'learn', 'upskill'],
    response: `Technical enablement is about teaching your team to work *with* AI, not replacing them.

I run hands-on workshops covering:
- Prompt engineering for Claude/GPT (system prompts, tool use, advanced patterns)
- AI-assisted development with Cursor, Copilot, and Claude Code
- Building internal tools with LLM APIs

The result: your team becomes self-sufficient with AI in their daily work. Most teams see productivity gains within the first week.

Interested in enablement for your team? [Book a free 15-minute consult](/contact#book) and we'll scope out what makes sense.`,
  },

  // Pricing
  {
    keywords: ['pricing', 'cost', 'rate', 'how much', 'budget', 'price'],
    response: `Pricing scales with scope:

**Consulting & Strategy** — $200/hour or project-based pricing for defined deliverables

**Implementation Projects** — Fixed-price quotes. Typical range: $5K (proof-of-concept) to $30K+ (full production deployment)

**Enablement Workshops** — $2K/day for team training (up to 15 people)

I'm flexible on structure — hourly, project-based, or retainer. The best way to get an accurate number is to talk through your specific needs.

[Book a free 15-minute consult](/contact#book) — no commitment, just a conversation. Available Monday through Friday, 9am-6pm.`,
  },

  // Booking / Call
  {
    keywords: ['book', 'call', 'meeting', 'schedule', 'calendar', 'talk', 'discuss', 'intro', 'consult'],
    response: `Let's do it. The intro call is free, 15 minutes, and zero pressure. We'll talk through what you're working on and whether I can help.

**[Book your free consult here](/contact#book)**
Available Monday through Friday, 9am-6pm.

Or keep asking questions here first — happy to answer anything upfront.`,
  },

  // Background / About
  {
    keywords: ['background', 'about you', 'experience', 'who are you', 'your story'],
    response: `Product manager turned AI consultant. 8+ years building software products in finance, defense, and healthtech.

The PM background means I focus on outcomes, not just code. I've shipped products used by thousands, managed engineering teams, and led technical strategy at multiple organizations.

Now I help businesses put AI to work — practical implementations that solve real problems, not science projects.

I work solo on most projects, occasionally pulling in specialists for design or infrastructure. That keeps overhead low and quality high.

Want to see if I'm the right fit? [Book a free 15-minute consult](/contact#book) — I'll give you an honest assessment.`,
  },

  // Process / Timeline
  {
    keywords: ['process', 'timeline', 'how long', 'delivery'],
    response: `My process is agile and transparent:

**Week 1-2: Discovery & Planning**
Understand your workflows, pain points, and goals. Design the solution approach. Deliver a project roadmap with milestones.

**Week 3+: Implementation**
Build in sprints with weekly check-ins. You see progress early and often — no surprises.

**Post-Launch: Handoff & Support**
Full documentation, knowledge transfer, and a 30-day support window included.

Typical projects: 4-8 weeks from kickoff to production. Some proof-of-concepts land in under 2 weeks.

[Book a free 15-minute consult](/contact#book) and I'll give you a rough timeline for your project.`,
  },

  // Portfolio / Examples
  {
    keywords: ['portfolio', 'examples', 'case studies', 'projects', 'work', 'built'],
    response: `Recent projects:

**HomeAI** — ML pipeline for analyzing home inspection reports and photos. Computer vision + document extraction to identify structural issues automatically.

**Webscope** — Agentic web scraper using Playwright + Claude to reverse-engineer web applications. Captures user flows, API calls, and data models.

**Custom RAG Chatbots** — Domain-specific knowledge systems for legal, medical, and technical documentation.

I also built this site and its chat system. Check out my [creative portfolio](/creative) for the artistic side.

Curious how something similar could work for you? [Book a free 15-minute consult](/contact#book).`,
  },

  // General greetings
  {
    keywords: ['hi', 'hello', 'hey', 'start', 'begin'],
    response: `Hey! Here's what I can tell you about:
- **How I help** — AI strategy, automation, and team enablement
- **Pricing** — rates and project costs
- **Process** — how we'd work together
- **Background** — my experience and past projects

Or skip the chat and [book a free 15-minute consult](/contact#book) to talk specifics. What would you like to know?`,
  },
];

const fallbackResponse = `Good question — let me point you in the right direction.

I can tell you about my **services**, **pricing**, **process**, or **past projects**. Or if you'd rather just talk through your situation directly:

**[Book a free 15-minute consult](/contact#book)** — available Monday through Friday, 9am-6pm. No commitment, just a conversation.

What else can I help with?`;

export function getScriptedResponse(input: string): string {
  const normalizedInput = input.toLowerCase().trim();

  // Find the first matching response
  for (const { keywords, response } of responses) {
    if (keywords.some(keyword => normalizedInput.includes(keyword))) {
      return response;
    }
  }

  return fallbackResponse;
}
