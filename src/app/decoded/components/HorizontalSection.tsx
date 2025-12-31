'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HorizontalSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function HorizontalSection({ children, className, id }: HorizontalSectionProps) {
  return (
    <section 
      id={id}
      className={cn(
        "min-w-full h-screen snap-center flex flex-col items-center justify-center relative overflow-hidden",
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