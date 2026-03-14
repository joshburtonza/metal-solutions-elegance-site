import { ReactNode, useRef, useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';

type EntryEffect = 'fade-rise' | 'slide-left' | 'slide-right' | 'scale-up' | 'curtain' | 'none';

interface SnapSectionProps {
  children: ReactNode;
  effect?: EntryEffect;
  className?: string;
}

const getVariants = (effect: EntryEffect) => {
  const elegant = {
    type: 'tween' as const,
    duration: 1.1,
    ease: [0.25, 0.1, 0.25, 1] as number[],
  };

  switch (effect) {
    case 'fade-rise':
      return {
        hidden: { y: 60, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { ...elegant, duration: 1.2 } },
      };
    case 'slide-left':
      return {
        hidden: { x: 80, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: elegant },
      };
    case 'slide-right':
      return {
        hidden: { x: -80, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: elegant },
      };
    case 'scale-up':
      return {
        hidden: { scale: 0.92, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { ...elegant, duration: 1.3 } },
      };
    case 'curtain':
      return {
        hidden: { y: 40, opacity: 0, scale: 0.97 },
        visible: { y: 0, opacity: 1, scale: 1, transition: { ...elegant, duration: 1.4 } },
      };
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8 } },
      };
  }
};

const SnapSection = memo(({ children, effect = 'fade-rise', className = '' }: SnapSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const variants = getVariants(effect);

  return (
    <div
      ref={ref}
      className={`relative snap-start min-h-screen overflow-hidden ${className}`}
    >
      <motion.div
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={variants}
        style={{ minHeight: '100vh', willChange: 'transform, opacity' }}
      >
        {children}

        {/* Subtle gold accent line */}
        {isVisible && (
          <motion.div
            className="absolute inset-x-0 top-0 h-px pointer-events-none z-30"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 0.4, 0.15], scaleX: [0, 1, 1] }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
              background: 'linear-gradient(90deg, transparent 10%, hsl(var(--primary) / 0.5), transparent 90%)',
              transformOrigin: 'center',
            }}
          />
        )}
      </motion.div>
    </div>
  );
});

SnapSection.displayName = 'SnapSection';

export default SnapSection;
