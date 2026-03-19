# BadAlien.Works

Personal portfolio and AI consulting showcase — multi-subdomain Next.js site with animation-heavy UI, photography gallery, data visualizations, and an AI chat interface.

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/bad-alien/badalien.works.git
   cd badalien.works
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev   # Runs on http://localhost:3001
   ```

4. Run tests:
   ```bash
   npm test          # Unit/integration tests (Vitest)
   npm run test:e2e  # E2E tests (Playwright)
   ```

## Project Structure

```
badalien.works/
├── src/
│   ├── app/           # Next.js App Router pages and API routes
│   │   ├── (site)/    # Main domain route group
│   │   ├── (decoded)/ # decoded subdomain
│   │   ├── (void)/    # void subdomain
│   │   └── api/       # API routes (contact, chat)
│   ├── components/    # React components (shared, home, consulting, chat, services)
│   ├── contexts/      # React context providers (ChatContext)
│   ├── hooks/         # Custom hooks
│   └── data/          # Static data (services)
├── tests/             # Vitest unit/integration tests
├── e2e/               # Playwright E2E tests
├── public/            # Static assets (logos, fonts)
└── spec/              # Design specs and feature documents
```

## Technology Stack

- [Next.js 15](https://nextjs.org/) — React 19, App Router
- [TypeScript 5](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) — Utility-first styling
- [Framer Motion](https://www.framer.com/motion/) / GSAP / Lottie — Animation
- [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) — Testing
- [Resend](https://resend.com/) — Contact form email delivery

## Documentation

- [DESIGN.md](DESIGN.md) — Design system (fonts, colors, spacing, aesthetic direction)
- [TESTING.md](TESTING.md) — Test framework setup, conventions, and philosophy
- [CHANGELOG.md](CHANGELOG.md) — Release history
- [TODOS.md](TODOS.md) — Tracked work items
- [CLAUDE.md](CLAUDE.md) — AI assistant project instructions

## Contact

For questions or collaboration, reach out through:
- GitHub: [@bad-alien](https://github.com/bad-alien)
