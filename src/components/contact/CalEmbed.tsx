'use client';

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({});
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          light: { "cal-brand": "#FF6B35" },
          dark: { "cal-brand": "#FF6B35" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  // Cal.com's embed yanks the page on calendar/booking-form transitions via
  // (a) Element.scrollIntoView, (b) window.scrollTo/scrollBy from its
  // postMessage handler, and (c) the browser's native focus-scroll when the
  // iframe receives focus on click. JS-level scroll API patches don't catch
  // (c), so we additionally snapshot scrollY on focusin / cal-origin messages
  // and revert any scroll event that lands inside a short follow-up window.
  useEffect(() => {
    const root = document.getElementById('book');
    if (!root) return;

    const proto = Element.prototype;
    const originalScrollIntoView = proto.scrollIntoView;
    const originalScrollTo = window.scrollTo.bind(window);
    const originalScrollBy = window.scrollBy.bind(window);

    proto.scrollIntoView = function (this: Element, ...args: unknown[]) {
      if (root.contains(this)) return;
      return originalScrollIntoView.apply(
        this,
        args as Parameters<typeof originalScrollIntoView>
      );
    };

    let lockedY: number | null = null;
    let lockUntil = 0;
    const lock = () => {
      lockedY = window.scrollY;
      lockUntil = performance.now() + 600;
    };

    const onFocusIn = (e: FocusEvent) => {
      if (e.target instanceof Node && root.contains(e.target)) lock();
    };
    const onMessage = (e: MessageEvent) => {
      if (typeof e.origin === 'string' && e.origin.includes('cal.com')) lock();
    };
    const onScroll = () => {
      if (
        lockedY !== null &&
        performance.now() < lockUntil &&
        window.scrollY !== lockedY
      ) {
        originalScrollTo(0, lockedY);
      }
    };

    window.scrollTo = ((...args: unknown[]) => {
      if (performance.now() < lockUntil) return;
      return originalScrollTo(...(args as Parameters<typeof originalScrollTo>));
    }) as typeof window.scrollTo;
    window.scrollBy = ((...args: unknown[]) => {
      if (performance.now() < lockUntil) return;
      return originalScrollBy(...(args as Parameters<typeof originalScrollBy>));
    }) as typeof window.scrollBy;

    document.addEventListener('focusin', onFocusIn, true);
    window.addEventListener('message', onMessage, true);
    window.addEventListener('scroll', onScroll, true);

    return () => {
      proto.scrollIntoView = originalScrollIntoView;
      window.scrollTo = originalScrollTo;
      window.scrollBy = originalScrollBy;
      document.removeEventListener('focusin', onFocusIn, true);
      window.removeEventListener('message', onMessage, true);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, []);

  return (
    <div id="book" className="w-full">
      <Cal
        calLink="bad-alien/free-consult"
        style={{ width: "100%", overflow: "scroll" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
