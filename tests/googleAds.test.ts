import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const track = vi.fn()
vi.mock('@vercel/analytics', () => ({ track: (...args: unknown[]) => track(...args) }))

import { trackConversion } from '@/lib/analytics'
import {
  GOOGLE_ADS_ID,
  GOOGLE_ADS_CONVERSION_LABELS,
  GOOGLE_ADS_BOOTSTRAP,
  reportGoogleAdsConversion,
} from '@/lib/googleAds'

describe('Google Ads conversions', () => {
  const saved = { ...GOOGLE_ADS_CONVERSION_LABELS }
  const gtag = vi.fn()

  beforeEach(() => {
    track.mockClear()
    gtag.mockClear()
    window.gtag = gtag
  })

  afterEach(() => {
    Object.assign(GOOGLE_ADS_CONVERSION_LABELS, saved)
    delete window.gtag
  })

  it('reports a labelled event to Google Ads with the account send_to', () => {
    GOOGLE_ADS_CONVERSION_LABELS['Call Booked'] = 'abc123'
    reportGoogleAdsConversion('Call Booked')
    expect(gtag).toHaveBeenCalledWith('event', 'conversion', { send_to: `${GOOGLE_ADS_ID}/abc123` })
  })

  it('skips events without a label', () => {
    GOOGLE_ADS_CONVERSION_LABELS['Contact Form Sent'] = ''
    reportGoogleAdsConversion('Contact Form Sent')
    reportGoogleAdsConversion('Chat Opened')
    expect(gtag).not.toHaveBeenCalled()
  })

  it('does nothing when the tag is not loaded (previews, local, other subdomains)', () => {
    GOOGLE_ADS_CONVERSION_LABELS['Call Booked'] = 'abc123'
    delete window.gtag
    expect(() => reportGoogleAdsConversion('Call Booked')).not.toThrow()
  })

  it('trackConversion feeds both Vercel Analytics and Google Ads', () => {
    GOOGLE_ADS_CONVERSION_LABELS['Reach Out Sent'] = 'lead42'
    trackConversion('Reach Out Sent', { source: 'chat' })
    expect(track).toHaveBeenCalledWith('Reach Out Sent', { source: 'chat' })
    expect(gtag).toHaveBeenCalledWith('event', 'conversion', { send_to: `${GOOGLE_ADS_ID}/lead42` })
  })

  it('a failing ad tag never breaks the caller', () => {
    GOOGLE_ADS_CONVERSION_LABELS['Call Booked'] = 'abc123'
    gtag.mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => trackConversion('Call Booked')).not.toThrow()
    expect(track).toHaveBeenCalledWith('Call Booked', undefined)
  })

  it('turns off ad personalization before configuring the account', () => {
    const set = GOOGLE_ADS_BOOTSTRAP.indexOf("gtag('set', 'allow_ad_personalization_signals', false);")
    const config = GOOGLE_ADS_BOOTSTRAP.indexOf(`gtag('config', '${GOOGLE_ADS_ID}');`)
    expect(set).toBeGreaterThan(-1)
    expect(config).toBeGreaterThan(set)
  })
})
