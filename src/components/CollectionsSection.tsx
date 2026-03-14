import { useState, Suspense, lazy } from "react";
import { ChevronRight } from "lucide-react";
import { ScrollReveal, StaggerChildren, StaggerItem, TiltCard, SplitText, ParallaxSection, AnimatedCounter } from "@/components/animations/ScrollReveal";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const SectionScene3D = lazy(() => import('@/components/3d/SectionScene').then(m => ({ default: m.SectionScene3D })));

const collections = [
  {
    name: "Bella",
    description: "Elegant curved steel forms with marble accents",
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?q=80&w=1974",
    number: "01"
  },
  {
    name: "Demi",
    description: "Minimalist approach with clean lines and angles",
    image: "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?q=80&w=1974",
    number: "02"
  },
  {
    name: "Luna",
    description: "Circular motifs with brushed steel finishes",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1965",
    number: "03"
  },
  {
    name: "Amara",
    description: "Bold contemporary pieces with suede highlights",
    image: "https://images.unsplash.com/photo-1518894781321-630e638d0742?q=80&w=2080",
    number: "04"
  }
];

const stats = [
  { value: 12, suffix: '+', label: 'Collections' },
  { value: 150, suffix: '+', label: 'Products' },
  { value: 98, suffix: '%', label: 'Satisfaction' },
  { value: 8, suffix: 'yr', label: 'Warranty' },
];

// Parallax card with staggered speed per index
const parallaxSpeeds = [0.15, 0.3, 0.2, 0.35];

const ParallaxCard = ({ children, index }: { children: React.ReactNode; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const speed = parallaxSpeeds[index % parallaxSpeeds.length];
  const y = useTransform(scrollYProgress, [0, 1], [60 * speed, -60 * speed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} style={{ y: smoothY }}>
      {children}
    </motion.div>
  );
};

const CollectionsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="collections" className="section-padding bg-background relative aurora-bg">
      <div className="container relative z-10">
        {/* 3D Separator */}
        <Suspense fallback={null}>
          <SectionScene3D variant="default" />
        </Suspense>

        <ScrollReveal animation="fadeUp">
          <div className="mb-20 text-center">
            <motion.span 
              className="mono text-xs tracking-[0.3em] text-primary/60 mb-4 block"
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              whileInView={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              curated for you
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-display font-bold">
              Our <SplitText text="Collections" className="text-gradient" animation="elastic" staggerDelay={0.04} />
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mt-6 text-lg">
              Meticulously crafted furniture lines where raw industrial steel meets liquid gold luxury.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats bar */}
        <ScrollReveal animation="clipReveal" className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-6 text-center group hover:gold-glow transition-all duration-500">
                <div className="font-display font-bold text-3xl md:text-4xl text-gradient mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mono text-xs tracking-widest text-muted-foreground uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <ParallaxCard key={collection.name} index={index}>
              <StaggerChildren staggerDelay={0.15}>
                <StaggerItem>
                  <TiltCard className="group cursor-pointer" intensity={12}>
                    <motion.div
                      className="relative overflow-hidden rounded-lg"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="aspect-[3/4] overflow-hidden rounded-lg">
                        <motion.img
                          src={collection.image}
                          alt={collection.name}
                          className="w-full h-full object-cover"
                          animate={{ scale: hoveredIndex === index ? 1.12 : 1 }}
                          transition={{ duration: 0.8 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                      </div>
                      
                      <div className="absolute top-5 right-5 mono text-sm text-primary/30 font-bold">
                        {collection.number}
                      </div>

                      <motion.div
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        animate={{ 
                          boxShadow: hoveredIndex === index 
                            ? '0 0 40px hsl(42 80% 55% / 0.2), inset 0 0 40px hsl(42 80% 55% / 0.05)' 
                            : '0 0 0px transparent' 
                        }}
                        transition={{ duration: 0.5 }}
                        style={{ border: hoveredIndex === index ? '1px solid hsl(42, 80%, 55%, 0.25)' : '1px solid transparent' }}
                      />

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-display font-bold text-foreground mb-1">{collection.name}</h3>
                        <motion.p
                          className="text-foreground/50 text-sm mb-4"
                          animate={{
                            opacity: hoveredIndex === index ? 1 : 0,
                            y: hoveredIndex === index ? 0 : 10
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {collection.description}
                        </motion.p>
                        <motion.button
                          className="flex items-center text-primary text-sm font-medium"
                          animate={{
                            opacity: hoveredIndex === index ? 1 : 0,
                            x: hoveredIndex === index ? 0 : -10
                          }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          onClick={() => {
                            const productsSection = document.getElementById('products');
                            if (productsSection) {
                              productsSection.scrollIntoView({ behavior: 'smooth' });
                              window.dispatchEvent(new CustomEvent('filterByCategory', {
                                detail: { category: collection.name.toUpperCase() }
                              }));
                            }
                          }}
                        >
                          <span className="mr-2">Explore</span>
                          <ChevronRight className="h-3 w-3" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </TiltCard>
                </StaggerItem>
              </StaggerChildren>
            </ParallaxCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
