'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Minus } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import BusinessChatInterface from '@/components/chat/BusinessChatInterface';

export default function ChatWidget() {
  const { chatView, openChat, minimizeChat, closeChat, setEntryPoint } = useChat();

  // Lock body scroll when chat is open
  useEffect(() => {
    if (chatView === 'open') {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [chatView]);

  // Don't render anything when closed
  if (chatView === 'closed') return null;

  return (
    <>
      {/* Minimized Icon Button */}
      {chatView === 'minimized' && (
        <motion.button
          onClick={() => {
            setEntryPoint('widget');
            openChat();
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[200] p-4 bg-primary rounded-full shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Open chat"
          style={{
            boxShadow: '0 0 30px rgba(255, 107, 53, 0.6), 0 4px 20px rgba(0, 0, 0, 0.4)',
          }}
        >
          <motion.div
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <MessageCircle className="w-6 h-6 text-background" />
          </motion.div>
        </motion.button>
      )}

      {/* Expanded Chat Overlay */}
      <AnimatePresence>
        {chatView === 'open' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={minimizeChat}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-4 top-[7.5vh] bottom-[7.5vh] md:inset-x-8 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-5xl bg-elevated border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-text-heading font-medium">AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={minimizeChat}
                    className="p-2 hover:bg-muted/20 rounded-lg transition-colors"
                    aria-label="Minimize chat"
                  >
                    <Minus className="w-5 h-5 text-text-secondary" />
                  </button>
                  <button
                    onClick={closeChat}
                    className="p-2 hover:bg-muted/20 rounded-lg transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5 text-text-secondary" />
                  </button>
                </div>
              </div>

              {/* Chat Interface */}
              <div className="flex-1 overflow-hidden">
                <BusinessChatInterface compact={false} context="homepage" heroMode={false} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
