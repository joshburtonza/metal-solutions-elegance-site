import { useState, useEffect, Suspense, lazy } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const ProductScene3D = lazy(() => import('@/components/3d/ProductScene').then(m => ({ default: m.ProductScene3D })));

const testimonials = [
  {
    text: "Luxe Living transformed our hotel lobby with their HOTEL collection. The precision craftsmanship and attention to detail is exceptional.",
    author: "JAMES WILSON",
    title: "Design Director, Grand Meridian Hotels",
    image: "https://images.unsplash.com/photo-1611689102192-1f6e0e52df0a?q=80&w=1965"
  },
  {
    text: "The BELLA coffee table is a statement piece. Incredibly well-made and draws compliments from everyone who visits.",
    author: "SOPHIA MARTINEZ",
    title: "Interior Design Enthusiast",
    image: "https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=2070"
  },
  {
    text: "We furnished our entire office with the NIKITA collection. The durability and elegance is unmatched in the industry.",
    author: "MICHAEL CHANG",
    title: "CEO, Modern Spaces Inc.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069"
  },
  {
    text: "The SWING BENCH has become the centerpiece of our patio. Luxe Living delivers luxury and quality without compromise.",
    author: "EMILY JOHNSON",
    title: "Landscape Architect",
    image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=2070"
  }
];

const installations = [
  { image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070", location: "Private Residence, LA" },
  { image: "https://images.unsplash.com/photo-1577958194277-1e583325b09b?q=80&w=1974", location: "Azure Hotel, Miami" },
  { image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070", location: "Executive Office, NYC" },
  { image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070", location: "Luxury Apt, SF" },
  { image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=2069", location: "Gallery, Seattle" }
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="section-padding bg-background relative noise-overlay">
      <div className="container relative z-10">
        <ScrollReveal animation="fadeUp">
          <span className="mono text-xs tracking-[0.3em] text-primary mb-4 block">// TESTIMONIALS</span>
          <h2 className="text-5xl md:text-7xl font-display font-black mb-16">
            VOICES OF<br />
            <span className="text-gradient">STEEL</span>
          </h2>
        </ScrollReveal>

        {/* 3D Element */}
        <Suspense fallback={null}>
          <div className="mb-12">
            <ProductScene3D variant="sphere" />
          </div>
        </Suspense>

        {/* Testimonial */}
        <ScrollReveal animation="scaleUp">
          <div className="relative max-w-5xl mx-auto mb-20">
            <div className="border-2 border-border bg-card/50 backdrop-blur-sm overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex flex-col md:flex-row min-h-[350px]">
                    <div className="hidden md:block md:w-2/5 relative overflow-hidden">
                      <img
                        src={testimonials[current].image}
                        alt={testimonials[current].author}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />
                    </div>
                    <div className="w-full md:w-3/5 p-10 md:p-14 flex flex-col justify-center">
                      <div className="text-6xl text-primary/20 font-display leading-none mb-4">"</div>
                      <blockquote className="text-lg md:text-xl mb-8 text-foreground/90 leading-relaxed">
                        {testimonials[current].text}
                      </blockquote>
                      <div className="border-t border-border pt-4">
                        <p className="font-display font-bold text-primary text-sm tracking-wider">
                          {testimonials[current].author}
                        </p>
                        <p className="mono text-xs text-muted-foreground mt-1">
                          {testimonials[current].title}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Gold accent line at bottom */}
              <div className="h-[2px] bg-primary" />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1 transition-all duration-500 ${
                      current === i ? 'w-12 bg-primary' : 'w-4 bg-border'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="w-12 h-12 border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="w-12 h-12 border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Installations Gallery */}
        <ScrollReveal animation="slideUp">
          <div className="mt-16">
            <span className="mono text-xs tracking-[0.3em] text-primary mb-6 block">// INSTALLATIONS</span>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
              {installations.map((inst, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="aspect-square">
                    <img
                      src={inst.image}
                      alt={inst.location}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:saturate-0"
                    />
                  </div>
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="mono text-xs text-primary tracking-wider">{inst.location}</p>
                  </div>
                  {/* Gold line on hover */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
