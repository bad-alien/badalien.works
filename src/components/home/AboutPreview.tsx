'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPreview() {
  return (
    <section className="py-24 px-4 bg-black">
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
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-sm bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
              <svg
                className="w-24 h-24 md:w-32 md:h-32 text-gray-700"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

          {/* Bio content */}
          <div className="flex-1">
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'var(--font-science-gothic)' }}
            >
              Who I Am
            </h2>

            <div className="space-y-4 text-gray-300 text-lg leading-relaxed mb-8">
              <p>
                8 years as a product manager across finance, defense, and healthtech.
                I built AI-first products before most companies knew what to do with the technology.
              </p>
              <p>
                Now I help businesses cut through the AI hype and actually deploy systems that work —
                combining strategic enablement with hands-on implementation.
              </p>
              <p>
                On the side, I build data visualizations and creative experiments. Check out{' '}
                <Link
                  href="https://creative.badalien.works"
                  className="text-white hover:text-gray-400 underline underline-offset-2 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  creative.badalien.works
                </Link>
                {' '}and{' '}
                <Link
                  href="https://decoded.badalien.works"
                  className="text-white hover:text-gray-400 underline underline-offset-2 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  decoded.badalien.works
                </Link>
                {' '}if you&apos;re curious.
              </p>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center text-white hover:text-gray-400 transition-colors duration-200 group"
            >
              <span className="font-semibold">More about me</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
