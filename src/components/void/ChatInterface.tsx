'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Send, HelpCircle, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Logo from '@/components/shared/Logo';

interface ChatInterfaceProps {
  onEscape: () => void;
}

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

export default function ChatInterface({ onEscape }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'assistant',
      content: 'You have entered The Void. What whispers do you bring?',
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Format messages for API
      const apiMessages = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          messages: apiMessages,
          temperature: 0.8,
          max_new_tokens: 512,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get response');
      }

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_${Math.random()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `msg_${Date.now()}_${Math.random()}`,
        role: 'assistant',
        content: 'The Void is silent... Try again later.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleMessageMouseEnter = (messageId: string) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Set a delay before showing the copy button
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMessageId(messageId);
    }, 300); // 300ms delay
  };

  const handleMessageMouseLeave = () => {
    // Clear the timeout if mouse leaves before delay completes
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredMessageId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 flex flex-col bg-black"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-20 flex items-center justify-center pt-4 pb-3 px-4 bg-black/40 backdrop-blur-md"
      >
        {/* Escape Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEscape}
          className="absolute left-8 top-1/2 -translate-y-1/2 text-void-orange hover:text-void-orange-light transition-colors duration-300 tracking-wider uppercase"
          style={{
            fontFamily: 'var(--font-gemunu-libre), monospace',
            fontSize: '0.75rem',
            textShadow: '0 0 8px currentColor',
          }}
        >
          escape
        </motion.button>

        <div className="flex items-center justify-center">
          <Logo size="xs" linkToHome={false} className="object-contain" />
        </div>
      </motion.header>

      {/* Messages Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto pt-20 pb-32 px-6 md:px-12 lg:px-24"
        style={{
          scrollbarGutter: 'stable',
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--color-void-orange) transparent',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => handleMessageMouseEnter(message.id)}
                onMouseLeave={handleMessageMouseLeave}
                className={`py-6 relative group ${
                  message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                }`}
                style={{
                  paddingLeft: message.role === 'assistant' ? '3rem' : '0',
                  paddingRight: message.role === 'user' ? '3rem' : '0',
                }}
              >
                {/* Copy button for assistant messages (left side) */}
                {message.role === 'assistant' && hoveredMessageId === message.id && (
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-void-orange hover:text-void-orange-light transition-colors duration-200"
                    style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}

                {/* Copy button for user messages (right side) */}
                {message.role === 'user' && hoveredMessageId === message.id && (
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-void-orange hover:text-void-orange-light transition-colors duration-200"
                    style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}

                <div
                  className={`text-void-orange markdown-content ${
                    message.role === 'user'
                      ? 'max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-xl bg-void-orange/5 backdrop-blur-sm border border-void-orange/20'
                      : 'w-full'
                  }`}
                  style={{
                    fontFamily: 'var(--font-gemunu-libre), monospace',
                    fontSize: message.role === 'user' ? '1.125rem' : '1.25rem',
                    lineHeight: '1.6',
                    letterSpacing: '0.025em',
                    textShadow: '0 0 8px rgba(var(--color-void-orange-rgb), 0.4)',
                    ...(message.role === 'user' && {
                      boxShadow: '0 0 20px rgba(var(--color-void-orange-rgb), 0.15), 0 0 40px rgba(var(--color-void-orange-rgb), 0.08)',
                    }),
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Headings
                      h1: ({...props}) => <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-6" {...props} />,
                      h2: ({...props}) => <h2 className="text-xl md:text-2xl font-bold mb-3 mt-5" {...props} />,
                      h3: ({...props}) => <h3 className="text-lg md:text-xl font-bold mb-2 mt-4" {...props} />,
                      // Paragraphs
                      p: ({...props}) => <p className="mb-3 last:mb-0" {...props} />,
                      // Lists
                      ul: ({...props}) => <ul className="list-disc list-inside mb-3 space-y-1 ml-2" {...props} />,
                      ol: ({...props}) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-2" {...props} />,
                      li: ({...props}) => <li className="ml-2" {...props} />,
                      // Code
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      code: ({inline, ...props}: any) =>
                        inline
                          ? <code className="bg-void-orange/10 px-1.5 py-0.5 rounded text-void-orange-light font-mono text-sm" {...props} />
                          : <code className="block bg-void-orange/10 p-3 rounded my-2 text-void-orange-light font-mono text-sm overflow-x-auto" {...props} />,
                      pre: ({...props}) => <pre className="my-2" {...props} />,
                      // Links
                      a: ({...props}) => <a className="text-void-orange-light underline hover:text-white transition-colors" {...props} />,
                      // Emphasis
                      strong: ({...props}) => <strong className="font-bold text-void-orange-light" {...props} />,
                      em: ({...props}) => <em className="italic" {...props} />,
                      // Blockquotes
                      blockquote: ({...props}) => <blockquote className="border-l-4 border-void-orange/50 pl-4 italic my-3" {...props} />,
                      // Horizontal rule
                      hr: ({...props}) => <hr className="border-void-orange/30 my-4" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && (
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
                    className="w-1.5 h-1.5 rounded-full bg-void-orange"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(var(--color-void-orange-rgb), 0.6))' }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="fixed bottom-8 left-0 right-0 z-20 px-6 md:px-12 lg:px-24"
      >
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-xl px-6 py-4 border border-void-orange/30">
            {/* Terminal-style input */}
            <div className="flex-1 relative">
              <div
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-black transition-all duration-500"
                style={{
                  boxShadow: input.length > 0 || isFocused
                    ? '0 0 20px rgba(var(--color-void-orange-rgb), 0.6), 0 0 40px rgba(var(--color-void-orange-rgb), 0.3)'
                    : '0 0 15px rgba(var(--color-void-orange-rgb), 0.4), 0 0 30px rgba(var(--color-void-orange-rgb), 0.2)'
                }}
              />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Speak to the Void…"
                disabled={isLoading}
                className="w-full bg-transparent border-none text-void-orange placeholder-void-gray py-3 outline-none transition-all duration-300 disabled:opacity-50"
                style={{
                  fontFamily: 'var(--font-gemunu-libre), monospace',
                  fontSize: '1rem',
                  caretColor: 'var(--color-void-orange)',
                  textShadow: '0 0 8px rgba(var(--color-void-orange-rgb), 0.4)',
                }}
                maxLength={8000}
              />
            </div>

            {/* Send Button */}
            <motion.button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 text-void-orange hover:text-void-orange-light disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            >
              <Send className="w-6 h-6" style={{ filter: 'drop-shadow(0 0 8px currentColor)' }} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Help Icon - Bottom Right */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-8 right-8 text-void-gray hover:text-void-orange transition-colors"
        style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
      >
        <HelpCircle size={20} />
      </motion.button>
    </motion.div>
  );
}
