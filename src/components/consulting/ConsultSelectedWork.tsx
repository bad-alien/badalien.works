'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const heroProjects = [
  {
    id: 'coaching',
    title: 'AI Enablement Sprint',
    category: 'Consulting',
    chip: 'In Progress',
    chipType: 'progress' as const,
    description:
      'Enablement sprint for a social ad agency. Coaching their team to confidently use AI tools, build repeatable workflows, and operate independently after the engagement ends.',
    image: '/images/work/enablement-hero.png',
    imageCenter: true,
  },
  {
    id: 'openclaw',
    title: 'OpenClaw Assistant',
    category: 'AI Assistant',
    chip: '3 Active Clients',
    chipType: 'active' as const,
    description:
      'AI assistant built for elderly clients and their families. Manages bills, appointments, finances, and communication — designed around data security and privacy first.',
    image: '/images/work/openclaw-hero.png',
    imageContain: true,
  },
  {
    id: 'lead-gen',
    title: 'Intelligent Prospecting Engine',
    category: 'AI Automation',
    chip: 'In Prod',
    chipType: 'built' as const,
    description:
      'Multi-agent LangChain system that finds, researches, and contacts leads for a B2B wholesaler. From discovery to production in 6 days. Delivers 10-20 qualified leads per week.',
    image: '/images/work/leadgen-hero.png',
  },
  {
    id: 'home-inspection',
    title: 'Inspection Report Automation',
    category: 'AI/ML',
    chip: 'Built',
    chipType: 'built' as const,
    description:
      'Multimodal AI that processes inspection reports end-to-end — parses documents, analyzes photos, surfaces what matters. Processing time cut by two-thirds.',
    image: '/images/work/homeai-triage-hero.png',
  },
];

const gridProjects = [
  {
    id: 'primari',
    title: 'primarihealth.com',
    category: 'Web',
    description: 'Website for a primary care practice. Design to deployment, with backend automation handling intake and scheduling.',
    url: 'https://primarihealth.com',
    image: '/images/work/primari-health-hero.png',
  },
  {
    id: 'camcoig',
    title: 'camcoig.com',
    category: 'Web',
    description: 'Client website for a commercial real estate group. End-to-end build with integrated visitor analytics and performance tracking.',
    url: 'https://camcoig.com',
    image: '/images/work/camcoig-hero.png',
  },
  {
    id: 'property-power',
    title: 'Property Power',
    category: 'AI Tool',
    description: 'Analyzes public records, satellite imagery, and news to assess power availability and expansion potential.',
  },
  {
    id: 'webscope',
    title: 'WebScope',
    category: 'Dev Tool',
    description: 'Crawls sites with Playwright, analyzes with Claude, outputs full architecture maps.',
  },
];

export default function ConsultSelectedWork() {
  return (
    <section className="py-24 px-4 bg-base">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-heading mb-6 font-display">
            What I&apos;ve Delivered
          </h2>
          <p className="text-xl sm:text-2xl text-text-body max-w-3xl mx-auto leading-relaxed">
            8 years shipping products across finance, defense, healthtech, and real estate — for startups, enterprises, and the government. Here&apos;s some of the recent work.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {heroProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
            >
              <div className="group h-full">
                <div className="h-full flex flex-col p-6 bg-surface border border-border rounded-xl hover:bg-elevated hover:border-muted transition-all duration-300 relative">
                  {/* Status chip */}
                  <span className={`absolute top-4 right-4 z-10 inline-flex items-center gap-2 px-3 py-1 rounded-md font-mono text-xs font-semibold uppercase tracking-wider ${
                    project.chipType === 'progress' || project.chipType === 'active'
                      ? 'bg-orange-950/80 border border-[#FF6B35]/40 text-[#FF6B35] backdrop-blur-sm'
                      : 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 backdrop-blur-sm'
                  }`}>
                    {(project.chipType === 'progress' || project.chipType === 'active') && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B35]"></span>
                      </span>
                    )}
                    {project.chip}
                  </span>

                  {/* Image */}
                  <div className={`w-full aspect-video rounded-lg mb-4 overflow-hidden relative ${project.imageContain ? 'bg-black' : 'bg-gradient-to-br from-surface to-elevated'}`}>
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className={`${project.imageContain ? 'object-contain p-4' : `object-cover ${project.imageCenter ? 'object-center' : 'object-top'}`} group-hover:scale-105 transition-transform duration-300`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </div>

                  {/* Category */}
                  <span className="font-mono text-[11px] font-semibold text-[#0284C7] uppercase tracking-[0.08em] mb-2">
                    {project.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-text-heading mb-3 group-hover:text-white transition-colors duration-300">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-body text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Grid Tier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {gridProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: 'easeOut',
              }}
            >
              <div className="group h-full">
                <div className="h-full flex flex-col p-4 bg-surface border border-border rounded-lg hover:bg-elevated hover:border-muted transition-all duration-300">
                  {/* Image */}
                  {project.image && (
                    <div className="w-full aspect-video rounded-md mb-3 overflow-hidden relative">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  {/* Category */}
                  <span className="font-mono text-[11px] font-semibold text-[#0284C7] uppercase tracking-[0.08em] mb-2">
                    {project.category}
                  </span>

                  {/* Title */}
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-base font-bold text-text-heading mb-2 hover:text-[#FF6B35] transition-colors duration-300"
                    >
                      {project.title}
                      <svg className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </a>
                  ) : (
                    <h4 className="text-base font-bold text-text-heading mb-2 group-hover:text-white transition-colors duration-300">
                      {project.title}
                    </h4>
                  )}

                  {/* Description */}
                  <p className="text-text-body text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
