'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

type ChatContextType = {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  isWidgetOpen: boolean;
  setIsWidgetOpen: (open: boolean) => void;
  isChatActive: boolean;
  setIsChatActive: (active: boolean) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'assistant',
      content: "Hi! I'm Bad Alien's AI assistant. I can help you learn about our consulting services, technical approach, pricing, and booking a call. What would you like to know?",
      timestamp: Date.now(),
    }
  ]);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        isWidgetOpen,
        setIsWidgetOpen,
        isChatActive,
        setIsChatActive,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
