import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/animations/ScrollReveal";
import { motion } from "framer-motion";

const collections = [
  {
    name: "BELLA",
    description: "Elegant curved steel forms with marble accents",
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?q=80&w=1974",
    number: "01"
  },
  {
    name: "DEMI",
    description: "Minimalist approach with clean lines and angles",
    image: "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?q=80&w=1974",
    number: "02"
  },
  {
    name: "LUNA",
    description: "Circular motifs with brushed steel finishes",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1965",
    number: "03"
  },
  {
    name: "AMARA",
    description: "Bold contemporary pieces with suede highlights",
    image: "https://images.unsplash.com/photo-1518894781321-630e638d0742?q=80&w=2080",
    number: "04"
  }
];

const CollectionsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="collections" className="section-padding bg-background relative noise-overlay">
      <div className="container relative z-10">
        <ScrollReveal animation="fadeUp">
          <div className="mb-16 flex items-end justify-between">
            <div>
              <span className="mono text-xs tracking-[0.3em] text-primary mb-4 block">// COLLECTIONS</span>
              <h2 className="text-5xl md:text-7xl font-display font-black">
                CURATED<br />
                <span className="text-gradient">SERIES</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm hidden md:block text-right">
              Meticulously crafted furniture lines where raw industrial steel meets luxury finishes.
            </p>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1" staggerDelay={0.15}>
          {collections.map((collection, index) => (
            <StaggerItem key={collection.name}>
              <motion.div
                className="relative overflow-hidden group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <motion.img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                    animate={{ scale: hoveredIndex === index ? 1.15 : 1 }}
                    transition={{ duration: 0.8 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>
                
                {/* Collection number */}
                <div className="absolute top-4 right-4 mono text-xs text-primary/40 tracking-widest">
                  {collection.number}
                </div>

                {/* Gold accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformOrigin: 'left' }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-3xl font-display font-black text-foreground mb-1">{collection.name}</h3>
                  <motion.p
                    className="text-muted-foreground text-sm mb-3"
                    animate={{
                      opacity: hoveredIndex === index ? 1 : 0,
                      y: hoveredIndex === index ? 0 : 10
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {collection.description}
                  </motion.p>
                  <motion.button
                    className="flex items-center text-primary text-sm mono tracking-wider"
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
                          detail: { category: collection.name }
                        }));
                      }
                    }}
                  >
                    <span className="mr-2">EXPLORE</span>
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
