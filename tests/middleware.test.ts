import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/server before importing middleware
vi.mock('next/server', () => {
  class MockNextResponse {
    static next() {
      return { type: 'next' }
    }
    static rewrite(url: URL) {
      return { type: 'rewrite', pathname: url.pathname }
    }
    static redirect(url: string | URL, status: number) {
      const pathname = typeof url === 'string' ? url : url.pathname
      return { type: 'redirect', url: pathname, status }
    }
  }

  return { NextResponse: MockNextResponse }
})

function createMockRequest(hostname: string, pathname: string) {
  const url = new URL(`http://${hostname}${pathname}`)
  return {
    nextUrl: url,
    headers: {
      get: (name: string) => {
        if (name === 'host') return hostname
        if (name === 'x-forwarded-proto') return 'https'
        return null
      },
    },
  }
}

describe('middleware routing logic', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('ROOT_DOMAIN', 'badalien.works')
  })

  it('skips static assets', async () => {
    const { middleware } = await import('@/middleware')
    const req = createMockRequest('localhost:3001', '/logo.png')
    const result = middleware(req as any) as any
    expect(result.type).toBe('next')
  })

  it('rewrites void subdomain to /void path in development', async () => {
    const { middleware } = await import('@/middleware')
    const req = createMockRequest('void.localhost:3001', '/')
    const result = middleware(req as any) as any
    expect(result.type).toBe('rewrite')
    expect(result.pathname).toBe('/void')
  })

  it('rewrites decoded subdomain to /decoded path in development', async () => {
    const { middleware } = await import('@/middleware')
    const req = createMockRequest('decoded.localhost:3001', '/')
    const result = middleware(req as any) as any
    expect(result.type).toBe('rewrite')
    expect(result.pathname).toBe('/decoded')
  })

  it('redirects /tech to /services', async () => {
    const { middleware } = await import('@/middleware')
    const req = createMockRequest('localhost:3001', '/tech')
    const result = middleware(req as any) as any
    expect(result.type).toBe('redirect')
    expect(result.status).toBe(301)
  })

  it('passes through main domain requests', async () => {
    const { middleware } = await import('@/middleware')
    const req = createMockRequest('localhost:3001', '/about')
    const result = middleware(req as any) as any
    expect(result.type).toBe('next')
  })
})
