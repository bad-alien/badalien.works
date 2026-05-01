'use client';

import { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

interface AuditCTAsProps {
  onBookCall: () => void;
  onTellGoodTime: () => void;
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
    cal('modal', {
      calLink: 'bad-alien/free-consult',
    });
    onBookCall();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-4">
      <button
        onClick={handleBookCall}
        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-all duration-150 bg-[#FF6B35] text-white hover:bg-[#FF8C5A] active:bg-[#E05A2A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35]"
        aria-label="Book a call"
      >
        Book a call
        <span aria-hidden="true">→</span>
      </button>

      <button
        onClick={onTellGoodTime}
        className="flex-1 flex items-center justify-center px-5 py-3 rounded-lg font-medium text-sm transition-all duration-150 border border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/10 active:bg-[#FF6B35]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35]"
        aria-label="Tell me a good time to reach you"
      >
        Tell me a good time
      </button>
    </div>
  );
}
