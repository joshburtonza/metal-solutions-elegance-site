import { ReactNode, useRef, useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';

type EntryEffect = 'flip-up' | 'flip-left' | 'flip-right' | 'zoom-rotate' | 'slam-down' | 'none';

interface SnapSectionProps {
  children: ReactNode;
  effect?: EntryEffect;
  className?: string;
}

// --- Cached Web Audio context ---
let audioCtx: AudioContext | null = null;
const getAudioCtx = () => {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
};

const playMetallicClang = () => {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    // Single resonant ping (reduced from 3 nodes to 2)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);

    // Short noise burst
    const len = ctx.sampleRate * 0.04;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.08));
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.05, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    src.connect(ng).connect(ctx.destination);
    src.start(now);
    src.stop(now + 0.04);
  } catch {
    // silently skip
  }
};

// --- Lightweight CSS-based shake (no layout thrash) ---
const triggerScreenShake = () => {
  const el = document.documentElement;
  el.classList.add('screen-shake');
  setTimeout(() => el.classList.remove('screen-shake'), 300);
};

// Animation variants — using only transform + opacity (GPU-composited, no filter)
const getVariants = (effect: EntryEffect) => {
  const spring = { type: 'spring' as const, stiffness: 70, damping: 16, mass: 1 };

  switch (effect) {
    case 'flip-up':
      return {
        hidden: { rotateX: 60, y: 120, scale: 0.8, opacity: 0 },
        visible: { rotateX: 0, y: 0, scale: 1, opacity: 1, transition: spring },
      };
    case 'flip-left':
      return {
        hidden: { rotateY: -55, x: -200, scale: 0.75, opacity: 0 },
        visible: { rotateY: 0, x: 0, scale: 1, opacity: 1, transition: spring },
      };
    case 'flip-right':
      return {
        hidden: { rotateY: 55, x: 200, scale: 0.75, opacity: 0 },
        visible: { rotateY: 0, x: 0, scale: 1, opacity: 1, transition: spring },
      };
    case 'zoom-rotate':
      return {
        hidden: { rotateX: 35, rotateY: 20, scale: 0.5, opacity: 0 },
        visible: { rotateX: 0, rotateY: 0, scale: 1, opacity: 1, transition: spring },
      };
    case 'slam-down':
      return {
        hidden: { rotateX: -45, y: -250, scale: 1.15, opacity: 0 },
        visible: { rotateX: 0, y: 0, scale: 1, opacity: 1, transition: { ...spring, stiffness: 90, damping: 14 } },
      };
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4 } },
      };
  }
};

const SnapSection = memo(({ children, effect = 'flip-up', className = '' }: SnapSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          setIsVisible(true);
          if (!triggered.current && effect !== 'none') {
            triggered.current = true;
            // Fire after animation is mostly visible
            setTimeout(() => {
              playMetallicClang();
              triggerScreenShake();
            }, 350);
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [effect]);

  const variants = getVariants(effect);

  return (
    <div
      ref={ref}
      className={`relative snap-start min-h-screen overflow-hidden ${className}`}
      style={{ perspective: 1000 }}
    >
      <motion.div
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={variants}
        style={{
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
          minHeight: '100vh',
        }}
      >
        {children}

        {/* Gold weld-flash line */}
        {isVisible && (
          <motion.div
            className="absolute inset-x-0 top-0 h-[2px] pointer-events-none z-30"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 1, 0.2], scaleX: [0, 1, 1] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              background: 'linear-gradient(90deg, transparent 5%, hsl(var(--primary)), hsl(var(--primary) / 0.6), transparent 95%)',
              boxShadow: '0 0 30px 4px hsl(var(--primary) / 0.5)',
              transformOrigin: 'left center',
            }}
          />
        )}
      </motion.div>
    </div>
  );
});

SnapSection.displayName = 'SnapSection';

export default SnapSection;
