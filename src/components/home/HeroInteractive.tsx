'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useAnimate } from 'framer-motion';

interface HeroInteractiveProps {
  onActivateChat: () => void;
  onLearnMore?: () => void;
}

const PROMPTS = [
  "What can you improve at our ad agency?",
  "Come teach my team about all the recent AI tools",
  "How can I automate parts of my construction business?",
  "Free on Friday at 1pm to swing by my office and chat?"
];

export default function HeroInteractive({ onActivateChat, onLearnMore }: HeroInteractiveProps) {
  const router = useRouter();
  const [displayText, setDisplayText] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [exitComplete, setExitComplete] = useState(false);
  const [scope, animate] = useAnimate();
  const inputRef = useRef<HTMLDivElement>(null);

  // Typing animation effect
  useEffect(() => {
    if (isExiting) return;

    let currentPromptIndex = 0;
    let currentCharIndex = 0;
    let isTyping = true;
    let timeoutId: NodeJS.Timeout;

    const typeNextChar = () => {
      const currentPrompt = PROMPTS[currentPromptIndex];

      if (isTyping) {
        // Typing phase
        if (currentCharIndex < currentPrompt.length) {
          setDisplayText(currentPrompt.slice(0, currentCharIndex + 1));
          currentCharIndex++;
          timeoutId = setTimeout(typeNextChar, 30); // 30ms per character
        } else {
          // Finished typing, pause before erasing
          timeoutId = setTimeout(() => {
            isTyping = false;
            setDisplayText('');
            // Move to next prompt
            currentPromptIndex = (currentPromptIndex + 1) % PROMPTS.length;
            currentCharIndex = 0;
            isTyping = true;
            // Small pause before typing next prompt
            timeoutId = setTimeout(typeNextChar, 200);
          }, 1200); // 1.2 second pause
        }
      }
    };

    // Initial delay before starting (800ms to account for input animation)
    const initialDelay = setTimeout(() => {
      typeNextChar();
    }, 800);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
    };
  }, [isExiting]);

  // Global keydown listener for printable keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Filter out modifiers, function keys, control keys
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.key.length > 1 || // Filter out special keys like "Enter", "Backspace", etc.
        e.key === ' ' // Ignore space for now since it might trigger button clicks
      ) {
        return;
      }

      // Printable key pressed - activate chat with exit animation
      handleActivateChat();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleActivateChat = async () => {
    if (isExiting) return;
    setIsExiting(true);

    // Exit animation sequence
    // 1. All hero elements fly UP and fade out
    if (scope.current) {
      await animate(
        '#tagline, #nav-buttons, #ghost-input, #learn-more',
        { opacity: 0, y: -40 },
        { duration: 0.4, ease: [0.4, 0, 1, 1] } // ease-in
      );
    }

    // 2. Trigger the chat activation
    onActivateChat();
    // 3. Unmount hero content now that animation is done
    setExitComplete(true);
  };

  const handleNavigate = (path: string) => {
    // Brief fade-out before navigation
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  const handleLearnMoreClick = () => {
    if (onLearnMore) {
      onLearnMore();
    } else {
      // Fallback if no handler provided
      const contentSection = document.querySelector('#main-content');
      if (contentSection) {
        contentSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (exitComplete) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const taglineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0,
      },
    },
  };

  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: 0.5,
      },
    },
  };

  return (
    <motion.div
      ref={scope}
      className="flex flex-col items-center gap-6 mt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Tagline */}
      <motion.p
        id="tagline"
        variants={taglineVariants}
        className="font-sans text-base text-text-body leading-relaxed max-w-2xl mx-auto text-center px-4"
      >
        Bridging the gap between AI curiosity and operational competency. I provide hands-on
        coaching for teams and business owners of all technical levels, ensuring your organization
        becomes fully self-sufficient in utilizing AI tools to drive value today and remains agile
        enough to master the innovations of tomorrow.
      </motion.p>

      {/* Navigation Buttons */}
      <motion.div
        id="nav-buttons"
        variants={buttonContainerVariants}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <motion.button
          variants={buttonVariants}
          onClick={() => handleNavigate('/consult')}
          className="px-6 py-2.5 rounded-full border-2 border-primary bg-transparent text-primary font-sans font-medium transition-all duration-300 hover:bg-primary hover:text-background"
        >
          Consult
        </motion.button>
        <motion.button
          variants={buttonVariants}
          onClick={() => handleNavigate('/creative')}
          className="px-6 py-2.5 rounded-full border-2 border-primary bg-transparent text-primary font-sans font-medium transition-all duration-300 hover:bg-primary hover:text-background"
        >
          Creative
        </motion.button>
        <motion.button
          variants={buttonVariants}
          onClick={() => handleNavigate('/about')}
          className="px-6 py-2.5 rounded-full border-2 border-primary bg-transparent text-primary font-sans font-medium transition-all duration-300 hover:bg-primary hover:text-background"
        >
          About
        </motion.button>
      </motion.div>

      {/* Ghost Input */}
      <motion.div id="ghost-input" variants={inputVariants} className="w-full max-w-2xl px-4">
        <div
          ref={inputRef}
          role="button"
          tabIndex={0}
          onClick={handleActivateChat}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleActivateChat();
            }
          }}
          className="relative w-full px-4 py-3 bg-transparent border border-muted/20 rounded-lg cursor-text transition-all duration-300 hover:border-muted/40"
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

      {/* Learn More Arrow */}
      <motion.button
        id="learn-more"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-8 flex flex-col items-center gap-4 cursor-pointer bg-transparent border-0 p-0"
        onClick={handleLearnMoreClick}
        aria-label="Scroll to learn more about our services"
      >
        <span
          className="text-primary text-sm font-mono uppercase tracking-[0.3em] drop-shadow-[0_0_10px_rgba(255,107,53,0.5)]"
        >
          learn more
        </span>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
