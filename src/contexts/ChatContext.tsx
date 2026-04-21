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
      content: "Hey! I help businesses figure out where AI can actually move the needle — no fluff, just practical results. Ask me anything, or grab a [free 15-minute intro call](/contact#book) to talk specifics.",
      timestamp: Date.now(),
    }
  ]);
  const [chatView, setChatView] = useState<ChatView>('minimized');
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
