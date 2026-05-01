'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '@/contexts/ChatContext';
import AuditBriefCard from './AuditBriefCard';
import AuditStatusBubble from './AuditStatusBubble';
import AuditCTAs from './AuditCTAs';
import ReachOutForm from './ReachOutForm';
import AIAvatar from './AIAvatar';

interface ChatMessageProps {
  message: Message;
  index: number;
  onBookCall?: () => void;
  onTellGoodTime?: () => void;
  onReachOutSuccess?: () => void;
  sessionId?: string | null;
}

export default function ChatMessage({
  message,
  index,
  onBookCall,
  onTellGoodTime,
  onReachOutSuccess,
  sessionId,
}: ChatMessageProps) {
  if (message.kind === 'status') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="py-1"
      >
        <AuditStatusBubble text={message.text} />
      </motion.div>
    );
  }

  if (message.kind === 'brief_card') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-2"
      >
        <AuditBriefCard brief={message.brief} url={message.url} />
      </motion.div>
    );
  }

  if (message.kind === 'cta_buttons') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-2"
      >
        <AuditCTAs
          onBookCall={onBookCall ?? (() => {})}
          onTellGoodTime={onTellGoodTime ?? (() => {})}
        />
      </motion.div>
    );
  }

  if (message.kind === 'reachout_form') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-2"
      >
        <ReachOutForm
          sessionId={sessionId ?? ''}
          onSuccess={onReachOutSuccess ?? (() => {})}
        />
      </motion.div>
    );
  }

  if (message.kind === 'reachout_confirm') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-3 flex justify-start"
      >
        <div
          className="text-primary"
          style={{ fontSize: '0.9375rem', lineHeight: '1.5', letterSpacing: '0.025em' }}
        >
          Got it — I&apos;ll be in touch. Talk soon.
        </div>
      </motion.div>
    );
  }

  // kind === 'text'
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
        className="py-2 flex justify-end"
      >
        <div
          className="px-3.5 py-2.5 max-w-[85%]"
          style={{
            background: '#1E1E1E',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px 14px 4px 14px',
            color: '#F0F0F0',
            fontSize: '0.9375rem',
            lineHeight: '1.5',
            letterSpacing: '0.01em',
            whiteSpace: 'pre-wrap',
            fontFamily: 'var(--font-instrument-sans, "Instrument Sans", sans-serif)',
          }}
        >
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1], delay: index * 0.04 }}
      className="py-2 flex items-start gap-2.5"
    >
      <span className="mt-0.5">
        <AIAvatar size={24} />
      </span>
      <div
        className="markdown-content flex-1 min-w-0"
        style={{
          color: '#C5C5C5',
          fontSize: '0.9375rem',
          lineHeight: '1.55',
          letterSpacing: '0.01em',
          fontFamily: 'var(--font-instrument-sans, "Instrument Sans", sans-serif)',
        }}
      >
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ ...props }) => <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-6" {...props} />,
              h2: ({ ...props }) => <h2 className="text-xl md:text-2xl font-bold mb-3 mt-5" {...props} />,
              h3: ({ ...props }) => <h3 className="text-lg md:text-xl font-bold mb-2 mt-4" {...props} />,
              p: ({ ...props }) => <p className="mb-3 last:mb-0" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-2" {...props} />,
              ol: ({ ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-2" {...props} />,
              li: ({ ...props }) => <li className="ml-2" {...props} />,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              code: ({ node, ...props }: any) => {
                const isInline = node?.parent?.tagName !== 'pre';
                return isInline
                  ? <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary-light font-mono text-sm" {...props} />
                  : <code className="block bg-primary/10 p-3 rounded my-2 text-primary-light font-mono text-sm overflow-x-auto" {...props} />;
              },
              pre: ({ ...props }) => <pre className="my-2" {...props} />,
              a: ({ ...props }) => <a className="text-primary-light underline hover:text-white transition-colors" {...props} />,
              strong: ({ ...props }) => <strong className="font-bold text-primary-light" {...props} />,
              em: ({ ...props }) => <em className="italic" {...props} />,
              blockquote: ({ ...props }) => <blockquote className="border-l-4 border-primary/50 pl-4 italic my-3" {...props} />,
              hr: ({ ...props }) => <hr className="border-primary/30 my-4" {...props} />,
            }}
          >
          {message.content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}
