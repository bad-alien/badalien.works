'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function Section({ children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "min-h-screen w-full snap-start snap-always flex flex-col items-center justify-center relative overflow-hidden",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="w-full h-full flex flex-col items-center justify-center p-8 md:p-16"
      >
        {children}
      </motion.div>
    </section>
  );
}