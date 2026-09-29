'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '@/contexts/ChatContext';
import AuditBriefCard from './AuditBriefCard';
import AuditStatusBubble from './AuditStatusBubble';
import AuditCTAs from './AuditCTAs';
import ReachOutForm from './ReachOutForm';

interface ChatMessageProps {
  message: Message;
  index: number;
  onBookCall?: () => void;
  onTellGoodTime?: () => void;
  onReachOutSuccess?: () => void;
  sessionId?: string | null;
  auditToken?: string | null;
}

export default function ChatMessage({
  message,
  index,
  onBookCall,
  onTellGoodTime,
  onReachOutSuccess,
  sessionId,
  auditToken,
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
          auditToken={auditToken ?? null}
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
          style={{ color: '#E8E8E8', fontSize: '0.9375rem', lineHeight: '1.55', letterSpacing: '0.01em' }}
        >
          Got it — I&apos;ll be in touch. Talk soon.
        </div>
      </motion.div>
    );
  }

  // kind === 'text'
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`py-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`markdown-content ${isUser ? 'text-right' : 'text-left w-full'}`}
        style={{
          color: isUser ? '#FFFFFF' : '#E8E8E8',
          fontSize: '0.9375rem',
          lineHeight: '1.55',
          letterSpacing: '0.01em',
        }}
      >
        {isUser ? (
          <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
        ) : (
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
                  ? <code className="px-1.5 py-0.5 rounded font-mono text-sm" style={{ background: 'rgba(255,255,255,0.06)', color: '#FFB088' }} {...props} />
                  : <code className="block p-3 rounded my-2 font-mono text-sm overflow-x-auto" style={{ background: 'rgba(255,255,255,0.04)', color: '#FFB088' }} {...props} />;
              },
              pre: ({ ...props }) => <pre className="my-2" {...props} />,
              a: ({ ...props }) => <a className="underline hover:text-white transition-colors" style={{ color: '#FF8C5A', textUnderlineOffset: '2px' }} {...props} />,
              strong: ({ ...props }) => <strong className="font-semibold" style={{ color: '#FFFFFF' }} {...props} />,
              em: ({ ...props }) => <em className="italic" {...props} />,
              blockquote: ({ ...props }) => <blockquote className="pl-4 italic my-3" style={{ borderLeft: '3px solid rgba(255,255,255,0.12)', color: '#C5C5C5' }} {...props} />,
              hr: ({ ...props }) => <hr className="my-4" style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
}
