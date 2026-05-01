'use client';

import { motion } from 'framer-motion';

interface IntroChipsProps {
  onAudit: () => void;
  onFaq: () => void;
}

export default function IntroChips({ onAudit, onFaq }: IntroChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="flex gap-2 mt-2 mb-4 flex-wrap"
      role="group"
      aria-label="Quick actions"
    >
      <motion.button
        type="button"
        onClick={onAudit}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 text-primary border border-primary/30 rounded-full text-sm hover:border-primary hover:bg-primary/10 transition-all duration-200 font-medium"
        style={{ fontFamily: 'var(--font-instrument-sans, "Instrument Sans", sans-serif)' }}
      >
        Free AI audit (60s)
      </motion.button>
      <motion.button
        type="button"
        onClick={onFaq}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 text-[#8A8A8A] border border-[#2A2A2A] rounded-full text-sm hover:border-[#3A3A3A] hover:text-[#C5C5C5] transition-all duration-200"
        style={{ fontFamily: 'var(--font-instrument-sans, "Instrument Sans", sans-serif)' }}
      >
        Different question
      </motion.button>
    </motion.div>
  );
}
