'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { services, SERVICES_INTRO } from '@/data/services';

// Copy comes from services.ts; only the icon is chosen here
const icons: Record<string, React.ReactNode> = {
  'ai-enablement': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  'ai-strategy': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  'ai-deployment': (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
};

export default function SolutionSection() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl mb-8 text-center font-display"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          What I Do
        </motion.h2>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto text-center mb-16">
          {SERVICES_INTRO}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((solution, index) => (
            <motion.div
              key={solution.id}
              className="group relative p-8 bg-surface border border-border rounded-xl hover:bg-elevated transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {/* Number + Icon */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-text-secondary/30 font-display">
                  {solution.number}
                </span>
                <div className="text-text-body group-hover:text-white transition-colors">
                  {icons[solution.id]}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl mb-4 font-display">
                {solution.title}
              </h3>

              {/* Description */}
              <p
                className="text-base sm:text-lg text-text-secondary leading-relaxed"
                style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}
              >
                {solution.description}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="mt-10 text-lg">
          <Link href="/services" className="text-text-heading hover:text-primary underline underline-offset-4 transition-colors duration-200">
            See all services and tooling →
          </Link>
        </p>
      </div>
    </section>
  );
}
