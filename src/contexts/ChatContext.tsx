'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

export type EntryPoint = 'hero' | 'widget' | 'page';
export type ChatView = 'closed' | 'open' | 'minimized';

type ChatContextType = {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  chatView: ChatView;
  openChat: () => void;
  minimizeChat: () => void;
  closeChat: () => void;
  entryPoint: EntryPoint;
  setEntryPoint: (entryPoint: EntryPoint) => void;
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
  const [chatView, setChatView] = useState<ChatView>('closed');
  const [entryPoint, setEntryPoint] = useState<EntryPoint>('page');

  const openChat = () => setChatView('open');
  const minimizeChat = () => setChatView('minimized');
  const closeChat = () => setChatView('closed');

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        chatView,
        openChat,
        minimizeChat,
        closeChat,
        entryPoint,
        setEntryPoint,
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
