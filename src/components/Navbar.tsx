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
import { motion } from "framer-motion";
import logo from "@/assets/luxe-logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { compareCount } = useCompare();
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        isScrolled
          ? "py-3 glass-surface"
          : "py-5 bg-transparent"
      )}
    >
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Luxe Living" className="h-10 w-10 object-contain" />
          <div className="font-display font-bold text-xl tracking-tight text-gradient">Luxe Living</div>
        </div>
        
        <div className="hidden md:flex items-center gap-1">
          {[
            { name: 'Collections', id: 'collections' },
            { name: 'Products', id: 'products' },
            { name: 'Stories', id: 'testimonials' },
            { name: 'Contact', id: 'contact' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="px-5 py-2 text-foreground/50 hover:text-primary transition-all duration-300 text-sm font-medium rounded-full hover:bg-primary/5"
            >
              {item.name}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <AuthButtons />
          
          <CompareDrawer>
            <Button variant="ghost" size="sm" className="relative hover:text-primary rounded-full">
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
          
          <CartDrawer onCheckout={() => navigate('/checkout')}>
            <CartIcon onClick={() => {}} />
          </CartDrawer>
          
          <button className="px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-all duration-300 hover:shadow-[0_0_20px_hsl(250_90%_72%/0.2)]">
            Catalog
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
