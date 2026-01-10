'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { RefObject } from 'react';

interface ProgressBarProps {
  containerRef: RefObject<HTMLElement | null>; // Updated to allow null which is common for refs initially
}

export default function ProgressBar({ containerRef }: ProgressBarProps) {
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-void-orange origin-left z-50"
      style={{ scaleX }}
    />
  );
}
