# 📜 Agent Instruction: Blackbox Decoded 2025 Foundation

## 🎯 Objective

Implement a high-performance, visually immersive interactive report titled **"Blackbox Decoded 2025"** within the current Next.js repository. The interface must be a **horizontal one-page scroller** that adopts the "dark mode" aesthetic and typography of the main site.

## 🏗 Architectural Requirements

- **Framework:** Next.js (App Router).
    
- **Path:** `/decoded/2025` (Internal name for the "Blackbox Decoded" experience).
    
- **Styling:** Tailwind CSS (consistent with global styles).
    
- **Motion:** Framer Motion (for entrance transitions and scroll progress).
    
- **Scrolling:** CSS Scroll Snapping (horizontal axis).
    
- **Data Strategy:** Static Site Generation (SSG) consuming a local JSON manifest.
    

## 📂 Targeted File Structure

Create the following structure within `src/app/decoded/2025/`:

Plaintext

```
src/app/decoded/2025/
├── page.tsx               # Main entry & Horizontal Snap Container
├── layout.tsx             # Specialized layout (to hide site-wide headers if needed)
├── components/            # Feature-specific components
│   ├── HorizontalSection.tsx  # Wrapper for individual "slides"
│   ├── ProgressBar.tsx        # Framer Motion horizontal scroll tracker
│   ├── InteractiveChart.tsx   # Recharts/Plotly wrapper for data visuals
│   └── AwardSlide.tsx         # Template for "Most Watched" awards
└── data/
    └── decoded_data.json      # Initial schema for development
```

## 🛠 Technical Implementation Details

### 1. The Horizontal Snap Engine

- The `main` container in `page.tsx` must utilize `flex overflow-x-auto snap-x snap-mandatory`.
    
- Scrollbars must be hidden while maintaining scroll functionality.
    
- Each `HorizontalSection` must be exactly `min-w-screen h-screen snap-center flex flex-col items-center justify-center`.
    

### 2. The Animation System (Framer Motion)

- **Reveal Logic:** Use `whileInView` with a viewport threshold (e.g., `0.5`) to trigger entrance animations.
    
- **Transition Styles:** Elements should "Fade Up" and posters should "Scale In" using high-stiffness spring physics for a premium feel.
    
- **Progress Tracking:** The `ProgressBar` must use `useScroll` from Framer Motion, mapping `scrollXProgress` to a fixed-position top bar.
    

### 3. Data & Visualization Strategy

- **JSON Ingestion:** The UI must map through an array in `data/decoded_data.json` to generate slides dynamically where possible.
    
- **Chart Placeholders:** Prepare `InteractiveChart.tsx` to handle library growth data (Area Chart) and server usage waves. Support both data-driven rendering (Recharts) and static SVG/Image fallbacks.
    
- **Image Optimization:** Use `next/image` for all movie posters and thumbnails. Maintain standard Plex ratios (2:3 for posters, 16:9 for backdrops).
    

## 🤖 Special Instructions for the Agent

1. **Analyze Styles First:** Before writing code, inspect `tailwind.config.js` and `src/app/globals.css`. Ensure all colors, fonts, and "Dark Vibe" gradients used in Blackbox Decoded are perfectly inherited from the existing site.
    
2. **Modularity:** Build `HorizontalSection` to be a generic wrapper. It should accept any React children so complex graphics can be dropped in later without refactoring.
    
3. **Performance:** Ensure the horizontal scroll is "buttery smooth." Avoid heavy re-renders during the scroll event.
    
4. **Architectural Feedback:** If you identify a cleaner way to structure the data flow or see opportunities to improve the main site's performance through this implementation, **stop and request permission** to proceed with larger changes.
    

---

### 📦 Initial Data Schema (`decoded_data.json`)

JSON

```
{
  "title": "Blackbox Decoded 2025",
  "stats": {
    "library_growth": [],
    "server_density": [],
    "awards": [
      {
        "category": "Most Watched Movie",
        "title": "Example Movie",
        "image_path": "/decoded/assets/example.webp"
      }
    ]
  }
}
```