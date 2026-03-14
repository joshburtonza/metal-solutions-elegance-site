import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { motion } from "framer-motion";

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding bg-card relative grid-overlay">
      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <ScrollReveal animation="fadeLeft">
              <div>
                <span className="mono text-xs tracking-[0.3em] text-primary mb-4 block">// CONTACT</span>
                <h2 className="text-5xl md:text-7xl font-display font-black mb-6">
                  GET IN<br />
                  <span className="text-gradient">TOUCH</span>
                </h2>
                <p className="text-muted-foreground mb-12 max-w-md">
                  Interested in raw steel luxury? Our team is here to forge your vision into reality.
                </p>

                <div className="space-y-8">
                  <div className="border-l-2 border-primary pl-6">
                    <h3 className="font-display font-bold text-sm tracking-wider text-primary mb-3">CONTACT INFO</h3>
                    <div className="space-y-2 text-foreground/80 text-sm">
                      <p>Robin Oosthuizen</p>
                      <p>Germiston, Gauteng, Johannesburg, South Africa</p>
                      <p className="mono text-primary">info@rtmetalsolutions.com</p>
                      <p className="mono">+27 76 514 6465</p>
                    </div>
                  </div>

                  <div className="border-l-2 border-border pl-6">
                    <h3 className="font-display font-bold text-sm tracking-wider text-primary mb-3">SHOWROOM</h3>
                    <div className="space-y-1 text-foreground/80 text-sm mono">
                      <p>MON—FRI: 09:00 — 18:00</p>
                      <p>SAT: 10:00 — 16:00</p>
                      <p>SUN: CLOSED</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-sm tracking-wider text-primary mb-4">CONNECT</h3>
                    <div className="flex gap-1">
                      {[
                        { icon: Facebook, label: "Facebook" },
                        { icon: Instagram, label: "Instagram" },
                        { icon: Linkedin, label: "LinkedIn" },
                        { icon: Twitter, label: "Twitter" }
                      ].map(({ icon: Icon, label }) => (
                        <motion.a
                          key={label}
                          href="#"
                          className="w-12 h-12 border-2 border-border flex items-center justify-center text-foreground/60 hover:border-primary hover:text-primary transition-all"
                          whileHover={{ scale: 1.1 }}
                          aria-label={label}
                        >
                          <Icon className="h-4 w-4" />
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeRight" delay={0.2}>
              <div className="h-full min-h-[500px] border-2 border-border overflow-hidden">
                <iframe
                  title="Luxe Living Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114488.01788023044!2d28.058043057236456!3d-26.215413064030874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e95124e6ad30e9d%3A0xd37b3752ab0a8645!2sGermiston%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1716449753911!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(1) contrast(1.2) brightness(0.5)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
