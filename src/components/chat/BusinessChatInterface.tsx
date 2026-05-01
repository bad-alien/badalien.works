'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat, Message, AuditStep } from '@/contexts/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import IntroChips from './IntroChips';
import type { AuditBrief } from '@/lib/auditSession';

interface BusinessChatInterfaceProps {
  compact?: boolean;
}

// --------------------------------------------------------------------------
// Intent classifier for free-typed intro messages
// --------------------------------------------------------------------------
const URL_PATTERN = /https?:\/\/[^\s]+|www\.[^\s]+\.[a-z]{2,}|[a-z0-9-]+\.[a-z]{2,}(\/[^\s]*)?/i;
const AUDIT_KEYWORDS = /\baudit\b|\bassess(ment)?\b|\blook at my site\b|\bcheck my (site|website|page)\b|\bfree (audit|assessment|scan)\b|\bai (audit|scan|check)\b/i;

function classifyIntroIntent(text: string): { branch: 'audit' | 'faq'; prefillUrl?: string } {
  const urlMatch = text.match(URL_PATTERN);
  if (urlMatch) {
    let url = urlMatch[0];
    if (!url.startsWith('http')) url = 'https://' + url;
    return { branch: 'audit', prefillUrl: url };
  }
  if (AUDIT_KEYWORDS.test(text)) {
    return { branch: 'audit' };
  }
  return { branch: 'faq' };
}

// --------------------------------------------------------------------------
// SSE parser — consumes a text/event-stream body as a ReadableStream<Uint8Array>
// --------------------------------------------------------------------------
async function* parseSSE(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<{ event: string; data: Record<string, unknown> }> {
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() ?? '';

    for (const block of blocks) {
      const lines = block.trim().split('\n');
      let eventName = 'message';
      let dataRaw = '';
      for (const line of lines) {
        if (line.startsWith('event: ')) eventName = line.slice(7).trim();
        if (line.startsWith('data: ')) dataRaw = line.slice(6).trim();
      }
      if (!dataRaw) continue;
      try {
        const data = JSON.parse(dataRaw) as Record<string, unknown>;
        yield { event: eventName, data };
      } catch {
        // skip malformed
      }
    }
  }
}

// --------------------------------------------------------------------------
// Component
// --------------------------------------------------------------------------
export default function BusinessChatInterface({ compact = false }: BusinessChatInterfaceProps) {
  const {
    messages,
    setMessages,
    branch,
    setBranch,
    auditStep,
    setAuditStep,
    sessionId,
    setSessionId,
    setAuditBrief,
    auditUrl,
    setAuditUrl,
    postAuditTurnCount,
    setPostAuditTurnCount,
    lastCtaInsertTurn,
    setLastCtaInsertTurn,
  } = useChat();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef(false); // guards async callbacks against stale closures
  const [isRunning, setIsRunning] = useState(false); // drives re-renders (typing indicator + input disabled)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // --------------------------------------------------------------------------
  // Message factory helpers
  // --------------------------------------------------------------------------
  function mkId() {
    return `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  function appendAssistantText(content: string) {
    setMessages((prev) => [
      ...prev,
      { id: mkId(), kind: 'text', role: 'assistant', content, timestamp: Date.now() } satisfies Message,
    ]);
  }

  function appendUserText(content: string) {
    setMessages((prev) => [
      ...prev,
      { id: mkId(), kind: 'text', role: 'user', content, timestamp: Date.now() } satisfies Message,
    ]);
  }

  function appendStatus(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: mkId(), kind: 'status', text, timestamp: Date.now() } satisfies Message,
    ]);
  }

  function appendBriefCard(brief: AuditBrief, url: string) {
    setMessages((prev) => [
      ...prev,
      { id: mkId(), kind: 'brief_card', brief, url, timestamp: Date.now() } satisfies Message,
    ]);
  }

  function appendCtaButtons() {
    setMessages((prev) => [
      ...prev,
      { id: mkId(), kind: 'cta_buttons', timestamp: Date.now() } satisfies Message,
    ]);
  }

  function appendReachOutForm() {
    setMessages((prev) => [
      ...prev,
      { id: mkId(), kind: 'reachout_form', timestamp: Date.now() } satisfies Message,
    ]);
  }

  // --------------------------------------------------------------------------
  // Audit SSE streaming
  // --------------------------------------------------------------------------
  const runAuditStream = useCallback(async (params: {
    session_id: string;
    url: string;
    bottleneck: string;
    sensitive_docs: 'yes' | 'sometimes' | 'no';
  }) => {
    isRunningRef.current = true;
    setIsRunning(true);
    setAuditStep('running');

    try {
      const res = await fetch('/api/audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: { message: 'Request failed.' } }));
        const code = (err as { error?: { code?: string } })?.error?.code;
        if (code === 'BUDGET_EXCEEDED') {
          appendAssistantText("I've hit today's audit limit. Come back tomorrow and I'll run a full scan — or book a call now if it's urgent.");
        } else if (code === 'RATE_LIMIT_EXCEEDED') {
          appendAssistantText("You've already run 3 audits today from this connection. Drop me a line directly — r@badalien.works — and I'll do a manual review.");
        } else {
          appendAssistantText("Something went sideways on my end. Try again in a moment, or reach out at r@badalien.works.");
        }
        setAuditStep('rendered');
        setBranch('post_audit');
        appendCtaButtons();
        return;
      }

      const reader = res.body.getReader();

      for await (const { event, data } of parseSSE(reader)) {
        if (event === 'status') {
          const statusData = data as { status: string; message?: string };
          if (statusData.message) appendStatus(statusData.message);
        } else if (event === 'done') {
          const doneData = data as { brief?: AuditBrief };
          if (doneData.brief) {
            setAuditBrief(doneData.brief);
            appendBriefCard(doneData.brief, params.url);
            appendCtaButtons();
            setAuditStep('rendered');
            setBranch('post_audit');
          }
        } else if (event === 'error') {
          appendAssistantText("The audit hit an error. Try again or reach out at r@badalien.works.");
          setAuditStep('rendered');
          setBranch('post_audit');
          appendCtaButtons();
          break;
        }
      }
    } catch {
      appendAssistantText("Lost the connection mid-audit. Try again — it's usually a blip.");
      setAuditStep('rendered');
      setBranch('post_audit');
      appendCtaButtons();
    } finally {
      isRunningRef.current = false;
      setIsRunning(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------------------------------
  // Free-chat API (faq + audit_followup modes)
  // --------------------------------------------------------------------------
  const sendFreeChatMessage = useCallback(async (
    mode: 'faq' | 'audit_followup',
    sid: string,
    currentMessages: Message[]
  ) => {
    isRunningRef.current = true;
    setIsRunning(true);

    try {
      const apiMessages = currentMessages
        .filter((m): m is Extract<Message, { kind: 'text' }> => m.kind === 'text')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, session_id: sid, mode }),
      });

      if (!res.ok) {
        appendAssistantText("I hit a snag on my end. Try again in a moment.");
        return null;
      }

      const json = await res.json() as { message?: string; content?: string };
      const reply = json.message ?? json.content ?? '';
      if (reply) appendAssistantText(reply);
      return reply;
    } catch {
      appendAssistantText("Connection issue. Try again in a moment.");
      return null;
    } finally {
      isRunningRef.current = false;
      setIsRunning(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------------------------------
  // Session creation
  // --------------------------------------------------------------------------
  async function ensureSession(sessionBranch: 'audit' | 'faq', url?: string): Promise<string | null> {
    try {
      const res = await fetch('/api/audit/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url ?? 'https://placeholder.com', branch: sessionBranch }),
      });
      if (!res.ok) return null;
      const json = await res.json() as { session_id?: string };
      return json.session_id ?? null;
    } catch {
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // Audit step handlers — called sequentially as user answers each question
  // --------------------------------------------------------------------------
  const handleAuditStep = useCallback(async (userInput: string, step: AuditStep) => {
    if (step === 'awaiting_url') {
      // Extract URL from user input
      let url = userInput.trim();
      const match = userInput.match(URL_PATTERN);
      if (match) {
        url = match[0];
        if (!url.startsWith('http')) url = 'https://' + url;
      } else if (!url.startsWith('http')) {
        url = 'https://' + url;
      }

      setAuditUrl(url);
      setAuditStep('awaiting_pain');

      // Create session after we have the URL
      const sid = await ensureSession('audit', url);
      if (sid) setSessionId(sid);

      appendAssistantText("Got it. What's the biggest bottleneck in your business right now — the thing that eats the most time or costs the most money?");
      return;
    }

    if (step === 'awaiting_pain') {
      setAuditStep('awaiting_sensitive');
      appendAssistantText("One more thing: does your work involve sensitive documents — client contracts, patient records, financial data, intake forms? (yes / sometimes / no)");
      return;
    }

    if (step === 'awaiting_sensitive') {
      const lower = userInput.toLowerCase();
      let sensitive: 'yes' | 'sometimes' | 'no' = 'no';
      if (lower.includes('yes') || lower.includes('yeah') || lower.includes('yep')) sensitive = 'yes';
      else if (lower.includes('sometimes') || lower.includes('occasionally') || lower.includes('some')) sensitive = 'sometimes';

      // Gather audit inputs from context — we need url and bottleneck
      // We stored url in auditUrl. Bottleneck is the last user message before this one.
      type TextMessage = Extract<Message, { kind: 'text' }>;
      const textMessages = messages.filter(
        (m): m is TextMessage & { role: 'user' } =>
          m.kind === 'text' && (m as TextMessage).role === 'user'
      );
      const bottleneck = textMessages.length >= 2
        ? textMessages[textMessages.length - 2].content
        : textMessages[textMessages.length - 1]?.content ?? '';

      if (!auditUrl || !sessionId) {
        appendAssistantText("I lost track of the session. Let's start over — what's your site URL?");
        setAuditStep('awaiting_url');
        setBranch('audit');
        return;
      }

      appendAssistantText("Running the audit now — I'll take a look at your site…");
      await runAuditStream({ session_id: sessionId, url: auditUrl, bottleneck, sensitive_docs: sensitive });
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditUrl, sessionId, messages, runAuditStream]);

  // --------------------------------------------------------------------------
  // Main message send handler
  // --------------------------------------------------------------------------
  const handleSendMessage = useCallback(async (userInput: string) => {
    if (isRunningRef.current) return;

    appendUserText(userInput);

    const currentMessages: Message[] = [...messages, {
      id: mkId(),
      kind: 'text',
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
    }];

    // Intro branch — classify intent
    if (branch === 'intro') {
      const { branch: targetBranch, prefillUrl } = classifyIntroIntent(userInput);

      if (targetBranch === 'audit') {
        setBranch('audit');
        if (prefillUrl) {
          setAuditUrl(prefillUrl);
          setAuditStep('awaiting_pain');
          const sid = await ensureSession('audit', prefillUrl);
          if (sid) setSessionId(sid);
          appendAssistantText(`I can see a URL in there — I'll audit **${prefillUrl}**. What's the biggest bottleneck in your business right now?`);
        } else {
          setAuditStep('awaiting_url');
          appendAssistantText("I'll run a free 60-second AI audit on your site. What's the URL?");
        }
      } else {
        // FAQ branch
        setBranch('faq');
        const sid = sessionId ?? (await ensureSession('faq'));
        if (sid && !sessionId) setSessionId(sid);
        await sendFreeChatMessage('faq', sid ?? '', currentMessages);
      }
      return;
    }

    // Audit branch — step through the flow
    if (branch === 'audit') {
      await handleAuditStep(userInput, auditStep);
      return;
    }

    // Post-audit branch — free chat with CTA resurfacing
    if (branch === 'post_audit') {
      const newTurnCount = postAuditTurnCount + 1;
      setPostAuditTurnCount(newTurnCount);

      await sendFreeChatMessage('audit_followup', sessionId ?? '', currentMessages);

      // Resurface CTAs every 2+ assistant turns since last insertion
      if (newTurnCount - lastCtaInsertTurn >= 2) {
        appendCtaButtons();
        setLastCtaInsertTurn(newTurnCount);
      }
      return;
    }

    // FAQ branch — free chat with CTA resurfacing
    if (branch === 'faq') {
      const newTurnCount = postAuditTurnCount + 1;
      setPostAuditTurnCount(newTurnCount);

      await sendFreeChatMessage('faq', sessionId ?? '', currentMessages);

      if (newTurnCount - lastCtaInsertTurn >= 2) {
        appendCtaButtons();
        setLastCtaInsertTurn(newTurnCount);
      }
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch, auditStep, auditUrl, sessionId, messages, postAuditTurnCount, lastCtaInsertTurn, handleAuditStep, sendFreeChatMessage]);

  // --------------------------------------------------------------------------
  // Chip actions
  // --------------------------------------------------------------------------
  const handleAuditChip = useCallback(async () => {
    setBranch('audit');
    setAuditStep('awaiting_url');
    appendAssistantText("I'll run a free 60-second AI audit on your site. What's the URL?");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFaqChip = useCallback(async () => {
    setBranch('faq');
    const sid = sessionId ?? (await ensureSession('faq'));
    if (sid && !sessionId) setSessionId(sid);
    appendAssistantText("Sure — what's on your mind?");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // --------------------------------------------------------------------------
  // CTA + form handlers
  // --------------------------------------------------------------------------
  const handleBookCall = useCallback(() => {
    // AuditCTAs opens the Cal modal itself; nothing extra needed here
  }, []);

  const handleTellGoodTime = useCallback(() => {
    appendReachOutForm();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReachOutSuccess = useCallback(() => {
    // Replace the last reachout_form with a confirm message
    setMessages((prev) => {
      const idx = [...prev].reverse().findIndex((m) => m.kind === 'reachout_form');
      if (idx === -1) return [...prev, { id: mkId(), kind: 'reachout_confirm', timestamp: Date.now() } satisfies Message];
      const realIdx = prev.length - 1 - idx;
      const updated = [...prev];
      updated[realIdx] = { id: mkId(), kind: 'reachout_confirm', timestamp: Date.now() } satisfies Message;
      return updated;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------------------------------
  // Render helpers
  // --------------------------------------------------------------------------
  const showIntroChips = branch === 'intro' && messages.length === 1 && messages[0]?.kind === 'text' && messages[0].role === 'assistant';

  const inputPlaceholder = (() => {
    if (branch === 'audit') {
      if (auditStep === 'awaiting_url') return 'Enter your site URL…';
      if (auditStep === 'awaiting_pain') return 'Describe your biggest bottleneck…';
      if (auditStep === 'awaiting_sensitive') return 'yes / sometimes / no';
    }
    return 'Ask anything…';
  })();

  return (
    <div className="flex flex-col bg-transparent h-full">
      {/* Messages Container */}
      <div
        ref={scrollContainerRef}
        role="log"
        aria-live="polite"
        aria-atomic="false"
        className={`flex-1 overflow-y-auto ${compact ? 'px-4 py-6' : 'px-6 py-8 md:px-12 lg:px-24'}`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 107, 53, 0.4) transparent',
        }}
      >
        <div className={compact ? 'max-w-full' : 'max-w-5xl mx-auto'}>
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <div key={message.id}>
                <ChatMessage
                  message={message}
                  index={index}
                  onBookCall={handleBookCall}
                  onTellGoodTime={handleTellGoodTime}
                  onReachOutSuccess={handleReachOutSuccess}
                  sessionId={sessionId}
                />

                {/* Intro chips — shown below the first assistant message */}
                {showIntroChips && index === 0 && (
                  <IntroChips onAudit={handleAuditChip} onFaq={handleFaqChip} />
                )}
              </div>
            ))}
          </AnimatePresence>

          {/* Typing / running indicator */}
          {isRunning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-6"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className={`${compact ? 'px-4 pb-[env(safe-area-inset-bottom,16px)] pt-2' : 'px-6 pb-4 md:px-12 lg:px-24'}`}>
        <div className={compact ? 'max-w-full' : 'max-w-5xl mx-auto'}>
          <ChatInput
            onSend={handleSendMessage}
            disabled={auditStep === 'running' || isRunning}
            placeholder={inputPlaceholder}
          />
        </div>
      </div>
    </div>
  );
}
