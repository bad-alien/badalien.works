'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { trackConversion } from '@/lib/analytics';
import type { AuditBrief } from '@/lib/auditSession';

export type ChatBranch = 'intro' | 'audit' | 'faq' | 'post_audit';
export type AuditStep = 'awaiting_url' | 'awaiting_pain' | 'awaiting_sensitive' | 'running' | 'rendered';

export type Message =
  | { id: string; kind: 'text'; role: 'user' | 'assistant'; content: string; timestamp: number }
  | { id: string; kind: 'status'; text: string; timestamp: number }
  | { id: string; kind: 'brief_card'; brief: AuditBrief; url: string; timestamp: number }
  | { id: string; kind: 'cta_buttons'; timestamp: number }
  | { id: string; kind: 'reachout_form'; timestamp: number }
  | { id: string; kind: 'reachout_confirm'; timestamp: number };

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
  branch: ChatBranch;
  setBranch: (branch: ChatBranch) => void;
  auditStep: AuditStep;
  setAuditStep: (step: AuditStep) => void;
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  auditBrief: AuditBrief | null;
  setAuditBrief: (brief: AuditBrief | null) => void;
  auditToken: string | null;
  setAuditToken: (token: string | null) => void;
  auditUrl: string | null;
  setAuditUrl: (url: string | null) => void;
  postAuditTurnCount: number;
  setPostAuditTurnCount: (n: number | ((prev: number) => number)) => void;
  lastCtaInsertTurn: number;
  setLastCtaInsertTurn: (n: number) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      kind: 'text',
      role: 'assistant',
      content: "Hey! I help businesses figure out where AI can actually move the needle — no fluff, just practical results. Ask me anything, or run a free 60-second AI audit on your site.",
      timestamp: Date.now(),
    }
  ]);
  const [chatView, setChatView] = useState<ChatView>('minimized');
  const [entryPoint, setEntryPoint] = useState<EntryPoint>('page');
  const [branch, setBranch] = useState<ChatBranch>('intro');
  const [auditStep, setAuditStep] = useState<AuditStep>('awaiting_url');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [auditBrief, setAuditBrief] = useState<AuditBrief | null>(null);
  const [auditToken, setAuditToken] = useState<string | null>(null);
  const [auditUrl, setAuditUrl] = useState<string | null>(null);
  const [postAuditTurnCount, setPostAuditTurnCount] = useState(0);
  const [lastCtaInsertTurn, setLastCtaInsertTurn] = useState(0);

  // Fire on the transition into 'open' (any launcher), after setEntryPoint has landed
  const prevChatView = useRef(chatView);
  useEffect(() => {
    if (chatView === 'open' && prevChatView.current !== 'open') {
      trackConversion('Chat Opened', { entry: entryPoint });
    }
    prevChatView.current = chatView;
  }, [chatView, entryPoint]);

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
        branch,
        setBranch,
        auditStep,
        setAuditStep,
        sessionId,
        setSessionId,
        auditBrief,
        setAuditBrief,
        auditToken,
        setAuditToken,
        auditUrl,
        setAuditUrl,
        postAuditTurnCount,
        setPostAuditTurnCount,
        lastCtaInsertTurn,
        setLastCtaInsertTurn,
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
