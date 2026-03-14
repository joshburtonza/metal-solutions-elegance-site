import { ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-background border-t-2 border-primary/20">
      <div className="container py-16">
        <ScrollReveal animation="fadeUp">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="font-display font-black text-4xl text-gradient mb-4">LUXE<br />LIVING</div>
              <p className="text-muted-foreground text-sm mb-8 max-w-xs">
                Raw industrial steel furniture. Forged with precision. Designed for modern living.
              </p>
              <button className="px-6 py-3 bg-primary text-primary-foreground font-display font-bold text-sm tracking-wider flex items-center gap-2 hover:shadow-[0_0_30px_hsl(46_75%_55%/0.4)] transition-all">
                <span>REQUEST CATALOG</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm tracking-wider text-primary mb-6">NAVIGATION</h3>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { name: 'Collections', id: 'collections' },
                  { name: 'Products', id: 'products' },
                  { name: 'Testimonials', id: 'testimonials' },
                  { name: 'Contact', id: 'contact' }
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center py-2 mono text-xs tracking-wider"
                  >
                    <ChevronRight className="h-3 w-3 mr-1 text-primary/40" />
                    <span>{link.name.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm tracking-wider text-primary mb-6">NEWSLETTER</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Stay updated with latest collections and exclusive drops.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-grow px-4 py-3 bg-card border-2 border-border mono text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button className="px-6 py-3 bg-primary text-primary-foreground font-display font-bold text-sm tracking-wider hover:shadow-[0_0_20px_hsl(46_75%_55%/0.3)] transition-all">
                  →
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-16 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="mono text-xs text-muted-foreground mb-4 md:mb-0">
            © 2025 LUXE LIVING. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 mono text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-primary transition-colors">TERMS</a>
            <a href="#" className="hover:text-primary transition-colors">SHIPPING</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
