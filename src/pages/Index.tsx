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
import SnapSection from "../components/animations/SnapSection";

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
    <div className="min-h-screen bg-background snap-y snap-mandatory overflow-y-auto h-screen">
      {/* Gold scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
        style={{ 
          scaleX,
          background: 'linear-gradient(90deg, hsl(42 80% 55%), hsl(48 95% 70%), hsl(42 80% 55%))'
        }}
      />

      <Navbar />
      
      <div className="snap-start min-h-screen">
        <HeroSection />
      </div>
      
      <SnapSection effect="fade-rise">
        <CollectionsSection />
      </SnapSection>
      
      <SnapSection effect="slide-left">
        <ProductsSection />
      </SnapSection>
      
      {isAuthenticated && (
        <SnapSection effect="scale-up">
          <section className="section-padding bg-card/20 min-h-screen flex items-center">
            <div className="container text-center">
              <ScrollReveal animation="fadeUp">
                <span className="mono text-xs tracking-[0.3em] text-primary/50 mb-4 block">// QUICK ACTIONS</span>
                <h2 className="text-3xl font-display font-bold mb-6">Reorder</h2>
                <QuickReorderButton />
              </ScrollReveal>
            </div>
          </section>
        </SnapSection>
      )}
      
      <SnapSection effect="curtain">
        <section className="section-padding bg-background relative aurora-bg min-h-screen flex items-center">
          <div className="container relative z-10">
            <ScrollReveal animation="fadeUp">
              <div className="text-center mb-8">
                <span className="mono text-xs tracking-[0.3em] text-primary/40 mb-4 block">// FOR YOU</span>
              </div>
              <ProductRecommendations products={products} maxItems={4} />
            </ScrollReveal>
          </div>
        </section>
      </SnapSection>
      
      <SnapSection effect="fade-rise">
        <TestimonialsSection />
      </SnapSection>
      
      <SnapSection effect="slide-right">
        <ContactSection />
      </SnapSection>

      <div className="snap-start">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
