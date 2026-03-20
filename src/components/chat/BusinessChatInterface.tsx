'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat, Message } from '@/contexts/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { getScriptedResponse } from './chatResponses';

interface BusinessChatInterfaceProps {
  compact?: boolean;
  context?: 'homepage' | 'consult' | 'services';
  heroMode?: boolean;
}

export default function BusinessChatInterface({
  compact = false,
  context = 'homepage', // eslint-disable-line @typescript-eslint/no-unused-vars
  heroMode = false
}: BusinessChatInterfaceProps) {
  const { messages, setMessages, setEntryPoint } = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive - scroll within container, not page
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Set entry point and initial message based on heroMode
  useEffect(() => {
    if (heroMode) {
      setEntryPoint('hero');
      setMessages([{
        id: 'initial',
        role: 'assistant',
        content: "Welcome! I can help you explore how AI enablement works for your team, walk through our approach, or book a free consultation. What brings you here?",
        timestamp: Date.now(),
      }]);
    }
  }, [heroMode, setEntryPoint, setMessages]);

  const handleSendMessage = async (userInput: string) => {
    if (isTyping) return;

    // Hide quick actions after first user message
    setShowQuickActions(false);

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate typing delay (1-2 seconds)
    const typingDelay = 1000 + Math.random() * 1000;

    setTimeout(() => {
      const responseText = getScriptedResponse(userInput);
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_${Math.random()}`,
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleQuickAction = (action: string) => {
    const quickActionMessages: Record<string, string> = {
      services: 'Tell me about your services',
      book: "I'd like to book a call",
      about: 'Tell me about your background',
    };
    handleSendMessage(quickActionMessages[action]);
  };

  // Show quick actions only after first assistant message and before any user message
  const shouldShowQuickActions = showQuickActions && messages.length === 1 && messages[0]?.role === 'assistant';

  return (
    <div
      className={`flex flex-col ${compact ? 'bg-[#0A0A0A]/80 backdrop-blur-sm border border-border rounded-xl' : 'bg-transparent'} ${
        compact ? 'h-full' : 'h-full'
      }`}
    >
      {/* Messages Container */}
      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto ${compact ? 'px-4 py-6' : 'px-6 py-8 md:px-12 lg:px-24'}`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 107, 53, 0.4) transparent',
        }}
      >
        <div className={compact ? 'max-w-full' : 'max-w-4xl mx-auto'}>
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <div key={message.id}>
                <ChatMessage message={message} index={index} />

                {/* Quick Action Chips - show below first assistant message */}
                {shouldShowQuickActions && index === 0 && message.role === 'assistant' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="flex gap-3 mt-6 mb-8 flex-wrap"
                  >
                    <motion.button
                      onClick={() => handleQuickAction('services')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-primary border border-primary/30 rounded-full text-sm hover:border-primary/50 transition-colors"
                    >
                      Services
                    </motion.button>
                    <motion.button
                      onClick={() => handleQuickAction('book')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-primary border border-primary/30 rounded-full text-sm hover:border-primary/50 transition-colors"
                    >
                      Book a Call
                    </motion.button>
                    <motion.button
                      onClick={() => handleQuickAction('about')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-primary border border-primary/30 rounded-full text-sm hover:border-primary/50 transition-colors"
                    >
                      About
                    </motion.button>
                  </motion.div>
                )}
              </div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-6"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={`${compact ? 'px-4 pb-4 pt-2' : 'px-6 pb-4 md:px-12 lg:px-24'}`}>
        <div className={compact ? 'max-w-full' : 'max-w-3xl mx-auto'}>
          <ChatInput
            onSend={handleSendMessage}
            disabled={isTyping}
            placeholder="Ask about our services..."
          />
        </div>
      </div>
    </div>
  );
}
