import { ChevronRight } from "lucide-react";
import { ScrollReveal, MagneticWrap, MarqueeTicker } from "@/components/animations/ScrollReveal";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-background border-t border-primary/10">
      {/* Gold marquee */}
      <div className="py-4 border-b border-primary/5">
        <MarqueeTicker speed={35} className="opacity-15">
          <span className="mono text-sm tracking-[0.5em] text-primary mx-16">LUXE LIVING</span>
          <span className="text-primary/50">✦</span>
          <span className="mono text-sm tracking-[0.5em] text-primary mx-16">PREMIUM STEEL</span>
          <span className="text-primary/50">✦</span>
          <span className="mono text-sm tracking-[0.5em] text-primary mx-16">HANDCRAFTED</span>
          <span className="text-primary/50">✦</span>
          <span className="mono text-sm tracking-[0.5em] text-primary mx-16">SOUTH AFRICA</span>
          <span className="text-primary/50">✦</span>
        </MarqueeTicker>
      </div>

      <div className="container py-20">
        <ScrollReveal animation="fadeUp">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="font-display font-bold text-3xl text-gradient mb-4">Luxe Living</div>
              <p className="text-muted-foreground text-sm mb-8 max-w-xs leading-relaxed">
                Premium steel furniture designed for modern living. Where raw industrial meets liquid gold luxury.
              </p>
              <MagneticWrap strength={0.3}>
                <button className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm flex items-center gap-2 hover:shadow-[0_0_30px_hsl(42_80%_55%/0.3)] transition-all duration-300">
                  <span>Request Catalog</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </MagneticWrap>
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
                  className="flex-grow px-4 py-3 rounded-lg bg-card border border-border/50 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                />
                <MagneticWrap strength={0.4}>
                  <button className="px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:shadow-[0_0_20px_hsl(42_80%_55%/0.3)] transition-all">
                    →
                  </button>
                </MagneticWrap>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-16 pt-6 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center">
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
