'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Minus } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import BusinessChatInterface from '@/components/chat/BusinessChatInterface';

export default function ChatWidget() {
  const { chatView, openChat, minimizeChat, closeChat, setEntryPoint } = useChat();

  // Don't render anything when closed
  if (chatView === 'closed') return null;

  return (
    <>
      {/* Minimized Icon Button */}
      <AnimatePresence>
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
      </AnimatePresence>

      {/* Expanded Chat Panel - Bottom Right */}
      <AnimatePresence>
        {chatView === 'open' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-[200] w-[420px] h-[560px] max-h-[80vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
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
