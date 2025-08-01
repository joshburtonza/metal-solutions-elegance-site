
import { ChevronRight } from "lucide-react";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-charcoal-dark border-t border-white/10">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <div className="text-3xl font-bold mb-3">RT<span className="text-burntOrange">MS</span></div>
            <p className="text-white/70 mb-6">
              Contemporary steel furniture and décor, meticulously crafted for modern living spaces.
            </p>
            <button className="px-4 py-2 bg-burntOrange text-white flex items-center space-x-2 rounded-sm hover:bg-burntOrange/90 transition-colors">
              <span>Request Catalog</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Collections', id: 'collections' },
                { name: 'Products', id: 'products' },
                { name: 'Order', id: 'order' },
                { name: 'Testimonials', id: 'testimonials' },
                { name: 'Contact', id: 'contact' }
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-white/70 hover:text-burntOrange transition-colors flex items-center py-1"
                >
                  <ChevronRight className="h-3 w-3 mr-1" />
                  <span>{link.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Newsletter</h3>
            <p className="text-white/70 mb-3">
              Subscribe to stay updated with our latest collections and exclusive offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-3 py-2 bg-charcoal border border-white/10 rounded-l-sm focus:outline-none focus:border-burntOrange"
              />
              <button className="px-4 py-2 bg-burntOrange text-white rounded-r-sm hover:bg-burntOrange/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            © 2025 RT Furniture. All Rights Reserved.
          </p>
          <div className="flex space-x-4 text-sm text-white/50">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
