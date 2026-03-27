'use client';

import Link from 'next/link';
import Image from 'next/image';
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
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden relative">
              <Image
                src="/images/profile.jpg"
                alt="Rasheed Akbarut"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 256px"
              />
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
                Now I help businesses adopt AI honestly. Years of experience across wildly different industries meant working
                with every type of user and stakeholder imaginable — I know how to meet people where
                they are. And AI is too important for anyone to stay dependent on someone else to use it.
                My goal is to make you capable, not just a recurring client.
              </p>
              <p>
                Outside of Bad Alien, I do photography, build data visualizations in the spirit of{' '}
                <a
                  href="https://en.wikipedia.org/wiki/Edward_Tufte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-heading hover:text-primary underline underline-offset-2 transition-colors duration-200"
                >
                  Tufte
                </a>
                , and lose myself in whatever new tech, medium, or subject has my attention. Check out{' '}
                <Link
                  href="/creative"
                  className="text-text-heading hover:text-primary underline underline-offset-2 transition-colors duration-200"
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
