'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '@/contexts/ChatContext';

interface ChatMessageProps {
  message: Message;
  index: number;
}

export default function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`py-3 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`markdown-content ${isUser ? 'text-white text-right' : 'text-primary text-left w-full'}`}
        style={{
          fontSize: '0.9375rem',
          lineHeight: '1.5',
          letterSpacing: '0.025em',
        }}
      >
        {isUser ? (
          <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({...props}) => <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-6" {...props} />,
              h2: ({...props}) => <h2 className="text-xl md:text-2xl font-bold mb-3 mt-5" {...props} />,
              h3: ({...props}) => <h3 className="text-lg md:text-xl font-bold mb-2 mt-4" {...props} />,
              p: ({...props}) => <p className="mb-3 last:mb-0" {...props} />,
              ul: ({...props}) => <ul className="list-disc list-inside mb-3 space-y-1 ml-2" {...props} />,
              ol: ({...props}) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-2" {...props} />,
              li: ({...props}) => <li className="ml-2" {...props} />,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              code: ({inline, ...props}: any) =>
                inline
                  ? <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary-light font-mono text-sm" {...props} />
                  : <code className="block bg-primary/10 p-3 rounded my-2 text-primary-light font-mono text-sm overflow-x-auto" {...props} />,
              pre: ({...props}) => <pre className="my-2" {...props} />,
              a: ({...props}) => <a className="text-primary-light underline hover:text-white transition-colors" {...props} />,
              strong: ({...props}) => <strong className="font-bold text-primary-light" {...props} />,
              em: ({...props}) => <em className="italic" {...props} />,
              blockquote: ({...props}) => <blockquote className="border-l-4 border-primary/50 pl-4 italic my-3" {...props} />,
              hr: ({...props}) => <hr className="border-primary/30 my-4" {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
}
