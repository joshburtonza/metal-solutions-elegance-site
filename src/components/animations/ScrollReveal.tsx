import { motion, useInView, Variants, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, ReactNode, useEffect, useState, useCallback } from 'react';

type AnimationType = 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scaleUp' | 'rotateIn' | 'slideUp' | 'clipReveal' | 'blurIn' | 'splitReveal';

const variants: Record<AnimationType, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 80, filter: 'blur(12px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -80, filter: 'blur(8px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' }
  },
  fadeRight: {
    hidden: { opacity: 0, x: 80, filter: 'blur(8px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' }
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8, filter: 'blur(20px)' },
    visible: { opacity: 1, scale: 1, filter: 'blur(0px)' }
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -5, scale: 0.9, filter: 'blur(8px)' },
    visible: { opacity: 1, rotate: 0, scale: 1, filter: 'blur(0px)' }
  },
  slideUp: {
    hidden: { opacity: 0, y: 120, filter: 'blur(15px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
  },
  clipReveal: {
    hidden: { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
    visible: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(30px)', scale: 1.1 },
    visible: { opacity: 1, filter: 'blur(0px)', scale: 1 }
  },
  splitReveal: {
    hidden: { opacity: 0, y: 60, rotateX: 45 },
    visible: { opacity: 1, y: 0, rotateX: 0 }
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

// Split text — each letter animates independently
export function SplitText({
  text,
  className = '',
  letterClassName = '',
  delay = 0,
  staggerDelay = 0.03,
  animation = 'up' as 'up' | 'wave' | 'blur' | 'elastic'
}: {
  text: string;
  className?: string;
  letterClassName?: string;
  delay?: number;
  staggerDelay?: number;
  animation?: 'up' | 'wave' | 'blur' | 'elastic';
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const letterVariants: Record<string, Variants> = {
    up: {
      hidden: { opacity: 0, y: 80, rotateX: 90 },
      visible: { opacity: 1, y: 0, rotateX: 0 }
    },
    wave: {
      hidden: { opacity: 0, y: 40, scale: 0.5 },
      visible: { opacity: 1, y: 0, scale: 1 }
    },
    blur: {
      hidden: { opacity: 0, filter: 'blur(20px)', x: 20 },
      visible: { opacity: 1, filter: 'blur(0px)', x: 0 }
    },
    elastic: {
      hidden: { opacity: 0, scale: 0, rotate: -20 },
      visible: { opacity: 1, scale: 1, rotate: 0 }
    }
  };

  const springTransition = animation === 'elastic' 
    ? { type: 'spring', damping: 12, stiffness: 200 }
    : { duration: 0.6, ease: [0.16, 1, 0.3, 1] };

  const words = text.split(' ');
  let letterIndex = 0;

  return (
    <motion.span ref={ref} className={`inline-block ${className}`} style={{ perspective: '600px' }}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split('').map((letter) => {
            const idx = letterIndex++;
            return (
              <motion.span
                key={idx}
                className={`inline-block ${letterClassName}`}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={letterVariants[animation]}
                transition={{
                  ...springTransition,
                  delay: delay + idx * staggerDelay
                }}
                style={{ transformOrigin: 'bottom center' }}
              >
                {letter}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}

// Magnetic hover effect
export function MagneticWrap({
  children,
  strength = 0.3,
  className = ''
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }, [x, y, strength]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}

// 3D Tilt card
export function TiltCard({
  children,
  className = '',
  intensity = 15,
  glare = true
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-ny * intensity);
    rotateY.set(nx * intensity);
    setGlarePos({ x: (nx + 0.5) * 100, y: (ny + 0.5) * 100 });
  }, [rotateX, rotateY, intensity]);

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, hsl(42 80% 55% / 0.12), transparent 60%)`
          }}
        />
      )}
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
        hidden: { opacity: 0, y: 50, filter: 'blur(10px)', scale: 0.95 },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
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
  const y = useTransform(scrollYProgress, [0, 1], [80 * speed, -80 * speed]);

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

// Horizontal scroll section
export function HorizontalScroll({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);

  return (
    <div ref={ref} className={`relative h-[300vh] ${className}`}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8">
          {children}
        </motion.div>
      </div>
    </div>
  );
}

// Marquee/infinite ticker
export function MarqueeTicker({
  children,
  speed = 30,
  className = ''
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {children}
        {children}
      </div>
    </div>
  );
}

// Counter animation
export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  className = '',
  duration = 2
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const totalFrames = 60 * duration;
    const increment = end / totalFrames;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
