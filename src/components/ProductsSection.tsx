
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { products } from "@/data/enhancedProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { SearchBar } from "@/components/search/SearchBar";
import { AdvancedFilters } from "@/components/filters/AdvancedFilters";
import { useProductSearch } from "@/hooks/useProductSearch";

const productCategories = [
  "BELLA", "DEMI", "LUNA", "AMARA", "JAX", 
  "BISHOP", "NIKITA", "FLOWER", "ZANI", "HOTEL", 
  "LANA", "TILLA", "SWING BENCH"
];


const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filteredProducts,
    filterOptions,
    resultCount,
    totalCount
  } = useProductSearch(products);

  // Listen for collection filter events from CollectionsSection
  useEffect(() => {
    const handleCategoryFilter = (event: CustomEvent) => {
      const { category } = event.detail;
      setSelectedCategory(category);
      // Update filters when category is selected from collections
      setFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    };

    window.addEventListener('filterByCategory', handleCategoryFilter as EventListener);
    
    return () => {
      window.removeEventListener('filterByCategory', handleCategoryFilter as EventListener);
    };
  }, [setFilters]);

  // Use the filtered products from the search hook
  const displayProducts = filteredProducts;

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

          {/* Search and Filters */}
          <div className="space-y-6">
            {/* Search Bar */}
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search by name, category, materials..."
              className="max-w-md"
            />

            {/* Advanced Filters */}
            <AdvancedFilters
              onFiltersChange={setFilters}
              availableCategories={filterOptions.categories}
              availableMaterials={filterOptions.materials}
              priceRange={filterOptions.priceRange}
            />

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-white/70">
                Showing {resultCount} of {totalCount} products
                {searchQuery && (
                  <span> for "{searchQuery}"</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `Try adjusting your search "${searchQuery}" or filters to find what you're looking for.`
                  : "Try adjusting your filters to find what you're looking for."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
