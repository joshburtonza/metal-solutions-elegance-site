import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  brightness: number;
  trail: { x: number; y: number }[];
}

type Direction = 'left-to-right' | 'right-to-left' | 'center-out';

interface WeldingTransitionProps {
  direction?: Direction;
  intensity?: number;
}

const TRANSITION_HEIGHT = 200;
const MAX_PARTICLES = 200;
const MOBILE_MAX_PARTICLES = 80;

const WeldingTransition = ({ direction = 'left-to-right', intensity = 1 }: WeldingTransitionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(false);
  const scrollProgressRef = useRef(0);
  const prevProgressRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Map scroll to a 0→1 welding progress
  const weldProgress = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

  useMotionValueEvent(weldProgress, 'change', (v) => {
    scrollProgressRef.current = Math.max(0, Math.min(1, v));
  });

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const getRodPosition = useCallback((progress: number, width: number) => {
    const y = TRANSITION_HEIGHT / 2;
    switch (direction) {
      case 'left-to-right':
        return { x: progress * width, y };
      case 'right-to-left':
        return { x: width - progress * width, y };
      case 'center-out':
        return { x: width / 2 + (progress - 0.5) * width, y };
      default:
        return { x: progress * width, y };
    }
  }, [direction]);

  const spawnParticles = useCallback((x: number, y: number, count: number) => {
    const maxP = isMobile ? MOBILE_MAX_PARTICLES : MAX_PARTICLES;
    for (let i = 0; i < count; i++) {
      if (particlesRef.current.length >= maxP) {
        // recycle oldest
        particlesRef.current.shift();
      }
      const angle = (Math.random() * Math.PI) - Math.PI; // mostly upward/outward
      const speed = 1.5 + Math.random() * 5 * intensity;
      const life = 30 + Math.random() * 40;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.4),
        vy: Math.sin(angle) * speed - (1 + Math.random() * 2), // bias upward
        life,
        maxLife: life,
        size: 0.5 + Math.random() * 2,
        brightness: 0.6 + Math.random() * 0.4,
        trail: [],
      });
    }
  }, [intensity, isMobile]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const progress = scrollProgressRef.current;
    const prevProgress = prevProgressRef.current;

    // Clear with slight fade for trail persistence
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, w, h);

    // Only animate when there's scroll movement and progress is between 0 and 1
    const delta = Math.abs(progress - prevProgress);
    prevProgressRef.current = progress;

    if (progress > 0 && progress < 1) {
      const rod = getRodPosition(progress, w);

      // Spawn sparks based on scroll velocity
      const spawnCount = Math.min(Math.floor(delta * 300 * intensity), 15);
      if (spawnCount > 0) {
        spawnParticles(rod.x, rod.y, spawnCount);
      }

      // -- Draw weld bead (the seam line) --
      const beadStart = getRodPosition(0, w);
      const beadEnd = getRodPosition(progress, w);
      
      const beadGrad = ctx.createLinearGradient(beadStart.x, rod.y, beadEnd.x, rod.y);
      beadGrad.addColorStop(0, 'hsla(28, 70%, 30%, 0.6)'); // cooled bronze
      beadGrad.addColorStop(0.7, 'hsla(35, 80%, 45%, 0.8)'); // warm gold
      beadGrad.addColorStop(0.9, 'hsla(42, 90%, 60%, 1)'); // hot gold
      beadGrad.addColorStop(1, 'hsla(48, 100%, 85%, 1)'); // white-hot

      ctx.beginPath();
      ctx.moveTo(beadStart.x, rod.y - 2);
      ctx.lineTo(beadEnd.x, rod.y - 2);
      ctx.lineTo(beadEnd.x, rod.y + 2);
      ctx.lineTo(beadStart.x, rod.y + 2);
      ctx.closePath();
      ctx.fillStyle = beadGrad;
      ctx.fill();

      // Weld bead glow
      ctx.shadowColor = 'hsla(42, 80%, 55%, 0.4)';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(beadStart.x, rod.y - 1);
      ctx.lineTo(beadEnd.x, rod.y - 1);
      ctx.lineTo(beadEnd.x, rod.y + 1);
      ctx.lineTo(beadStart.x, rod.y + 1);
      ctx.closePath();
      ctx.fillStyle = 'hsla(42, 80%, 55%, 0.3)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // -- Draw welding rod --
      const rodLength = 60;
      const rodAngle = -Math.PI / 4; // 45 degrees
      const rodEndX = rod.x + Math.cos(rodAngle) * rodLength;
      const rodEndY = rod.y + Math.sin(rodAngle) * rodLength;

      // Rod body
      ctx.beginPath();
      ctx.moveTo(rod.x, rod.y);
      ctx.lineTo(rodEndX, rodEndY);
      ctx.strokeStyle = 'hsla(30, 15%, 35%, 0.9)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Rod coating
      ctx.beginPath();
      ctx.moveTo(rod.x + 8 * Math.cos(rodAngle), rod.y + 8 * Math.sin(rodAngle));
      ctx.lineTo(rodEndX, rodEndY);
      ctx.strokeStyle = 'hsla(25, 20%, 25%, 0.8)';
      ctx.lineWidth = 6;
      ctx.stroke();

      // -- Arc flash at tip --
      const flashIntensity = Math.min(delta * 50, 1) * intensity;
      if (flashIntensity > 0.05) {
        // Outer glow
        const outerGlow = ctx.createRadialGradient(rod.x, rod.y, 0, rod.x, rod.y, 60 * flashIntensity);
        outerGlow.addColorStop(0, `hsla(42, 80%, 85%, ${0.8 * flashIntensity})`);
        outerGlow.addColorStop(0.3, `hsla(42, 80%, 60%, ${0.4 * flashIntensity})`);
        outerGlow.addColorStop(0.6, `hsla(28, 70%, 45%, ${0.15 * flashIntensity})`);
        outerGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = outerGlow;
        ctx.fillRect(rod.x - 60, rod.y - 60, 120, 120);

        // Inner white-hot core
        const coreGlow = ctx.createRadialGradient(rod.x, rod.y, 0, rod.x, rod.y, 12 * flashIntensity);
        coreGlow.addColorStop(0, `hsla(48, 100%, 95%, ${flashIntensity})`);
        coreGlow.addColorStop(0.5, `hsla(45, 95%, 75%, ${0.6 * flashIntensity})`);
        coreGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGlow;
        ctx.fillRect(rod.x - 15, rod.y - 15, 30, 30);
      }
    }

    // -- Update and render particles --
    ctx.globalCompositeOperation = 'lighter'; // additive blending for sparks
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      // Physics
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 5) p.trail.shift();
      
      p.vy += 0.15; // gravity
      p.vx *= 0.99; // air resistance
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      if (p.life <= 0 || p.x < -20 || p.x > w + 20 || p.y > h + 20) {
        particles.splice(i, 1);
        continue;
      }

      const lifeRatio = p.life / p.maxLife;
      const alpha = lifeRatio * p.brightness;

      // Draw trail (motion blur lines)
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let t = 1; t < p.trail.length; t++) {
          ctx.lineTo(p.trail[t].x, p.trail[t].y);
        }
        ctx.lineTo(p.x, p.y);
        
        // Color fades from white-hot → gold → orange → red
        let r: number, g: number, b: number;
        if (lifeRatio > 0.7) {
          // White-hot
          r = 255; g = 240 + lifeRatio * 15; b = 200 + lifeRatio * 55;
        } else if (lifeRatio > 0.4) {
          // Gold
          r = 255; g = 180 + lifeRatio * 80; b = 50 + lifeRatio * 80;
        } else {
          // Orange-red dying
          r = 255; g = 100 + lifeRatio * 150; b = 20;
        }
        
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = p.size * lifeRatio;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Bright tip of spark
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * lifeRatio * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 250, 220, ${alpha * 0.8})`;
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';

    if (isVisibleRef.current) {
      animFrameRef.current = requestAnimationFrame(render);
    }
  }, [getRodPosition, spawnParticles, intensity]);

  // Intersection Observer for visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          animFrameRef.current = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(animFrameRef.current);
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [render]);

  // Canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: TRANSITION_HEIGHT }}
    >
      {/* Metal plate seam line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-border/30" />
      
      {/* Canvas for sparks and welding */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Heat haze distortion overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: useTransform(weldProgress, [0, 0.5, 1], [0, 0.6, 0]),
        }}
      >
        <svg className="absolute inset-0 w-full h-full" style={{ filter: 'url(#heat-haze)' }}>
          <defs>
            <filter id="heat-haze">
              <feTurbulence
                type="turbulence"
                baseFrequency="0.015 0.08"
                numOctaves="3"
                result="turbulence"
              >
                <animate
                  attributeName="baseFrequency"
                  values="0.015 0.08;0.02 0.12;0.015 0.08"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="8"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="transparent" />
        </svg>
      </motion.div>

      {/* Ambient glow from welding */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: useTransform(weldProgress, [0, 0.3, 0.7, 1], [0, 0.4, 0.4, 0]),
          background: 'radial-gradient(ellipse 40% 100% at 50% 50%, hsla(42, 80%, 55%, 0.08), transparent)',
        }}
      />
    </div>
  );
};

export default WeldingTransition;
