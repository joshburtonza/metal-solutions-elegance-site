import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CinematicLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'logo' | 'wipe' | 'done'>('logo');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('wipe'), 2200);
    const t2 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            style={{
              background: 'radial-gradient(ellipse 50% 40% at 50% 50%, hsl(42 80% 55% / 0.08), transparent 70%)',
            }}
          />

          {/* Logo / brand mark */}
          <div className="relative flex flex-col items-center gap-6">
            {/* Gold line expanding */}
            <motion.div
              className="h-px w-0"
              animate={{ width: '120px' }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              style={{
                background: 'linear-gradient(90deg, transparent, hsl(42 80% 55% / 0.6), transparent)',
              }}
            />

            {/* Brand text */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-display text-4xl md:text-5xl font-bold tracking-[-0.04em]"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                style={{
                  background: 'linear-gradient(135deg, hsl(45 90% 65%), hsl(35 85% 50%), hsl(25 80% 40%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                LUXE LIVING
              </motion.h1>
            </div>

            {/* Tagline */}
            <motion.p
              className="mono text-xs tracking-[0.4em] text-muted-foreground"
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.4em' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            >
              PREMIUM STEEL
            </motion.p>

            {/* Progress line */}
            <motion.div
              className="mt-8 h-[1px] rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '80px', opacity: 1 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              style={{
                background: 'hsl(42 80% 55% / 0.3)',
              }}
            />

            {/* Shimmer running across progress */}
            <motion.div
              className="absolute bottom-0 h-[1px] w-4"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: ['-40px', '40px'], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 1, repeat: 1 }}
              style={{
                background: 'hsl(48 95% 70%)',
                filter: 'blur(2px)',
              }}
            />
          </div>

          {/* Curtain wipe out */}
          {phase === 'wipe' && (
            <>
              <motion.div
                className="absolute inset-0 bg-background origin-top"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                style={{ transformOrigin: 'top' }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicLoader;
