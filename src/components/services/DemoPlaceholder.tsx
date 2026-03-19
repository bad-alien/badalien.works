'use client';

interface DemoPlaceholderProps {
  type?: 'placeholder' | 'image' | 'video' | 'embed';
  className?: string;
}

export default function DemoPlaceholder({ type = 'placeholder', className = '' }: DemoPlaceholderProps) {
  return (
    <div
      className={`relative w-full aspect-video rounded-xl bg-surface border border-border overflow-hidden flex items-center justify-center ${className}`}
      aria-label="Demo preview placeholder"
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Corner accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/20" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-white/20" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/20" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/20" />

      <div className="relative flex flex-col items-center gap-3 select-none">
        <div className="w-8 h-px bg-white/20" />
        <span className="text-xs font-mono tracking-[0.08em] text-secondary/40 uppercase">
          {type === 'placeholder' ? 'Demo coming soon' : 'Preview unavailable'}
        </span>
        <div className="w-8 h-px bg-white/20" />
      </div>
    </div>
  );
}
