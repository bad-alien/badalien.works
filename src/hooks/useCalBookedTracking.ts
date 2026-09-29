'use client';

import { useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { trackConversion } from '@/lib/analytics';

// Fires 'Call Booked' when a Cal.com embed (inline or modal) confirms a booking.
// The listener is removed on unmount so remounts don't double-count.
export function useCalBookedTracking(source: 'contact' | 'chat') {
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const cal = await getCalApi({});
      if (cancelled) return;
      const callback = () => trackConversion('Call Booked', { source });
      cal('on', { action: 'bookingSuccessfulV2', callback });
      cleanup = () => cal('off', { action: 'bookingSuccessfulV2', callback });
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [source]);
}
