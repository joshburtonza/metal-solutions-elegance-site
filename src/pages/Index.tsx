import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CollectionsSection from "../components/CollectionsSection";
import ProductsSection from "../components/ProductsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import { ProductRecommendations } from "../components/recommendations/ProductRecommendations";
import { QuickReorderButton } from "../components/quick-order/QuickReorderButton";
import { products } from "../data/enhancedProducts";
import { useAuth } from "../contexts/AuthContext";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import MetalPlateReveal from "../components/animations/MetalPlateReveal";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleHashChange = () => {
      const { hash } = window.location;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (window.location.hash) handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Gold scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
        style={{ 
          scaleX,
          background: 'linear-gradient(90deg, hsl(42 80% 55%), hsl(48 95% 70%), hsl(42 80% 55%))'
        }}
      />

      <Navbar />
      <HeroSection />
      
      <MetalPlateReveal origin="top" angle={10}>
        <CollectionsSection />
      </MetalPlateReveal>
      
      <MetalPlateReveal origin="left" angle={6}>
        <ProductsSection />
      </MetalPlateReveal>
      
      {isAuthenticated && (
        <MetalPlateReveal origin="right" angle={8}>
          <section className="section-padding bg-card/20">
            <div className="container text-center">
              <ScrollReveal animation="fadeUp">
                <span className="mono text-xs tracking-[0.3em] text-primary/50 mb-4 block">// QUICK ACTIONS</span>
                <h2 className="text-3xl font-display font-bold mb-6">Reorder</h2>
                <QuickReorderButton />
              </ScrollReveal>
            </div>
          </section>
        </MetalPlateReveal>
      )}
      
      <MetalPlateReveal origin="bottom" angle={7}>
        <section className="section-padding bg-background relative aurora-bg">
          <div className="container relative z-10">
            <ScrollReveal animation="fadeUp">
              <div className="text-center mb-8">
                <span className="mono text-xs tracking-[0.3em] text-primary/40 mb-4 block">// FOR YOU</span>
              </div>
              <ProductRecommendations products={products} maxItems={4} />
            </ScrollReveal>
          </div>
        </section>
      </MetalPlateReveal>
      
      <MetalPlateReveal origin="top" angle={9}>
        <TestimonialsSection />
      </MetalPlateReveal>
      
      <MetalPlateReveal origin="left" angle={6}>
        <ContactSection />
      </MetalPlateReveal>

      <Footer />
    </div>
  );
};

export default Index;
