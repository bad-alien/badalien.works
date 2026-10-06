# badalien.works

Personal portfolio and creative showcase — multi-subdomain Next.js site with animation-heavy UI, photography gallery, data visualizations, and an AI chat interface.

## Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript 5
- **Styling:** Tailwind CSS 4 (PostCSS, utility-first, custom design tokens in `globals.css`)
- **Animation:** Framer Motion, GSAP, Lottie
- **Data Viz:** Recharts, D3
- **Email:** Resend (contact form API route)
- **Linting:** ESLint 9 with Next.js config
- **Package manager:** npm

## Commands

```bash
npm run dev        # Dev server on port 3001
npm run build      # Production build
npm start          # Production server
npm run lint       # ESLint
npm test           # Run unit/integration tests (vitest)
npm run test:watch # Vitest in watch mode
npm run test:e2e   # Playwright e2e tests
```

## Conventions

- Source code in `src/`, static assets in `public/`
- App Router route groups: `(site)` (main domain), `(decoded)` (decoded subdomain), `(void)` (void subdomain)
- Subdomain routing handled by `src/middleware.ts`
- Components: PascalCase files, co-located per section (`src/components/{shared,creative,tech,void}/`, `src/app/(decoded)/decoded/components/`)
- Hooks: `src/hooks/use*.ts`
- API routes: `src/app/api/`
- Path alias: `@/*` → `./src/*`
- Tests in `tests/` (vitest) and `e2e/` (Playwright). See `TESTING.md` for conventions

### Git Commits

- Keep commit messages brief — one short sentence, no body unless essential
- Do **not** add `Co-Authored-By` or any attribution trailers
- Never `git reset --hard`, `git clean -fdx`, or force-push

### Deploys

- Vercel is connected to GitHub: every PR gets a preview URL, and merging to `main` deploys production (badalien.works, decoded., void.)
- Work on a branch and open a PR; never push to `main` directly. The owner reviews the preview and merges
- Run `npm test` and `npm run lint` before pushing. Do not run `npm run build` while `npm run dev` is running (both write `.next/`)

### Content rules

- Founder's public name is **Rasheed** — first name only, no surname anywhere (copy, schema, alt text, chat prompts). Business: "Bad Alien" (legal "Bad Alien LLC"). No street address
- Blog posts (`src/content/insights/*.mdx`): terse, roughly half a "thorough" draft; no "About the author" footer; booking CTAs link to `/contact` (Cal embed), not `/consult`
- No emojis in code, comments, or docs

## Design System

Always read DESIGN.md before making any visual or UI decisions. All font choices, colors, spacing, and aesthetic direction are defined there. Do not deviate without explicit user approval. In QA mode, flag any code that doesn't match DESIGN.md.
