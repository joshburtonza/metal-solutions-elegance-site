
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    text: "Luxe Living transformed our hotel lobby with their HOTEL collection. The precision craftsmanship and attention to detail is exceptional.",
    author: "James Wilson",
    title: "Design Director, Grand Meridian Hotels",
    image: "https://images.unsplash.com/photo-1611689102192-1f6e0e52df0a?q=80&w=1965"
  },
  {
    text: "The BELLA coffee table is a statement piece in our living room. It's incredibly well-made and draws compliments from everyone who visits.",
    author: "Sophia Martinez",
    title: "Interior Design Enthusiast",
    image: "https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=2070"
  },
  {
    text: "We furnished our entire office with pieces from the NIKITA collection. The durability and elegance of these pieces is unmatched.",
    author: "Michael Chang",
    title: "CEO, Modern Spaces Inc.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069"
  },
  {
    text: "The SWING BENCH has become the centerpiece of our patio. Luxe Living delivers exactly what they promise - luxury and quality.",
    author: "Emily Johnson",
    title: "Landscape Architect",
    image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=2070"
  }
];

const installations = [
  {
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070",
    location: "Private Residence, Los Angeles"
  },
  {
    image: "https://images.unsplash.com/photo-1577958194277-1e583325b09b?q=80&w=1974",
    location: "Azure Hotel, Miami"
  },
  {
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070",
    location: "Executive Office, New York"
  },
  {
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070",
    location: "Luxury Apartment, San Francisco"
  },
  {
    image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=2069",
    location: "Contemporary Gallery, Seattle"
  }
];

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="section-padding bg-card">
      <div className="container">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Customer <span className="text-gradient">Testimonials</span>
          </h2>
          <p className="text-white/70 max-w-2xl">
            Discover what our clients have to say about their experiences with Luxe Living's premium furniture.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto mb-20">
          <div className="glass-card rounded-md overflow-hidden">
            <div className="relative h-[400px] md:h-[300px]">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    currentTestimonial === index
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-20"
                  }`}
                >
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="hidden md:block md:w-2/5 h-full">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                      <blockquote className="text-lg md:text-xl mb-6 italic text-white/90">
                        "{testimonial.text}"
                      </blockquote>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-white/70">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4">
            <button
              onClick={goToPrevTestimonial}
              className="bg-card/50 hover:bg-primary p-2 rounded-full transition-colors glass-card"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-4">
            <button
              onClick={goToNextTestimonial}
              className="bg-card/50 hover:bg-primary p-2 rounded-full transition-colors glass-card"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Indicator Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentTestimonial === index ? "bg-primary w-6" : "bg-white/30"
                }`}
                style={currentTestimonial === index ? { boxShadow: 'var(--shadow-chrome-glow)' } : {}}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Installations Gallery */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-8">Featured Installations</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {installations.map((installation, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-md"
              >
                <div className="aspect-square">
                  <img 
                    src={installation.image} 
                    alt={installation.location}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-sm text-white">{installation.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
