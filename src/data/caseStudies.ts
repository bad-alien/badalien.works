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
    id: 'agency-claude-migration',
    title: 'Agency-Wide Move to Claude',
    services: ['Enablement', 'Strategy'],
    chip: 'Completed',
    chipType: 'built',
    description:
      'A 40-person social ad agency. What began as a 20-hour coaching sprint, hours capped from day one, became the agency\'s move from ChatGPT to Claude and Cowork: a 90-day migration playbook, Custom GPTs rebuilt as Claude Skills, a guide for staff to build their own Skills, and a ranked opportunity map for what comes next.',
    image: '/images/work/enablement-hero.png',
    imageCenter: true,
    featured: true,
  },
  {
    id: 'lead-gen',
    title: 'Intelligent Prospecting Engine',
    services: ['Deployment'],
    chip: 'In Prod',
    chipType: 'built',
    description:
      'Multi-agent LangChain system that finds, researches, and contacts leads for a B2B wholesaler. From discovery to production in 6 days. Runs on its own, delivers 10-20 qualified leads per week.',
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
    image: '/images/work/homeai-triage-hero.png',
  },
  {
    id: 'openclaw',
    title: 'Personal AI Assistant',
    services: ['Deployment'],
    chip: '3 Active Clients',
    chipType: 'active',
    description:
      'Assistants for busy executives and families caring for elderly relatives. Claude Cowork or ChatGPT Work when that\'s enough; a private, self-hosted assistant when the data is sensitive. Bills, appointments, finances, communication, with security first.',
    image: '/images/work/openclaw-hero.png',
    imageContain: true,
  },
];

export const featuredCaseStudies = caseStudies.filter((study) => study.featured);
