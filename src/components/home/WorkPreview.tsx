'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import CaseStudyCard from '@/components/shared/CaseStudyCard';
import { featuredCaseStudies } from '@/data/caseStudies';

type GridProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  url?: string;
};

const gridProjects: GridProject[] = [
  {
    id: 'badalien',
    title: 'badalien.works',
    category: 'Web',
    description: 'Home of Bad Alien. A consulting sales tool, portfolio showcase, chat assistant, and a few experiments under one roof.',
    image: '/images/work/badalien-hero.png',
  },
  {
    id: 'decoded',
    title: 'Decoded',
    category: 'Data Viz',
    description: 'Year-in-review for a shared UNRAID server. Interactive data viz celebrating curated taste over algorithmic feeds.',
    image: '/images/work/decoded-loop.gif',
  },
  {
    id: 'crm-sales',
    title: 'CRM Sales Intelligence',
    category: 'AI Automation',
    description: 'Pulls CRM data and competitive intel to generate targeted sales recommendations automatically.',
  },
];

export default function WorkPreview() {
  return (
    <section className="py-24 px-4 bg-base">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary">
            02 / Work
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-text-heading mb-4 font-display">
            What I&apos;ve Done
          </h2>
          <p className="text-xl text-text-secondary mb-16 max-w-2xl">
            From consulting engagements to personal experiments
          </p>
        </motion.div>

        {/* Featured engagements: the wide one spans the row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {featuredCaseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              className={study.wide ? 'md:col-span-2' : undefined}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
            >
              <CaseStudyCard study={study} />
            </motion.div>
          ))}
        </div>

        {/* Grid Tier - 3-4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gridProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                delay: (featuredCaseStudies.length * 0.1) + (index * 0.08),
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
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        {...(project.image.endsWith('.gif') ? { unoptimized: true } : {})}
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
