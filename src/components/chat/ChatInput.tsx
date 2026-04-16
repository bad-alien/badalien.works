'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Ask about our services...'
}: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-2xl px-4 py-3 sm:px-6 sm:py-4 sm:gap-4 transition-all duration-300 border border-primary/30 outline-none focus-within:outline-none focus-visible:outline-none ring-0 focus-within:ring-0"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Chat message input"
        className="flex-1 bg-transparent border-none text-white placeholder-[#5A5A5A] outline-none disabled:opacity-50 text-base"
        style={{
          fontSize: '16px',
          caretColor: '#FF6B35',
          outline: 'none',
        }}
        maxLength={8000}
      />
      <motion.button
        type="submit"
        disabled={!input.trim() || disabled}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-primary hover:text-primary-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-300"
        aria-label="Send message"
      >
        <Send className="w-6 h-6" />
      </motion.button>
    </form>
  );
}
