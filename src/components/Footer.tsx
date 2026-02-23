
import { useState } from 'react';
import { ChevronRight } from "lucide-react";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const POLICY_CONTENT: Record<string, { title: string; body: string }> = {
  privacy: {
    title: 'Privacy Policy',
    body: `Your privacy is important to us. We collect only the information necessary to process your orders and improve your experience. We do not sell or share your personal data with third parties. All data is stored securely and you may request deletion at any time by contacting us at info@rtmetalsolutions.com.`,
  },
  terms: {
    title: 'Terms of Service',
    body: `By placing an order with Luxe Living / RT Metal Solutions you agree to our standard terms. All products are custom-made to order. Lead times vary by product. Payment is required before production begins. We reserve the right to refuse orders at our discretion.`,
  },
  shipping: {
    title: 'Shipping Policy',
    body: `We deliver across South Africa. Delivery times range from 5–15 business days after payment confirmation, depending on location and product. Courier fees are calculated at checkout. For large items, white-glove delivery can be arranged. Contact us for remote area quotes.`,
  },
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [openPolicy, setOpenPolicy] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribing(true);
    // Mailto fallback — opens mail client with subscription request
    window.location.href = `mailto:info@rtmetalsolutions.com?subject=Newsletter%20Subscription&body=Please%20add%20${encodeURIComponent(trimmed)}%20to%20the%20newsletter.`;
    setTimeout(() => {
      setSubscribing(false);
      setEmail('');
      toast.success('Thank you! Your subscription request has been sent.');
    }, 500);
  };

  const policy = openPolicy ? POLICY_CONTENT[openPolicy] : null;

  return (
    <footer className="bg-background border-t border-primary/20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <div className="text-3xl font-bold mb-3 text-gradient">Luxe Living</div>
            <p className="text-white/70 mb-6">
              Contemporary steel furniture and décor, meticulously crafted for modern living spaces.
            </p>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 bg-primary text-primary-foreground flex items-center space-x-2 rounded-sm hover:bg-primary/90 transition-colors button-hover"
            >
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
                  className="text-white/70 hover:text-primary transition-colors flex items-center py-1"
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
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-3 py-2 bg-card border border-primary/20 rounded-l-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-r-sm hover:bg-primary/90 transition-colors button-hover disabled:opacity-60"
              >
                {subscribing ? '...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            © 2025 Luxe Living. All Rights Reserved.
          </p>
          <div className="flex space-x-4 text-sm text-white/50">
            <button onClick={() => setOpenPolicy('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => setOpenPolicy('terms')} className="hover:text-white transition-colors">Terms of Service</button>
            <button onClick={() => setOpenPolicy('shipping')} className="hover:text-white transition-colors">Shipping Policy</button>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      <Dialog open={!!openPolicy} onOpenChange={(open) => !open && setOpenPolicy(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{policy?.title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground leading-relaxed">{policy?.body}</p>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
