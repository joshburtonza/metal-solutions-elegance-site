
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { products } from "@/data/enhancedProducts";
import { ProductCard } from "@/components/products/ProductCard";

const productCategories = [
  "BELLA", "DEMI", "LUNA", "AMARA", "JAX", 
  "BISHOP", "NIKITA", "FLOWER", "ZANI", "HOTEL", 
  "LANA", "TILLA", "SWING BENCH"
];


const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsCategoryDropdownOpen(!isCategoryDropdownOpen);

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory) 
    : products;

  return (
    <section id="products" className="section-padding bg-charcoal-dark">
      <div className="container">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Product <span className="text-gradient">Catalog</span>
          </h2>
          <p className="text-white/70 max-w-2xl mb-8">
            Explore our extensive range of contemporary steel furniture and décor items, crafted with precision and attention to detail.
          </p>

          {/* Category Filter */}
          <div className="relative inline-block w-full md:w-64 mb-8">
            <button
              onClick={toggleDropdown}
              className="w-full flex items-center justify-between px-4 py-3 bg-charcoal border border-white/10 rounded-md focus:outline-none"
            >
              <span>{selectedCategory || "All Categories"}</span>
              {isCategoryDropdownOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute z-20 w-full mt-1 bg-charcoal border border-white/10 rounded-md shadow-lg max-h-60 overflow-auto">
                <div 
                  className="px-4 py-2 hover:bg-charcoal-light cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(null);
                    setIsCategoryDropdownOpen(false);
                  }}
                >
                  All Categories
                </div>
                {productCategories.map((category) => (
                  <div
                    key={category}
                    className="px-4 py-2 hover:bg-charcoal-light cursor-pointer"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsCategoryDropdownOpen(false);
                    }}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
