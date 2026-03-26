'use client';

import Link from 'next/link';

type CtaAction =
  | { type: 'button'; label: string; onClick: () => void }
  | { type: 'link'; label: string; href: string };

interface DualCtaProps {
  primary: CtaAction;
  secondary: CtaAction;
  size?: 'default' | 'large';
  className?: string;
}

export default function DualCta({ primary, secondary, size = 'default', className }: DualCtaProps) {
  const px = size === 'large' ? 'px-10' : 'px-8';
  const py = size === 'large' ? 'py-5' : 'py-4';
  const text = size === 'large' ? 'text-lg font-bold' : 'text-lg font-medium';

  const primaryClasses = `group relative ${px} ${py} min-h-[44px] ${text} text-black bg-white rounded-lg transition-all duration-300 hover:scale-105`;
  const secondaryClasses = `group relative ${px} ${py} min-h-[44px] ${text} text-white bg-surface border border-border rounded-xl transition-all duration-300 hover:bg-elevated`;

  return (
    <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center${className ? ` ${className}` : ''}`}>
      {primary.type === 'button' ? (
        <button onClick={primary.onClick} className={primaryClasses}>
          <span className="relative z-10">{primary.label}</span>
        </button>
      ) : (
        <Link href={primary.href} className={primaryClasses}>
          <span className="relative z-10">{primary.label}</span>
        </Link>
      )}

      {secondary.type === 'button' ? (
        <button onClick={secondary.onClick} className={secondaryClasses}>
          <span className="relative z-10">{secondary.label}</span>
        </button>
      ) : (
        <Link href={secondary.href} className={secondaryClasses}>
          <span className="relative z-10">{secondary.label}</span>
        </Link>
      )}
    </div>
  );
}
