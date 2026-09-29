'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// Viewport reveal for server-rendered sections. Content is in the HTML
// regardless; the root layout's <noscript> rule shows it without JS.
export default function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
