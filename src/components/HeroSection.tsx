import Slideshow from "@/components/ui/slideshow";

const heroSlides = [
  {
    img: "/lovable-uploads/072f1f50-0eb2-4aa0-a473-35d1b488497c.png",
    text: ["LUXE LIVING", "2025"],
    alt: "Modern orange steel lounge chair with ottoman",
  },
  {
    img: "/lovable-uploads/22dd1449-dcc3-41ed-8c5d-6e68c507b0e7.png",
    text: ["CONTEMPORARY", "DESIGN"],
    alt: "Contemporary living space with steel furniture and orange accents",
  },
  {
    img: "/lovable-uploads/f21e2af8-0505-4c06-93da-90dd7821b7a8.png",
    text: ["TIMELESS", "ELEGANCE"],
    alt: "Modern steel framed lounge area with decorative plant features",
  }
];

const HeroSection = () => {
  return (
    <section id="hero" className="relative h-screen">
      <Slideshow slides={heroSlides} autoPlayInterval={5000} />
    </section>
  );
};

export default HeroSection;
