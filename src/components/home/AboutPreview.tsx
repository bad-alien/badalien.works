'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPreview() {
  return (
    <section className="py-24 px-4 bg-base">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col md:flex-row items-start gap-12"
        >
          {/* Photo placeholder */}
          <div className="flex-shrink-0">
            <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary block mb-4">03 / About</span>
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-xl bg-gradient-to-br from-surface to-elevated flex items-center justify-center overflow-hidden">
              <svg
                className="w-24 h-24 md:w-32 md:h-32 text-muted"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

          {/* Bio content */}
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-bold text-text-heading mb-6 font-display">
              Who I Am
            </h2>

            <div className="space-y-4 text-text-body text-lg leading-relaxed mb-8">
              <p>
                I started in tech as a machine learning researcher, then spent 8 years as a product
                manager shipping AI-powered systems across finance, defense contracting, and healthtech.
                I built data products for institutional teams, led development on mission-critical
                intelligence platforms, and shipped diagnostic automation tools for clinical workflows.
              </p>
              <p>
                Now I help businesses adopt AI honestly — with the technical depth to deploy reliable
                systems and the design instinct to make them beautiful.
              </p>
              <p>
                I&apos;d rather teach you to fish than sell you fish. My default is enablement — giving
                you the knowledge, frameworks, and tools to make your own AI decisions. Only you know
                your business best.
              </p>
              <p>
                When you need something built, I build it with you — not for you. You&apos;ll understand
                the system, be able to use it fully, and maintain it without depending on me.
              </p>
              <p>
                I can also build the whole thing independently if that&apos;s what you need. Custom
                automation, full-stack applications, polished frontends — from concept to deployed
                and working.
              </p>
              <p>
                Outside of consulting, I shoot film photography, build interactive data visualizations,
                and experiment with generative media. Check out{' '}
                <Link
                  href="https://creative.badalien.works"
                  className="text-text-heading hover:text-primary underline underline-offset-2 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  my portfolio
                </Link>
                .
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
