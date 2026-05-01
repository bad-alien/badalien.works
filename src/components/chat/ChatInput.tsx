'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MAX_HEIGHT = 120;

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Ask about our services...',
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [input]);

  const submit = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const canSend = input.trim().length > 0 && !disabled;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 transition-shadow duration-150"
      style={{
        background: '#1E1E1E',
        border: `1px solid ${focused ? '#FF6B35' : '#2A2A2A'}`,
        borderRadius: '14px',
        padding: '6px 6px 6px 14px',
        boxShadow: focused ? '0 0 0 3px rgba(255, 107, 53, 0.10)' : 'none',
      }}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        aria-label="Chat message input"
        maxLength={8000}
        className="flex-1 bg-transparent border-none resize-none disabled:opacity-50 outline-none"
        style={{
          color: '#F0F0F0',
          fontSize: '15px',
          lineHeight: '1.5',
          padding: '8px 0',
          caretColor: '#FF6B35',
          maxHeight: MAX_HEIGHT,
          fontFamily: 'var(--font-instrument-sans, "Instrument Sans", sans-serif)',
        }}
      />
      <motion.button
        type="submit"
        disabled={!canSend}
        whileHover={canSend ? { scale: 1.05 } : undefined}
        whileTap={canSend ? { scale: 0.95 } : undefined}
        transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        aria-label="Send message"
        className="inline-flex items-center justify-center transition-colors duration-150 disabled:cursor-not-allowed shrink-0"
        style={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          background: canSend ? '#FF6B35' : '#2A2A2A',
          color: canSend ? '#1A0A04' : '#8A8A8A',
        }}
      >
        <Send className="w-4 h-4" strokeWidth={2.25} />
      </motion.button>
    </form>
  );
}
