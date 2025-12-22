import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Configuration
  const rootDomain = process.env.ROOT_DOMAIN || 'badalien.works';

  // Extract subdomain
  let currentHost = hostname;

  if (process.env.NODE_ENV === 'development') {
    // Handle localhost development
    // Supports: void.localhost:3001, localhost:3001
    currentHost = currentHost.replace('.localhost:3001', '').replace('.localhost:3000', '');

    if (currentHost === 'localhost:3001' || currentHost === 'localhost:3000' || currentHost === '127.0.0.1:3001') {
      currentHost = 'main';
    }
  } else {
    // Production: remove .badalien.works
    currentHost = currentHost.replace(`.${rootDomain}`, '');

    if (currentHost === rootDomain) {
      currentHost = 'main';
    }
  }

  // Scenario 1: Accessing the Void Subdomain (void.badalien.works or void.localhost:3001)
  if (currentHost === 'void') {
    // Rewrite traffic to /void internally
    // User sees: void.badalien.works
    // Server renders: src/app/(void)/void/page.tsx
    url.pathname = `/void${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Scenario 2: Prevent direct access to /void from main domain
  // Force users to use void.badalien.works
  if (url.pathname.startsWith('/void')) {
    if (process.env.NODE_ENV === 'development') {
      // In development, redirect to void.localhost:3001
      return NextResponse.redirect(new URL(`http://void.localhost:3001${url.pathname.replace('/void', '') || '/'}`, request.url), 301);
    } else {
      // In production, redirect to void.badalien.works
      const protocol = request.headers.get('x-forwarded-proto') || 'https';
      return NextResponse.redirect(`${protocol}://void.${rootDomain}${url.pathname.replace('/void', '') || '/'}`, 301);
    }
  }

  // Scenario 3: Main Domain - no rewrite needed
  // Route groups are transparent to URL path
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)',
  ],
};
