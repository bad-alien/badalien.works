# Design System — Bad Alien

## Product Context
- **What this is:** Personal portfolio and AI consulting site — a hybrid that sells consulting services while showcasing creative/technical work
- **Who it's for:** Product teams, CTOs, and business leaders looking for AI consulting; also creative/tech peers evaluating capabilities
- **Space/industry:** AI consulting, creative technology, full-stack development
- **Project type:** Multi-subdomain Next.js site (main consulting site + decoded + void + creative subdomains)

## Aesthetic Direction
- **Direction:** Industrial/Retro-Futuristic hybrid — the "technical operator" look
- **Decoration level:** Intentional — subtle grain texture on dark surfaces, thin rule lines as section dividers, graffiti logo and hand-drawn section titles as the main expressive elements
- **Mood:** Dark, structured, data-informed. The graffiti branding (logo, section title PNGs like "BlackBox Decoded") provides explosive creative contrast against an otherwise precise, engineered backdrop. The site should feel like it was built by someone who ships AI systems, not someone who makes decks about them.
- **Key principle:** The bigger the gap between the raw, expressive graffiti elements and the precise, refined typography — the more impactful both become. The clean font is the canvas; the graffiti is the paint.

## Typography
- **Display/Hero:** Outfit (Google Fonts) — warm geometric with soft terminals. Approachable but never casual. Stays out of the way so graffiti brand elements carry the personality. Variable font (100-900 weights).
- **Body:** Instrument Sans (Google Fonts) — clean, modern, excellent readability at small sizes. Slightly humanist warmth keeps it from feeling cold.
- **UI/Labels:** Instrument Sans (same as body)
- **Data/Tables:** Geist Mono (Google Fonts) — Vercel's monospace. Signals "I live in the terminal." Perfect tabular numbers for data displays. Also used for code snippets, metadata labels, badges, and section markers (e.g., `01 /`, `// consulting`).
- **Code:** Geist Mono
- **Loading:** Google Fonts CDN
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  ```
- **Scale:**
  - Hero: 48-80px (clamp), weight 700-800, letter-spacing -0.02em
  - H1: 36-44px, weight 700
  - H2: 28-32px, weight 600
  - H3: 20-24px, weight 600
  - Body: 16px, weight 400, line-height 1.6
  - Small: 14px
  - Caption: 12px
  - Mono labels: 11-13px, weight 500, letter-spacing 0.08em, uppercase

## Color
- **Approach:** Restrained — one bold accent (orange), one technical accent (deep sky blue), warm neutrals on black
- **Primary:** #FF6B35 — orange. Distinctive, energetic, not AI-slop purple. Used for CTAs, links, active states, and primary brand moments.
- **Primary light:** #FF8C5A — hover/lighter variant
- **Primary dark:** #E05A2A — pressed/darker variant
- **Secondary:** #0284C7 — deep sky blue. Professional, grounded. Used for monospace labels, data highlights, section markers, and secondary interactive elements.
- **Secondary light:** #0EA5E9 — hover variant
- **Secondary dark:** #016A9F — pressed variant
- **Neutrals (dark mode):**
  - Base: #0A0A0A (page background)
  - Surface: #161616 (cards, panels)
  - Elevated: #1E1E1E (modals, elevated cards, input backgrounds)
  - Border: #2A2A2A
  - Muted: #3A3A3A (placeholder text, disabled states)
  - Secondary text: #8A8A8A (descriptions, metadata)
  - Body text: #C5C5C5 (primary readable text)
  - Heading text: #F0F0F0 (headings, emphasis)
  - Bright: #FFFFFF (hero text, high emphasis)
- **Semantic:**
  - Success: #22C55E
  - Warning: #F59E0B
  - Error: #EF4444
  - Info: #3B82F6
- **Dark mode:** This IS the dark mode. The site is dark-first. If a light mode is ever added: invert surfaces (base → #F5F5F5, surface → #FFFFFF), flip text colors, reduce accent saturation 10-20%.

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable — generous padding for consulting pages (breathable, premium feel), tighter for data-dense portfolio sections
- **Scale:** 2xs(2px) xs(4px) sm(8px) md(16px) lg(24px) xl(32px) 2xl(48px) 3xl(64px) 4xl(96px)
- **Section padding:** 64px vertical (desktop), 40px (mobile)
- **Card padding:** 24-32px
- **Component gaps:** 8-16px between related elements, 24-32px between groups

## Layout
- **Approach:** Hybrid — grid-disciplined for consulting/services pages (trust, clarity), creative-editorial for portfolio/about (personality, visual interest)
- **Grid:** 12 columns on desktop (1440px), 8 columns on tablet (768px), 4 columns on mobile (375px)
- **Max content width:** 1200px (1400px for full-bleed sections)
- **Border radius:**
  - sm: 4px (chips, badges)
  - md: 8px (buttons, inputs)
  - lg: 12px (cards, panels)
  - xl: 16px (modals, large cards)
  - full: 9999px (pills, avatars)

## Motion
- **Approach:** Intentional — animations aid comprehension and add personality, but always have visible fallbacks
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50-100ms) short(150-250ms) medium(250-400ms) long(400-700ms)
- **Critical rules:**
  - All `whileInView` animations MUST use `once: true` to prevent re-triggering
  - All animated elements MUST have a CSS fallback that shows content even if JS/animation fails (never leave elements at `opacity: 0` permanently)
  - Use `amount: 0.3` threshold for viewport-triggered reveals (don't require full visibility)
  - `prefers-reduced-motion: reduce` should disable decorative animations but keep functional transitions
  - The graffiti logo animation on the homepage is the signature moment — give it room to breathe

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-03-19 | Initial design system created | Created by /design-consultation based on existing codebase audit, QA findings (invisible content due to insufficient contrast), and graffiti brand identity from decoded subdomain |
| 2025-03-19 | Outfit over Clash Grotesk, Satoshi, Space Grotesk, General Sans | Warm precision — soft terminals, approachable but professional. Stays out of the way so graffiti brand elements carry personality. Selected after two rounds of visual comparison (8 total candidates). |
| 2025-03-19 | Deep Sky #0284C7 over Electric Teal #00D4AA | Teal pulled slightly "gamer" which could fight consulting credibility. Deep Sky is professional, grounded, and lets orange be the undisputed primary. |
| 2025-03-19 | Body text #C5C5C5, headings #F0F0F0 | QA revealed content vanishing into the dark background. These values provide WCAG AA+ contrast while maintaining the dark aesthetic. |
| 2025-03-19 | Geist Mono for labels and metadata (not just code) | Monospace accents in UI (section markers like "01 /", tags, badges) reinforce the "I build things" identity. Creative risk that adds unique texture. |
