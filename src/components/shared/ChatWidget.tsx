'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import BusinessChatInterface from '@/components/chat/BusinessChatInterface';

export default function ChatWidget() {
  const { isWidgetOpen, setIsWidgetOpen, isChatActive } = useChat();

  // Hide widget when inline chat is active on homepage
  if (isChatActive) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsWidgetOpen(!isWidgetOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 p-4 bg-white text-black rounded-full shadow-lg hover:shadow-xl transition-shadow"
        style={{
          boxShadow: '0 4px 20px rgba(255,255,255,0.3)',
        }}
      >
        {isWidgetOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>

      {/* Chat Overlay Panel */}
      <AnimatePresence>
        {isWidgetOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-40 w-[90vw] max-w-[380px] h-[520px] md:h-[580px] shadow-2xl"
            style={{
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}
          >
            <BusinessChatInterface compact context="homepage" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
