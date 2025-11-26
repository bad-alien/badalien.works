'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function VoidPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate session ID on mount
  useEffect(() => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
  }, []);

  // Clear session
  const handleClearSession = useCallback(() => {
    setMessages([]);
    setInput('');
    setError(null);
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);
  }, []);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      handleClearSession();
    }, 5 * 60 * 1000); // 5 minutes
  }, [handleClearSession]);

  // Reset timer on user activity
  useEffect(() => {
    resetInactivityTimer();

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [messages, input, resetInactivityTimer]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          messages: updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get response');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
      };

      setMessages([...updatedMessages, assistantMessage]);
      resetInactivityTimer();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle textarea Enter key (send on Enter, new line on Shift+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (!input.trim() || isLoading) return;

      const userMessage: Message = {
        role: 'user',
        content: input.trim(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');
      setIsLoading(true);
      setError(null);

      // Call API
      fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          messages: updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error.message || 'Failed to get response');
          }

          const assistantMessage: Message = {
            role: 'assistant',
            content: data.reply,
          };

          setMessages((prev) => [...prev, assistantMessage]);
          resetInactivityTimer();
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'An error occurred');
          console.error('Chat error:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <img
            src="/logos/ba-logo-trans-white.png"
            alt="Bad Alien"
            className="h-12 w-auto"
          />
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 font-mono">void</span>
          <button
            onClick={handleClearSession}
            className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1 border border-gray-700 hover:border-gray-500 rounded"
          >
            END SESSION
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-600">
              <p className="text-2xl mb-2">Enter the void</p>
              <p className="text-sm">No memory. No logs. No trace.</p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] md:max-w-[60%] px-4 py-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-[#007878] text-white'
                  : 'bg-gray-900 text-gray-100 border border-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[60%] px-4 py-3 rounded-lg bg-gray-900 border border-gray-800">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse delay-75"></span>
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse delay-150"></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="px-4 py-3 rounded-lg bg-red-900/20 border border-red-500/50 text-red-300 text-sm">
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 px-6 py-4 bg-black">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Transmit to the void..."
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#007878] resize-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-[#007878] hover:bg-[#006666] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            SEND
          </button>
        </form>
        <p className="text-xs text-gray-600 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line • Session ends after 5 min of inactivity
        </p>
      </div>
    </div>
  );
}
