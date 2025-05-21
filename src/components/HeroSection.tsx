
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleSlideChange((currentSlide + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleSlideChange = (index: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSlide(index);
    
    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const goToSlide = (index: number) => {
    handleSlideChange(index);
  };

  const goToPrevSlide = () => {
    handleSlideChange(currentSlide === 0 ? heroImages.length - 1 : currentSlide - 1);
  };

  const goToNextSlide = () => {
    handleSlideChange((currentSlide + 1) % heroImages.length);
  };

  return (
    <section id="hero" className="relative h-screen">
      {/* Image carousel with enhanced transitions */}
      <div className="absolute inset-0 overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
              currentSlide === index 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            }`}
            aria-hidden={currentSlide !== index}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/95 via-charcoal-dark/50 to-transparent" />
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Content overlay with enhanced styling */}
      <div className="relative h-full flex flex-col justify-center items-center z-10 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-white">RT METAL SOLUTIONS</span> 
            <span className="text-burntOrange ml-2">2025</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "200ms" }}>
            Contemporary Steel Furniture & Décor for Modern Living
          </p>
          
          <button 
            onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-burntOrange text-white font-medium rounded-sm transform transition-all duration-300 hover:bg-burntOrange/90 hover:shadow-lg hover:translate-y-[-2px] animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            Explore Collections
          </button>
        </div>

        {/* Enhanced slider controls */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-3 animate-fade-in" style={{ animationDelay: "600ms" }}>
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                currentSlide === index 
                  ? "bg-burntOrange w-10 shadow-[0_0_8px_rgba(249,115,22,0.6)]" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              disabled={isTransitioning}
            />
          ))}
        </div>
        
        {/* Enhanced navigation buttons */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition-all transform hover:scale-110 hover:shadow-lg"
          aria-label="Previous slide"
          disabled={isTransitioning}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={goToNextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full transition-all transform hover:scale-110 hover:shadow-lg"
          aria-label="Next slide"
          disabled={isTransitioning}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
