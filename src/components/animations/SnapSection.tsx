import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SnapSectionProps {
  children: ReactNode;
  /** 3D entrance effect */
  effect?: 'flip-up' | 'flip-left' | 'flip-right' | 'zoom-rotate' | 'slide-up' | 'none';
  className?: string;
}

const SnapSection = ({ children, effect = 'flip-up', className = '' }: SnapSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  });

  // All transforms happen as the section scrolls into view (0 = off-screen below, 1 = snapped in)
  const getTransforms = () => {
    switch (effect) {
      case 'flip-up':
        return {
          rotateX: useTransform(scrollYProgress, [0, 0.6, 1], [45, 10, 0]),
          rotateY: useTransform(scrollYProgress, [0, 1], [0, 0]),
          y: useTransform(scrollYProgress, [0, 0.6, 1], [200, 30, 0]),
          scale: useTransform(scrollYProgress, [0, 0.6, 1], [0.8, 0.95, 1]),
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 0.6, 1]),
        };
      case 'flip-left':
        return {
          rotateX: useTransform(scrollYProgress, [0, 1], [0, 0]),
          rotateY: useTransform(scrollYProgress, [0, 0.6, 1], [-35, -8, 0]),
          y: useTransform(scrollYProgress, [0, 0.6, 1], [120, 20, 0]),
          scale: useTransform(scrollYProgress, [0, 0.6, 1], [0.85, 0.97, 1]),
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 0.6, 1]),
        };
      case 'flip-right':
        return {
          rotateX: useTransform(scrollYProgress, [0, 1], [0, 0]),
          rotateY: useTransform(scrollYProgress, [0, 0.6, 1], [35, 8, 0]),
          y: useTransform(scrollYProgress, [0, 0.6, 1], [120, 20, 0]),
          scale: useTransform(scrollYProgress, [0, 0.6, 1], [0.85, 0.97, 1]),
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 0.6, 1]),
        };
      case 'zoom-rotate':
        return {
          rotateX: useTransform(scrollYProgress, [0, 0.5, 1], [20, 5, 0]),
          rotateY: useTransform(scrollYProgress, [0, 0.5, 1], [15, 3, 0]),
          y: useTransform(scrollYProgress, [0, 0.6, 1], [150, 20, 0]),
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 0.9, 1]),
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 0.5, 1]),
        };
      case 'slide-up':
        return {
          rotateX: useTransform(scrollYProgress, [0, 1], [0, 0]),
          rotateY: useTransform(scrollYProgress, [0, 1], [0, 0]),
          y: useTransform(scrollYProgress, [0, 0.6, 1], [300, 40, 0]),
          scale: useTransform(scrollYProgress, [0, 0.6, 1], [0.92, 0.98, 1]),
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 0.7, 1]),
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
  const glowOpacity = useTransform(scrollYProgress, [0.6, 0.8, 0.95, 1], [0, 0.7, 1, 0]);

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ perspective: 1400 }}
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
          className="absolute inset-x-0 top-0 h-[2px] pointer-events-none z-30"
          style={{
            opacity: glowOpacity,
            background: 'linear-gradient(90deg, transparent 5%, hsl(42 80% 55%), hsl(48 95% 80%), hsl(42 80% 55%), transparent 95%)',
            boxShadow: '0 0 40px 4px hsl(42 80% 55% / 0.5), 0 0 80px 8px hsl(42 80% 55% / 0.25), 0 0 120px 12px hsl(35 70% 45% / 0.1)',
          }}
        />
        {/* Subtle gold ambient wash */}
        <motion.div
          className="absolute inset-x-0 top-0 h-32 pointer-events-none z-20"
          style={{
            opacity: useTransform(glowOpacity, v => v * 0.3),
            background: 'linear-gradient(180deg, hsl(42 80% 55% / 0.12), transparent)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default SnapSection;
