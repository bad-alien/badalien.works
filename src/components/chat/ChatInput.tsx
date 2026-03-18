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
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-2xl px-6 py-4 transition-colors duration-300"
      style={{
        border: `1px solid ${isFocused ? 'rgba(255, 107, 53, 0.5)' : 'rgba(255, 107, 53, 0.3)'}`,
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Chat message input"
        className="flex-1 bg-transparent border-none text-white placeholder-[#5A5A5A] outline-none disabled:opacity-50"
        style={{
          fontFamily: 'var(--font-gemunu-libre)',
          fontSize: '1rem',
          caretColor: '#FF6B35',
        }}
        maxLength={8000}
      />
      <motion.button
        type="submit"
        disabled={!input.trim() || disabled}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-[#FF6B35] hover:text-[#FF8C5A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-300"
        aria-label="Send message"
      >
        <Send className="w-6 h-6" />
      </motion.button>
    </form>
  );
}
