import { describe, it, expect } from 'vitest'

// Extracted from src/app/api/contact/route.ts for testing
function escapeHtml(text: string): string {
  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return text.replace(/[&<>"'/]/g, (char) => htmlEntities[char])
}

describe('escapeHtml', () => {
  it('escapes ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })

  it('escapes angle brackets', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
    )
  })

  it('escapes quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;')
    expect(escapeHtml("it's")).toBe('it&#x27;s')
  })

  it('escapes forward slashes', () => {
    expect(escapeHtml('a/b')).toBe('a&#x2F;b')
  })

  it('returns plain text unchanged', () => {
    expect(escapeHtml('hello world')).toBe('hello world')
  })

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('')
  })

  it('escapes multiple entities in one string', () => {
    expect(escapeHtml('<b>"Hi" & \'Bye\'</b>')).toBe(
      '&lt;b&gt;&quot;Hi&quot; &amp; &#x27;Bye&#x27;&lt;&#x2F;b&gt;'
    )
  })
})
