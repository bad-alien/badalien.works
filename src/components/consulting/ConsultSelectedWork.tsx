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
          <p className="text-2xl sm:text-3xl text-text-body max-w-3xl mx-auto">
            8 years building products across finance, defense, and healthtech
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
      </div>
    </section>
  );
}
