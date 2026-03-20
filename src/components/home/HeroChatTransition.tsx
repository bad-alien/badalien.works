'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BusinessChatInterface from '@/components/chat/BusinessChatInterface';

interface HeroChatTransitionProps {
  phase: 'chat-opening' | 'chat-active';
}

export default function HeroChatTransition({ phase }: HeroChatTransitionProps) {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4">
      {/* Compact nav pills */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: phase === 'chat-active' ? 0.2 : 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <button
          onClick={() => handleNavigate('/consult')}
          className="px-4 py-1.5 rounded-full border border-primary/40 bg-transparent text-primary/80 text-sm font-sans font-medium transition-all duration-300 hover:bg-primary hover:text-background hover:border-primary"
        >
          Consult
        </button>
        <button
          onClick={() => handleNavigate('/creative')}
          className="px-4 py-1.5 rounded-full border border-primary/40 bg-transparent text-primary/80 text-sm font-sans font-medium transition-all duration-300 hover:bg-primary hover:text-background hover:border-primary"
        >
          Creative
        </button>
        <button
          onClick={() => handleNavigate('/about')}
          className="px-4 py-1.5 rounded-full border border-primary/40 bg-transparent text-primary/80 text-sm font-sans font-medium transition-all duration-300 hover:bg-primary hover:text-background hover:border-primary"
        >
          About
        </button>
      </motion.div>

      {/* Chat container with morph animation */}
      <motion.div
        className="w-full max-w-3xl"
        initial={
          phase === 'chat-opening'
            ? { height: '48px', opacity: 0.5 }
            : { height: 'auto', opacity: 1 }
        }
        animate={{ height: 'auto', opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {phase === 'chat-active' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="h-[calc(100vh-200px)] max-h-[600px]"
          >
            <BusinessChatInterface heroMode={true} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
