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

  // Opacity: 0→1 in first 30%, hold, gentle fade at exit
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.75, 1], [0, 1, 1, 0.7]);

  // Y translations
  const yUp = useTransform(smoothProgress, [0, 0.2, 0.7, 1], [80, 0, 0, -30]);
  const yFade = useTransform(smoothProgress, [0, 0.2], [40, 0]);

  // Scale
  const scale = useTransform(smoothProgress, [0, 0.2, 0.75, 1], [0.94, 1, 1, 0.98]);
  const scaleSubtle = useTransform(smoothProgress, [0, 0.2], [0.97, 1]);

  // Clip-path reveals
  const clipMask = useTransform(smoothProgress, [0, 0.25], [100, 0]);
  const clipMaskPath = useTransform(clipMask, (v) => `inset(${v}% 0% 0% 0%)`);
  const curtainInset = useTransform(smoothProgress, [0, 0.25], [50, 0]);
  const curtainPath = useTransform(curtainInset, (v) => `inset(0% ${v}% 0% ${v}%)`);

  // Gold line
  const lineOpacity = useTransform(smoothProgress, [0.1, 0.25, 0.6], [0, 0.25, 0]);
  const lineScaleX = useTransform(smoothProgress, [0.08, 0.3], [0, 1]);

  const getMotionStyle = (): MotionStyle => {
    switch (effect) {
      case 'reveal-up':
        return { y: yUp, opacity, scale: scaleSubtle };
      case 'reveal-scale':
        return { scale, opacity };
      case 'reveal-mask':
        return { clipPath: clipMaskPath };
      case 'reveal-fade':
        return { y: yFade, opacity };
      case 'curtain':
        return { opacity, clipPath: curtainPath };
      default:
        return { opacity };
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={getMotionStyle()}>
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
