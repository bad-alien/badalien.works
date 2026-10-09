// Client engagements shown on the homepage (featured only), /consult and /about.
// Keep chip text honest: only claim what shipped. Name a client only with their OK.
export type ServiceTag = 'Strategy' | 'Deployment' | 'Enablement';

export type CaseStudy = {
  id: string;
  title: string;
  services: ServiceTag[];
  chip: string;
  chipType: 'progress' | 'active' | 'built';
  description: string;
  image?: string;
  imageContain?: boolean;
  imageCenter?: boolean;
  // Spans the full grid row as a text-led card
  wide?: boolean;
  // Shown on the homepage
  featured?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    id: 'camco',
    title: 'CAMCO: From Model Choice to Daily Use',
    services: ['Strategy', 'Deployment', 'Enablement'],
    chip: 'Repeat Client',
    chipType: 'active',
    description:
      'A commercial real estate group, across two onsites and remote work in between. We weighed the Claude and OpenAI tiers against open-source models and chose Claude. I built Property Power, which assesses power availability from public records, satellite imagery and news, then built a SharePoint integration to their spec, prepped their documents for it, and trained the team to use it inside Claude.',
    wide: true,
    featured: true,
  },
  {
    id: 'agency-enablement',
    title: 'An Agency That Builds Its Own AI Tools',
    services: ['Enablement', 'Strategy'],
    chip: 'Completed',
    chipType: 'built',
    description:
      'A 40-person social ad agency where everyone used AI their own way: prompts lost in personal chats, the same custom GPT built twice by different teams. I coached their leads to build and run AI workflows themselves, then consolidated the agency onto one shared Claude setup, where each client account has a knowledge base everyone\'s AI reads from, and staff build and share their own Skills.',
    image: '/images/work/enablement-hero.png',
    imageCenter: true,
    featured: true,
  },
  {
    id: 'back-office',
    title: 'AI Back Office for a B2B Wholesaler',
    services: ['Deployment'],
    chip: 'In Prod',
    chipType: 'built',
    description:
      'Agents that run the work between first contact and paid invoice. They find and research leads and email them, log every touch in the CRM, generate purchase orders and invoices, chase anything overdue, and answer customer questions by text and email, handing anything unusual to a person. 10-20 qualified leads a week.',
    image: '/images/work/leadgen-hero.png',
    featured: true,
  },
  {
    id: 'primari',
    title: 'Primari Health: An AI-Ready Practice',
    services: ['Strategy'],
    chip: 'Completed',
    chipType: 'built',
    description:
      'A new primary care practice, alongside its website. Automating front-desk work and patient outreach was the only way the doctor could open cost-effectively, but it had to stay HIPAA compliant, which limits where AI can touch patient data. We compared Practice Better and Healthie on what their APIs allow and what the AI build would cost, and chose Practice Better.',
  },
  {
    id: 'screening-agent',
    title: 'Screening Coordination Agent',
    services: ['Deployment', 'Enablement'],
    chip: 'Built',
    chipType: 'built',
    description:
      'For an independent documentary: an agent that takes screening requests from first inquiry to booked date. It answers questions about the film, qualifies the venue, schedules, and hands off to the crew when something needs approval. Traced and evaluated. Plus a session training the crew to use AI for outreach and marketing.',
  },
  {
    id: 'home-inspection',
    title: 'Inspection Report Automation',
    services: ['Deployment'],
    chip: 'Built',
    chipType: 'built',
    description:
      'Multimodal AI that processes inspection reports end-to-end — parses documents, analyzes photos, surfaces what matters. Hundreds of reports through production, processing time cut by two-thirds.',
  },
  {
    id: 'private-assistants',
    title: 'Private Assistants for Owners and Executives',
    services: ['Deployment'],
    chip: '3 Active Clients',
    chipType: 'active',
    description:
      'An assistant wired into email, calendar, documents and finances that drafts replies, keeps the schedule, tracks bills and follows up. Claude Cowork or ChatGPT Work when that\'s enough; a self-hosted open-source assistant when the data shouldn\'t leave their hands. Three running today.',
  },
];

export const featuredCaseStudies = caseStudies.filter((study) => study.featured);
