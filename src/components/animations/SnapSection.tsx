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

  // Gentle parallax Y — content drifts up as you scroll into view
  const yUp = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [60, 0, 0, -20]);
  const yFade = useTransform(smoothProgress, [0, 0.25], [30, 0]);

  // Subtle scale breathe
  const scale = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [0.96, 1, 1, 0.99]);
  const scaleSubtle = useTransform(smoothProgress, [0, 0.2], [0.98, 1]);

  // Gold line
  const lineOpacity = useTransform(smoothProgress, [0.1, 0.25, 0.6], [0, 0.25, 0]);
  const lineScaleX = useTransform(smoothProgress, [0.08, 0.3], [0, 1]);

  const getMotionStyle = (): MotionStyle => {
    switch (effect) {
      case 'reveal-up':
        return { y: yUp, scale: scaleSubtle };
      case 'reveal-scale':
        return { scale };
      case 'reveal-mask':
        return { y: yFade };
      case 'reveal-fade':
        return { y: yFade };
      case 'curtain':
        return { scale: scaleSubtle, y: yFade };
      default:
        return {};
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
