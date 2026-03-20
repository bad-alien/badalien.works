'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface HeroInteractiveProps {
  onActivateChat: () => void;
}

const PROMPTS = [
  "What can you improve at our ad agency?",
  "Come teach my team about all the recent AI tools",
  "How can I automate parts of my construction business?",
  "Free on Friday at 1pm to swing by my office and chat?"
];

export default function HeroInteractive({ onActivateChat }: HeroInteractiveProps) {
  const router = useRouter();
  const [displayText, setDisplayText] = useState('');

  // Typing animation effect
  useEffect(() => {
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
          timeoutId = setTimeout(typeNextChar, 45); // 45ms per character
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
          }, 2000); // 2 second pause
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
  }, []);

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

      // Printable key pressed - activate chat
      onActivateChat();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onActivateChat]);

  const handleNavigate = (path: string) => {
    // Brief fade-out before navigation
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

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
      className="flex flex-col items-center gap-6 mt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Tagline */}
      <motion.p
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
      <motion.div variants={inputVariants} className="w-full max-w-md px-4">
        <div
          onClick={onActivateChat}
          className="relative w-full px-4 py-3 bg-transparent border border-muted/20 rounded-lg cursor-text transition-all duration-300 hover:border-muted/40"
        >
          <span className="text-muted/50 text-sm font-sans select-none">
            {displayText}
            <span
              className="inline-block w-0.5 h-4 bg-primary ml-1 align-middle"
              style={{ animation: 'blink-cursor 1s step-end infinite' }}
            />
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
