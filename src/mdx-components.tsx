import type { MDXComponents } from 'mdx/types';
import Image, { ImageProps } from 'next/image';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: (props) => (
      <Image
        {...(props as ImageProps)}
        width={800}
        height={400}
        className="rounded-lg"
        alt={props.alt || ''}
      />
    ),
    a: (props) => {
      const isExternal = props.href?.startsWith('http');
      return (
        <a
          {...props}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        />
      );
    },
    pre: (props) => (
      <pre
        {...props}
        className="bg-surface border border-border rounded-lg overflow-x-auto p-5"
      />
    ),
    code: (props) => {
      // Inline code (not in pre)
      if (!props.className) {
        return (
          <code
            {...props}
            className="bg-elevated px-1.5 py-0.5 rounded font-mono text-sm"
          />
        );
      }
      // Code block (in pre)
      return <code {...props} className="font-mono text-sm" />;
    },
    h1: (props) => (
      <h1
        {...props}
        className="font-display text-3xl md:text-4xl font-bold text-heading mt-8 mb-4 scroll-mt-24"
      />
    ),
    h2: (props) => (
      <h2
        {...props}
        className="font-display text-2xl md:text-3xl font-semibold text-heading mt-10 mb-4 scroll-mt-24"
      />
    ),
    h3: (props) => (
      <h3
        {...props}
        className="font-display text-xl md:text-2xl font-semibold text-heading mt-8 mb-3 scroll-mt-24"
      />
    ),
    blockquote: (props) => (
      <blockquote
        {...props}
        className="border-l-4 border-primary pl-4 italic text-text-secondary my-6"
      />
    ),
    ...components,
  };
}
