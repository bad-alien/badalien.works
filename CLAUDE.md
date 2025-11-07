# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Development Server
```bash
npm run dev
```
The dev server runs on `http://127.0.0.1:3001` (configured to use port 3001 instead of default 3000).

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Project Architecture

This is a **Next.js 15** portfolio/showcase site using the **App Router** pattern with **TypeScript** and **Tailwind CSS v4**.

### App Structure

The project uses Next.js file-based routing under `/src/app/`:

- **`page.tsx`** - Homepage with animated logo cycling (7 SVGs on 200ms intervals) and navigation reveal
- **`consult/page.tsx`** - Consulting services page with heavy Lottie animations, scroll effects, and gradient text
- **`layout.tsx`** - Root layout applying Gemunu Libre font (main brand font) and global metadata

Additional pages (`/creative`, `/about`) are linked but not yet implemented.

### Component Organization

**There is no dedicated `components/` directory.** All UI is currently built inline within page files. If you need to extract reusable components, create `/src/components/` and place them there.

### Animation System

The site is animation-heavy using two libraries:

- **`@lottiefiles/dotlottie-react`** - For `.lottie` format files (used for background animations)
- **`lottie-react`** - For `.json` format files (used for demo animations)

Animation files are located in `/public/animations/`:
- `background-animation.lottie` (554KB) - Full-screen background on consult page
- `demo-animation.json` (893KB) - Demo animation showcasing AI agents

**Common Animation Patterns:**
- Logo cycling: State-based with `setInterval` (200ms)
- Fade transitions: Tailwind `duration-1000` with `ease-in-out`
- Staggered reveals: Custom keyframes with animation delays
- Scroll effects: `useEffect` with scroll event listeners

### Styling

- **Tailwind CSS v4** is the primary styling system
- **Global CSS** in `src/app/globals.css` defines root variables and font configuration
- **Gemunu Libre** (Google Font, weights 200-800) is the brand font
- Some pages dynamically inject **Inter** font for specific sections
- Custom animations use inline `<style>` tags with keyframes

### TypeScript Configuration

- Path alias `@/*` maps to `./src/*` (configured but not heavily used yet)
- Strict mode enabled
- Target: ES2017

### State Management

All pages use local React state with `useState` and `useEffect`. No global state management library is used.

**Common State Patterns:**
- Animation cycling states (`currentLogo`, `keepCycling`)
- Navigation visibility (`showNav`)
- Scroll position tracking (`isScrolled`)
- Animation data loading (`demoAnimationData`)

### Asset Organization

```
/public/
  /logos/         - SVG logos (ba-logo-1.svg through ba-logo-7.svg)
  /animations/    - Lottie animation files
    /images/      - Animation frame assets
```

## Key Development Notes

1. **All pages are client components** - Both main pages use `'use client'` for interactivity
2. **Animation cleanup** - Always clean up intervals and scroll listeners in `useEffect` return functions
3. **Font loading** - Gemunu Libre is configured in layout.tsx; some pages load additional fonts dynamically
4. **Dev server port** - Uses 3001 by default (not 3000), bound to 127.0.0.1
5. **No backend** - This is a pure frontend application

## Brand Guidelines

- **Primary font:** Gemunu Libre
- **Site name:** "Bad Alien"
- **Color scheme:** Dark theme with gradient accents (yellow-green-blue gradients)
- **Animation style:** Smooth transitions, staggered reveals, continuous background animations
