'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Service } from './types';

interface ServiceSectionProps {
  service: Service;
}

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
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="min-h-0 py-12 md:py-16 border-b border-border last:border-0 scroll-mt-28"
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
            <span className="font-mono text-base tracking-[0.2em] text-secondary">
              {service.number} /
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            id={`service-title-${service.id}`}
            variants={itemVariants}
            className="text-4xl md:text-6xl font-display font-light tracking-tight text-text-heading mb-8 leading-[1.1]"
          >
            {service.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-text-body font-light leading-relaxed text-lg md:text-xl mb-12"
          >
            {service.description}
          </motion.p>

          {/* Tech stack */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-10">
            {service.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-md text-sm font-light tracking-wide text-text-secondary bg-surface border border-border"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          {/* CTA - Book a Call button */}
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-6 py-3 border border-white/30 text-sm font-light tracking-wider text-white hover:bg-white hover:text-black transition-all duration-300 rounded-sm"
              aria-label={`Book a call about ${service.title}`}
            >
              Book a Call
            </Link>
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
