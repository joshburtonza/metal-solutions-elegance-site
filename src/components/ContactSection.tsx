import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
const ContactSection = () => {
  return <section id="contact" className="section-padding bg-charcoal-dark">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get In <span className="text-gradient">Touch</span>
              </h2>
              <p className="text-white/70 mb-8">
                Interested in our products or have questions? Our team is here to assist you with any inquiries about our premium steel furniture and décor.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                  <div className="space-y-3 text-white/80">
                    <p>Robin Oosthuizen</p>
                    <p>Germiston, Gauteng, Johannesburg, South Africa</p>
                    <p>Email: info@rtmetalsolutions.com</p>
                    <p>Phone: +27 76 514 6465</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Showroom Hours</h3>
                  <div className="space-y-1 text-white/80">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-charcoal hover:bg-burntOrange p-3 rounded-full transition-colors" aria-label="Facebook">
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a href="#" className="bg-charcoal hover:bg-burntOrange p-3 rounded-full transition-colors" aria-label="Instagram">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="#" className="bg-charcoal hover:bg-burntOrange p-3 rounded-full transition-colors" aria-label="LinkedIn">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href="#" className="bg-charcoal hover:bg-burntOrange p-3 rounded-full transition-colors" aria-label="Twitter">
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full">
              <div className="h-full rounded-md overflow-hidden">
                <iframe title="RT Metal Solutions Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114488.01788023044!2d28.058043057236456!3d-26.215413064030874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e95124e6ad30e9d%3A0xd37b3752ab0a8645!2sGermiston%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1716449753911!5m2!1sen!2sus" width="100%" height="100%" style={{
                border: 0,
                minHeight: "300px"
              }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactSection;