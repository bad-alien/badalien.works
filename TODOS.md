# TODOS

## TODO #1: Full DESIGN.md application (fonts, colors, tokens, anti-slop)

**What:** Complete design system application across all pages:
- **Fonts:** Replace Science Gothic/Gemunu Libre with Outfit/Instrument Sans/Geist Mono. Replace all inline `fontFamily` styles with Tailwind utility classes.
- **Colors:** Background #000000 → #0A0A0A. Content cards: replace `bg-white/5 backdrop-blur-sm` with solid `bg-[#161616] border-[#2A2A2A]`. Keep glassmorphism ONLY on overlays (scrolled header, mobile menu, chat widget, chat input). Form containers: `bg-[#1E1E1E]`. Body text: `text-[#C5C5C5]`. Headings: `text-[#F0F0F0]`.
- **Spacing:** Standardize section padding to 64px desktop / 40px mobile. Card padding: 24-32px. Card border-radius: 12px (`rounded-xl`).
- **Anti-slop:** Add Geist Mono section markers (`01 /`, `// consulting`, numbered steps). Add subtle grain texture on dark surfaces. Use thin rule lines as section dividers instead of uniform `border-white/10`. Apply secondary blue (#0284C7) for monospace labels and data highlights. Break up uniform 3-column card grids with varied layouts.
- **Homepage:** Wire scroll-down sections (ServicesPreview, WorkPreview, AboutPreview, CtaSection). Remove hardcoded inline cards. Add small positioning label above chat (`// AI CONSULTING & ENABLEMENT` in Geist Mono).
- **Placeholders:** Replace all bracket-placeholder text ("[Your Name]", "[Client reference placeholder]") with credible stand-ins or remove sections until real content arrives.
- **DESIGN.md update:** Add glassmorphism overlay pattern as a documented treatment (currently missing from the design system).

**Why:** DESIGN.md was created during this branch but almost nothing in the code matches it. The homepage is missing 60% of its planned scroll-down content. The site currently looks like every other dark-mode consulting template — DESIGN.md has strong anti-slop tools (Geist Mono markers, grain, rule lines, graffiti contrast) that would make it distinctive.

**Pros:** Single source of truth for design. Complete homepage. Anti-AI-slop visual identity. Cleaner code (no inline styles). All pages visually consistent. Glassmorphism reserved for where it creates real depth (overlays over content).

**Cons:** Touches many files (site-wide). Requires visual QA after the change to verify nothing breaks. Largest single TODO.

**Context:** DESIGN.md specifies: Outfit (display), Instrument Sans (body), Geist Mono (labels/code). Card style decision: solid surfaces (#161616) for content, glassmorphism for floating overlays only. Four scroll components exist in `src/components/home/` but aren't imported by `src/app/(site)/page.tsx`. The inline hardcoded "What I Do" cards on the homepage duplicate `src/data/services.ts` data. 9 content card instances need solid surface swap. 4 overlay instances keep glassmorphism. Proven /consult conversion structure (Hero→Problem→Solution→Proof→CTA) stays, differentiated visually via DESIGN.md vocabulary.

**Depends on:** Nothing.

---

## TODO #2: Extract shared DualCta component

**What:** Create `src/components/shared/DualCta.tsx` that encapsulates the "Talk to My AI" + "Book a Call" button pair. Replace all 5 instances: ConsultHero, ConsultCta, AboutPage CTA section, CtaSection, homepage.

**Why:** DRY violation — the same CTA pattern is copy-pasted with slightly different styling in 5 files. A single style change (font, color, padding) requires editing 5 components.

**Pros:** One source of truth for primary conversion buttons. Future style changes are single-file edits.

**Cons:** Adds one new shared component file.

**Context:** Each current instance has different padding, border-radius, hover effects, and font-family inline styles. The component should accept props for: primary/secondary label text, primary onClick handler (chat open vs scroll), secondary href (contact page), optional size/variant. Build with the final DESIGN.md fonts from TODO #1.

**Depends on:** TODO #1 (font alignment) — build DualCta with the final fonts, not the ones being replaced.

---

## TODO #4: Fix eng review findings (small fixes bundle)

**What:** Five small fixes from the engineering review:
- (a) Escape `name` and `company` in contact API email subject line + add regex email validation
- (b) Remove redundant "Contact" link from Header mobile menu (keep "Book a Call" only)
- (c) Replace ConsultHero custom nav with `<Header variant="minimal" />`
- (d) Fix ChatMessage deprecated `inline` prop for react-markdown code blocks
- (e) Unmount HeroSection overlay after animation `phase === 'complete'`

**Why:** Security hardening (a), DRY/UX cleanup (b, c), deprecated API fix (d), performance (e). Each is 1-10 lines of code.

**Pros:** Eliminates all agreed-upon review findings. Zero risk — each fix is isolated and small.

**Cons:** None.

**Context:** Issue (a): `route.ts:73` uses raw `${name}` in subject — apply `escapeHtml()` and add `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` email validation. Issue (b): Header.tsx lines 150-162 have "Contact" linking to /contact, same as "Book a Call" above it. Issue (c): ConsultHero.tsx has its own `<nav>` that duplicates Header's styling — Header already supports `variant="minimal"`. Issue (d): ChatMessage.tsx:46 uses `({inline, ...props}: any)` — switch to checking if parent is `<pre>`. Issue (e): HeroSection.tsx keeps a z-[100] overlay in the DOM after it fades to opacity:0 — conditionally render null when `phase === 'complete'`.

**Depends on:** Nothing.

---

## TODO #5: Add sessionStorage animation skip for return visitors

**What:** Check `sessionStorage` for an `animation_seen` flag in HeroSection. First visit in a session: full logo animation. Return visits: skip directly to resolved state (header visible, chat ready). Set the flag after animation completes.

**Why:** 4 seconds of unskippable animation on every homepage visit creates friction for return visitors — your warmest leads. A consulting conversion site should get repeat visitors to the chat as fast as possible.

**Pros:** Faster experience for returning visitors while preserving the brand moment for first impressions. Cross-session visits still see the animation (sessionStorage clears on tab close).

**Cons:** Adds ~10 lines of state logic to HeroSection.

**Context:** The animation phases are: animating (2s) → resolved (0.9s) → transitioning (1s) → complete. With sessionStorage skip, return visitors go straight to `phase === 'complete'` with header visible and chat ready. Use `sessionStorage` (not `localStorage`) so new browser sessions still get the brand moment.

**Depends on:** TODO #4e (overlay unmount should be done first).

---

## TODO #6: Accessibility pass (focus ring, skip link, ARIA landmarks)

**What:** Add a global `focus-visible` outline style using #FF6B35 in globals.css. Add a visually-hidden skip-to-content link in Header. Add ARIA landmarks to major page sections. Ensure chat quick action chips are keyboard-navigable.

**Why:** Keyboard users (including power users and all screen reader users) currently can't see where their focus is on the site. No skip link means tabbing through the entire nav on every page.

**Pros:** WCAG AA compliance for keyboard navigation. Better experience for power users who navigate by keyboard.

**Cons:** Adds ~20 lines across globals.css and Header.

**Context:** DESIGN.md already has contrast ratios figured out (#C5C5C5 body on #0A0A0A is well above AA). The main gaps are interactive/keyboard a11y: no focus ring, no skip link, no ARIA landmarks on sections, chat quick action chips not in tab order. The focus ring should use the primary orange (#FF6B35) for brand consistency.

**Depends on:** Nothing.

---

## Completed

### TODO #3: Add Vitest and write unit tests for chatResponses + contact API
**Completed:** v0.1.0.0 (2026-03-19)
Bootstrapped Vitest + Testing Library + Playwright. 31 tests across 5 files covering chatResponses keyword matching, HTML escaping, middleware routing, contact API validation/send/error paths, and ChatContext. CI workflow added.
