'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

interface HeroInteractiveProps {
  onActivateChat: () => void;
  onLearnMore: () => void;
}

const PROMPTS = [
  'Help my team actually understand and use AI tools',
  'What would it cost to automate our intake process?',
  'Can you build us a custom system from scratch?',
  'We just need a few sessions to get up to speed',
];

const NAV = [
  { href: '/consult', label: 'Consult' },
  { href: '/creative', label: 'Creative' },
  { href: '/contact', label: 'Contact' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function HeroInteractive({ onActivateChat, onLearnMore }: HeroInteractiveProps) {
  const reduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState('');

  // Typing loop for the ghost input
  useEffect(() => {
    let promptIndex = 0;
    let charIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeNextChar = () => {
      const prompt = PROMPTS[promptIndex];
      if (charIndex < prompt.length) {
        setDisplayText(prompt.slice(0, charIndex + 1));
        charIndex++;
        timeoutId = setTimeout(typeNextChar, 30);
        return;
      }
      timeoutId = setTimeout(() => {
        setDisplayText('');
        promptIndex = (promptIndex + 1) % PROMPTS.length;
        charIndex = 0;
        timeoutId = setTimeout(typeNextChar, 200);
      }, 1200);
    };

    timeoutId = setTimeout(typeNextChar, 600);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <motion.div
      className="mt-6 flex w-full flex-col items-center gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p
        variants={itemVariants}
        className="font-sans text-lg text-text-body leading-relaxed max-w-2xl mx-auto text-center px-4"
      >
        Bringing AI to those ready to move from curiosity to capability.
      </motion.p>

      <motion.nav
        variants={itemVariants}
        aria-label="Hero navigation"
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
      >
        {NAV.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-5 sm:px-6 py-2.5 rounded-full border-2 border-primary bg-transparent text-primary font-sans font-medium transition-all duration-300 hover:bg-primary hover:text-background"
          >
            {label}
          </Link>
        ))}
      </motion.nav>

      <motion.div variants={itemVariants} className="w-full max-w-2xl px-4">
        <div
          role="button"
          tabIndex={0}
          aria-label="Start a chat"
          onClick={onActivateChat}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onActivateChat();
            }
          }}
          className="relative w-full px-5 py-4 bg-transparent border border-muted/20 rounded-lg cursor-text transition-all duration-300 hover:border-muted/40"
        >
          <span className="text-primary/70 text-base font-sans select-none">
            {displayText}
            <span
              className="inline-block w-0.5 h-4 bg-primary ml-1 align-middle"
              style={{ animation: 'blink-cursor 1s step-end infinite' }}
            />
          </span>
        </div>
      </motion.div>

      <motion.button
        variants={itemVariants}
        type="button"
        className="mt-8 flex flex-col items-center gap-4 cursor-pointer bg-transparent border-0 p-0"
        onClick={onLearnMore}
        aria-label="Scroll to learn more about our services"
      >
        <span className="text-primary text-sm font-mono uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(255,107,53,0.5)]">
          learn more
        </span>
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <div className="absolute inset-0 blur-xl bg-primary/30 rounded-full scale-150" />
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            className="relative text-primary drop-shadow-[0_0_20px_rgba(255,107,53,0.8)]"
            aria-hidden="true"
          >
            <path
              d="M12 4L12 20M12 20L6 14M12 20L18 14"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
