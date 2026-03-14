import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type FlipOrigin = 'top' | 'bottom' | 'left' | 'right';

interface MetalPlateRevealProps {
  children: ReactNode;
  origin?: FlipOrigin;
  /** Max rotation angle in degrees */
  angle?: number;
  /** Add gold spark edge glow when plate locks in */
  sparks?: boolean;
}

const MetalPlateReveal = ({
  children,
  origin = 'top',
  angle = 8,
  sparks = true,
}: MetalPlateRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Map: section enters viewport → rotates from angled to flat
  // 0 = section top at viewport bottom, 0.3 = locked in, stays flat
  const rotateProgress = useTransform(scrollYProgress, [0, 0.25, 0.35], [1, 0.1, 0]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.15, 0.25], [0, 0.7, 1]);

  // Edge glow intensity (bright flash at the moment it locks in)
  const glowOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.45], [0, 0.8, 1, 0]);

  // Scale: starts slightly smaller, scales to 1
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.35], [0.96, 0.995, 1]);

  // Build the rotation based on origin
  const getRotateAxis = () => {
    switch (origin) {
      case 'top':
        return { rotateX: useTransform(rotateProgress, (v) => v * angle), rotateY: 0 };
      case 'bottom':
        return { rotateX: useTransform(rotateProgress, (v) => v * -angle), rotateY: 0 };
      case 'left':
        return { rotateX: 0, rotateY: useTransform(rotateProgress, (v) => v * -angle) };
      case 'right':
        return { rotateX: 0, rotateY: useTransform(rotateProgress, (v) => v * angle) };
    }
  };

  const { rotateX, rotateY } = getRotateAxis();

  // Transform origin based on flip direction
  const transformOrigin = {
    top: 'center top',
    bottom: 'center bottom',
    left: 'left center',
    right: 'right center',
  }[origin];

  // Edge glow position
  const glowPosition = {
    top: 'inset-x-0 top-0 h-[2px]',
    bottom: 'inset-x-0 bottom-0 h-[2px]',
    left: 'inset-y-0 left-0 w-[2px]',
    right: 'inset-y-0 right-0 w-[2px]',
  }[origin];

  const glowGradient = {
    top: 'linear-gradient(90deg, transparent, hsl(42 80% 55%), hsl(48 95% 75%), hsl(42 80% 55%), transparent)',
    bottom: 'linear-gradient(90deg, transparent, hsl(42 80% 55%), hsl(48 95% 75%), hsl(42 80% 55%), transparent)',
    left: 'linear-gradient(180deg, transparent, hsl(42 80% 55%), hsl(48 95% 75%), hsl(42 80% 55%), transparent)',
    right: 'linear-gradient(180deg, transparent, hsl(42 80% 55%), hsl(48 95% 75%), hsl(42 80% 55%), transparent)',
  }[origin];

  return (
    <div ref={ref} className="relative" style={{ perspective: 1200 }}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          opacity: opacityProgress,
          transformOrigin,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}

        {/* Gold edge glow — flashes as the plate "welds" into position */}
        {sparks && (
          <>
            <motion.div
              className={`absolute ${glowPosition} pointer-events-none z-20`}
              style={{
                background: glowGradient,
                opacity: glowOpacity,
                boxShadow: '0 0 30px hsl(42 80% 55% / 0.6), 0 0 60px hsl(42 80% 55% / 0.3), 0 0 100px hsl(35 70% 45% / 0.15)',
              }}
            />
            {/* Ambient glow wash */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10 rounded-sm"
              style={{
                opacity: useTransform(glowOpacity, (v) => v * 0.15),
                background: 'radial-gradient(ellipse 80% 30% at 50% 0%, hsl(42 80% 55% / 0.2), transparent)',
              }}
            />
          </>
        )}
      </motion.div>
    </div>
  );
};

export default MetalPlateReveal;
