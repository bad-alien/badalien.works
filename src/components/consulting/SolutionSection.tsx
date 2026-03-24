'use client';

import { motion } from 'framer-motion';

const solutions = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Learn to Navigate AI Yourself',
    description: 'Enablement sessions that give you the knowledge, frameworks, and tools to operate independently. AI is too important to rely on someone else every time you want to use it.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Custom Systems, Built With You',
    description: 'When you need something built, I build collaboratively so you understand the system, use it fully, and can adapt it as your business evolves. No black box handoffs.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'Full-Service Build & Deploy',
    description: 'Need it built end-to-end? Custom automation, full-stack applications, beautiful frontends — from concept to production. The technical chops to deliver reliable systems with an eye for design.',
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

      </div>
    </section>
  );
}
