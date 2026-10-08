import type { ConversionEvent } from '@/lib/analytics';

// Google Ads conversion tracking. The tag loads on main-domain pages in production
// only (see the (site) layout), with ad personalization off: it measures whether ad
// clicks turn into leads and builds no remarketing audiences. The privacy policy
// describes exactly this setup, so change both together.
export const GOOGLE_ADS_ID = 'AW-787933005';

// Conversion labels from Google Ads (Goals, Conversions, open the action, Tag setup):
// the part after the slash in its send_to value. An empty label leaves that event
// unreported to Google Ads; it still reaches Vercel Analytics.
export const GOOGLE_ADS_CONVERSION_LABELS: Partial<Record<ConversionEvent, string>> = {
  'Call Booked': 'cSLRCK_XiZYdEM3O2_cC',
  'Contact Form Sent': 'ZYhKCNjdg5YdEM3O2_cC',
  'Reach Out Sent': '',
};

// Inline bootstrap for the tag, equivalent to Google's snippet plus the
// personalization opt-out.
export const GOOGLE_ADS_BOOTSTRAP = [
  'window.dataLayer = window.dataLayer || [];',
  'function gtag(){dataLayer.push(arguments);}',
  "gtag('js', new Date());",
  "gtag('set', 'allow_ad_personalization_signals', false);",
  `gtag('config', '${GOOGLE_ADS_ID}');`,
].join('\n');

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function reportGoogleAdsConversion(event: ConversionEvent): void {
  const label = GOOGLE_ADS_CONVERSION_LABELS[event];
  if (!label || typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'conversion', { send_to: `${GOOGLE_ADS_ID}/${label}` });
}
