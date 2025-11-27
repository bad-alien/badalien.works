'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface LandingViewProps {
  onEnter: () => void;
}

const philosophicalLines = [
  "There are no inhibitions",
  "There are no memories",
  "Be good, human",
];

export default function LandingView({ onEnter }: LandingViewProps) {
  const [showButton, setShowButton] = useState(true);
  const [showLines, setShowLines] = useState(false);

  const handleClick = () => {
    setShowButton(false);

    // Wait for button to fade out before showing lines
    setTimeout(() => {
      setShowLines(true);
    }, 400); // Match the button exit duration (50% faster)

    // Transition to chat after lines have been shown
    setTimeout(() => {
      onEnter();
    }, 2500); // 400ms delay + 2100ms for lines (3 lines * 0.5s each + 0.6s buffer) - 50% faster
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Background GIF - Centered and sized */}
      <div
        className="absolute bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/void/black_hole.gif)',
          width: '85%',
          height: '85%',
          maxWidth: '1200px',
          maxHeight: '1200px',
        }}
      />

      {/* "ENTER THE VOID" Text */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            className="relative z-10 text-6xl md:text-7xl font-science text-white cursor-pointer
                       tracking-[0.3em] uppercase"
            style={{ fontWeight: 100 }}
          >
            ENTER THE VOID
          </motion.button>
        )}
      </AnimatePresence>

      {/* Philosophical Lines appearing one by one */}
      {showLines && (
        <div className="relative z-10 flex flex-col items-center justify-center gap-8">
          {philosophicalLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.5,
              }}
              className="text-2xl font-mono text-void-green tracking-wide"
            >
              {line}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
