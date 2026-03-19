'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const solutions = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Ship Your First AI Feature',
    description: 'From idea to production in weeks — with your team trained and enabled',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: 'Eliminate Manual Bottlenecks',
    description: 'Custom automation that saves hours daily and cuts operational costs',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'Build Automated Growth Engines',
    description: 'Marketing and sales workflows that scale without hiring',
  },
];

export default function SolutionSection() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl mb-16 text-center font-display"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          What I Do
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              className="group relative p-8 bg-surface border border-border rounded-xl hover:bg-elevated transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              {/* Icon */}
              <div className="mb-6 text-text-body group-hover:text-white transition-colors">
                {solution.icon}
              </div>

              {/* Title */}
              <h3
                className="text-2xl mb-4 font-display"
              >
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

        {/* Link to services */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/services"
            className="inline-block text-lg text-text-body hover:text-white transition-colors border-b border-border hover:border-white pb-1"
          >
            See all services →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
