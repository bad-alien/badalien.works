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
const CONFIG = {
  // Drop animation
  drop: {
    height: 600,           // Starting position above final - starts OFF SCREEN
    duration: 1.05,        // Drop duration (seconds) - 50% slower
    bounce: 0.12,          // Bounce intensity (0-1)
  },
  // Shadow animation
  shadow: {
    initialScale: 0.6,     // Starting scale
    initialOpacity: 0.25,  // Starting opacity
    impactScale: 1.12,     // Scale at impact moment
    impactOpacity: 0.75,   // Opacity at impact
    settleDuration: 0.375, // Time to settle after impact - 50% slower
  },
  // Lid opening (morphing polygon points for 2.5D effect)
  lid: {
    startDelay: 1.125,     // Delay after drop starts (seconds) - 50% slower
    duration: 0.9,         // Lid open duration - 50% slower
  },
  // Bit stream
  bits: {
    startDelay: 1.425,     // Delay after animation starts - 50% slower
    count: 60,             // Number of bits to emit
    emitInterval: 95,      // ms between bit emissions
    durationMin: 2.0,      // Travel duration (same for all)
    durationMax: 2.0,      // Travel duration (same for all)
    sizeMin: 28,           // Min font size
    sizeMax: 34,           // Max font size
    xSpread: 2,            // Horizontal spread randomness (px)
  },
  // Box exit
  boxExit: {
    startDelay: 5,         // When box starts exiting
    duration: 1.2,         // Exit animation duration
  },
  // Content entrance
  content: {
    startDelay: 5.7,       // When content starts appearing
    duration: 1.5,         // Fade in duration
    stagger: 0.3,          // Stagger between elements
  },
};

// Lid polygon points - closed and open states for morph animation
// New centered box lid closed: "310,270 400,240 490,295 400,325"
// Points order: front-left, back-left(hinge), back-right(hinge), front-right
// Back edge (hinge): 400,240 -> 490,295 (stays fixed)
// Front edge: 310,270 -> 400,325 (moves up and back when opening)

// Open state - front edge moved up and back toward hinge line
// When lid opens ~80°, front points move up and collapse toward hinge
const LID_OPEN = {
  // Front-left moves from (310,270) toward back-left hinge (400,240), going up
  // Front-right moves from (400,325) toward back-right hinge (490,295), going up
  top: "400,190 400,240 490,295 490,245",       // Lid tilted back, front edge near hinge
  underside: "400,190 400,240 490,295 490,245",
  side: "490,245 490,295 490,303 490,253",      // Side edge compressed vertically
  backEdge: "400,240 490,295 490,303 400,248",  // Back edge thickness visible
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
    const boxLid = svg.querySelector('#box_lid') as SVGGElement;
    const boxShadow = svg.querySelector('#box_shadow') as SVGGElement;
    const boxInner = svg.querySelector('#box_inner') as SVGGElement;
    const lidTop = svg.querySelector('#lid_top') as SVGPolygonElement;
    const lidUnderside = svg.querySelector('#lid_underside') as SVGPolygonElement;
    const lidSide = svg.querySelector('#lid_side') as SVGPolygonElement;
    const lidBackEdge = svg.querySelector('#lid_back_edge') as SVGPolygonElement;
    const bitsStream = svg.querySelector('#bits_stream') as SVGGElement;
    const streamPath = svg.querySelector('#stream_path') as SVGPathElement;

    if (!boxBody || !boxLid || !boxShadow || !boxInner || !bitsStream || !streamPath) {
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
    gsap.set([boxBody, boxLid], { y: -CONFIG.drop.height });
    gsap.set(boxShadow, {
      scale: CONFIG.shadow.initialScale,
      opacity: CONFIG.shadow.initialOpacity,
      transformOrigin: 'center center',
    });
    gsap.set(boxInner, { opacity: 0 });
    gsap.set(lidBackEdge, { opacity: 0 });
    gsap.set(contentElements, { opacity: 0, y: 150 }); // Start well below for dramatic "from bottom" entrance
    gsap.set(contentRef.current, { opacity: 0 });

    // Create master timeline
    const tl = gsap.timeline();

    // Phase 1: Drop + Impact
    tl.to([boxBody, boxLid], {
      y: 0,
      duration: CONFIG.drop.duration,
      ease: `back.out(${CONFIG.drop.bounce})`,
    }, 0);

    // Shadow responds to drop
    tl.to(boxShadow, {
      scale: CONFIG.shadow.impactScale,
      opacity: CONFIG.shadow.impactOpacity,
      duration: CONFIG.drop.duration * 0.85,
      ease: 'power2.out',
    }, 0);

    // Shadow settles
    tl.to(boxShadow, {
      scale: 1,
      opacity: 0.55,
      duration: CONFIG.shadow.settleDuration,
      ease: 'power2.inOut',
    }, CONFIG.drop.duration * 0.85);

    // Phase 2: Lid Open (morph polygon points)
    // Animate lid polygons to open position
    tl.to(lidTop, {
      attr: { points: LID_OPEN.top },
      duration: CONFIG.lid.duration,
      ease: 'power2.out',
    }, CONFIG.lid.startDelay);

    tl.to(lidUnderside, {
      attr: { points: LID_OPEN.underside },
      duration: CONFIG.lid.duration,
      ease: 'power2.out',
    }, CONFIG.lid.startDelay);

    tl.to(lidSide, {
      attr: { points: LID_OPEN.side },
      duration: CONFIG.lid.duration,
      ease: 'power2.out',
    }, CONFIG.lid.startDelay);

    // Reveal inner cavity
    tl.to(boxInner, {
      opacity: 1,
      duration: 0.3,
      ease: 'power1.in',
    }, CONFIG.lid.startDelay + 0.1);

    // Reveal lid back edge
    tl.to(lidBackEdge, {
      opacity: 1,
      attr: { points: LID_OPEN.backEdge },
      duration: CONFIG.lid.duration * 0.8,
      ease: 'power2.out',
    }, CONFIG.lid.startDelay + 0.05);

    // Phase 3: Bit Stream - curves up then down with horizontal spread
    const emitBits = () => {
      for (let i = 0; i < CONFIG.bits.count; i++) {
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

          // Random horizontal offset for spread effect
          const xOffset = (Math.random() - 0.5) * CONFIG.bits.xSpread * 2;

          // Animate along the curved path with horizontal offset
          gsap.to(bit, {
            motionPath: {
              path: streamPath,
              align: streamPath,
              alignOrigin: [0.5, 0.5],
              offsetX: xOffset,
            },
            duration,
            ease: 'none', // Linear for consistent flow
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
        }, i * CONFIG.bits.emitInterval);
      }
    };

    tl.call(emitBits, [], CONFIG.bits.startDelay);

    // Phase 4: Box exits (moves up and fades out)
    tl.to(svgContainerRef.current, {
      y: -150,
      opacity: 0,
      duration: CONFIG.boxExit.duration,
      ease: 'power2.inOut',
    }, CONFIG.boxExit.startDelay);

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

          {/* Box body - centered at x=400 */}
          <g id="box_body">
            {/* Inner cavity */}
            <g id="box_inner" opacity="0">
              <polygon id="inner_back" points="310,270 400,240 490,295 400,325" fill="#141418"/>
              <polygon id="inner_floor" points="310,270 310,415 400,470 400,325" fill="#0f0f13"/>
            </g>

            {/* Top face (visible when lid closed) */}
            <polygon
              id="face_top"
              points="310,270 400,240 490,295 400,325"
              fill="#2b2b34"
              stroke="#0a0a0d"
              strokeWidth="2"
              opacity="0.98"
            />

            {/* Front face */}
            <polygon
              id="face_front"
              points="310,270 400,325 400,470 310,415"
              fill="#1f1f27"
              stroke="#0a0a0d"
              strokeWidth="2"
            />

            {/* Right side face */}
            <polygon
              id="face_side"
              points="400,325 490,295 490,440 400,470"
              fill="#17171f"
              stroke="#0a0a0d"
              strokeWidth="2"
            />

            {/* Rim highlight */}
            <polyline
              points="310,270 400,325 490,295"
              fill="none"
              stroke="#bdbdd1"
              strokeWidth="2"
              opacity="0.08"
            />
          </g>

          {/* Lid */}
          <g id="box_lid">
            {/* Back-edge thickness */}
            <polygon
              id="lid_back_edge"
              points="400,240 490,295 486,302 396,247"
              fill="#0f0f13"
              opacity="0"
            />

            {/* Underside */}
            <polygon
              id="lid_underside"
              points="310,270 400,240 490,295 400,325"
              fill="#14141b"
              opacity="0.85"
            />

            {/* Lid top */}
            <polygon
              id="lid_top"
              points="310,270 400,240 490,295 400,325"
              fill="#34343f"
              stroke="#0a0a0d"
              strokeWidth="2"
              opacity="0.98"
            />

            {/* Lid thickness on right edge */}
            <polygon
              id="lid_side"
              points="400,325 490,295 490,303 400,333"
              fill="#23232c"
              stroke="#0a0a0d"
              strokeWidth="2"
              opacity="0.98"
            />

            {/* Subtle highlight */}
            <polyline
              points="310,270 400,240 490,295"
              fill="none"
              stroke="#d7d7ea"
              strokeWidth="2"
              opacity="0.06"
            />
          </g>

          {/* Stream path - curves UP-LEFT, arches at top, then DOWN-RIGHT creating visible fountain arch */}
          <path
            id="stream_path"
            d="M 400 280 C 320 150 300 50 400 30 C 500 50 480 150 400 300 L 400 950"
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
