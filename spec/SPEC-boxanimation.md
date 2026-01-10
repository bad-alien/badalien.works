### Goal

Implement a hero intro animation where:

1. A dark 2.5D box drops in from above and lands (shadow sells impact).
    
2. Lid opens on a back-edge hinge (slightly 3D feel).
    
3. A stream of `0`/`1` emits from the box and flows toward the right.
    
4. As the stream reaches the right side, the page’s hero content slides in from the right, reading as if the bits “lead into” the title.
    

### Inputs / Assets

- Use provided SVG: `hero-animation.svg` containing these IDs:
    
    - `#box_shadow`
        
    - `#box_body`
        
    - `#box_inner`
        
    - `#box_lid`
        
    - `#lid_back_edge`
        
    - `#stream_path` (invisible path for bit flow)
        
    - `#bits_stream` (empty group to populate with bits)
        
    - `#bits_origin` (anchor / emission point)
        
    - `#bits_target` (visual dev marker; may be hidden later)
        

### Layout Requirements

- Hero is 2-column:
    
    - Left: SVG “stage”
        
    - Right: real DOM content (title/subtitle/CTA), responsive and selectable.
        
- Provide a container around SVG with CSS `perspective` to support a subtle 3D lid open (if using 3D transforms).
    
- Content should be positioned so the stream visually leads toward the title area (near `bits_target`).
    

### Animation Orchestration

Use a single master timeline (GSAP recommended for sequencing), with these phases and approximate timings:

1. **Initial State**
    
    - Hero content elements (title/subtitle/CTA) start off-screen right (e.g., `x + 60–100px`) and `opacity: 0`.
        
    - Box starts above view: translate `#box_body` and `#box_lid` up by ~200–280px.
        
    - `#box_shadow` starts smaller + fainter (e.g., `scale ~0.6–0.75`, lower opacity).
        
    - `#box_inner` opacity 0.
        
    - `#lid_back_edge` opacity 0.
        
    - Ensure `#bits_stream` is empty at start.
        
2. **Drop + Impact (0.0s → ~0.8s)**
    
    - Animate `#box_body` + `#box_lid` down to final position with eased landing (soft bounce acceptable).
        
    - On/near impact:
        
        - `#box_shadow` scales up quickly (mostly X scale) and increases opacity briefly, then settles to normal.
            
3. **Lid Open (starts ~0.85s; lasts ~0.6–0.8s)**
    
    - Rotate `#box_lid` around a hinge near the back edge of the top face.
        
    - Use a fixed hinge origin:
        
        - Prefer GSAP `svgOrigin: "400 217.5"` (or compute from the lid geometry) so rotation looks anchored.
            
    - During opening:
        
        - Fade `#box_inner` from 0 → 1 (slightly delayed so it appears as lid clears).
            
        - Fade `#lid_back_edge` from 0 → 1 to sell thickness while opening.
            
4. **Bits Stream (starts ~1.05s; overlaps lid opening)**
    
    - Emit a burst of `0/1` bits from `#bits_origin` and animate along `#stream_path` toward the right.
        
    - Implementation guidance:
        
        - Create SVG `<text>` elements (monospace) or use path sprites; insert them into `#bits_stream`.
            
        - For each bit:
            
            - Start at or near `bits_origin` position.
                
            - Animate motion along `#stream_path` (GSAP MotionPathPlugin or equivalent).
                
            - Add mild per-bit variation: delay, duration, font size, slight drift.
                
            - Fade in quickly, then fade out near the end; remove element from DOM after completion.
                
    - Bits density: ~24–40 concurrently for first pass; tune for performance.
        
5. **Content Entrance (starts after bits begin, ~1.35s onward)**
    
    - Animate hero title in first (slide from right + fade in).
        
    - Follow with subtitle and CTA in stagger.
        
    - Timing should make it feel like bits “arrive” before the title fully settles.
        

### Technical Constraints / Notes

- **SVG must be inline or injected** such that internal element IDs are queryable (e.g., `document.querySelector("#box_lid")` works). If using `<img>`, internal IDs are not directly selectable—avoid.
    
- Use `prefers-reduced-motion`:
    
    - If reduced motion is enabled, skip the drop/lid/bits; just show the content with a simple fade (or no animation).
        
- Performance:
    
    - Keep bit count moderate; ensure completed bits are removed.
        
    - Avoid expensive SVG filters initially.
        

### Acceptance Criteria

- Lid rotation reads as hinged at the back edge (not sliding).
    
- Bits originate from the opening seam and follow a clear curve to the right.
    
- Content slides in from right with clear causal timing (bits first, content next).
    
- Works responsively: SVG scales; content remains crisp.
    
- Reduced-motion path behaves appropriately.
    

### Deliverables Expected from Agent

- Integration code (GSAP timeline or equivalent) targeting the SVG IDs above.
    
- CSS for hero layout + perspective stage container.
    
- A small configuration section for easy tuning:
    
    - drop height, drop duration
        
    - lid open angle/duration
        
    - bit count, bit duration range, bit size range
        
    - content entrance stagger/duration