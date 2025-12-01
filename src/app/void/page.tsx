'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingView from '@/components/void/LandingView';
import ChatInterface from '@/components/void/ChatInterface';

type ViewMode = 'landing' | 'chat';

export default function VoidPage(): JSX.Element {
  const [mode, setMode] = useState<ViewMode>('landing');

  // Handle Escape key to return to landing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mode === 'chat') {
        setMode('landing');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  const handleEnterVoid = () => {
    setMode('chat');
  };

  const handleEscape = () => {
    setMode('landing');
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {mode === 'landing' ? (
          <LandingView
            key="landing"
            onEnter={handleEnterVoid}
          />
        ) : (
          <ChatInterface
            key="chat"
            onEscape={handleEscape}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
