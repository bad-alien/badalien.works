import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // Skip middleware for static assets (files with extensions in /assets, /fonts, /logos, etc.)
  // These should be served directly without path rewriting
  const isStaticAsset = /\.(png|jpg|jpeg|gif|svg|ico|webp|mp4|webm|mp3|wav|pdf|woff|woff2|ttf|otf|eot|json|lottie|css|js)$/i.test(pathname);
  if (isStaticAsset) {
    return NextResponse.next();
  }

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

  // Scenario 1: Accessing Subdomains
  if (currentHost === 'void') {
    url.pathname = `/void${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (currentHost === 'decoded') {
    url.pathname = `/decoded${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Scenario 2: Prevent direct access to sub-paths from main domain (production only)
  // In development, allow direct path access for easier testing
  if (process.env.NODE_ENV !== 'development') {
    if (url.pathname.startsWith('/void') || url.pathname.startsWith('/decoded')) {
      const targetSubdomain = url.pathname.startsWith('/void') ? 'void' : 'decoded';
      const cleanPath = url.pathname.replace(`/${targetSubdomain}`, '') || '/';
      const protocol = request.headers.get('x-forwarded-proto') || 'https';
      return NextResponse.redirect(`${protocol}://${targetSubdomain}.${rootDomain}${cleanPath}`, 301);
    }
  }

  // Scenario 3: Redirect /tech to /services (permanent redirect for renamed route)
  if (url.pathname === '/tech' || url.pathname.startsWith('/tech/')) {
    url.pathname = url.pathname.replace('/tech', '/services');
    return NextResponse.redirect(url, 301);
  }

  // Scenario 4: Main Domain - no rewrite needed
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
