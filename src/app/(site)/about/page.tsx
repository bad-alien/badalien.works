'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, Shield, Activity } from 'lucide-react';
import { caseStudies } from '@/data/caseStudies';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { useChat } from '@/contexts/ChatContext';
import DualCta from '@/components/shared/DualCta';

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

export default function AboutPage() {
  const { openChat, setEntryPoint } = useChat();

  const heroRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<HTMLDivElement>(null);
  const personalRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const experienceInView = useInView(experienceRef, { once: true, amount: 0.3 });
  const clientInView = useInView(clientRef, { once: true, amount: 0.3 });
  const personalInView = useInView(personalRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  return (
    <div className="min-h-screen bg-base relative grain-texture">
      <Header />
      <main id="main-content">

      {/* Hero Section */}
      <section ref={heroRef} aria-label="Introduction" className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
          >
            <h1 className="sr-only">About Rasheed, founder of Bad Alien — AI consultant in Pasadena, CA</h1>

            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-10"
            >
              <div className="w-64 h-64 rounded-full overflow-hidden relative border border-border">
                <Image
                  src="/images/profile.jpg"
                  alt="Rasheed, founder of Bad Alien"
                  fill
                  priority
                  className="object-cover"
                  sizes="256px"
                />
              </div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-text-body font-light leading-relaxed text-lg md:text-xl mb-6 text-center"
            >
              I&apos;m Rasheed. I run Bad Alien, an independent AI consultancy in Pasadena, California, working with businesses across Los Angeles and remotely. Before that: 8 years as a product manager shipping products across finance, defense contracting, and healthtech. I&apos;ve seen how AI transforms organizations from the inside — and how it fails when adopted without strategy.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-text-body font-light leading-relaxed text-lg md:text-xl text-center"
            >
              Now I help businesses adopt AI that actually works — from team enablement to custom-built systems.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Experience Highlights */}
      <section ref={experienceRef} aria-label="Experience" className="py-20 px-6 border-t border-border">
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
      <section ref={clientRef} aria-label="Client work" className="py-20 px-6 border-t border-border">
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
              {caseStudies.map((study) => (
                <motion.div
                  key={study.id}
                  variants={itemVariants}
                  className="p-8 rounded-xl bg-surface border border-border"
                >
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-secondary">
                      {study.services.join(' · ')}
                    </span>
                    <span className="shrink-0 whitespace-nowrap font-mono text-[11px] tracking-[0.08em] uppercase text-primary">
                      {study.chip}
                    </span>
                  </div>
                  <h3 className="text-xl font-light text-text-heading mb-3 tracking-wide">{study.title}</h3>
                  <p className="text-text-secondary font-light text-sm leading-relaxed">{study.description}</p>
                </motion.div>
              ))}
            </div>
            <motion.p variants={itemVariants} className="mt-8 text-center">
              <Link
                href="/consult"
                className="text-text-secondary hover:text-text-heading transition-colors duration-300 font-light underline underline-offset-4"
              >
                See all work →
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Personal Section */}
      <section ref={personalRef} aria-label="Personal" className="py-20 px-6 border-t border-border">
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
              <Link
                href="/creative"
                className="text-text-secondary hover:text-text-heading transition-colors duration-300 font-light"
              >
                creative
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} aria-label="Contact call to action" className="py-24 px-6 border-t border-border">
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
            <motion.div variants={itemVariants}>
              <DualCta
                primary={{ type: 'link', label: 'Book a Call', href: '/contact' }}
                secondary={{ type: 'button', label: 'Or ask my AI', onClick: () => { setEntryPoint('widget'); openChat(); } }}
              />
            </motion.div>
            <motion.p variants={itemVariants} className="mt-10 text-text-secondary font-light">
              Based in Pasadena?{' '}
              <Link href="/ai-consultant-pasadena" className="text-text-heading hover:text-primary underline underline-offset-4 transition-colors duration-200">
                See how I work with local businesses
              </Link>
              .
            </motion.p>
          </motion.div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
