Markdown

# Implementation Specs: The Void Interface

## 🛑 AGENT PROTOCOL: ASSET VERIFICATION
**CRITICAL INSTRUCTION FOR AI AGENT:**
Before generating code that references image or font assets, you must check the `/public` directory (or specified assets folder).
1.  **If a required asset is missing (e.g., the black hole GIF, the logo file, or font files):** STOP immediately.
2.  **Prompt the User:** Ask the user to provide the specific file path or add the file to the project before you proceed with that component.
3.  **Do NOT** use placeholder URLs (like `placeholder.com`) or generate hallucinated paths.

---

## 1. Project Context & Dependencies
* **Target Route:** `/void` (New page implementation).
* **Framework:** Next.js (App Router), TypeScript.
* **Styling:** Tailwind CSS.
* **Animation Engine:** `framer-motion` (Must be installed).
* **Icons:** `lucide-react` (or existing project icon set).

### Required Dependencies
```bash
npm install framer-motion clsx tailwind-merge
2. Asset Checklist
public/assets/void/black-hole-landing.gif: The looping background animation for the landing screen.

public/assets/void/bad-alien-logo.svg (or .png): The white scribbled logo for the chat header.

Fonts:

Science Gothic (Custom/Local font or Google Font if available).

Gemunu Libre (Google Fonts).

3. Design Tokens (Tailwind Config)
Extend tailwind.config.ts with these precise values.

Colors
Backgrounds:

void-black: #000000

void-bg-input: rgba(0, 0, 0, 0.4) (Black with transparency)

Text/Borders:

void-title: #E0E0E0 (Light Gray)

void-orange: #FF6B35 (Primary Accent)

void-orange-light: #FF8C5A (Hover Accent)

void-green: #00FF00 (Terminal Green)

void-gray: #5A5A5A (Placeholder)

void-teal: #007878 (Scrollbars/Accents)

Effects (Box Shadows/Glows):

Create a utility class for the orange glow: shadow-[0_0_15px_rgba(255,107,53,0.5)]

Fonts
font-science: "Science Gothic", sans-serif (Weight: 240/Custom)

font-gemunu: "Gemunu Libre", sans-serif (Weights: 400, 700)

4. Animation Choreography (Framer Motion)
A. Screen Transition Logic
State: Use a parent state mode: 'landing' | 'chat'.

Wrapper: Use <AnimatePresence mode="wait">.

Transition Duration: 0.8s ease-in-out.

B. Landing Screen (LandingView.tsx)
Entrance: Fade in (opacity 0 -> 1, duration 0.8s).

"Enter the Void" Title:

Init: Opacity 0, y: 20.

Enter: Opacity 1, y: 0 (Duration 0.8s, Delay 0.3s).

Hover: Scale 1.05 + Orange Text Shadow (Duration 75ms).

Interaction: On click, set mode to 'chat'.

Philosophical Lines (The "Whispers"):

Position: Absolute center or aligned per design.

Sequence: Render these conditionally or use a staggered delay map.

Animation: Fade In -> Hold -> Fade Out.

"There are no inhibitions": Total 3s.

"There are no memories": Total 3s (Delay start by 1.2s).

"Be good, human": Total 3s (Delay start by 2.4s).

Color: text-void-green (#00FF00).

C. Chat Interface (ChatInterface.tsx)
Entrance: Global fade in (1s).

Header (Logo + Text):

Slide down from y: -20, Fade in (Duration 0.8s, Delay 0.3s).

Escape Button:

Fade in (Delay 0.6s).

Hover: Scale 1.05 + Box Shadow (Orange glow).

Tap: Scale 0.95.

Action: Set mode to 'landing'.

Message List:

Container: Flex-col, scrollable.

Items: AnimatePresence for new messages.

Message Entry: Slide up from y: 20 + Fade In (Duration 0.6s).

Stagger: If loading initial history, stagger children by 0.1s.

Input Area:

Slide up from y: 20 + Fade in (Duration 0.8s, Delay 0.5s).

Focus: Increase border glow intensity.

D. Micro-Interactions
Copy Icon (Message Hover):

Hidden by default.

On Message Hover: Fade in + Slide (Left -10px for user, Right +10px for AI).

Hover Icon: Scale 1.1.

Click: Scale 0.9.

Typing Indicator:

Three dots.

Anim: Opacity (0.3 -> 1 -> 0.3) + Scale (1 -> 1.2 -> 1).

Loop: Infinite, Duration 1.2s, Stagger 0.2s.

5. Component Architecture Specification
src/app/void/page.tsx
Role: Container / State Manager.

Logic:

Manages mode state.

Handles keyboard listener for Escape key (triggers return to Landing).

src/components/void/LandingView.tsx
Role: Visual hook.

Props: onEnter: () => void.

Structure:

Background Image/GIF (Absolute fill).

Centered "Enter the Void" button.

Absolute positioned container for "Philosophical Lines".

src/components/void/ChatInterface.tsx
Role: The actual chat UI.

Props: onEscape: () => void.

Structure:

Header: Flex row, "Bad Alien" logo centered (or left), Escape button top-left (per screenshot).

MessageList: Scrollable area. Needs custom scrollbar styling (Teal track).

InputArea: Fixed bottom. Transparent background (black/40), Orange border.

Data Hook: Connect to existing chat hook/context if available (check api-chat-handler.md), otherwise mock with the provided text "The Void sees you..."

6. Implementation Steps for Agent
Verify Assets: Check for GIF and Logo. Ask user if missing.

Config: Update tailwind.config.ts and app/layout.tsx (fonts).

Scaffold: Create component files in src/components/void/.

Landing: Build LandingView with framer-motion.

Chat: Build ChatInterface with scroll handling and input logic.

Integration: Assemble in src/app/void/page.tsx.