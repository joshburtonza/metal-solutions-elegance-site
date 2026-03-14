import { useEffect } from "react";
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

const Index = () => {
  const { isAuthenticated } = useAuth();

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
      <Navbar />
      <HeroSection />
      <CollectionsSection />
      <ProductsSection />
      
      {isAuthenticated && (
        <section className="section-padding bg-card">
          <div className="container text-center">
            <ScrollReveal animation="fadeUp">
              <span className="mono text-xs tracking-[0.3em] text-primary mb-4 block">// QUICK ACTIONS</span>
              <h2 className="text-3xl font-display font-black mb-6">REORDER</h2>
              <QuickReorderButton />
            </ScrollReveal>
          </div>
        </section>
      )}
      
      <section className="section-padding bg-background grid-overlay relative">
        <div className="container relative z-10">
          <ScrollReveal animation="fadeUp">
            <span className="mono text-xs tracking-[0.3em] text-primary mb-4 block">// FOR YOU</span>
            <ProductRecommendations products={products} maxItems={4} />
          </ScrollReveal>
        </div>
      </section>
      
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
