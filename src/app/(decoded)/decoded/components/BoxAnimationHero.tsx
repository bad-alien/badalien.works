'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(MotionPathPlugin);
}

// ============================================================================
// CONFIGURATION - Tune these values to adjust animation feel
// ============================================================================
// Check if mobile device (runs on client only)
const getIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

const CONFIG = {
  // Drop animation
  drop: {
    height: 600,           // Starting position above final - starts OFF SCREEN
    duration: 0.55,        // Drop duration - FASTER
  },
  // Impact animation
  impact: {
    squishScaleY: 0.55,    // Vertical squish - VERY EXAGGERATED
    squishScaleX: 1.35,    // Horizontal expand during squish - VERY EXAGGERATED
    squishDuration: 0.1,   // How long the squish lasts - SNAPPIER
    unsquishDuration: 0.35,// How long to return to normal
    lineDistance: 180,     // How far impact lines shoot out - EXTENDED
    lineDuration: 0.25,    // Line animation duration - SHORTER
  },
  // Shadow animation
  shadow: {
    initialScale: 0.6,     // Starting scale
    initialOpacity: 0.25,  // Starting opacity
    impactScale: 1.25,     // Scale at impact moment - bigger for emphasis
    impactOpacity: 0.85,   // Opacity at impact
    settleDuration: 0.3,   // Time to settle after impact
  },
  // Lid opening (morphing polygon points for 2.5D effect)
  lid: {
    startDelay: 1.0,       // Delay after drop starts (adjusted for faster drop)
    duration: 0.9,         // Lid open duration
    secondLidDelay: 0.25,  // Delay before second lid opens
  },
  // Bit stream - desktop values (mobile overrides applied at runtime)
  bits: {
    startDelay: 1.425,     // Delay after animation starts
    count: 1000,           // Number of bits to emit (mobile: 350)
    emitInterval: 10,      // ms between bit emissions (mobile: 28)
    durationMin: 2.6,      // Travel duration
    durationMax: 2.6,      // Travel duration (uniform speed)
    sizeMin: 28,           // Min font size
    sizeMax: 34,           // Max font size
    xSpread: 2,            // Horizontal spread randomness (px)
    stopBeforeExit: 0.3,   // Stop emitting this many seconds before box exits
  },
  // Box exit
  boxExit: {
    startDelay: 5,         // When box starts exiting
    duration: 1.2,         // Exit animation duration
  },
  // Content entrance
  content: {
    startDelay: 6.5,       // Title appears at 6.5s
    duration: 1.5,         // Fade in duration
    stagger: 0.3,          // Stagger between elements
  },
};

// Lid polygon points - TWO LIDS that split horizontally
// Original lid: "310,270 400,240 490,295 400,325"
// Split into back lid and front lid at midpoints:
// - Mid-left: (355, 255) - midpoint of front-left to back-left
// - Mid-right: (445, 310) - midpoint of back-right to front-right

// BACK LID - hinges on back edge, opens backward (20% shorter box)
// Closed: 355,298 -> 400,286 -> 490,330 -> 445,342
const _BACK_LID_CLOSED = "355,298 400,286 490,330 445,342";
void _BACK_LID_CLOSED; // Reference position for documentation
const BACK_LID_OPEN = {
  top: "400,254 400,286 490,330 490,298",       // Tilted back
  underside: "400,254 400,286 490,330 490,298",
  backEdge: "400,286 490,330 490,336 400,292",
};

// FRONT LID - hinges on FRONT edge, back edge swings UP (mirrors back lid)
// Closed: 310,310 -> 355,298 -> 445,342 -> 400,354
const _FRONT_LID_CLOSED = "310,310 355,298 445,342 400,354";
void _FRONT_LID_CLOSED; // Reference position for documentation
const FRONT_LID_OPEN = {
  top: "310,310 310,278 400,322 400,354",       // Back edge swings up (same height as back lid)
  underside: "310,310 310,278 400,322 400,354",
  frontEdge: null, // No edge visible when opening this direction
};

interface BoxAnimationHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export default function BoxAnimationHero({
  title = 'DECODED',
  subtitle = '2025',
  description = 'Scroll down to explore the year in data.',
}: BoxAnimationHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const bitsCreatedRef = useRef<SVGTextElement[]>([]);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Main animation effect
  useEffect(() => {
    if (!svgContainerRef.current || !contentRef.current) return;

    const svg = svgContainerRef.current.querySelector('svg');
    if (!svg) return;

    // Get SVG elements
    const boxBody = svg.querySelector('#box_body') as SVGGElement;
    const backLid = svg.querySelector('#back_lid') as SVGGElement;
    const frontLid = svg.querySelector('#front_lid') as SVGGElement;
    const boxShadow = svg.querySelector('#box_shadow') as SVGGElement;
    const boxInner = svg.querySelector('#box_inner') as SVGGElement;
    // Back lid elements
    const backLidTop = svg.querySelector('#back_lid_top') as SVGPolygonElement;
    const backLidUnderside = svg.querySelector('#back_lid_underside') as SVGPolygonElement;
    const backLidEdge = svg.querySelector('#back_lid_edge') as SVGPolygonElement;
    // Front lid elements
    const frontLidTop = svg.querySelector('#front_lid_top') as SVGPolygonElement;
    const frontLidUnderside = svg.querySelector('#front_lid_underside') as SVGPolygonElement;
    const frontLidEdge = svg.querySelector('#front_lid_edge') as SVGPolygonElement;
    const bitsStream = svg.querySelector('#bits_stream') as SVGGElement;
    const streamPaths = [0, 1, 2, 3, 4].map(i => svg.querySelector(`#stream_path_${i}`) as SVGPathElement);
    const impactLines = svg.querySelector('#impact_lines') as SVGGElement;

    if (!boxBody || !backLid || !frontLid || !boxShadow || !boxInner || !bitsStream || streamPaths.some(p => !p)) {
      console.warn('BoxAnimationHero: Missing required SVG elements');
      return;
    }

    // Content elements
    const contentElements = [
      titleRef.current,
      subtitleRef.current,
      descriptionRef.current,
      scrollIndicatorRef.current,
    ].filter(Boolean);

    // If reduced motion, just show content without animation
    if (prefersReducedMotion) {
      gsap.set(svgContainerRef.current, { opacity: 0, display: 'none' });
      gsap.set(contentElements, { opacity: 1, y: 0 });
      setShowContent(true);
      return;
    }

    // Set initial states
    gsap.set([boxBody, backLid, frontLid], {
      y: -CONFIG.drop.height,
      transformOrigin: 'center bottom', // Squish from bottom
    });
    gsap.set(boxShadow, {
      scale: CONFIG.shadow.initialScale,
      opacity: CONFIG.shadow.initialOpacity,
      transformOrigin: 'center center',
    });
    gsap.set(boxInner, { opacity: 0 });
    gsap.set([backLidEdge, frontLidEdge], { opacity: 0 });
    gsap.set(contentElements, { opacity: 0, y: 150 }); // Start well below for dramatic "from bottom" entrance
    gsap.set(contentRef.current, { opacity: 0 });

    // Set up impact lines - start as invisible at center
    if (impactLines) {
      const lines = impactLines.querySelectorAll('line');
      lines.forEach(line => {
        gsap.set(line, { opacity: 0 });
      });
    }

    // Create master timeline
    const tl = gsap.timeline();

    // Phase 1: Drop (fast, no bounce - hard landing)
    tl.to([boxBody, backLid, frontLid], {
      y: 0,
      duration: CONFIG.drop.duration,
      ease: 'power2.in', // Accelerate into ground
    }, 0);

    // Shadow grows as box approaches
    tl.to(boxShadow, {
      scale: CONFIG.shadow.impactScale,
      opacity: CONFIG.shadow.impactOpacity,
      duration: CONFIG.drop.duration,
      ease: 'power2.in',
    }, 0);

    // Phase 1b: Impact - Squish!
    const impactTime = CONFIG.drop.duration;

    // Squish the box
    tl.to([boxBody, backLid, frontLid], {
      scaleY: CONFIG.impact.squishScaleY,
      scaleX: CONFIG.impact.squishScaleX,
      duration: CONFIG.impact.squishDuration,
      ease: 'power2.out',
    }, impactTime);

    // Shadow expands more on impact
    tl.to(boxShadow, {
      scaleX: 1.4,
      scaleY: 1.2,
      duration: CONFIG.impact.squishDuration,
      ease: 'power2.out',
    }, impactTime);

    // Show impact lines - short lines that shoot out from bottom of box
    if (impactLines) {
      const lines = impactLines.querySelectorAll('line');
      const numLines = lines.length;
      const baseY = 480; // At shadow level
      const centerX = 400;

      // Match the shadow ellipse ratio (rx=140, ry=26)
      const ellipseRatioY = 26 / 140; // ~0.186 - flattens to match 3D perspective

      lines.forEach((line, i) => {
        // Spread lines in an ellipse pattern matching the shadow
        const angle = (i / numLines) * Math.PI * 2; // Full 360 degrees

        const dist = CONFIG.impact.lineDistance;
        const lineLength = 60; // Length of each impact line - LONGER

        // Direction vector - ellipse (flattened in Y to match shadow)
        const dx = Math.cos(angle);
        const dy = Math.sin(angle) * ellipseRatioY;

        // Initial position - small line at center
        gsap.set(line, {
          attr: {
            x1: centerX,
            y1: baseY,
            x2: centerX + dx * 3,
            y2: baseY + dy * 3,
          },
          opacity: 0,
        });

        // End position (extended outward)
        const endX1 = centerX + dx * (dist - lineLength);
        const endY1 = baseY + dy * (dist - lineLength);
        const endX2 = centerX + dx * dist;
        const endY2 = baseY + dy * dist;

        // Animate line shooting out from center
        tl.to(line, {
          attr: {
            x1: endX1,
            y1: endY1,
            x2: endX2,
            y2: endY2,
          },
          opacity: 0.7,  // Slightly transparent
          duration: CONFIG.impact.lineDuration,
          ease: 'power2.out',
        }, impactTime);

        // Fade out lines
        tl.to(line, {
          opacity: 0,
          duration: CONFIG.impact.lineDuration * 0.5,
        }, impactTime + CONFIG.impact.lineDuration * 0.6);
      });
    }

    // Phase 1c: Jiggle - squish/unsquish with decreasing intensity
    const unsquishTime = impactTime + CONFIG.impact.squishDuration;

    // First unsquish (overshoot slightly)
    tl.to([boxBody, backLid, frontLid], {
      scaleY: 1.05,
      scaleX: 0.97,
      duration: CONFIG.impact.unsquishDuration * 0.6,
      ease: 'power2.out',
    }, unsquishTime);

    // Second squish (smaller)
    const jiggle1Time = unsquishTime + CONFIG.impact.unsquishDuration * 0.6;
    tl.to([boxBody, backLid, frontLid], {
      scaleY: 0.92,
      scaleX: 1.05,
      duration: CONFIG.impact.unsquishDuration * 0.4,
      ease: 'power2.inOut',
    }, jiggle1Time);

    // Second unsquish
    const jiggle2Time = jiggle1Time + CONFIG.impact.unsquishDuration * 0.4;
    tl.to([boxBody, backLid, frontLid], {
      scaleY: 1.02,
      scaleX: 0.99,
      duration: CONFIG.impact.unsquishDuration * 0.3,
      ease: 'power2.out',
    }, jiggle2Time);

    // Third squish (tiny)
    const jiggle3Time = jiggle2Time + CONFIG.impact.unsquishDuration * 0.3;
    tl.to([boxBody, backLid, frontLid], {
      scaleY: 0.98,
      scaleX: 1.01,
      duration: CONFIG.impact.unsquishDuration * 0.25,
      ease: 'power2.inOut',
    }, jiggle3Time);

    // Final settle to normal
    const settleTime = jiggle3Time + CONFIG.impact.unsquishDuration * 0.25;
    tl.to([boxBody, backLid, frontLid], {
      scaleY: 1,
      scaleX: 1,
      duration: CONFIG.impact.unsquishDuration * 0.3,
      ease: 'power2.out',
    }, settleTime);

    // Shadow settles
    tl.to(boxShadow, {
      scale: 1,
      opacity: 0.55,
      duration: CONFIG.shadow.settleDuration,
      ease: 'power2.inOut',
    }, unsquishTime);

    // Phase 2: Lid Open (morph polygon points) - BACK LID FIRST
    const backLidStartTime = CONFIG.lid.startDelay;
    const frontLidStartTime = CONFIG.lid.startDelay + CONFIG.lid.secondLidDelay;

    // Back lid opens first (opens backward)
    tl.to(backLidTop, {
      attr: { points: BACK_LID_OPEN.top },
      duration: CONFIG.lid.duration,
      ease: 'power2.out',
    }, backLidStartTime);

    tl.to(backLidUnderside, {
      attr: { points: BACK_LID_OPEN.underside },
      duration: CONFIG.lid.duration,
      ease: 'power2.out',
    }, backLidStartTime);

    // Reveal back lid edge (subtle)
    tl.to(backLidEdge, {
      opacity: 0.3,
      attr: { points: BACK_LID_OPEN.backEdge },
      duration: CONFIG.lid.duration * 0.8,
      ease: 'power2.out',
    }, backLidStartTime + 0.05);

    // Reveal inner cavity (starts when back lid opens)
    tl.to(boxInner, {
      opacity: 1,
      duration: 0.3,
      ease: 'power1.in',
    }, backLidStartTime + 0.1);

    // Front lid opens second (opens forward)
    tl.to(frontLidTop, {
      attr: { points: FRONT_LID_OPEN.top },
      duration: CONFIG.lid.duration,
      ease: 'power2.out',
    }, frontLidStartTime);

    tl.to(frontLidUnderside, {
      attr: { points: FRONT_LID_OPEN.underside },
      duration: CONFIG.lid.duration,
      ease: 'power2.out',
    }, frontLidStartTime);

    // Front lid edge stays hidden (no visible edge when opening upward with front hinge)

    // Phase 3: Bit Stream - curves up then down (arch phase)
    // Mobile optimization: reduce bit count and increase interval to prevent stutter
    const isMobile = getIsMobile();
    const bitCount = isMobile ? 350 : CONFIG.bits.count;
    const bitInterval = isMobile ? 28 : CONFIG.bits.emitInterval;

    // Calculate how many arch bits to emit - stop BEFORE box exits
    const archBitsDuration = (CONFIG.boxExit.startDelay - CONFIG.bits.startDelay - CONFIG.bits.stopBeforeExit) * 1000; // ms
    const archBitsCount = Math.min(bitCount, Math.floor(archBitsDuration / bitInterval));

    const emitArchBits = () => {
      for (let i = 0; i < archBitsCount; i++) {
        setTimeout(() => {
          const bit = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          bit.textContent = Math.random() > 0.5 ? '1' : '0';
          bit.setAttribute('font-family', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace');
          bit.setAttribute('fill', '#FF6B35');
          bit.setAttribute('font-weight', 'bold');

          const size = CONFIG.bits.sizeMin + Math.random() * (CONFIG.bits.sizeMax - CONFIG.bits.sizeMin);
          bit.setAttribute('font-size', `${size}px`);
          bit.setAttribute('opacity', '0');
          bit.setAttribute('text-anchor', 'middle');

          bitsStream.appendChild(bit);
          bitsCreatedRef.current.push(bit);

          const duration = CONFIG.bits.durationMin + Math.random() * (CONFIG.bits.durationMax - CONFIG.bits.durationMin);

          // Randomly pick one of the 5 stream paths
          const pathIndex = Math.floor(Math.random() * streamPaths.length);
          const selectedPath = streamPaths[pathIndex];

          // Small horizontal offset for slight variation within each column
          const xOffset = (Math.random() - 0.5) * CONFIG.bits.xSpread * 2;

          // Animate along the selected path
          gsap.to(bit, {
            motionPath: {
              path: selectedPath,
              align: selectedPath,
              alignOrigin: [0.5, 0.5],
              offsetX: xOffset,
            },
            duration,
            ease: 'none',
          });

          // Fade in
          gsap.to(bit, {
            opacity: 0.95,
            duration: 0.15,
            ease: 'power1.in',
          });

          // Fade out and remove
          gsap.to(bit, {
            opacity: 0,
            duration: 0.4,
            delay: duration - 0.4,
            ease: 'power1.out',
            onComplete: () => {
              bit.remove();
              const idx = bitsCreatedRef.current.indexOf(bit);
              if (idx > -1) bitsCreatedRef.current.splice(idx, 1);
            },
          });
        }, i * bitInterval);
      }
    };

    tl.call(emitArchBits, [], CONFIG.bits.startDelay);

    // Phase 4: Box exits (box elements move up and fade, bits continue streaming down)
    tl.to([boxBody, backLid, frontLid], {
      y: -250,
      opacity: 0,
      duration: CONFIG.boxExit.duration,
      ease: 'power2.out',
    }, CONFIG.boxExit.startDelay);

    // Shadow fades out quickly
    tl.to(boxShadow, {
      opacity: 0,
      scale: 0.5,
      duration: CONFIG.boxExit.duration * 0.5,
      ease: 'power2.in',
    }, CONFIG.boxExit.startDelay);

    // Fade out bits before content appears at 7s
    tl.to(bitsStream, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.in',
    }, CONFIG.content.startDelay - 1.0);

    // Phase 5: Content appears
    tl.call(() => setShowContent(true), [], CONFIG.content.startDelay);

    tl.to(contentRef.current, {
      opacity: 1,
      duration: 0.3,
    }, CONFIG.content.startDelay);

    tl.to(contentElements, {
      opacity: 1,
      y: 0,
      duration: CONFIG.content.duration,
      stagger: CONFIG.content.stagger,
      ease: 'power3.out', // Smoother deceleration for "rising from below"
    }, CONFIG.content.startDelay);

    // Cleanup
    return () => {
      tl.kill();
      bitsCreatedRef.current.forEach(bit => bit.remove());
      bitsCreatedRef.current = [];
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black px-4 relative overflow-hidden"
    >
      {/* SVG Stage - Centered */}
      <div
        ref={svgContainerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1000px' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 700"
          className="w-full max-w-2xl h-auto"
          role="img"
          aria-label="Animated box opening with streaming bits"
        >
          {/* Background - transparent */}
          <rect x="0" y="0" width="800" height="700" fill="transparent"/>

          {/* Ground line */}
          <line x1="100" y1="480" x2="700" y2="480" stroke="#14141a" strokeWidth="2" opacity="0.5"/>

          {/* Shadow - centered under box */}
          <g id="box_shadow" opacity="0.55">
            <ellipse cx="400" cy="480" rx="140" ry="26" fill="#000000" opacity="0.65"/>
            <ellipse cx="400" cy="480" rx="90" ry="16" fill="#000000" opacity="0.4"/>
          </g>

          {/* Impact lines - BEFORE box so they render behind it - 12 lines for full circle */}
          <g id="impact_lines">
            <line x1="400" y1="470" x2="400" y2="470" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
            <line x1="400" y1="470" x2="400" y2="470" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
            <line x1="400" y1="470" x2="400" y2="470" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
            <line x1="400" y1="470" x2="400" y2="470" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
            <line x1="400" y1="470" x2="400" y2="470" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
            <line x1="400" y1="470" x2="400" y2="470" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
            <line x1="400" y1="470" x2="400" y2="470" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
            <line x1="400" y1="470" x2="400" y2="470" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round"/>
            <line x1="400" y1="470" x2="400" y2="470" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round"/>
            <line x1="400" y1="470" x2="400" y2="470" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round"/>
            <line x1="400" y1="470" x2="400" y2="470" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round"/>
            <line x1="400" y1="470" x2="400" y2="470" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round"/>
          </g>

          {/* Box body - centered at x=400 (20% shorter) */}
          <g id="box_body">
            {/* Inner cavity - extended to fill full opening when both lids open */}
            <g id="box_inner" opacity="0">
              {/* Back wall - extends up to meet both open lids */}
              <polygon id="inner_back" points="310,278 400,254 490,298 400,322" fill="#141418"/>
              {/* Original top plane */}
              <polygon id="inner_top" points="310,310 400,286 490,330 400,354" fill="#18181f"/>
              {/* Floor visible through opening */}
              <polygon id="inner_floor" points="310,310 310,426 400,470 400,354" fill="#0f0f13"/>
              {/* Right wall visible */}
              <polygon id="inner_right" points="400,354 490,330 490,446 400,470" fill="#101015"/>
            </g>

            {/* Top face (visible when lid closed) */}
            <polygon
              id="face_top"
              points="310,310 400,286 490,330 400,354"
              fill="#2b2b34"
              stroke="#0a0a0d"
              strokeWidth="2"
              opacity="0.98"
            />

            {/* Front face */}
            <polygon
              id="face_front"
              points="310,310 400,354 400,470 310,426"
              fill="#1f1f27"
              stroke="#0a0a0d"
              strokeWidth="2"
            />

            {/* Right side face */}
            <polygon
              id="face_side"
              points="400,354 490,330 490,446 400,470"
              fill="#17171f"
              stroke="#0a0a0d"
              strokeWidth="2"
            />

            {/* Rim highlight */}
            <polyline
              points="310,310 400,354 490,330"
              fill="none"
              stroke="#bdbdd1"
              strokeWidth="2"
              opacity="0.08"
            />
          </g>

          {/* FRONT LID - opens upward (rendered first, behind back lid) */}
          <g id="front_lid">
            {/* Front-edge thickness (visible when open) */}
            <polygon
              id="front_lid_edge"
              points="310,310 400,354 400,360 310,316"
              fill="#0f0f13"
              opacity="0"
            />

            {/* Underside */}
            <polygon
              id="front_lid_underside"
              points="310,310 355,298 445,342 400,354"
              fill="#14141b"
            />

            {/* Lid top */}
            <polygon
              id="front_lid_top"
              points="310,310 355,298 445,342 400,354"
              fill="#34343f"
              stroke="#0a0a0d"
              strokeWidth="2"
            />
          </g>

          {/* BACK LID - opens backward */}
          <g id="back_lid">
            {/* Back-edge thickness (visible when open) */}
            <polygon
              id="back_lid_edge"
              points="400,286 490,330 490,336 400,292"
              fill="#0f0f13"
              opacity="0"
            />

            {/* Underside */}
            <polygon
              id="back_lid_underside"
              points="355,298 400,286 490,330 445,342"
              fill="#14141b"
            />

            {/* Lid top */}
            <polygon
              id="back_lid_top"
              points="355,298 400,286 490,330 445,342"
              fill="#34343f"
              stroke="#0a0a0d"
              strokeWidth="2"
            />

            {/* Subtle highlight */}
            <polyline
              points="355,298 400,286 490,330"
              fill="none"
              stroke="#d7d7ea"
              strokeWidth="2"
              opacity="0.06"
            />
          </g>

          {/* Stream paths - 5 columns emerging from box */}
          {/* Far left stream */}
          <path
            id="stream_path_0"
            d="M 400 318 C 250 220 150 120 200 60 Q 230 40 250 80 L 250 950"
            fill="none"
            stroke="none"
          />
          {/* Left stream */}
          <path
            id="stream_path_1"
            d="M 400 318 C 300 220 250 120 300 60 Q 320 40 325 80 L 325 950"
            fill="none"
            stroke="none"
          />
          {/* Center stream */}
          <path
            id="stream_path_2"
            d="M 400 318 C 350 200 350 100 400 50 Q 450 30 400 80 L 400 950"
            fill="none"
            stroke="none"
          />
          {/* Right stream */}
          <path
            id="stream_path_3"
            d="M 400 318 C 500 220 550 120 500 60 Q 480 40 475 80 L 475 950"
            fill="none"
            stroke="none"
          />
          {/* Far right stream */}
          <path
            id="stream_path_4"
            d="M 400 318 C 550 220 650 120 600 60 Q 570 40 550 80 L 550 950"
            fill="none"
            stroke="none"
          />

          {/* Bits container */}
          <g id="bits_stream"></g>
        </svg>
      </div>

      {/* Content - appears after box exits */}
      <div
        ref={contentRef}
        className={`relative z-10 flex flex-col items-center justify-center text-center space-y-6 ${showContent ? '' : 'pointer-events-none'}`}
        style={{ opacity: 0 }}
      >
        <h1
          ref={titleRef}
          className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600"
        >
          {title}
        </h1>
        <p
          ref={subtitleRef}
          className="text-3xl md:text-5xl font-mono text-void-orange tracking-widest"
        >
          {subtitle}
        </p>
        <p
          ref={descriptionRef}
          className="text-neutral-400 max-w-md text-lg mt-4"
        >
          {description}
        </p>

        {/* Scroll indicator */}
        <div
          ref={scrollIndicatorRef}
          className="animate-bounce text-neutral-600 mt-8 text-3xl"
        >
          ↓
        </div>
      </div>
    </div>
  );
}
