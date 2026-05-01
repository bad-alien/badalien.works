'use client';

import { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

interface AuditCTAsProps {
  onBookCall: () => void;
  onTellGoodTime: () => void;
}

interface CtaCardProps {
  title: string;
  sub: string;
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}

function CtaCard({ title, sub, icon, onClick, ariaLabel }: CtaCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="group w-full flex items-center gap-3 text-left transition-all duration-150"
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 107, 53, 0.12), rgba(255, 107, 53, 0.04))',
        border: '1px solid rgba(255, 107, 53, 0.25)',
        borderRadius: '12px',
        padding: '14px 16px',
      }}
    >
      <span
        className="inline-flex items-center justify-center shrink-0"
        style={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          background: 'rgba(255, 107, 53, 0.15)',
          color: '#FF6B35',
        }}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0 flex flex-col leading-tight">
        <span
          className="text-[13px] font-semibold truncate"
          style={{
            color: '#F0F0F0',
            fontFamily: 'var(--font-outfit, "Outfit", sans-serif)',
          }}
        >
          {title}
        </span>
        <span
          className="text-xs"
          style={{
            color: '#8A8A8A',
            fontFamily: 'var(--font-instrument-sans, "Instrument Sans", sans-serif)',
          }}
        >
          {sub}
        </span>
      </span>
      <ChevronRight
        className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
        style={{ color: '#FF6B35' }}
      />
    </button>
  );
}

export default function AuditCTAs({ onBookCall, onTellGoodTime }: AuditCTAsProps) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({});
      cal('ui', {
        theme: 'dark',
        cssVarsPerTheme: {
          light: { 'cal-brand': '#FF6B35' },
          dark: { 'cal-brand': '#FF6B35' },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  const handleBookCall = async () => {
    const cal = await getCalApi({});
    cal('modal', { calLink: 'bad-alien/free-consult' });
    onBookCall();
  };

  return (
    <div className="flex flex-col gap-2.5 mt-3">
      <CtaCard
        title="Book a free 15-min intro call"
        sub="See if we're a fit — no pitch"
        icon={<Calendar className="w-4 h-4" strokeWidth={2.25} />}
        onClick={handleBookCall}
        ariaLabel="Book a free 15-minute intro call"
      />
      <CtaCard
        title="Tell me a good time"
        sub="I'll reach out at your convenience"
        icon={<Clock className="w-4 h-4" strokeWidth={2.25} />}
        onClick={onTellGoodTime}
        ariaLabel="Tell me a good time to reach you"
      />
    </div>
  );
}
