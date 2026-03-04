import { Service } from '@/components/tech/types';

export const services: Service[] = [
  {
    id: 'ai-adoption',
    number: '01',
    title: 'AI Adoption & Strategic Enablement',
    description:
      'Bridging the gap between AI curiosity and operational competency. I provide hands-on coaching for teams of all technical levels, ensuring your organization becomes fully self-sufficient in utilizing AI tools to drive value today and remains agile enough to master the innovations of tomorrow.',
    status: 'Active',
    categories: ['AI'],
    techStack: ['ChatGPT / Codex', 'Gemini / Google Workspace', 'Claude / Claude Code', 'n8n', 'Agentic Workflows', 'Deployments'],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
  {
    id: 'bespoke-automation',
    number: '02',
    title: 'Bespoke Software & Automation',
    description:
      'Eliminating overhead and manual bottlenecks for small to medium-sized businesses. My process begins with a deep-dive discovery to fully map your unique business complexities, resulting in reliable, always-working intelligence solutions that drastically reduce labor costs and human error.',
    status: 'Active',
    categories: ['Automation'],
    techStack: ['Claude Code', 'n8n', 'AWS / GCP', 'UI/UX Design', 'iOS / Android / Web', 'OpenClaw', 'Marketing & Sales Agent Teams'],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
  {
    id: 'design-growth',
    number: '03',
    title: 'Beautiful Design, Automated Growth',
    description:
      'High-end UI/UX engineered for total operational efficiency. I build digital presences that function as fully automated growth engines—integrating autonomous customer service, intelligent retention loops, and end-to-end marketing and sales workflows that scale without increasing headcount.',
    status: 'Active',
    categories: ['Design'],
    techStack: ['Next.js', 'Figma', 'Vercel', 'Custom Animations'],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
  {
    id: 'secure-infrastructure',
    number: '04',
    title: 'Secure Business Infrastructure',
    description:
      'Protecting your competitive advantage with high-performance, always-on server environments. I architect private infrastructure that guarantees total data ownership and 24/7 reliability, insulating your critical business assets from third-party outages and escalating subscription costs.',
    status: 'Active',
    categories: ['Infrastructure'],
    techStack: ['Linux', 'Cloudflare', 'Nginx', 'Tailscale', 'OpenClaw'],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
];

export const serviceFilters = ['All', 'AI', 'Automation', 'Infrastructure', 'Design'] as const;
export type ServiceFilter = (typeof serviceFilters)[number];
