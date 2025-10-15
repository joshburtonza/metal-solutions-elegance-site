
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/cart/CartIcon";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CompareDrawer } from "@/components/compare/CompareDrawer";
import { AuthButtons } from "@/components/auth/AuthButtons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCompare } from "@/contexts/CompareContext";
import { BarChart3 } from "lucide-react";
import logo from "@/assets/luxe-logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { compareCount } = useCompare();
  
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
          ? "py-3 bg-background/90 backdrop-blur-lg shadow-lg border-b border-primary/20" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Luxe Living" className="h-12 w-12 object-contain" />
          <div className="text-2xl font-bold text-gradient">Luxe Living</div>
        </div>
        
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
              className="text-white/80 hover:text-primary transition-colors duration-300 text-sm uppercase tracking-wider"
            >
              {item.name}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Auth Buttons */}
          <AuthButtons />
          
          {/* Compare Icon */}
          <CompareDrawer>
            <Button variant="ghost" size="sm" className="relative">
              <BarChart3 className="h-5 w-5" />
              {compareCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {compareCount}
                </Badge>
              )}
            </Button>
          </CompareDrawer>
          
          {/* Cart Icon */}
          <CartDrawer onCheckout={() => navigate('/checkout')}>
            <CartIcon onClick={() => {}} />
          </CartDrawer>
          
          <button className="px-5 py-2 border border-primary text-primary text-sm rounded-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300 button-hover">
            Request Catalog
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
