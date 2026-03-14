import { Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Slideshow from "@/components/ui/slideshow";
import { SplitText, MagneticWrap, MarqueeTicker } from "@/components/animations/ScrollReveal";
import { useRef } from 'react';

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
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <motion.section 
      ref={sectionRef}
      id="hero" 
      className="relative h-screen overflow-hidden"
      style={{ opacity, scale }}
    >
      <Slideshow slides={heroSlides} autoPlayInterval={5000} />
      
      {/* 3D overlay scene */}
      <Suspense fallback={null}>
        <FuturisticScene className="pointer-events-none opacity-60 mix-blend-screen" />
      </Suspense>

      {/* Gold glow overlay */}
      <div className="absolute inset-0 glow-overlay pointer-events-none z-[5]" />
      
      {/* Bottom marquee ticker */}
      <div className="absolute bottom-24 left-0 right-0 z-20 opacity-20">
        <MarqueeTicker speed={40} className="py-3 border-t border-b border-primary/10">
          <span className="mono text-xs tracking-[0.5em] text-primary/50 mx-12">PREMIUM STEEL</span>
          <span className="text-primary/30">✦</span>
          <span className="mono text-xs tracking-[0.5em] text-primary/50 mx-12">HANDCRAFTED</span>
          <span className="text-primary/30">✦</span>
          <span className="mono text-xs tracking-[0.5em] text-primary/50 mx-12">MODERN LUXURY</span>
          <span className="text-primary/30">✦</span>
          <span className="mono text-xs tracking-[0.5em] text-primary/50 mx-12">SOUTH AFRICA</span>
          <span className="text-primary/30">✦</span>
        </MarqueeTicker>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <MagneticWrap strength={0.5}>
          <span className="mono text-xs tracking-[0.3em] text-primary/40 uppercase">Explore</span>
        </MagneticWrap>
        <div className="w-5 h-8 rounded-full border border-primary/20 flex justify-center pt-1.5">
          <motion.div 
            className="w-1 h-2 rounded-full bg-primary/60"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
