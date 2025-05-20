
import { useState } from "react";
import { ChevronRight } from "lucide-react";

const collections = [
  {
    name: "BELLA",
    description: "Elegant curved steel forms with marble accents",
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?q=80&w=1974"
  },
  {
    name: "DEMI",
    description: "Minimalist approach with clean lines and angles",
    image: "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?q=80&w=1974"
  },
  {
    name: "LUNA",
    description: "Circular motifs with brushed steel finishes",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1965"
  },
  {
    name: "AMARA",
    description: "Bold contemporary pieces with suede highlights",
    image: "https://images.unsplash.com/photo-1518894781321-630e638d0742?q=80&w=2080"
  }
];

const CollectionsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="collections" className="section-padding bg-charcoal">
      <div className="container">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            Premium <span className="text-gradient">Collections</span>
          </h2>
          <p className="text-white/70 max-w-2xl">
            Discover our meticulously crafted furniture lines, where contemporary steel design meets luxurious finishes and expert craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <div 
              key={collection.name}
              className="relative overflow-hidden rounded-md group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={collection.image} 
                  alt={collection.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    hoveredIndex === index ? "scale-110" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300">
                <h3 className="text-2xl font-semibold text-white mb-2">{collection.name}</h3>
                <p className={`text-white/80 mb-4 transform transition-all duration-300 ${
                  hoveredIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}>
                  {collection.description}
                </p>
                <button className={`flex items-center text-burntOrange transform transition-all duration-300 ${
                  hoveredIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}>
                  <span className="mr-1">View Collection</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
