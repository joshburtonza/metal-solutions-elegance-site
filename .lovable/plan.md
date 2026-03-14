

## Welding Spark Section Transitions — Plan

### Concept
Create a **WeldingTransition** component that sits between each major section. As the user scrolls into the boundary between sections, they see:

1. **A welding rod tip** (glowing hot gold) touching a corner/seam between two "metal plates" (the sections above and below)
2. **Sparks explode outward** — hundreds of tiny gold particles shooting in parabolic arcs with gravity, glow, and fade
3. **A bright welding arc flash** — intense white-gold point light that blooms and fades
4. **A molten weld bead** forms along the seam line as scroll progresses
5. **Smoke/heat haze** distortion ripples upward from the weld point

### Technical Approach

**New component: `src/components/animations/WeldingTransition.tsx`**
- Uses **Canvas 2D** (not R3F — lighter weight, can have many instances) for the spark particle system
- Scroll-driven via `framer-motion`'s `useScroll` + `useTransform` tied to the transition element's viewport position
- Each transition is a ~200px tall sticky overlay between sections

**Particle system (Canvas 2D):**
- 150-300 spark particles per transition, spawned as scroll progresses
- Each particle: initial velocity (random angle, biased upward/outward), gravity pull downward, gold color with brightness variation, trail rendering, opacity fade over lifetime
- Particles rendered as short lines (motion blur effect) not circles — looks like real sparks
- Hot white core fading to gold fading to orange/red at tail

**Welding rod:**
- SVG or absolutely positioned div — angled rod with a bright glowing tip
- Tip position animates along the seam line based on scroll progress
- CSS `box-shadow` with multiple layers for the intense arc glow: `0 0 20px #fff, 0 0 40px gold, 0 0 80px orange`

**Weld bead (the seam):**
- An SVG `<path>` or gradient div that grows in width as scroll progresses
- Starts bright white-gold (fresh weld), cools to darker gold/bronze behind the rod
- Subtle pulsing glow on the fresh portion

**Heat haze:**
- CSS `backdrop-filter` with a slight `blur` and vertical displacement, animated with scroll
- Or an SVG filter with `feTurbulence` + `feDisplacementMap` for realistic heat distortion

**Integration in `Index.tsx`:**
- Insert `<WeldingTransition />` between each major section (Hero→Collections, Collections→Products, Products→Testimonials, etc.)
- Each instance can have a `direction` prop (left-to-right, right-to-left, corner) for variety

### Files to Create/Edit

| File | Action |
|------|--------|
| `src/components/animations/WeldingTransition.tsx` | **Create** — Full welding spark transition component with Canvas 2D particle system, welding rod, bead, and heat haze |
| `src/pages/Index.tsx` | **Edit** — Insert `<WeldingTransition />` between each section pair |
| `src/index.css` | **Edit** — Add weld glow keyframes and heat-haze utility classes |

### Performance Considerations
- Canvas particles only animate when the transition is in/near viewport (Intersection Observer)
- `requestAnimationFrame` loop pauses when not visible
- Particle count scales down on mobile via `window.innerWidth` check
- Each canvas is small (~200px height, full width) — very lightweight

