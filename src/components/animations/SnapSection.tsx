import { ReactNode, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type EntryEffect = 'flip-up' | 'flip-left' | 'flip-right' | 'zoom-rotate' | 'slam-down' | 'none';

interface SnapSectionProps {
  children: ReactNode;
  effect?: EntryEffect;
  className?: string;
}

// --- Web Audio metallic impact ---
let audioCtx: AudioContext | null = null;

const playMetallicClang = () => {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    const ctx = audioCtx;
    const now = ctx.currentTime;

    // Resonant metal ping
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2200, now);
    osc1.frequency.exponentialRampToValueAtTime(350, now + 0.2);
    gain1.gain.setValueAtTime(0.1, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // High overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(4000, now);
    osc2.frequency.exponentialRampToValueAtTime(600, now + 0.06);
    gain2.gain.setValueAtTime(0.04, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.1);

    // Impact noise
    const bufferSize = ctx.sampleRate * 0.06;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.07, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000;
    filter.Q.value = 8;
    noise.connect(filter).connect(noiseGain).connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.06);
  } catch {
    // silently skip
  }
};

// --- Screen shake ---
const triggerScreenShake = () => {
  const el = document.documentElement;
  el.style.transition = 'none';
  const frames = [
    { x: 5, y: 3 }, { x: -6, y: -2 }, { x: 4, y: -4 },
    { x: -3, y: 5 }, { x: 5, y: -2 }, { x: -2, y: 2 },
    { x: 1, y: -1 }, { x: 0, y: 0 },
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

// Animation variants per effect type
const getVariants = (effect: EntryEffect): { hidden: Record<string, any>; visible: Record<string, any> } => {
  switch (effect) {
    case 'flip-up':
      return {
        hidden: {
          rotateX: 90, y: 200, scale: 0.7, opacity: 0,
          filter: 'brightness(2) blur(4px)',
        },
        visible: {
          rotateX: 0, y: 0, scale: 1, opacity: 1,
          filter: 'brightness(1) blur(0px)',
          transition: { type: 'spring' as const, stiffness: 60, damping: 15, mass: 1.2 },
        },
      };
    case 'flip-left':
      return {
        hidden: {
          rotateY: -80, x: -300, scale: 0.65, opacity: 0,
          filter: 'brightness(1.8) blur(3px)',
        },
        visible: {
          rotateY: 0, x: 0, scale: 1, opacity: 1,
          filter: 'brightness(1) blur(0px)',
          transition: { type: 'spring' as const, stiffness: 55, damping: 14, mass: 1.3 },
        },
      };
    case 'flip-right':
      return {
        hidden: {
          rotateY: 80, x: 300, scale: 0.65, opacity: 0,
          filter: 'brightness(1.8) blur(3px)',
        },
        visible: {
          rotateY: 0, x: 0, scale: 1, opacity: 1,
          filter: 'brightness(1) blur(0px)',
          transition: { type: 'spring' as const, stiffness: 55, damping: 14, mass: 1.3 },
        },
      };
    case 'zoom-rotate':
      return {
        hidden: {
          rotateX: 50, rotateY: 30, scale: 0.3, opacity: 0,
          filter: 'brightness(2.5) blur(6px)',
        },
        visible: {
          rotateX: 0, rotateY: 0, scale: 1, opacity: 1,
          filter: 'brightness(1) blur(0px)',
          transition: { type: 'spring' as const, stiffness: 50, damping: 12, mass: 1.5 },
        },
      };
    case 'slam-down':
      return {
        hidden: {
          rotateX: -60, y: -400, scale: 1.3, opacity: 0,
          filter: 'brightness(2) blur(2px)',
        },
        visible: {
          rotateX: 0, y: 0, scale: 1, opacity: 1,
          filter: 'brightness(1) blur(0px)',
          transition: { type: 'spring' as const, stiffness: 80, damping: 12, mass: 1.8 },
        },
      };
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
      };
  }
};

const SnapSection = ({ children, effect = 'flip-up', className = '' }: SnapSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          setIsVisible(true);
          if (!hasPlayedSound.current && effect !== 'none') {
            hasPlayedSound.current = true;
            // Slight delay so the animation is visible before impact
            setTimeout(() => {
              playMetallicClang();
              triggerScreenShake();
            }, 400);
          }
        } else if (!entry.isIntersecting) {
          setIsVisible(false);
          hasPlayedSound.current = false;
        }
      },
      { threshold: [0.3, 0.5] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [effect]);

  const variants = getVariants(effect);

  return (
    <div
      ref={ref}
      className={`relative snap-start min-h-screen overflow-hidden ${className}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={variants}
        style={{
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity, filter',
          minHeight: '100vh',
        }}
      >
        {children}

        {/* Gold weld-flash along top edge on entry */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[3px] pointer-events-none z-30"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isVisible ? {
            opacity: [0, 1, 1, 0.3],
            scaleX: [0, 0.3, 1, 1],
          } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            background: 'linear-gradient(90deg, transparent 2%, hsl(42 80% 55%), hsl(48 100% 85%), hsl(42 80% 55%), transparent 98%)',
            boxShadow: '0 0 60px 8px hsl(42 80% 55% / 0.7), 0 0 120px 16px hsl(42 80% 55% / 0.35), 0 0 180px 24px hsl(35 70% 45% / 0.15)',
            transformOrigin: 'left center',
          }}
        />

        {/* Gold ambient wash */}
        <motion.div
          className="absolute inset-x-0 top-0 h-64 pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: [0, 0.5, 0.15] } : { opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{
            background: 'linear-gradient(180deg, hsl(42 80% 55% / 0.2), transparent)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default SnapSection;
