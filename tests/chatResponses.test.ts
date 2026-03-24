import { describe, it, expect } from 'vitest'
import { getScriptedResponse } from '@/components/chat/chatResponses'

describe('getScriptedResponse', () => {
  it('returns services response for service-related keywords', () => {
    const response = getScriptedResponse('what services do you offer?')
    expect(response).toContain('AI Strategy & Implementation')
    expect(response).toContain('AI-Powered Automation')
    expect(response).toContain('Technical Enablement')
  })

  it('returns pricing response for cost-related keywords', () => {
    const response = getScriptedResponse('how much does it cost?')
    expect(response).toContain('$200/hour')
    expect(response).toContain('Fixed-price quotes')
  })

  it('returns greeting response for hello', () => {
    const response = getScriptedResponse('hello')
    expect(response).toContain('How I help')
    expect(response).toContain('Pricing')
    expect(response).toContain('Background')
  })

  it('is case-insensitive', () => {
    const lower = getScriptedResponse('pricing')
    const upper = getScriptedResponse('PRICING')
    expect(lower).toBe(upper)
  })

  it('trims whitespace from input', () => {
    const trimmed = getScriptedResponse('pricing')
    const padded = getScriptedResponse('  pricing  ')
    expect(trimmed).toBe(padded)
  })

  it('returns fallback for unrecognized input', () => {
    const response = getScriptedResponse('xyzzy quantum flux capacitor')
    expect(response).toContain('Book a free 15-minute consult')
    expect(response).toContain('point you in the right direction')
  })

  it('matches automation keywords', () => {
    const response = getScriptedResponse('tell me about automation')
    expect(response).toContain('intelligent automation systems')
  })

  it('matches training keywords', () => {
    const response = getScriptedResponse('do you offer training workshops?')
    expect(response).toContain('hands-on workshops')
  })

  it('matches first keyword group when multiple match', () => {
    // "services" appears before "pricing" in the response list
    const response = getScriptedResponse('what services and pricing do you have?')
    expect(response).toContain('AI Strategy & Implementation')
  })
})
