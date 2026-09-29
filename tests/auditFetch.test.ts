import { describe, it, expect } from 'vitest'
import { htmlToText } from '@/lib/auditFetch'

describe('htmlToText', () => {
  it('keeps body copy and drops head, scripts, styles, nav, header, footer and comments', () => {
    const html = `<!doctype html><html><head><title>T</title><style>.a{}</style></head>
      <body><header>Menu</header><nav>Links</nav><!-- hidden -->
      <main><h1>Pasadena Dental</h1><p>We handle <b>patient records</b> &amp; billing.</p></main>
      <script>alert(1)</script><footer>(c)</footer></body></html>`
    expect(htmlToText(html)).toBe('Pasadena Dental We handle patient records & billing.')
  })

  it('does not treat <headline> as <head> or <header>', () => {
    expect(htmlToText('<headline>Keep me</headline>')).toBe('Keep me')
  })

  it('decodes named and numeric entities', () => {
    expect(htmlToText('<p>Tom&rsquo;s &lt;shop&gt; &#8212; &#x2713;</p>')).toBe('Tom’s <shop> — ✓')
  })

  it('handles unclosed blocks and stray angle brackets in linear time', () => {
    const hostile = '<script>'.repeat(50_000) + '<'.repeat(500_000) + '<!--'.repeat(50_000)
    const start = Date.now()
    htmlToText('<p>ok</p>' + hostile)
    expect(Date.now() - start).toBeLessThan(1000)
  })
})
