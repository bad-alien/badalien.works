'use client';

import { motion } from 'framer-motion';

const solutions = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    number: '01',
    title: 'AI Adoption & Enablement',
    description: 'Learning AI tools is too important to outsource permanently. I build the initial bridge — hands-on coaching that cuts through the hype, gives your team real capability, and gets you operating independently.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    number: '02',
    title: 'Operations & Cost Intelligence',
    description: 'Most businesses are bleeding money on tools and subscriptions they\'ve stopped questioning. AI has collapsed the cost of building custom alternatives. I audit your operation and show you exactly where to cut, consolidate, or replace.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    number: '03',
    title: 'Bespoke Apps & Automation',
    description: 'Discovery comes first — I map your actual business needs before writing a line of code. When I build, I build with you, not for you. You\'ll understand how it works, own the result, and be capable of adapting it as your business evolves.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    number: '04',
    title: 'Websites That Work For You',
    description: 'AI is how I build fast. Design experience is how I make sure it doesn\'t look like it. Your site gets both — a genuinely crafted digital presence with real business automation wired in, not a template with your logo swapped in.',
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              {/* Number + Icon */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-text-secondary/30 font-display">
                  {solution.number}
                </span>
                <div className="text-text-body group-hover:text-white transition-colors">
                  {solution.icon}
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
      </div>
    </section>
  );
}
