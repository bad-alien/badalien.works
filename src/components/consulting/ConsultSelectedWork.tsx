'use client';

import { motion } from 'framer-motion';
import CaseStudyCard from '@/components/shared/CaseStudyCard';
import { caseStudies, type CaseStudy } from '@/data/caseStudies';

// Shown here only: CAMCO's card already covers this tool for /about and the chat
const tools: CaseStudy[] = [
  {
    id: 'property-power',
    title: 'Property Power',
    services: ['Deployment'],
    chip: 'Built',
    chipType: 'built',
    description:
      'Analyzes public records, satellite imagery, and news to assess power availability and expansion potential.',
  },
];

const work = [...caseStudies, ...tools];

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
            Before consulting, I spent eight years as a product manager across finance, defense and
            healthtech, for startups, enterprises and government. The habit stuck: find the real
            problem, ship something that works, and leave a team that can run it.
          </p>
        </motion.div>

        {/* Engagements: the wide one spans the row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {work.map((study, index) => (
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

      </div>
    </section>
  );
}
