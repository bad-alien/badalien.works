'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

interface HeroInteractiveProps {
  // Receives the prompt on screen, which the chat opens with as a draft
  onActivateChat: (prompt: string) => void;
  onLearnMore: () => void;
}

// Two per service, alternating Enablement, Strategy, Deployment. Each is something the
// chat can answer, so none asks for a price.
export const PROMPTS = [
  'My team has AI licenses and still does everything by hand',
  'Do we need the most expensive model, or would an open-source one do?',
  'We have three AI pilots and nothing in production',
  'Staff use ChatGPT on their own. We need a policy and training.',
  'No AI budget, no roadmap. Where do we start?',
  'Can AI work on client files without the data leaving our walls?',
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
  const promptIndexRef = useRef(0);

  // Typing loop for the ghost input
  useEffect(() => {
    let promptIndex = 0;
    let charIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeNextChar = () => {
      promptIndexRef.current = promptIndex;
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

  const activate = () => onActivateChat(PROMPTS[promptIndexRef.current]);

  return (
    <motion.div
      className="mt-12 flex w-full flex-col items-center gap-6 sm:mt-14"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
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
        {/* min-h holds two lines on phones so the page doesn't jump as prompts wrap */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Start a chat"
          onClick={activate}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              activate();
            }
          }}
          className="relative w-full min-h-[5rem] sm:min-h-0 px-5 py-4 bg-transparent border border-muted/20 rounded-lg cursor-text transition-all duration-300 hover:border-muted/40"
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
