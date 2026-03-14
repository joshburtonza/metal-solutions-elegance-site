import { useState, Suspense, lazy } from "react";
import { ChevronRight } from "lucide-react";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/animations/ScrollReveal";
import { motion } from "framer-motion";

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

const CollectionsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="collections" className="section-padding bg-background relative mesh-bg">
      <div className="container relative z-10">
        {/* 3D Separator */}
        <Suspense fallback={null}>
          <SectionScene3D variant="default" />
        </Suspense>

        <ScrollReveal animation="fadeUp">
          <div className="mb-20 text-center">
            <motion.span 
              className="mono text-xs tracking-[0.3em] text-primary/60 mb-4 block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              curated for you
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-display font-bold">
              Our <span className="text-gradient">Collections</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mt-6 text-lg">
              Meticulously crafted furniture lines where raw industrial steel meets modern elegance.
            </p>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.15}>
          {collections.map((collection, index) => (
            <StaggerItem key={collection.name}>
              <motion.div
                className="relative overflow-hidden group cursor-pointer rounded-2xl"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl">
                  <motion.img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                    animate={{ scale: hoveredIndex === index ? 1.12 : 1 }}
                    transition={{ duration: 0.8 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent rounded-2xl" />
                </div>
                
                {/* Collection number with glow */}
                <div className="absolute top-5 right-5 mono text-sm text-primary/30 font-bold">
                  {collection.number}
                </div>

                {/* Glow border on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{ 
                    boxShadow: hoveredIndex === index 
                      ? '0 0 40px hsl(250 90% 72% / 0.15), inset 0 0 40px hsl(250 90% 72% / 0.05)' 
                      : '0 0 0px transparent' 
                  }}
                  transition={{ duration: 0.5 }}
                  style={{ border: hoveredIndex === index ? '1px solid hsl(250, 90%, 72%, 0.2)' : '1px solid transparent' }}
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
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
};

export default CollectionsSection;
