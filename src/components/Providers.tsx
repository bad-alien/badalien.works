'use client';

import { ReactNode } from 'react';
import { ChatProvider } from '@/contexts/ChatContext';
import ChatWidget from '@/components/shared/ChatWidget';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      {children}
      <ChatWidget />
    </ChatProvider>
  );
}
