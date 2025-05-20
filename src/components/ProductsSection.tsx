
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const productCategories = [
  "BELLA", "DEMI", "LUNA", "AMARA", "JAX", 
  "BISHOP", "NIKITA", "FLOWER", "ZANI", "HOTEL", 
  "LANA", "TILLA", "SWING BENCH"
];

const products = [
  {
    id: "bella-01",
    name: "BELLA Coffee Table",
    itemCode: "BL-CT-01",
    category: "BELLA",
    dimensions: "120cm × 60cm × 45cm",
    materials: "Brushed Steel, Marble Top",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1969"
  },
  {
    id: "bella-02",
    name: "BELLA Side Table",
    itemCode: "BL-ST-02",
    category: "BELLA",
    dimensions: "45cm × 45cm × 50cm",
    materials: "Polished Steel, Tempered Glass",
    image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?q=80&w=2035"
  },
  {
    id: "demi-01",
    name: "DEMI Chair",
    itemCode: "DM-CH-01",
    category: "DEMI",
    dimensions: "60cm × 55cm × 80cm",
    materials: "Matte Steel, Premium Leather",
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=2080"
  },
  {
    id: "luna-01",
    name: "LUNA Mirror",
    itemCode: "LN-MR-01",
    category: "LUNA",
    dimensions: "90cm × 5cm × 90cm",
    materials: "Circular Brushed Steel Frame",
    image: "https://images.unsplash.com/photo-1619596662481-085e45d69762?q=80&w=1974"
  },
  {
    id: "amara-01",
    name: "AMARA Dining Set",
    itemCode: "AM-DS-01",
    category: "AMARA",
    dimensions: "Table: 180cm × 90cm × 75cm",
    materials: "Blackened Steel, Suede Chairs",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932"
  },
  {
    id: "bishop-01",
    name: "BISHOP Bookshelf",
    itemCode: "BS-BK-01",
    category: "BISHOP",
    dimensions: "90cm × 35cm × 200cm",
    materials: "Powder-coated Steel",
    image: "https://images.unsplash.com/photo-1588169257530-58be9c5d4adc?q=80&w=2070"
  },
  {
    id: "nikita-01",
    name: "NIKITA Desk",
    itemCode: "NK-DK-01",
    category: "NIKITA",
    dimensions: "140cm × 70cm × 75cm",
    materials: "Graphite Steel, Tempered Glass",
    image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?q=80&w=2065"
  },
  {
    id: "swing-01",
    name: "SWING BENCH",
    itemCode: "SW-BN-01",
    category: "SWING BENCH",
    dimensions: "180cm × 60cm × 45cm",
    materials: "Steel Frame, Premium Cushions",
    image: "https://images.unsplash.com/photo-1556438758-8d49568ce18e?q=80&w=2070"
  }
];

const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsCategoryDropdownOpen(!isCategoryDropdownOpen);

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory) 
    : products;

  const toggleProductDetails = (productId: string) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-burntOrange/20"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-burntOrange px-2 py-1 text-xs text-white rounded">
                  {product.itemCode}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-white/70 mb-3">
                  {product.category}
                </p>

                <button
                  onClick={() => toggleProductDetails(product.id)}
                  className="flex items-center justify-between w-full text-sm text-burntOrange"
                >
                  <span>Product Details</span>
                  {expandedProduct === product.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {expandedProduct === product.id && (
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm space-y-2">
                    <p>
                      <span className="text-white/50">Item Code: </span>
                      <span className="text-white">{product.itemCode}</span>
                    </p>
                    <p>
                      <span className="text-white/50">Dimensions: </span>
                      <span className="text-white">{product.dimensions}</span>
                    </p>
                    <p>
                      <span className="text-white/50">Materials: </span>
                      <span className="text-white">{product.materials}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
