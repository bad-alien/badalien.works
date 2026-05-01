'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useChat } from '@/contexts/ChatContext';
import { useNudge } from '@/hooks/useNudge';
import BusinessChatInterface from '@/components/chat/BusinessChatInterface';
import AIAvatar from '@/components/chat/AIAvatar';

const EASING = [0.2, 0.8, 0.2, 1] as const;

export default function ChatWidget() {
  const pathname = usePathname();
  const { chatView, openChat, minimizeChat, setEntryPoint } = useChat();
  const { showNudge, dismiss } = useNudge();

  if (pathname.startsWith('/blog') || pathname === '/contact') return null;
  if (chatView === 'closed') return null;

  return (
    <>
      <AnimatePresence>
        {chatView === 'minimized' && (
          <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-2">
            <AnimatePresence>
              {showNudge && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.9 }}
                  transition={{ duration: 0.24, ease: EASING }}
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

            {/* Launcher pill */}
            <motion.button
              onClick={() => {
                setEntryPoint('widget');
                openChat();
              }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.24, ease: EASING }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Open chat with the AI Assistant"
              className="group inline-flex items-center gap-3 pl-4 pr-5 py-2.5 rounded-full transition-colors"
              style={{
                background: '#161616',
                border: '1px solid #2A2A2A',
                boxShadow:
                  '0 30px 80px -20px rgba(0,0,0,0.6), 0 8px 24px -6px rgba(255, 107, 53, 0.18)',
              }}
            >
              <motion.span
                animate={
                  showNudge
                    ? { scale: [1, 1.18, 1, 1.12, 1] }
                    : { opacity: [0.85, 1, 0.85] }
                }
                transition={
                  showNudge
                    ? { duration: 0.5, ease: 'easeInOut', times: [0, 0.2, 0.4, 0.7, 1] }
                    : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                }
                className="inline-flex"
              >
                <AIAvatar size={28} showStatus statusBorderColor="#161616" />
              </motion.span>
              <span
                className="text-primary font-medium text-sm"
                style={{
                  fontFamily: 'var(--font-instrument-sans, "Instrument Sans", sans-serif)',
                }}
              >
                Chat with the AI Assistant
              </span>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatView === 'open' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.28, ease: EASING }}
            className="fixed z-[200] flex flex-col overflow-hidden
              bottom-0 left-0 right-0 h-[68vh] max-h-[560px] rounded-t-2xl
              sm:left-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[640px] sm:max-h-[calc(100vh-56px)] sm:rounded-2xl"
            style={{
              background: '#161616',
              border: '1px solid #2A2A2A',
              boxShadow:
                '0 30px 80px -20px rgba(0,0,0,0.6), 0 8px 24px -6px rgba(255, 107, 53, 0.10)',
            }}
            role="dialog"
            aria-label="AI Assistant chat"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b shrink-0"
              style={{ borderColor: '#222222' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <AIAvatar size={32} showStatus statusBorderColor="#161616" />
                <div className="flex flex-col leading-tight min-w-0">
                  <span
                    className="text-sm font-semibold truncate"
                    style={{
                      color: '#F0F0F0',
                      fontFamily: 'var(--font-outfit, "Outfit", sans-serif)',
                    }}
                  >
                    AI Assistant
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      color: '#8A8A8A',
                      fontFamily:
                        'var(--font-instrument-sans, "Instrument Sans", sans-serif)',
                    }}
                  >
                    Usually replies in seconds
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={minimizeChat}
                  className="p-1.5 rounded-lg transition-colors hover:bg-primary/10 text-[#8A8A8A] hover:text-primary"
                  aria-label="Minimize chat"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={minimizeChat}
                  className="p-1.5 rounded-lg transition-colors hover:bg-primary/10 text-[#8A8A8A] hover:text-primary"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <BusinessChatInterface compact={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
