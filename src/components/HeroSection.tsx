import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Slideshow from "@/components/ui/slideshow";

const FuturisticScene = lazy(() => import('@/components/3d/FuturisticScene'));

const heroSlides = [
  {
    img: "/lovable-uploads/072f1f50-0eb2-4aa0-a473-35d1b488497c.png",
    text: ["LUXE", "LIVING"],
    alt: "Modern orange steel lounge chair with ottoman",
  },
  {
    img: "/lovable-uploads/22dd1449-dcc3-41ed-8c5d-6e68c507b0e7.png",
    text: ["RAW", "STEEL"],
    alt: "Contemporary living space with steel furniture",
  },
  {
    img: "/lovable-uploads/f21e2af8-0505-4c06-93da-90dd7821b7a8.png",
    text: ["FORGED", "LUXURY"],
    alt: "Modern steel framed lounge area",
  }
];

const HeroSection = () => {
  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      <Slideshow slides={heroSlides} autoPlayInterval={5000} />
      
      {/* 3D overlay scene */}
      <Suspense fallback={null}>
        <FuturisticScene className="pointer-events-none opacity-50 mix-blend-screen" />
      </Suspense>

      {/* Soft glow overlay */}
      <div className="absolute inset-0 glow-overlay pointer-events-none z-[5]" />
      
      {/* Bottom scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="mono text-xs tracking-[0.3em] text-foreground/30 uppercase">Explore</span>
        <div className="w-5 h-8 rounded-full border border-foreground/20 flex justify-center pt-1.5">
          <motion.div 
            className="w-1 h-2 rounded-full bg-primary/60"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
