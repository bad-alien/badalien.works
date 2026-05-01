'use client';

import { useState, useEffect, useCallback } from 'react';

const SESSION_KEY = 'bw_nudge_shown';
const DWELL_MS = 15_000;
const SCROLL_THRESHOLD = 0.4;
const AUTO_DISMISS_MS = 6_000;

export function useNudge() {
  const [showNudge, setShowNudge] = useState(false);

  const triggerNudge = useCallback(() => {
    if (typeof sessionStorage === 'undefined') return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    setShowNudge(true);
  }, []);

  const dismiss = useCallback(() => {
    setShowNudge(false);
  }, []);

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    let fired = false;

    const fire = () => {
      if (fired) return;
      fired = true;
      clearTimeout(dwellTimer);
      window.removeEventListener('scroll', onScroll);
      triggerNudge();
    };

    const dwellTimer = setTimeout(fire, DWELL_MS);

    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
      if (scrolled >= SCROLL_THRESHOLD) {
        fire();
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(dwellTimer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [triggerNudge]);

  useEffect(() => {
    if (!showNudge) return;
    const timer = setTimeout(() => setShowNudge(false), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [showNudge]);

  return { showNudge, dismiss };
}
