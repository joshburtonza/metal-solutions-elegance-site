import { ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-background border-t border-border/30">
      <div className="container py-20">
        <ScrollReveal animation="fadeUp">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="font-display font-bold text-3xl text-gradient mb-4">Luxe Living</div>
              <p className="text-muted-foreground text-sm mb-8 max-w-xs leading-relaxed">
                Premium steel furniture designed for modern living. Where raw industrial meets soft futurism.
              </p>
              <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-display font-semibold text-sm flex items-center gap-2 hover:shadow-[0_0_30px_hsl(250_90%_72%/0.3)] transition-all duration-300">
                <span>Request Catalog</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm text-foreground/80 mb-6">Navigation</h3>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { name: 'Collections', id: 'collections' },
                  { name: 'Products', id: 'products' },
                  { name: 'Stories', id: 'testimonials' },
                  { name: 'Contact', id: 'contact' }
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center py-2 text-sm"
                  >
                    <ChevronRight className="h-3 w-3 mr-1 text-primary/30" />
                    <span>{link.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm text-foreground/80 mb-6">Newsletter</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Stay updated with latest collections and exclusive drops.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-grow px-4 py-3 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                />
                <button className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-[0_0_20px_hsl(250_90%_72%/0.3)] transition-all">
                  →
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-16 pt-6 border-t border-border/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground mb-4 md:mb-0">
            © 2025 Luxe Living. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Shipping</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
