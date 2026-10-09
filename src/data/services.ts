import { Service } from '@/components/services/types';

// The single source for what Bad Alien offers. The homepage, /consult, /services,
// the Pasadena page, llms.txt, the services JSON-LD and the chat prompt all read from
// here, so change the offer in this file and nowhere else.
export const services: Service[] = [
  {
    id: 'ai-enablement',
    number: '01',
    title: 'AI Enablement',
    description:
      'Your team has AI licenses and still does the work by hand. I fix that with hands-on sessions built around your actual workflows, not generic prompt tips. Your people leave able to build their own assistants, Skills and automations, with the guardrails to run them safely. I succeed when you stop needing me.',
    status: 'Active',
    techStack: [
      'Claude / Cowork / Claude Code',
      'ChatGPT / Codex',
      'Gemini / Google Workspace',
      'Custom GPTs & Claude Skills',
      'Workshops & Coaching Sprints',
      'Team Playbooks',
    ],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
  {
    id: 'ai-strategy',
    number: '02',
    title: 'AI Strategy',
    description:
      'Which tools are worth paying for, which model fits the job, and where your data should live. That might be the right Claude or OpenAI tier, or an open-source model that brings the cost way down. I compare the options against your budget and the work you actually do, then hand you a ranked plan: what to adopt, what to skip, what to build. No vendor to sell you.',
    status: 'Active',
    techStack: [
      'Tool & Platform Selection',
      'Model Selection',
      'Build vs. Buy',
      'Cost Modeling',
      '30/60/90 Roadmap',
      'AI Usage Policy',
    ],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
  {
    id: 'ai-deployment',
    number: '03',
    title: 'AI Deployment',
    description:
      "When something is worth building, I build it with you: custom automations, agents, integrations with the tools you already use, and open-source or local LLMs when the data can't leave your walls. Discovery first, a working pilot fast, documentation your team can maintain. No black boxes, no lock-in.",
    status: 'Active',
    techStack: [
      'Claude Code & Cloud Sessions',
      'Claude Agent SDK',
      'OpenAI Agents SDK',
      'Vercel AI SDK',
      'LangChain',
      'n8n',
      'Open-Source / Local LLMs',
      'SharePoint & Google Workspace',
      'AWS / GCP / VPS',
      'Evals & Tracing',
    ],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
];

// Section intro wherever the three services are listed together
export const SERVICES_INTRO =
  "Teach your team, pick the right tools, build what's worth building. Hire me for one or all three. Every engagement ends with your team running it without me.";
