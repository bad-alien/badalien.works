'use client';

import { motion } from 'framer-motion';

const portfolioItems = [
  {
    id: 'homeai',
    title: 'Home Inspection ML Pipeline',
    description:
      'Computer vision system for automated home inspection report analysis and photo classification. Deployed pipeline processing thousands of images.',
    category: 'AI/ML',
    tags: ['Computer Vision', 'PyTorch', 'AWS'],
  },
  {
    id: 'webscope',
    title: 'WebScope',
    description:
      'Web app reverse-engineering crawler using Playwright and Claude. Automatically maps application structure and generates technical documentation.',
    category: 'Automation',
    tags: ['Playwright', 'Claude API', 'Node.js'],
  },
  {
    id: 'decoded',
    title: 'Decoded',
    description:
      'Interactive data visualization platform exploring societal metrics and trends. Custom D3 visualizations with animated transitions.',
    category: 'Creative',
    tags: ['D3.js', 'Next.js', 'Data Viz'],
  },
];

export default function WorkPreview() {
  return (
    <section className="py-24 px-4 bg-base">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary">02 / Work</span>
          <h2 className="text-5xl md:text-6xl font-bold text-text-heading mb-4 font-display">
            What I&apos;ve Built
          </h2>
          <p className="text-xl text-text-secondary mb-16 max-w-2xl">
            A mix of client work and personal projects — from ML pipelines to creative experiments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
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
                <div className="h-full flex flex-col p-6 bg-surface border border-border rounded-xl hover:bg-elevated hover:border-muted transition-all duration-300">
                  {/* Image placeholder */}
                  <div className="w-full aspect-video bg-gradient-to-br from-surface to-elevated rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-4xl opacity-20">
                      {item.category === 'AI/ML' ? '🤖' : item.category === 'Automation' ? '⚙️' : '🎨'}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <span className="font-mono text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold text-text-heading mb-2 group-hover:text-white transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-text-body text-sm mb-4 flex-1">
                      {item.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-base border border-border rounded-md text-text-secondary font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
