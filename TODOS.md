# TODOS

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

## TODO #7: Re-add Cal.com calendar embed to /contact

**What:** Re-add the Cal.com calendar booking section to the /contact page once the Cal.com account is created and configured.

**Why:** Calendar booking is a key conversion path for leads who prefer scheduling directly over chat or email. The section was removed because the placeholder said "loading..." when nothing was loading — misleading for real visitors.

**Pros:** Direct booking reduces friction vs. back-and-forth emails. Cal.com free tier supports unlimited bookings with dark theme embed.

**Cons:** None — just needs the Cal.com account.

**Context:** The implementation was already built (`@calcom/embed-react`, dark theme, inline embed). It was removed during design review because the placeholder text was misleading. The embed code and component structure exist in git history (commit around `ef58b70`). Re-adding is a matter of: (1) creating Cal.com account, (2) getting the booking link, (3) uncommenting/re-adding the embed section with the real `calLink` prop.

**Depends on:** Owner creating Cal.com account and providing booking link (see `.claude/plans/content-needs.md`).

---

## Completed

### TODO #1: Full DESIGN.md application (fonts, colors, tokens, anti-slop)
**Completed:** 2026-03-19 (commits 28f5a55, ff2e29b, ef58b70)
Full design system applied across all pages: Outfit/Instrument Sans/Geist Mono fonts, design tokens in globals.css, solid surfaces for content cards, glassmorphism reserved for overlays, grain texture, Geist Mono section markers, rule line dividers.

### TODO #3: Add Vitest and write unit tests for chatResponses + contact API
**Completed:** v0.1.0.0 (2026-03-19)
Bootstrapped Vitest + Testing Library + Playwright. 31 tests across 5 files covering chatResponses keyword matching, HTML escaping, middleware routing, contact API validation/send/error paths, and ChatContext. CI workflow added.
