'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AuditStatusBubbleProps {
  text: string;
}

const DOTS = ['', '.', '..', '...'];

export default function AuditStatusBubble({ text }: AuditStatusBubbleProps) {
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % DOTS.length);
    }, 380);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex items-center gap-2 py-1.5"
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '0.75rem',
          color: 'rgba(255,107,53,0.5)',
        }}
      >
        ⚙
      </span>
      <span
        style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '0.75rem',
          color: 'rgba(255,107,53,0.6)',
          letterSpacing: '0.02em',
        }}
      >
        {text}
        <span
          className="inline-block w-7 text-left"
          aria-hidden="true"
          style={{ color: 'rgba(255,107,53,0.4)' }}
        >
          {DOTS[dotIndex]}
        </span>
      </span>
    </motion.div>
  );
}
