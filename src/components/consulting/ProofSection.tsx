'use client';

import { motion } from 'framer-motion';

const approach = [
  { step: '01', title: 'Discovery', description: 'Deep-dive into your business, challenges, and what you\'ve already tried. No solutions until I understand the problem.' },
  { step: '02', title: 'Strategy', description: 'Design the right approach — whether that\'s enablement, automation, a full build, or a combination.' },
  { step: '03', title: 'Build Together', description: 'When I build, I build with you. Weekly check-ins, visible progress, and you understand every decision along the way.' },
  { step: '04', title: 'Handoff & Beyond', description: 'Every engagement ends with your team able to operate independently. And if you need me again — for a new challenge, a second opinion, or just a gut check — I\'m here.' },
];

export default function ProofSection() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Approach */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-4xl sm:text-5xl md:text-6xl mb-12 text-center font-display"
          >
            How I Work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {approach.map((item, index) => (
              <motion.div
                key={item.step}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <div className="text-6xl font-bold text-secondary mb-4 font-mono">
                  {item.step}
                </div>
                <h4
                  className="text-xl mb-2 font-display"
                >
                  {item.title}
                </h4>
                <p
                  className="text-text-secondary"
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
