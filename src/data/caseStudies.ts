// Featured engagements shown on /consult and /about. Keep chip text honest.
export type CaseStudy = {
  id: string;
  title: string;
  category: string;
  chip: string;
  chipType: 'progress' | 'active' | 'built';
  description: string;
  image: string;
  imageContain?: boolean;
  imageCenter?: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    id: 'coaching',
    title: 'AI Enablement Sprint',
    category: 'Consulting',
    chip: 'Completed',
    chipType: 'built',
    description:
      'Enablement sprint for a social ad agency. Coached their team to confidently use AI tools, build repeatable workflows, and operate independently after the engagement ended.',
    image: '/images/work/enablement-hero.png',
    imageCenter: true,
  },
  {
    id: 'openclaw',
    title: 'Personal AI Assistant',
    category: 'AI Assistant',
    chip: '3 Active Clients',
    chipType: 'active',
    description:
      'Assistants for busy executives and families caring for elderly relatives. Claude Cowork or ChatGPT Work when that\'s enough; a private, self-hosted assistant when the data is sensitive. Bills, appointments, finances, communication, with security first.',
    image: '/images/work/openclaw-hero.png',
    imageContain: true,
  },
  {
    id: 'lead-gen',
    title: 'Intelligent Prospecting Engine',
    category: 'AI Automation',
    chip: 'In Prod',
    chipType: 'built',
    description:
      'Multi-agent LangChain system that finds, researches, and contacts leads for a B2B wholesaler. From discovery to production in 6 days. Delivers 10-20 qualified leads per week.',
    image: '/images/work/leadgen-hero.png',
  },
  {
    id: 'home-inspection',
    title: 'Inspection Report Automation',
    category: 'AI/ML',
    chip: 'Built',
    chipType: 'built',
    description:
      'Multimodal AI that processes inspection reports end-to-end — parses documents, analyzes photos, surfaces what matters. Processing time cut by two-thirds.',
    image: '/images/work/homeai-triage-hero.png',
  },
];
