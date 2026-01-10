# Spec Sheet: "Decoded" Interactive Ridgeline Pulse

**Component:** $24 \times 7$ Temporal Server Usage Ridgeline Plot

**Project Context:** Interactive section for "Decoded" visualizing one year of hourly server averages.

---

## 1. Data Logic: The "Padded" 28-Hour Window

To prevent jagged edges at the 12am/12am boundaries, the data for each day must be processed as follows:

- **Buffer Injection:** For each 24-hour array, inject a 2-hour buffer at the start (from the previous day's end) and a 2-hour buffer at the end (from the next day's start).
    
- **Cyclical Continuity:** Sunday draws its "start buffer" from Saturday; Saturday draws its "end buffer" from Sunday.
    
- **The Result:** A $7 \times 28$ data structure used for calculation, even though only 24 hours are visible.
    

## 2. Visual Requirements

- **X-Axis:** Strictly display **12am to 12am**. The 4 hours of buffer data must be clipped or rendered "off-stage" so the chart starts and ends exactly on the vertical axes.
    
- **Absolute Scaling:** Wave heights must be relative to the _global maximum_ of the entire week. This ensures a "busy" Tuesday is physically taller than a "quiet" Sunday.
    
- **Baselines:** Each day must have a subtle, solid horizontal baseline to ground the wave.
    
- **Overlap:** Ridgelines should overlap vertically (approx. $30\%$).
    
- **The "Decoded" Aesthetic:** * Match existing dark-mode teals, purples, and blues.
    
    - **Fill:** Solid color fills (no vertical gradients).
        
    - **Endpoint Transitions:** The 2-hour buffer regions should feature a horizontal gradient. This gradient should transition from the _previous/next day's color_ into the _current day's color_ and fade in/out of transparency to indicate the data "flowing" across the time boundary.
        

## 3. Interactivity & Motion

- **Entrance Animation:** When scrolled into view, the waves should animate "upward" from their baselines. This should match the timing/feel of existing animations in the "Decoded" project.
    
- **Dynamic Focus:** * **Hover/Touch:** The active day must be brought to the visual forefront (Z-index).
    
    - **Opacity Shift:** The focused day should be nearly opaque ($~0.85$), while all other days dim significantly ($~0.15$) to create high contrast.
        
    - **Consistency:** All state changes should have a smooth, CSS-based transition duration ($200ms–300ms$).
        

## 4. Responsive Adaptability

- **Mobile View:** On smaller viewports, reduce the vertical overlap and simplify X-axis labels (e.g., 12am, 6am, 12pm, 6pm).
    
- **Interaction:** Use "Tap" as the trigger for focus states on touch devices.
    

---

## Instructions for the Coding Agent

> "Prioritize using the project's existing charting libraries to maintain consistency and reduce bundle size. If the current library cannot support custom path clipping or the 28-hour padded math required for smooth endpoints, you are authorized to implement a custom SVG solution using D3.js or a similar low-level primitive. Ensure the 'Decoded' color palette is extracted and applied correctly."