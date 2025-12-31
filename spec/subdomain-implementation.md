# Specification: Subdomain Implementation

## Overview
This document outlines the architectural strategy for implementing subdomains in the `badalien.works` project. The system is a hybrid deployment:

1.  **Vercel** — Hosts the Next.js application (Portfolio + Void Interface).
2.  **Unraid (Self-Hosted)** — Hosts private services via reverse proxy.

## 1. Domain Mapping Strategy

### A. Vercel-Hosted (Next.js Application)
| Domain | Route Group | Purpose |
|--------|-------------|---------|
| `badalien.works` | `(site)` | Main Portfolio: Home, Creative, Tech, Contact |
| `void.badalien.works` | `(void)` | The Void AI Interface |

### B. Unraid Self-Hosted Services (External to Next.js)
| Domain | Service |
|--------|---------|
| `obsidian.badalien.works` | Obsidian Sync/Publish |
| `plex.badalien.works` | Plex Media Server |
| `*.badalien.works` | Future self-hosted services |

## 2. DNS Configuration

DNS uses a **specific + wildcard** strategy. Specific records override the wildcard.

### DNS Records Table

| Record | Type | Value | Target System | Notes |
|--------|------|-------|---------------|-------|
| `badalien.works` | A | `76.76.21.21` | Vercel | Root domain (Apex) |
| `void.badalien.works` | CNAME | `cname.vercel-dns.com` | Vercel | Explicit subdomain |
| `*.badalien.works` | A | `[YOUR_HOME_IP]` | Unraid | Wildcard catch-all |

### Key Concepts
- **Vercel Routes:** `badalien.works` and `void.badalien.works` are explicitly handled by Vercel.
- **Unraid Catch-all:** Any *other* subdomain (e.g., `plex`, `random`) falls through to the wildcard A record pointing to the Unraid server.

## 3. Next.js Implementation Plan

### A. Folder Structure Restructuring
We will use **Route Groups** to separate the layouts and logic for the two Vercel-hosted domains.

**Current:**
```text
src/app/
├── layout.tsx
├── page.tsx
├── creative/
├── tech/
└── void/
```

**Target:**
```text
src/app/
├── (site)/             # Group for main domain (badalien.works)
│   ├── layout.tsx      # Main site layout (Nav, Footer)
│   ├── page.tsx        # Main landing page
│   ├── creative/
│   ├── tech/
│   └── contact/
├── (void)/             # Group for void subdomain (void.badalien.works)
│   ├── layout.tsx      # Specialized Void layout (minimal/terminal style)
│   └── void/           # The actual page content
│       └── page.tsx
└── api/                # Shared API routes (accessible by both)
```
*Note: The `void` directory inside `(void)` is necessary because the middleware will rewrite `void.badalien.works` -> `/void`.*

### B. Middleware Configuration (`src/middleware.ts`)

The middleware is the traffic cop. It inspects the `hostname` and rewrites the URL to the correct folder.

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Configuration
  const rootDomain = 'badalien.works'; // Replace with env var if needed
  
  // Normalize hostname (handle localhost and root domain)
  // detailed check to safely extract subdomain
  let currentHost = hostname;
  if (process.env.NODE_ENV === 'development') {
    // remove .localhost:3000 or similar
    currentHost = currentHost.replace('.localhost:3000', ''); 
  } else {
    // remove .badalien.works
    currentHost = currentHost.replace(`.${rootDomain}`, ''); 
  }
  
  // handle root domain case where replace might leave original if no match
  if (currentHost === rootDomain || currentHost === 'localhost:3000') {
    currentHost = 'main'; // Internal label for root
  }

  // Scenario 1: Accessing the Void Subdomain
  if (currentHost === 'void') {
    // Rewrite traffic to /void internally
    // User sees: void.badalien.works
    // Server renders: src/app/(void)/void/page.tsx
    url.pathname = `/void${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Scenario 2: Prevent direct access to /void from main domain
  // We want to force users to use void.badalien.works
  if (url.pathname.startsWith('/void')) {
     const protocol = request.headers.get('x-forwarded-proto') || 'https';
     return NextResponse.redirect(`${protocol}://void.${rootDomain}`, 301);
  }

  // Scenario 3: Main Domain
  // No rewrite needed, Next.js handles (site) group automatically if configured or 
  // we might need to verify if we want to explicitly rewrite to (site)?
  // Actually, standard Next.js behavior with Route Groups:
  // If we don't rewrite, it tries to match URL path to file system.
  // /creative -> src/app/(site)/creative/page.tsx works? 
  // Yes, Route groups are transparent to URL path.
  // So NO specific rewrite is needed for "main", just let it fall through.

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
```

### C. Component Updates
1.  **Navigation Links:** Update `Link` components to use absolute URLs when crossing domains.
    - `href="https://void.badalien.works"` instead of `/void`.
2.  **Asset Handling:** Ensure shared assets (fonts, images) in `public/` are accessible to both domains.

## 4. Unraid Reverse Proxy Setup (Reference)

This is managed outside the codebase but crucial for the complete picture.

1.  **Tool:** Nginx Proxy Manager (NPM) on Unraid.
2.  **Router:** Port forward 80 & 443 -> Unraid IP.
3.  **NPM Configuration:**
    - Create Proxy Host: `*.badalien.works` (or specific subdomains like `obsidian`).
    - Destination: Internal Container IP & Port.
    - SSL: Let's Encrypt (Wildcard or per-subdomain).

## 5. Implementation Checklist

1.  [ ] **Backup**: Commit current state.
2.  [ ] **Restructure**:
    - Create `src/app/(site)` and move main pages there.
    - Create `src/app/(void)` and move void pages there.
    - Ensure `layout.tsx` files are correctly placed/duplicated/split.
3.  [ ] **Middleware**: Create `src/middleware.ts` with the logic above.
4.  [ ] **Testing (Local)**:
    - Update `/etc/hosts`: `127.0.0.1 void.localhost`
    - Verify `localhost:3000` loads main site.
    - Verify `void.localhost:3000` loads Void site.
5.  [ ] **Cleanup**: Remove old redirects or unused files.
6.  [ ] **Deploy**: Push to Vercel and configure domains in Vercel project settings.
