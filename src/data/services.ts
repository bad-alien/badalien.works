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
    techStack: ['OpenAI', 'Anthropic Claude', 'LangChain', 'LlamaIndex', 'Python', 'Jupyter'],
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
    techStack: ['n8n', 'Python', 'Node.js', 'Zapier', 'Make', 'PostgreSQL', 'REST APIs'],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
  {
    id: 'secure-infrastructure',
    number: '03',
    title: 'Secure Business Infrastructure',
    description:
      'Protecting your competitive advantage with high-performance, always-on server environments. I architect private infrastructure that guarantees total data ownership and 24/7 reliability, insulating your critical business assets from third-party outages and escalating subscription costs.',
    status: 'Active',
    categories: ['Infrastructure'],
    techStack: ['Linux', 'Docker', 'Nginx', 'Cloudflare', 'Proxmox', 'Terraform', 'WireGuard'],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
  {
    id: 'design-growth',
    number: '04',
    title: 'Strategic Design & Automated Growth',
    description:
      'High-end UI/UX engineered for total operational efficiency. I build digital presences that function as fully automated growth engines—integrating autonomous customer service, intelligent retention loops, and end-to-end marketing and sales workflows that scale without increasing headcount.',
    status: 'Active',
    categories: ['Design'],
    techStack: ['Next.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Figma', 'Vercel'],
    demo: { type: 'placeholder' },
    ctaLabel: "Let's Talk →",
    ctaUrl: '/contact',
  },
];

export const serviceFilters = ['All', 'AI', 'Automation', 'Infrastructure', 'Design'] as const;
export type ServiceFilter = (typeof serviceFilters)[number];
