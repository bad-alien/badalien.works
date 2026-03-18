'use client';

import { motion } from 'framer-motion';

const approach = [
  { step: '01', title: 'Discovery', description: 'Deep-dive into your business and challenges' },
  { step: '02', title: 'Strategy', description: 'Design the right solution for your needs' },
  { step: '03', title: 'Implementation', description: 'Build and deploy with precision' },
  { step: '04', title: 'Support', description: 'Ensure your team is fully enabled' },
];

export default function ProofSection() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Background statement */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-4xl sm:text-5xl md:text-6xl mb-8"
            style={{ fontFamily: 'var(--font-science-gothic)' }}
          >
            8 Years Building Products
          </h2>
          <p
            className="text-2xl sm:text-3xl text-white/70 max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-gemunu-libre)' }}
          >
            Across finance, defense, and healthtech — from product strategy to technical implementation
          </p>
        </motion.div>

        {/* Client references (placeholders) */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center"
              >
                <p
                  className="text-lg text-white/40 italic"
                  style={{ fontFamily: 'var(--font-gemunu-libre)' }}
                >
                  [Client reference placeholder]
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Approach */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3
            className="text-3xl sm:text-4xl mb-12 text-center"
            style={{ fontFamily: 'var(--font-science-gothic)' }}
          >
            My Approach
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {approach.map((item, index) => (
              <motion.div
                key={item.step}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <div className="text-6xl font-bold text-white/10 mb-4" style={{ fontFamily: 'var(--font-science-gothic)' }}>
                  {item.step}
                </div>
                <h4
                  className="text-xl mb-2"
                  style={{ fontFamily: 'var(--font-science-gothic)' }}
                >
                  {item.title}
                </h4>
                <p
                  className="text-white/60"
                  style={{ fontFamily: 'var(--font-gemunu-libre)' }}
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
