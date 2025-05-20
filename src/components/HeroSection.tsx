
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroImages = [
  {
    src: "/lovable-uploads/072f1f50-0eb2-4aa0-a473-35d1b488497c.png",
    alt: "Modern orange steel lounge chair with ottoman",
  },
  {
    src: "/lovable-uploads/22dd1449-dcc3-41ed-8c5d-6e68c507b0e7.png",
    alt: "Contemporary living space with steel furniture and orange accents",
  },
  {
    src: "/lovable-uploads/f21e2af8-0505-4c06-93da-90dd7821b7a8.png",
    alt: "Modern steel framed lounge area with decorative plant features",
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="hero" className="relative h-screen">
      {/* Image carousel */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark via-transparent to-transparent opacity-90" />
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Content overlay */}
      <div className="relative h-full flex flex-col justify-center items-center z-10 px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-center">
          RT METAL SOLUTIONS <span className="text-burntOrange">2025</span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl text-center">
          Contemporary Steel Furniture & Décor for Modern Living
        </p>
        <button 
          onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-8 py-3 bg-burntOrange text-white font-medium rounded-sm hover:bg-burntOrange/90 button-hover"
        >
          Explore Collections
        </button>

        {/* Slider controls */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-burntOrange w-8" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <button
          onClick={goToPrevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={goToNextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
