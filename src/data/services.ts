import { Service } from '@/components/services/types';

export const services: Service[] = [
  {
    id: 'ai-adoption',
    number: '01',
    title: 'AI Adoption & Enablement',
    description:
      'Learning AI tools is too important to outsource permanently. I build the initial bridge — hands-on coaching that cuts through the hype, gives your team real capability, and gets you operating independently. I succeed when you stop needing me.',
    status: 'Active',
    categories: ['AI'],
    techStack: ['ChatGPT / Codex', 'Gemini / Google Workspace', 'Claude / Claude Code', 'n8n', 'Agentic Workflows', 'Deployments'],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
  {
    id: 'cost-intelligence',
    number: '02',
    title: 'Operations & Cost Intelligence',
    description:
      'Most businesses are bleeding money on tools and subscriptions they\'ve stopped questioning. AI has collapsed the cost of building custom alternatives. I audit your full operation and show you exactly where to cut, consolidate, or replace.',
    status: 'Active',
    categories: ['Automation'],
    techStack: ['Stack Audit', 'SaaS Rationalization', 'Build vs. Buy Analysis', 'Cost Modeling', 'Vendor Benchmarking'],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
  {
    id: 'bespoke-automation',
    number: '03',
    title: 'Bespoke Apps & Automation',
    description:
      'Discovery comes first — I map your actual business needs before writing a line of code. When I build, I build with you, not for you. You\'ll understand how it works, own the result, and be capable of adapting it as your business evolves. No black boxes, no lock-in.',
    status: 'Active',
    categories: ['Automation'],
    techStack: ['Claude Code', 'n8n', 'AWS / GCP', 'UI/UX Design', 'iOS / Android / Web', 'OpenClaw', 'Marketing & Sales Agent Teams'],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
  {
    id: 'design-growth',
    number: '04',
    title: 'Websites That Work For You',
    description:
      'AI is how I build fast. Design experience is how I make sure it doesn\'t look like it. Your site gets both — a genuinely crafted digital presence with real business automation wired in, not a template with your logo swapped in.',
    status: 'Active',
    categories: ['Design'],
    techStack: ['Next.js', 'Figma', 'Vercel', 'Custom Animations'],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
];

export const serviceFilters = ['All', 'AI', 'Automation', 'Design'] as const;
export type ServiceFilter = (typeof serviceFilters)[number];
