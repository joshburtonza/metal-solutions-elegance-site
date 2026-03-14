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
        <section className="section-padding bg-card/30">
          <div className="container text-center">
            <ScrollReveal animation="fadeUp">
              <span className="mono text-xs tracking-[0.3em] text-primary/60 mb-4 block">quick actions</span>
              <h2 className="text-3xl font-display font-bold mb-6">Reorder</h2>
              <QuickReorderButton />
            </ScrollReveal>
          </div>
        </section>
      )}
      
      <section className="section-padding bg-background relative mesh-bg">
        <div className="container relative z-10">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-8">
              <span className="mono text-xs tracking-[0.3em] text-accent/60 mb-4 block">for you</span>
            </div>
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
