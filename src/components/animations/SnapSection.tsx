import { ReactNode, useRef, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface SnapSectionProps {
  children: ReactNode;
  effect?: 'flip-up' | 'flip-left' | 'flip-right' | 'zoom-rotate' | 'slide-up' | 'none';
  className?: string;
}

// --- Web Audio metallic impact sound ---
let audioCtx: AudioContext | null = null;

const playMetallicClang = () => {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    const ctx = audioCtx;
    const now = ctx.currentTime;

    // Main metallic tone - short resonant ping
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1800, now);
    osc1.frequency.exponentialRampToValueAtTime(400, now + 0.15);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // High metallic overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(3200, now);
    osc2.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    gain2.gain.setValueAtTime(0.03, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.12);

    // Impact noise burst (the "clang" texture)
    const bufferSize = ctx.sampleRate * 0.08;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    // Bandpass to make it metallic
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2500;
    filter.Q.value = 5;
    noise.connect(filter).connect(noiseGain).connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.08);
  } catch {
    // Audio not available, silently skip
  }
};

// --- Screen shake ---
const triggerScreenShake = () => {
  const el = document.documentElement;
  el.style.transition = 'none';
  const frames = [
    { x: 3, y: 2 }, { x: -4, y: -1 }, { x: 2, y: -3 },
    { x: -2, y: 3 }, { x: 3, y: -1 }, { x: -1, y: 1 }, { x: 0, y: 0 },
  ];
  let i = 0;
  const shake = () => {
    if (i >= frames.length) {
      el.style.transform = '';
      el.style.transition = '';
      return;
    }
    el.style.transform = `translate(${frames[i].x}px, ${frames[i].y}px)`;
    i++;
    requestAnimationFrame(shake);
  };
  requestAnimationFrame(shake);
};

const SnapSection = ({ children, effect = 'flip-up', className = '' }: SnapSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  });

  // Fire shake + sound when section locks into place
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.88 && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      playMetallicClang();
      triggerScreenShake();
    }
    // Reset when scrolled away
    if (v < 0.5) {
      hasTriggeredRef.current = false;
    }
  });

  // CRANKED UP rotation angles
  const getTransforms = () => {
    switch (effect) {
      case 'flip-up':
        return {
          rotateX: useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [75, 25, 3, 0]),
          rotateY: useTransform(scrollYProgress, [0, 1], [0, 0]),
          y: useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [350, 80, 10, 0]),
          scale: useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0.6, 0.85, 0.98, 1]),
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 0.5, 1]),
        };
      case 'flip-left':
        return {
          rotateX: useTransform(scrollYProgress, [0, 0.5, 1], [10, 3, 0]),
          rotateY: useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [-60, -18, -2, 0]),
          y: useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [200, 50, 8, 0]),
          scale: useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0.7, 0.88, 0.98, 1]),
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 0.5, 1]),
        };
      case 'flip-right':
        return {
          rotateX: useTransform(scrollYProgress, [0, 0.5, 1], [10, 3, 0]),
          rotateY: useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [60, 18, 2, 0]),
          y: useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [200, 50, 8, 0]),
          scale: useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0.7, 0.88, 0.98, 1]),
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 0.5, 1]),
        };
      case 'zoom-rotate':
        return {
          rotateX: useTransform(scrollYProgress, [0, 0.4, 0.85, 1], [40, 12, 2, 0]),
          rotateY: useTransform(scrollYProgress, [0, 0.4, 0.85, 1], [30, 8, 1, 0]),
          y: useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [250, 60, 8, 0]),
          scale: useTransform(scrollYProgress, [0, 0.4, 0.85, 1], [0.4, 0.8, 0.97, 1]),
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 0.4, 1]),
        };
      case 'slide-up':
        return {
          rotateX: useTransform(scrollYProgress, [0, 0.85, 1], [15, 2, 0]),
          rotateY: useTransform(scrollYProgress, [0, 1], [0, 0]),
          y: useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [400, 100, 15, 0]),
          scale: useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0.85, 0.93, 0.99, 1]),
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.5], [0, 0.6, 1]),
        };
      case 'none':
      default:
        return {
          rotateX: useTransform(scrollYProgress, [0, 1], [0, 0]),
          rotateY: useTransform(scrollYProgress, [0, 1], [0, 0]),
          y: useTransform(scrollYProgress, [0, 1], [0, 0]),
          scale: useTransform(scrollYProgress, [0, 1], [1, 1]),
          opacity: useTransform(scrollYProgress, [0, 1], [1, 1]),
        };
    }
  };

  const { rotateX, rotateY, y, scale, opacity } = getTransforms();

  // Gold edge glow that flashes when section "lands"
  const glowOpacity = useTransform(scrollYProgress, [0.75, 0.88, 0.95, 1], [0, 0.9, 1, 0.2]);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          y,
          scale,
          opacity,
          transformOrigin: 'center bottom',
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
        }}
      >
        {children}

        {/* Gold weld-flash along top edge when section locks in */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[3px] pointer-events-none z-30"
          style={{
            opacity: glowOpacity,
            background: 'linear-gradient(90deg, transparent 2%, hsl(42 80% 55%), hsl(48 100% 85%), hsl(42 80% 55%), transparent 98%)',
            boxShadow: '0 0 50px 6px hsl(42 80% 55% / 0.6), 0 0 100px 12px hsl(42 80% 55% / 0.3), 0 0 150px 20px hsl(35 70% 45% / 0.15)',
          }}
        />
        {/* Gold ambient wash from the weld */}
        <motion.div
          className="absolute inset-x-0 top-0 h-48 pointer-events-none z-20"
          style={{
            opacity: useTransform(glowOpacity, v => v * 0.4),
            background: 'linear-gradient(180deg, hsl(42 80% 55% / 0.15), transparent)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default SnapSection;
