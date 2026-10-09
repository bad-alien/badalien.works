import { track } from '@vercel/analytics';
import { reportGoogleAdsConversion } from '@/lib/googleAds';

// Conversion funnel events (Vercel Web Analytics custom events).
// Keep to one flat property per event: property count is plan-limited and
// values must be strings/numbers/booleans under 255 chars.
export type ConversionEvent =
  | 'Hero Prompt Clicked'
  | 'Chat Opened'
  | 'Audit Started'
  | 'Audit Completed'
  | 'Book Call Clicked'
  | 'Reach Out Clicked'
  | 'Reach Out Sent'
  | 'Call Booked'
  | 'Contact Form Sent';

export function trackConversion(
  event: ConversionEvent,
  data?: Record<string, string | number | boolean>
): void {
  try {
    track(event, data);
  } catch {
    // Analytics must never break the UI
  }
  try {
    reportGoogleAdsConversion(event);
  } catch {
    // Same rule for the ad tag
  }
}
