import { ReactNode, useRef, memo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

type EntryEffect = 'reveal-up' | 'reveal-scale' | 'reveal-mask' | 'reveal-fade' | 'curtain';

interface SnapSectionProps {
  children: ReactNode;
  effect?: EntryEffect;
  className?: string;
}

const SnapSection = memo(({ children, effect = 'reveal-up', className = '' }: SnapSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Smooth spring for buttery interpolation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.0001,
  });

  // --- Scroll-linked transforms per effect ---

  // Opacity: fade in during first 40% of scroll, stay visible
  const opacity = useTransform(smoothProgress, [0, 0.25, 0.85, 1], [0, 1, 1, 0.6]);

  // Parallax Y offset — content rises gently into place
  const yUp = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [120, 0, 0, -40]);
  const yFade = useTransform(smoothProgress, [0, 0.3], [60, 0]);

  // Scale — grows subtly from 0.92 to 1
  const scale = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1, 0.97]);
  const scaleSubtle = useTransform(smoothProgress, [0, 0.25], [0.96, 1]);

  // Clip-path mask reveal (bottom to top wipe)
  const clipProgress = useTransform(smoothProgress, [0, 0.35], [100, 0]);

  // Curtain — split from center
  const curtainInset = useTransform(smoothProgress, [0, 0.3], [50, 0]);

  // Blur (very subtle, only on entry)
  const blur = useTransform(smoothProgress, [0, 0.2], [8, 0]);

  // Build style based on effect
  const getMotionStyle = () => {
    switch (effect) {
      case 'reveal-up':
        return { y: yUp, opacity, scale: scaleSubtle };
      case 'reveal-scale':
        return { scale, opacity };
      case 'reveal-mask':
        return { opacity: 1 }; // clip-path handles visibility
      case 'reveal-fade':
        return { y: yFade, opacity };
      case 'curtain':
        return { opacity };
      default:
        return { opacity };
    }
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        style={{
          ...getMotionStyle(),
          // Clip-path for mask effects
          ...(effect === 'reveal-mask'
            ? { clipPath: useTransform(clipProgress, (v) => `inset(${v}% 0% 0% 0%)`) }
            : {}),
          ...(effect === 'curtain'
            ? { clipPath: useTransform(curtainInset, (v) => `inset(0% ${v}% 0% ${v}%)`) }
            : {}),
          // Subtle blur on entry for depth-of-field feel
          ...(effect !== 'reveal-mask' && effect !== 'curtain'
            ? { filter: useTransform(blur, (v) => `blur(${v}px)`) }
            : {}),
          willChange: 'transform, opacity, clip-path, filter',
        }}
      >
        {children}

        {/* Ambient gold line — scroll-linked opacity */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px pointer-events-none z-30"
          style={{
            opacity: useTransform(smoothProgress, [0.15, 0.35, 0.7], [0, 0.3, 0]),
            scaleX: useTransform(smoothProgress, [0.1, 0.4], [0, 1]),
            background: 'linear-gradient(90deg, transparent 5%, hsl(var(--primary) / 0.4), transparent 95%)',
            transformOrigin: 'center',
          }}
        />
      </motion.div>
    </div>
  );
});

SnapSection.displayName = 'SnapSection';

export default SnapSection;
