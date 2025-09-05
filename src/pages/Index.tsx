
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

const Index = () => {
  const { isAuthenticated } = useAuth();

  // Smooth scroll effect for anchor links
  useEffect(() => {
    const handleHashChange = () => {
      const { hash } = window.location;
      if (hash) {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // Handle initial hash if present
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CollectionsSection />
      <ProductsSection />
      
      {/* Quick Reorder Section for authenticated users */}
      {isAuthenticated && (
        <section className="section-padding bg-charcoal">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Quick Actions</h2>
            <QuickReorderButton />
          </div>
        </section>
      )}
      
      {/* Product Recommendations */}
      <section className="section-padding bg-charcoal-dark">
        <div className="container">
          <ProductRecommendations products={products} maxItems={4} />
        </div>
      </section>
      
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
