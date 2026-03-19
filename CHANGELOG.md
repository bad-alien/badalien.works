# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0.0] - 2026-03-19

### Added
- Consulting-focused homepage with AI chat interface, logo animation, and service previews
- Shared Header component with responsive navigation and mobile slide-out menu
- Shared Footer component with site links and social references
- About page with bio, experience highlights, and client work sections
- Consult landing page with hero, problem/solution narrative, proof section, and CTA
- Contact page redesign with company field, service interest selector, and Cal.com placeholder
- Business chat system: ChatContext, ChatWidget, BusinessChatInterface, scripted keyword-matching responses
- Chat widget (floating button) available on all site pages via ChatProvider
- XSS protection via escapeHtml for contact form submissions
- Lazy-initialized Resend client to prevent build-time crashes without API key
- prefers-reduced-motion CSS and noscript animation fallback for accessibility
- Standardized Framer Motion viewport amount (0.3) per DESIGN.md
- DESIGN.md design system document
- Test framework: Vitest + Testing Library + Playwright with CI workflow
- 31 unit/integration tests covering chat responses, HTML escaping, middleware routing, contact API, and ChatContext

### Changed
- Renamed /tech route to /services with 301 redirect in middleware
- Moved components from `components/tech/` to `components/services/`
- Replaced per-page headers with shared Header component
- Updated CLAUDE.md with testing commands and orchestration improvements
- Added priority to LCP logo image for performance
