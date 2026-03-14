import { motion, useInView, Variants, useScroll, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';

type AnimationType = 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scaleUp' | 'rotateIn' | 'slideUp' | 'clipReveal' | 'blurIn';

const variants: Record<AnimationType, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -60, filter: 'blur(8px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' }
  },
  fadeRight: {
    hidden: { opacity: 0, x: 60, filter: 'blur(8px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' }
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.85, filter: 'blur(15px)' },
    visible: { opacity: 1, scale: 1, filter: 'blur(0px)' }
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -3, scale: 0.95, filter: 'blur(5px)' },
    visible: { opacity: 1, rotate: 0, scale: 1, filter: 'blur(0px)' }
  },
  slideUp: {
    hidden: { opacity: 0, y: 100, filter: 'blur(12px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
  },
  clipReveal: {
    hidden: { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
    visible: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(20px)', scale: 1.05 },
    visible: { opacity: 1, filter: 'blur(0px)', scale: 1 }
  }
};

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 1,
  className = '',
  once = true
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[animation]}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger children wrapper
export function StaggerChildren({
  children,
  className = '',
  staggerDelay = 0.1
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Parallax wrapper
export function ParallaxSection({
  children,
  speed = 0.5,
  className = ''
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], [50 * speed, -50 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
