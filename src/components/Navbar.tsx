
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/cart/CartIcon";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthButtons } from "@/components/auth/AuthButtons";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "py-3 bg-charcoal-dark/90 backdrop-blur-lg shadow-lg" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="container flex justify-between items-center">
        <div className="text-2xl font-bold text-white">RT <span className="text-burntOrange">Furniture</span></div>
        
        <div className="hidden md:flex space-x-8">
          {[
            { name: 'Collections', id: 'collections' },
            { name: 'Products', id: 'products' },
            { name: 'Order', id: 'order' },
            { name: 'Testimonials', id: 'testimonials' },
            { name: 'Contact', id: 'contact' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-white/80 hover:text-burntOrange transition-colors duration-300 text-sm uppercase tracking-wider"
            >
              {item.name}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Auth Buttons */}
          <AuthButtons />
          
          {/* Cart Icon */}
          <CartDrawer onCheckout={() => navigate('/checkout')}>
            <CartIcon onClick={() => {}} />
          </CartDrawer>
          
          <button className="px-5 py-2 border border-burntOrange text-burntOrange text-sm rounded-sm hover:bg-burntOrange hover:text-white transition-all duration-300">
            Request Catalog
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
