import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { motion } from "framer-motion";

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding bg-card/30 relative mesh-bg">
      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fadeUp">
            <div className="text-center mb-16">
              <span className="mono text-xs tracking-[0.3em] text-primary/60 mb-4 block">reach out</span>
              <h2 className="text-5xl md:text-7xl font-display font-bold">
                Get in <span className="text-gradient">Touch</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ScrollReveal animation="fadeLeft">
              <div className="space-y-8">
                <div className="glass-card p-8">
                  <h3 className="font-display font-bold text-primary text-sm mb-4">Contact Info</h3>
                  <div className="space-y-3 text-foreground/70">
                    <p>Robin Oosthuizen</p>
                    <p>Germiston, Gauteng, Johannesburg, South Africa</p>
                    <p className="text-primary">info@rtmetalsolutions.com</p>
                    <p className="mono text-sm">+27 76 514 6465</p>
                  </div>
                </div>

                <div className="glass-card p-8">
                  <h3 className="font-display font-bold text-primary text-sm mb-4">Showroom Hours</h3>
                  <div className="space-y-2 text-foreground/70 mono text-sm">
                    <p>MON—FRI: 09:00 — 18:00</p>
                    <p>SAT: 10:00 — 16:00</p>
                    <p>SUN: Closed</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-bold text-primary text-sm mb-4">Connect</h3>
                  <div className="flex gap-3">
                    {[
                      { icon: Facebook, label: "Facebook" },
                      { icon: Instagram, label: "Instagram" },
                      { icon: Linkedin, label: "LinkedIn" },
                      { icon: Twitter, label: "Twitter" }
                    ].map(({ icon: Icon, label }) => (
                      <motion.a
                        key={label}
                        href="#"
                        className="w-11 h-11 rounded-full border border-border/50 flex items-center justify-center text-foreground/40 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        aria-label={label}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeRight" delay={0.2}>
              <div className="h-full min-h-[500px] rounded-2xl overflow-hidden glow-border">
                <iframe
                  title="Luxe Living Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114488.01788023044!2d28.058043057236456!3d-26.215413064030874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e95124e6ad30e9d%3A0xd37b3752ab0a8645!2sGermiston%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1716449753911!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'saturate(0.3) brightness(0.6) hue-rotate(200deg)' }}
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
