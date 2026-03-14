import { useRef, useEffect, useCallback, useState } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  brightness: number;
}

type Direction = 'left-to-right' | 'right-to-left' | 'center-out' | 'edges-in';

interface WeldingTransitionProps {
  direction?: Direction;
  intensity?: number;
}

const WeldingTransition = ({ direction = 'left-to-right', intensity = 1 }: WeldingTransitionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const progressRef = useRef(0);
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  const MAX_SPARKS = isMobile ? 120 : 300;

  const spawnSparks = useCallback((x: number, y: number, count: number, canvasH: number) => {
    for (let i = 0; i < count; i++) {
      if (sparksRef.current.length >= MAX_SPARKS) {
        sparksRef.current.shift();
      }
      // Sparks shoot upward and downward from the seam edge
      const side = Math.random() > 0.5 ? -1 : 1; // up or down
      const angle = (Math.random() * 0.8 - 0.4) + (side === -1 ? -Math.PI / 2 : Math.PI / 2);
      const speed = 2 + Math.random() * 6 * intensity;
      const life = 20 + Math.random() * 35;

      sparksRef.current.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed * (0.5 + Math.random() * 0.8),
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        size: 0.5 + Math.random() * 2.5,
        brightness: 0.5 + Math.random() * 0.5,
      });
    }
  }, [intensity, MAX_SPARKS]);

  const getWeldX = useCallback((progress: number, width: number): number => {
    switch (direction) {
      case 'left-to-right':
        return progress * width;
      case 'right-to-left':
        return width - progress * width;
      case 'center-out': {
        // Two points moving outward from center
        return width / 2 + (progress - 0.5) * width;
      }
      case 'edges-in':
        return progress * width;
      default:
        return progress * width;
    }
  }, [direction]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const seamY = h / 2;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const progress = progressRef.current;

    // --- Draw the glowing seam/weld bead ---
    if (progress > 0.01) {
      const startX = direction === 'right-to-left' ? getWeldX(progress, w) : 0;
      const endX = direction === 'right-to-left' ? w : getWeldX(progress, w);

      // Outer glow
      ctx.shadowColor = 'hsla(42, 90%, 60%, 0.6)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(startX, seamY);
      ctx.lineTo(endX, seamY);
      ctx.strokeStyle = 'hsla(42, 85%, 55%, 0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Hot bead core - gradient from cooled to hot at the tip
      const beadGrad = ctx.createLinearGradient(startX, seamY, endX, seamY);
      if (direction === 'right-to-left') {
        beadGrad.addColorStop(0, 'hsla(48, 100%, 90%, 1)');
        beadGrad.addColorStop(0.15, 'hsla(42, 90%, 65%, 0.9)');
        beadGrad.addColorStop(0.5, 'hsla(35, 80%, 45%, 0.7)');
        beadGrad.addColorStop(1, 'hsla(28, 60%, 30%, 0.3)');
      } else {
        beadGrad.addColorStop(0, 'hsla(28, 60%, 30%, 0.3)');
        beadGrad.addColorStop(0.5, 'hsla(35, 80%, 45%, 0.7)');
        beadGrad.addColorStop(0.85, 'hsla(42, 90%, 65%, 0.9)');
        beadGrad.addColorStop(1, 'hsla(48, 100%, 90%, 1)');
      }
      ctx.beginPath();
      ctx.moveTo(startX, seamY);
      ctx.lineTo(endX, seamY);
      ctx.strokeStyle = beadGrad;
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- Arc flash at the welding tip ---
      const tipX = getWeldX(progress, w);
      const flashSize = 25 + Math.sin(Date.now() * 0.02) * 8;

      // Intense white-gold glow
      const flash = ctx.createRadialGradient(tipX, seamY, 0, tipX, seamY, flashSize * intensity);
      flash.addColorStop(0, 'hsla(48, 100%, 95%, 0.95)');
      flash.addColorStop(0.2, 'hsla(45, 95%, 80%, 0.7)');
      flash.addColorStop(0.5, 'hsla(42, 80%, 55%, 0.3)');
      flash.addColorStop(1, 'transparent');
      ctx.fillStyle = flash;
      ctx.fillRect(tipX - flashSize, seamY - flashSize, flashSize * 2, flashSize * 2);

      // Extra bloom
      const bloom = ctx.createRadialGradient(tipX, seamY, 0, tipX, seamY, flashSize * 2.5);
      bloom.addColorStop(0, 'hsla(42, 80%, 55%, 0.15)');
      bloom.addColorStop(1, 'transparent');
      ctx.fillStyle = bloom;
      ctx.fillRect(tipX - flashSize * 2.5, seamY - flashSize * 2.5, flashSize * 5, flashSize * 5);
    }

    // --- Render sparks ---
    ctx.globalCompositeOperation = 'lighter';
    const sparks = sparksRef.current;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];

      // Physics
      s.vy += 0.12; // gravity
      s.vx *= 0.985;
      s.vy *= 0.985;
      s.x += s.vx;
      s.y += s.vy;
      s.life--;

      if (s.life <= 0 || s.x < -30 || s.x > w + 30 || s.y < -50 || s.y > h + 50) {
        sparks.splice(i, 1);
        continue;
      }

      const lifeRatio = s.life / s.maxLife;
      const alpha = lifeRatio * s.brightness;

      // Color: white-hot → gold → orange → dim red
      let r: number, g: number, b: number;
      if (lifeRatio > 0.7) {
        r = 255; g = 245; b = 200 + lifeRatio * 55;
      } else if (lifeRatio > 0.35) {
        r = 255; g = 170 + lifeRatio * 100; b = 40 + lifeRatio * 60;
      } else {
        r = 220 + lifeRatio * 35; g = 80 + lifeRatio * 120; b = 10;
      }

      // Motion blur trail line
      const trailLen = Math.sqrt(s.vx * s.vx + s.vy * s.vy) * 2;
      const trailAngle = Math.atan2(s.vy, s.vx);
      ctx.beginPath();
      ctx.moveTo(s.x - Math.cos(trailAngle) * trailLen, s.y - Math.sin(trailAngle) * trailLen);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`;
      ctx.lineWidth = s.size * lifeRatio;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Bright spark head
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * lifeRatio * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 250, 230, ${alpha * 0.9})`;
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();

    if (isVisibleRef.current) {
      animFrameRef.current = requestAnimationFrame(render);
    }
  }, [getWeldX, direction, intensity]);

  // Scroll listener to drive progress and spawn sparks
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const viewH = window.innerHeight;

      // Progress: 0 when section top reaches viewport bottom, 1 when section bottom reaches viewport top
      const rawProgress = 1 - (rect.top + rect.height) / (viewH + rect.height);
      const progress = Math.max(0, Math.min(1, rawProgress));

      const prevProgress = progressRef.current;
      const delta = Math.abs(progress - prevProgress);
      progressRef.current = progress;

      // Spawn sparks when scrolling and the transition is in view
      if (delta > 0.001 && progress > 0.05 && progress < 0.95) {
        const dpr = Math.min(window.devicePixelRatio, 2);
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        const tipX = getWeldX(progress, w);
        const spawnCount = Math.min(Math.floor(delta * 500 * intensity), 20);
        if (spawnCount > 0) {
          spawnSparks(tipX, h / 2, spawnCount, h);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [getWeldX, spawnSparks, intensity]);

  // Canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Intersection Observer
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
      { rootMargin: '200px' }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [render]);

  return (
    <div
      ref={containerRef}
      className="relative w-full pointer-events-none z-10"
      style={{ height: 80, marginTop: -40, marginBottom: -40 }}
    >
      {/* Thin glowing seam line (CSS fallback) */}
      <div 
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(42 80% 55% / 0.15), hsl(42 80% 55% / 0.25), hsl(42 80% 55% / 0.15), transparent)',
        }}
      />

      {/* Canvas for sparks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default WeldingTransition;
