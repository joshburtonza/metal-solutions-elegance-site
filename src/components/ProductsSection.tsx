import { useState, useEffect, Suspense, lazy } from "react";
import { Search } from "lucide-react";
import { products } from "@/data/enhancedProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { SearchBar } from "@/components/search/SearchBar";
import { AdvancedFilters } from "@/components/filters/AdvancedFilters";
import { useProductSearch } from "@/hooks/useProductSearch";
import { ScrollReveal, StaggerChildren, StaggerItem, SplitText } from "@/components/animations/ScrollReveal";

const SectionScene3D = lazy(() => import('@/components/3d/SectionScene').then(m => ({ default: m.SectionScene3D })));

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

  useEffect(() => {
    const handleCategoryFilter = (event: CustomEvent) => {
      const { category } = event.detail;
      setSelectedCategory(category);
      setFilters(prev => ({ ...prev, categories: [category] }));
    };

    window.addEventListener('filterByCategory', handleCategoryFilter as EventListener);
    return () => window.removeEventListener('filterByCategory', handleCategoryFilter as EventListener);
  }, [setFilters]);

  const displayProducts = filteredProducts;

  return (
    <section id="products" className="section-padding bg-card/20 relative mesh-bg">
      <div className="container relative z-10">
        {/* 3D separator */}
        <Suspense fallback={null}>
          <SectionScene3D variant="products" />
        </Suspense>

        <ScrollReveal animation="fadeUp">
          <div className="mb-16 text-center">
            <span className="mono text-xs tracking-[0.3em] text-primary/50 mb-4 block">// CATALOG</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-4">
              Product <SplitText text="Arsenal" className="text-gradient" animation="up" staggerDelay={0.05} />
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg mb-10">
              Every piece crafted with intention and precision.
            </p>

            <div className="max-w-2xl mx-auto space-y-6">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search by name, category, materials..."
                className="max-w-md mx-auto"
              />

              <AdvancedFilters
                onFiltersChange={setFilters}
                availableCategories={filterOptions.categories}
                availableMaterials={filterOptions.materials}
                priceRange={filterOptions.priceRange}
              />

              <div className="flex items-center justify-center">
                <p className="mono text-sm text-muted-foreground">
                  {resultCount} of {totalCount} products
                  {searchQuery && <span className="text-primary"> · "{searchQuery}"</span>}
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold mb-2">No results found</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery
                  ? `Try adjusting "${searchQuery}" or your filters.`
                  : "Adjust filters to find products."
                }
              </p>
            </div>
          )}
        </StaggerChildren>
      </div>
    </section>
  );
};

export default ProductsSection;
