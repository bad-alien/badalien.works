'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { User, Briefcase, Shield, Activity } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

const experienceHighlights = [
  {
    icon: Briefcase,
    industry: 'Finance',
    description: 'Built data products and risk analytics platforms for institutional finance teams',
  },
  {
    icon: Shield,
    industry: 'Defense',
    description: 'Led product development for mission-critical intelligence and logistics systems',
  },
  {
    icon: Activity,
    industry: 'HealthTech',
    description: 'Shipped AI-powered diagnostic and workflow automation tools for clinical teams',
  },
];

const clientPlaceholders = [
  'Case study details arriving Q2 2026',
  'Case study details arriving Q2 2026',
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<HTMLDivElement>(null);
  const personalRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const bioInView = useInView(bioRef, { once: true, amount: 0.3 });
  const experienceInView = useInView(experienceRef, { once: true, amount: 0.3 });
  const clientInView = useInView(clientRef, { once: true, amount: 0.3 });
  const personalInView = useInView(personalRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  return (
    <div className="min-h-screen bg-base">
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-display font-light tracking-tight text-text-heading mb-16"
            >
              The Person Behind Bad Alien
            </motion.h1>

            {/* Photo Placeholder */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center md:justify-start mb-12"
            >
              <div className="w-64 h-64 rounded-full bg-surface border border-border flex flex-col items-center justify-center gap-4">
                <User className="w-20 h-20 text-muted" strokeWidth={1} />
                <span className="text-sm text-text-secondary font-light">Photo coming soon</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      <section ref={bioRef} className="py-16 px-6 border-t border-border">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={bioInView ? 'visible' : 'hidden'}
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-display font-light tracking-tight text-text-heading mb-6"
            >
              [Your Name]
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-text-body font-light leading-relaxed text-lg md:text-xl mb-6"
            >
              8 years as a product manager shipping products across finance, defense contracting, and healthtech. I&apos;ve seen how AI transforms organizations from the inside — and how it fails when adopted without strategy.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-text-body font-light leading-relaxed text-lg md:text-xl"
            >
              Now I help businesses adopt AI that actually works — from team enablement to custom-built systems.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Experience Highlights */}
      <section ref={experienceRef} className="py-20 px-6 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={experienceInView ? 'visible' : 'hidden'}
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-display font-light tracking-tight text-text-heading mb-12 text-center"
            >
              Experience
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {experienceHighlights.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="p-8 rounded-xl bg-surface border border-border hover:border-border/80 transition-colors duration-300"
                  >
                    <Icon className="w-10 h-10 text-text-secondary mb-6" strokeWidth={1.5} />
                    <h3 className="text-xl font-light text-text-heading mb-3 tracking-wide">
                      {item.industry}
                    </h3>
                    <p className="text-text-secondary font-light text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Client Work Section */}
      <section ref={clientRef} className="py-20 px-6 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={clientInView ? 'visible' : 'hidden'}
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-display font-light tracking-tight text-text-heading mb-12 text-center"
            >
              What I&apos;ve Delivered
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clientPlaceholders.map((text, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-10 rounded-xl bg-surface border border-border flex items-center justify-center min-h-[200px]"
                >
                  <p className="text-text-secondary font-light text-center italic">
                    {text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Personal Section */}
      <section ref={personalRef} className="py-20 px-6 border-t border-border">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={personalInView ? 'visible' : 'hidden'}
          >
            <motion.p
              variants={itemVariants}
              className="text-text-body font-light leading-relaxed text-lg md:text-xl mb-6"
            >
              When I&apos;m not building AI systems, I shoot film photography and run a media server with friends.
            </motion.p>
            <motion.div variants={itemVariants} className="flex gap-6 text-base">
              <a
                href="https://creative.badalien.works"
                className="text-text-secondary hover:text-text-heading transition-colors duration-300 font-light"
              >
                creative.badalien.works
              </a>
              <a
                href="https://decoded.badalien.works"
                className="text-text-secondary hover:text-text-heading transition-colors duration-300 font-light"
              >
                decoded.badalien.works
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 px-6 border-t border-border">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={ctaInView ? 'visible' : 'hidden'}
          >
            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-6xl font-display font-light tracking-tight text-text-heading mb-10"
            >
              Let&apos;s work together
            </motion.h2>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link
                href="/contact"
                className="px-8 py-4 rounded-md bg-white text-black font-light tracking-wide hover:bg-white/90 transition-all duration-300 text-lg"
              >
                Book a Call
              </Link>
              <button
                className="px-8 py-4 rounded-md bg-surface border border-border text-text-heading font-light tracking-wide hover:border-border/80 transition-all duration-300 text-lg"
                onClick={() => {
                  // Placeholder - will be wired to chat widget
                }}
              >
                Or ask my AI
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
