import { ReactNode, useRef, memo } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionStyle } from 'framer-motion';

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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.0001,
  });

  // All transforms declared unconditionally (hooks rules)
  const opacity = useTransform(smoothProgress, [0, 0.25, 0.85, 1], [0, 1, 1, 0.6]);
  const yUp = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [120, 0, 0, -40]);
  const yFade = useTransform(smoothProgress, [0, 0.3], [60, 0]);
  const scale = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1, 0.97]);
  const scaleSubtle = useTransform(smoothProgress, [0, 0.25], [0.96, 1]);
  const clipMask = useTransform(smoothProgress, [0, 0.35], [100, 0]);
  const clipMaskPath = useTransform(clipMask, (v) => `inset(${v}% 0% 0% 0%)`);
  const curtainInset = useTransform(smoothProgress, [0, 0.3], [50, 0]);
  const curtainPath = useTransform(curtainInset, (v) => `inset(0% ${v}% 0% ${v}%)`);
  const blur = useTransform(smoothProgress, [0, 0.2], [8, 0]);
  const filterBlur = useTransform(blur, (v) => `blur(${v}px)`);

  // Gold line transforms
  const lineOpacity = useTransform(smoothProgress, [0.15, 0.35, 0.7], [0, 0.3, 0]);
  const lineScaleX = useTransform(smoothProgress, [0.1, 0.4], [0, 1]);

  const getMotionStyle = (): MotionStyle => {
    switch (effect) {
      case 'reveal-up':
        return { y: yUp, opacity, scale: scaleSubtle, filter: filterBlur };
      case 'reveal-scale':
        return { scale, opacity, filter: filterBlur };
      case 'reveal-mask':
        return { clipPath: clipMaskPath };
      case 'reveal-fade':
        return { y: yFade, opacity, filter: filterBlur };
      case 'curtain':
        return { opacity, clipPath: curtainPath };
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
          willChange: 'transform, opacity, clip-path, filter',
        }}
      >
        {children}

        {/* Ambient gold line */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px pointer-events-none z-30"
          style={{
            opacity: lineOpacity,
            scaleX: lineScaleX,
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
