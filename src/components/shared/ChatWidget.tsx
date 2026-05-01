'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Minus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useChat } from '@/contexts/ChatContext';
import { useNudge } from '@/hooks/useNudge';
import BusinessChatInterface from '@/components/chat/BusinessChatInterface';

export default function ChatWidget() {
  const pathname = usePathname();
  const { chatView, openChat, minimizeChat, closeChat, setEntryPoint } = useChat();
  const { showNudge, dismiss } = useNudge();

  // Hide on blog pages and contact
  if (pathname.startsWith('/blog') || pathname === '/contact') return null;

  // Don't render anything when closed
  if (chatView === 'closed') return null;

  return (
    <>
      {/* Minimized Icon Button + Nudge Badge */}
      <AnimatePresence>
        {chatView === 'minimized' && (
          <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-2">
            {/* Nudge badge */}
            <AnimatePresence>
              {showNudge && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.9 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  onMouseEnter={dismiss}
                  onClick={dismiss}
                  className="relative cursor-pointer select-none"
                  role="button"
                  aria-label="Dismiss nudge"
                >
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap"
                    style={{
                      background: '#FF6B35',
                      color: '#0A0A0A',
                      fontFamily: 'var(--font-geist-mono, monospace)',
                      letterSpacing: '0.04em',
                      boxShadow: '0 0 16px rgba(255, 107, 53, 0.5)',
                    }}
                  >
                    Free AI audit?
                  </div>
                  {/* Pointer arrow pointing down toward icon */}
                  <div
                    className="absolute left-1/2 -bottom-1.5 -translate-x-1/2"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '7px solid #FF6B35',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Icon button — pulses once when nudge fires */}
            <motion.button
              onClick={() => {
                setEntryPoint('widget');
                openChat();
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-primary rounded-full shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Open chat"
              style={{
                boxShadow: '0 0 30px rgba(255, 107, 53, 0.6), 0 4px 20px rgba(0, 0, 0, 0.4)',
              }}
            >
              <motion.div
                animate={
                  showNudge
                    ? {
                        scale: [1, 1.2, 1, 1.15, 1],
                        opacity: [1, 1, 1, 1, 1],
                      }
                    : {
                        opacity: [0.7, 1, 0.7],
                      }
                }
                transition={
                  showNudge
                    ? { duration: 0.5, ease: 'easeInOut', times: [0, 0.2, 0.4, 0.7, 1] }
                    : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }
              >
                <MessageCircle className="w-6 h-6 text-background" />
              </motion.div>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Expanded Chat Panel - Bottom Right */}
      <AnimatePresence>
        {chatView === 'open' && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed z-[200] flex flex-col overflow-hidden shadow-2xl
              bottom-0 left-0 right-0 h-[55vh] max-h-[480px] rounded-t-2xl
              sm:left-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[560px] sm:max-h-[80vh] sm:rounded-2xl"
            style={{
              background: '#0A0A0A',
              border: '1px solid rgba(255, 107, 53, 0.3)',
              boxShadow: '0 0 40px rgba(255, 107, 53, 0.15), 0 8px 32px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Chat Header */}
            <div
              className="flex items-center justify-between px-5 py-3 border-b"
              style={{ borderColor: 'rgba(255, 107, 53, 0.2)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary font-medium text-sm">AI Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={minimizeChat}
                  className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors"
                  aria-label="Minimize chat"
                >
                  <Minus className="w-4 h-4 text-primary/60" />
                </button>
                <button
                  onClick={closeChat}
                  className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4 text-primary/60" />
                </button>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 overflow-hidden">
              <BusinessChatInterface compact={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
