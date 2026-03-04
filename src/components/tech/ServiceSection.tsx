'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Service, ServiceStatus } from './types';
import DemoPlaceholder from './DemoPlaceholder';

interface ServiceSectionProps {
  service: Service;
}

const statusConfig: Record<ServiceStatus, { bg: string; text: string; border: string; label: string }> = {
  Active: {
    bg: 'bg-green-500/20',
    text: 'text-green-300',
    border: 'border-green-500/50',
    label: 'Active',
  },
  Completed: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-300',
    border: 'border-blue-500/50',
    label: 'Completed',
  },
  'In Progress': {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-300',
    border: 'border-yellow-500/50',
    label: 'In Progress',
  },
  Planned: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-300',
    border: 'border-purple-500/50',
    label: 'Planned',
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' as const },
  },
};

export default function ServiceSection({ service }: ServiceSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' });
  const status = statusConfig[service.status];

  return (
    <section
      ref={ref}
      className="min-h-[80vh] flex items-start py-20 md:py-28 border-b border-white/5 last:border-0 scroll-mt-28"
      aria-labelledby={`service-title-${service.id}`}
    >
      <div className="container mx-auto px-6 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-3xl mx-auto"
        >
          {/* Number */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="font-mono text-base tracking-[0.2em] text-white/25">
              {service.number} /
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            id={`service-title-${service.id}`}
            variants={itemVariants}
            className="text-4xl md:text-6xl font-light tracking-tight text-white mb-8 leading-[1.1]"
          >
            {service.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-gray-300 font-light leading-relaxed text-lg md:text-xl mb-12"
          >
            {service.description}
          </motion.p>

          {/* Demo placeholder with status badge */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-sm font-light tracking-wider">Featured Project</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-light tracking-wider border ${status.bg} ${status.text} ${status.border}`}
                aria-label={`Status: ${service.status}`}
              >
                {status.label}
              </span>
            </div>
            <DemoPlaceholder type={service.demo.type} />
          </motion.div>

          {/* Tech stack */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-10">
            {service.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-md text-sm font-light tracking-wide text-white/50 bg-white/5 border border-white/10"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants}>
            <Link
              href={service.ctaUrl ?? '/contact'}
              className="inline-flex items-center gap-2 text-base font-light tracking-wider text-white/70 hover:text-white transition-colors duration-300 group"
              aria-label={`${service.ctaLabel ?? "Let's Talk"} about ${service.title}`}
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                {service.ctaLabel ?? "Let's Talk →"}
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
