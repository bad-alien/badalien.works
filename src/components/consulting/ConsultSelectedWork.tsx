'use client';

import { motion } from 'framer-motion';

const heroProjects = [
  {
    id: 'lead-gen',
    title: 'Autonomous Lead Gen & Outreach',
    category: 'AI Automation',
    metric: '10-20 hot leads/week',
    description:
      'Autonomous LangChain pipeline for B2B wholesaler. Setup in 3 days, runs reliably without any human oversight.',
  },
  {
    id: 'openclaw',
    title: 'OpenClaw Personal Assistant',
    category: 'AI Assistant',
    metric: '3 clients managed',
    description:
      'Safe, reliable AI assistant for elderly clients — managing finances, bills, health appointments, and family communication.',
  },
  {
    id: 'coaching',
    title: 'AI Enablement Coaching Sprint',
    category: 'Consulting',
    metric: null,
    inProgress: true,
    description:
      '20-hour coaching sprint for a social ad agency. Teaching the team to independently design, operate, and extend AI-enabled workflows.',
  },
  {
    id: 'home-inspection',
    title: 'Home Inspection ML Pipeline',
    category: 'AI/ML',
    metric: '1.5hrs → 30min',
    description:
      'Computer vision system automating report analysis and photo classification. Hundreds of reports processed.',
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
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-heading mb-6 font-display">
            What I&apos;ve Delivered
          </h2>
          <p className="text-2xl sm:text-3xl text-text-body max-w-3xl mx-auto">
            8 years building products across finance, defense, and healthtech
          </p>
        </motion.div>

        {/* Hero Tier - 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {heroProjects.map((project, index) => (
            <motion.div
              key={project.id}
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
                  <div className="w-full aspect-video bg-gradient-to-br from-surface to-elevated rounded-lg mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Category */}
                  <span className="font-mono text-[11px] font-semibold text-[#0284C7] uppercase tracking-[0.08em] mb-2">
                    {project.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-text-heading mb-3 group-hover:text-white transition-colors duration-300">
                    {project.title}
                  </h3>

                  {/* Metric or In Progress badge */}
                  {project.inProgress ? (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/30 rounded-md">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B35]"></span>
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#FF6B35] uppercase tracking-wider">
                          In Progress
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <span className="font-mono text-2xl font-bold text-[#FF6B35]">
                        {project.metric}
                      </span>
                    </div>
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
