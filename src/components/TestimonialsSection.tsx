import { useState, useEffect, Suspense, lazy } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, SplitText, MagneticWrap, ParallaxSection } from "@/components/animations/ScrollReveal";

const SectionScene3D = lazy(() => import('@/components/3d/SectionScene').then(m => ({ default: m.SectionScene3D })));

const testimonials = [
  {
    text: "Luxe Living transformed our hotel lobby with their HOTEL collection. The precision craftsmanship and attention to detail is exceptional.",
    author: "James Wilson",
    title: "Design Director, Grand Meridian Hotels",
    image: "https://images.unsplash.com/photo-1611689102192-1f6e0e52df0a?q=80&w=1965"
  },
  {
    text: "The BELLA coffee table is a statement piece. Incredibly well-made and draws compliments from everyone who visits.",
    author: "Sophia Martinez",
    title: "Interior Design Enthusiast",
    image: "https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=2070"
  },
  {
    text: "We furnished our entire office with the NIKITA collection. The durability and elegance is unmatched in the industry.",
    author: "Michael Chang",
    title: "CEO, Modern Spaces Inc.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069"
  },
  {
    text: "The SWING BENCH has become the centerpiece of our patio. Luxe Living delivers luxury and quality without compromise.",
    author: "Emily Johnson",
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
    <section id="testimonials" className="section-padding bg-background relative aurora-bg">
      <div className="container relative z-10">
        {/* 3D Element */}
        <Suspense fallback={null}>
          <SectionScene3D variant="testimonials" />
        </Suspense>

        <ScrollReveal animation="fadeUp">
          <div className="text-center mb-16">
            <span className="mono text-xs tracking-[0.3em] text-primary/50 mb-4 block">// TESTIMONIALS</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold">
              Client <SplitText text="Stories" className="text-gradient-warm" animation="wave" staggerDelay={0.06} />
            </h2>
          </div>
        </ScrollReveal>

        {/* Testimonial */}
        <ScrollReveal animation="scaleUp">
          <div className="relative max-w-5xl mx-auto mb-20">
            <div className="glass-card overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                  exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex flex-col md:flex-row min-h-[350px]">
                    <div className="hidden md:block md:w-2/5 relative overflow-hidden rounded-l-lg">
                      <img
                        src={testimonials[current].image}
                        alt={testimonials[current].author}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/60" />
                    </div>
                    <div className="w-full md:w-3/5 p-10 md:p-14 flex flex-col justify-center">
                      <div className="text-6xl text-primary/20 font-display leading-none mb-4">"</div>
                      <blockquote className="text-lg md:text-xl mb-8 text-foreground/80 leading-relaxed">
                        {testimonials[current].text}
                      </blockquote>
                      <div className="border-t border-primary/10 pt-4">
                        <p className="font-display font-bold text-primary text-sm">
                          {testimonials[current].author}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {testimonials[current].title}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      current === i ? 'w-10 bg-primary' : 'w-4 bg-border'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <MagneticWrap strength={0.4}>
                  <button
                    onClick={() => setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                    className="w-10 h-10 rounded-lg border border-border/50 flex items-center justify-center hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </MagneticWrap>
                <MagneticWrap strength={0.4}>
                  <button
                    onClick={() => setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                    className="w-10 h-10 rounded-lg border border-border/50 flex items-center justify-center hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </MagneticWrap>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Installations Gallery */}
        <ScrollReveal animation="slideUp">
          <div className="mt-16">
            <div className="text-center mb-8">
              <span className="mono text-xs tracking-[0.3em] text-primary/40 block">// INSTALLATIONS</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {installations.map((inst, index) => (
                <ParallaxSection key={index} speed={0.2 + index * 0.1}>
                  <motion.div
                    className="group relative overflow-hidden cursor-pointer rounded-lg"
                    whileHover={{ y: -6, scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={inst.image}
                        alt={inst.location}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-sm text-foreground/80 font-medium">{inst.location}</p>
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ border: '1px solid hsl(42, 80%, 55%, 0.2)' }}
                    />
                  </motion.div>
                </ParallaxSection>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
