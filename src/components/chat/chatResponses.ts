/**
 * Phase 1: Scripted chat responses with keyword matching
 * Phase 2: Replace with AI backend via Vercel AI SDK
 */

type ResponseMatch = {
  keywords: string[];
  response: string;
};

const responses: ResponseMatch[] = [
  // Services
  {
    keywords: ['services', 'what do you do', 'offerings', 'help with', 'provide'],
    response: `I offer three core AI consulting services:

**AI Strategy & Implementation** — I help organizations design and deploy AI solutions that actually work. From proof-of-concept to production deployment.

**AI-Powered Automation** — I build custom automation systems using LLMs and agentic workflows. Think intelligent data pipelines, automated analysis, and smart document processing.

**Technical Enablement** — I train teams to work effectively with AI tools like Claude, ChatGPT, and Cursor. Hands-on workshops tailored to your workflow.

Which area interests you most?`,
  },

  // Strategy
  {
    keywords: ['strategy', 'planning', 'roadmap', 'approach'],
    response: `My approach to AI strategy is practical and outcome-focused:

1. **Discovery** — I assess your current workflows and identify high-impact AI opportunities
2. **Proof of Concept** — We validate the approach with a small-scale pilot
3. **Implementation** — I build and deploy the solution, with your team involved throughout
4. **Enablement** — I train your team to maintain and extend what we've built

I've done this for companies ranging from finance to healthcare. Want to discuss your specific use case?`,
  },

  // Automation
  {
    keywords: ['automation', 'workflow', 'pipeline', 'agentic', 'llm'],
    response: `I specialize in building intelligent automation systems using frontier AI models like Claude and GPT-4.

Recent examples:
- Automated ML pipeline for home inspection analysis (computer vision + document extraction)
- Agentic web scraping system for reverse-engineering applications
- Custom chatbots with RAG (retrieval-augmented generation) for domain-specific knowledge

These aren't chatbot wrappers — they're production systems that replace hours of manual work.

What workflow are you looking to automate?`,
  },

  // Enablement / Training
  {
    keywords: ['training', 'enablement', 'teach', 'workshop', 'learn', 'upskill'],
    response: `Technical enablement is about teaching your team to work *with* AI tools effectively, not replacing them.

I run hands-on workshops covering:
- Prompt engineering for Claude/GPT (including system prompts and tool use)
- AI-assisted development with Cursor, Copilot, and Claude Code
- Building internal tools with LLM APIs

The goal: your team becomes self-sufficient with AI in their daily work.

Interested in enablement for your team?`,
  },

  // Pricing
  {
    keywords: ['pricing', 'cost', 'rate', 'how much', 'budget', 'price'],
    response: `Pricing depends on scope and engagement type:

**Consulting & Strategy** — $200/hour or project-based pricing for defined deliverables

**Implementation Projects** — Fixed-price quotes based on scope. Typical projects range from $5K (proof-of-concept) to $30K+ (full production deployment)

**Enablement Workshops** — $2K/day for team training (up to 15 people)

I'm flexible on structure — hourly, project-based, or retainer. Want to discuss your specific needs?`,
  },

  // Booking / Call
  {
    keywords: ['book', 'call', 'meeting', 'schedule', 'calendar', 'talk', 'discuss'],
    response: `Great! I'd love to talk through your project.

You can book a 30-minute intro call directly on my calendar. We'll discuss your goals, current challenges, and whether I'm the right fit.

**Book here:** [Link to calendar will be added]

Or keep asking questions here — I'm happy to answer anything upfront.`,
  },

  // Background / About
  {
    keywords: ['background', 'about you', 'experience', 'who are you', 'your story'],
    response: `I'm a product manager turned AI consultant with 8+ years building software products in finance, defense, and healthtech.

My PM background means I focus on outcomes, not just code. I've shipped products used by thousands of users, managed engineering teams, and led technical strategy.

Now I help organizations leverage AI without the hype — practical implementations that solve real problems.

I work solo on most projects, occasionally pulling in specialists for design or infrastructure.

What else would you like to know?`,
  },

  // Process / Methodology
  {
    keywords: ['process', 'how do you work', 'methodology', 'workflow', 'timeline'],
    response: `My process is agile and transparent:

**Week 1-2: Discovery & Planning**
- Understand your workflows, pain points, goals
- Design the solution approach
- Create a project roadmap with milestones

**Week 3+: Implementation**
- Build in sprints with weekly check-ins
- Share progress early and often (no "big reveal" at the end)
- Iterate based on your feedback

**Post-Launch: Handoff & Support**
- Full documentation and knowledge transfer
- 30-day support window included
- Available for ongoing maintenance if needed

Typical projects take 4-8 weeks from kickoff to production.

Sound good?`,
  },

  // Portfolio / Examples
  {
    keywords: ['portfolio', 'examples', 'case studies', 'projects', 'work', 'built'],
    response: `Recent projects include:

**HomeAI** — ML pipeline for analyzing home inspection reports and photos. Combines computer vision with document extraction to identify structural issues automatically.

**Webscope** — Agentic web scraper using Playwright + Claude to reverse-engineer web applications. Captures user flows, API calls, and data models.

**Custom Chatbots** — Built several RAG-based chatbots for domain-specific knowledge (legal, medical, technical documentation).

I also built this site and its AI chat system — creative.badalien.works and void.badalien.works show the artistic side.

Want details on any of these?`,
  },

  // General / Catch-all
  {
    keywords: ['hi', 'hello', 'hey', 'start', 'begin'],
    response: `Hey! I can help you with:
- **Services** — what I offer and how I can help
- **Pricing** — rates and project costs
- **Process** — how we'd work together
- **Background** — my experience and past projects
- **Booking** — scheduling a call

What would you like to know?`,
  },
];

const fallbackResponse = `That's a great question! I'm still learning (this is a scripted chatbot in Phase 1).

For now, the best way to get detailed answers is to **book a call** with me directly. I can walk through your specific situation and give you a tailored recommendation.

Or ask about:
- Services & offerings
- Pricing & process
- My background & past work
- Booking a call

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
