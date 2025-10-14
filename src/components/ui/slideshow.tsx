import React, { useState, useEffect } from "react";

interface Slide {
  img: string;
  text: string[];
  alt: string;
}

interface SlideshowProps {
  slides: Slide[];
  autoPlayInterval?: number;
}

export default function Slideshow({ slides, autoPlayInterval = 5000 }: SlideshowProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoPlayInterval) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [current, slides.length, autoPlayInterval]);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="slideshow">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`slide ${i === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.img})` }}
          role="img"
          aria-label={slide.alt}
        >
          <div className="slide-text">
            {slide.text.map((t, j) => (
              <span key={j}>{t}</span>
            ))}
          </div>
        </div>
      ))}

      {/* Controls */}
      <button className="nav left" onClick={prevSlide} aria-label="Previous slide">
        ←
      </button>
      <button className="nav right" onClick={nextSlide} aria-label="Next slide">
        →
      </button>

      {/* Counter */}
      <div className="counter">
        0{current + 1} / 0{slides.length}
      </div>
    </div>
  );
}
