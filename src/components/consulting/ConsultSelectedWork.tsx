'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import CaseStudyCard, { StatusChip } from '@/components/shared/CaseStudyCard';
import { caseStudies } from '@/data/caseStudies';

type GridProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  url?: string;
  chip?: string;
};

const gridProjects: GridProject[] = [
  {
    id: 'property-power',
    title: 'Property Power',
    category: 'AI Tool',
    description: 'Analyzes public records, satellite imagery, and news to assess power availability and expansion potential.',
    chip: 'Built',
  },
  {
    id: 'webscope',
    title: 'WebScope',
    category: 'Dev Tool',
    description: 'Crawls sites with Playwright, analyzes with Claude, outputs full architecture maps.',
    chip: 'Built',
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
          <h2 className="text-4xl sm:text-5xl md:text-6xl mb-8 font-display">
            What I&apos;ve Delivered
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            8 years shipping products across finance, defense, healthtech, and real estate — for startups, enterprises, and the government. Here&apos;s some of the recent work.
          </p>
        </motion.div>

        {/* Engagements: the wide one spans the row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.map((study, index) => (
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
                  {/* Category + status */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <span className="font-mono text-[11px] font-semibold text-[#0284C7] uppercase tracking-[0.08em] pt-1">
                      {project.category}
                    </span>
                    {project.chip && <StatusChip chip={project.chip} chipType="built" />}
                  </div>

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
