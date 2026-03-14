import { useState, useEffect, Suspense, lazy } from "react";
import { Search } from "lucide-react";
import { products } from "@/data/enhancedProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { SearchBar } from "@/components/search/SearchBar";
import { AdvancedFilters } from "@/components/filters/AdvancedFilters";
import { useProductSearch } from "@/hooks/useProductSearch";
import { ScrollReveal, StaggerChildren, StaggerItem } from "@/components/animations/ScrollReveal";

const ProductScene3D = lazy(() => import('@/components/3d/ProductScene').then(m => ({ default: m.ProductScene3D })));

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
    <section id="products" className="section-padding bg-card relative grid-overlay">
      <div className="container relative z-10">
        {/* 3D separator */}
        <Suspense fallback={null}>
          <div className="mb-8">
            <ProductScene3D variant="frame" />
          </div>
        </Suspense>

        <ScrollReveal animation="fadeUp">
          <div className="mb-16">
            <span className="mono text-xs tracking-[0.3em] text-primary mb-4 block">// CATALOG</span>
            <h2 className="text-5xl md:text-7xl font-display font-black mb-4">
              PRODUCT<br />
              <span className="text-gradient">ARSENAL</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mb-8">
              Industrial precision. Every piece forged with intent.
            </p>

            <div className="space-y-6">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search by name, category, materials..."
                className="max-w-md"
              />

              <AdvancedFilters
                onFiltersChange={setFilters}
                availableCategories={filterOptions.categories}
                availableMaterials={filterOptions.materials}
                priceRange={filterOptions.priceRange}
              />

              <div className="flex items-center justify-between border-t border-border pt-4">
                <p className="mono text-sm text-muted-foreground">
                  [{resultCount}/{totalCount}] RESULTS
                  {searchQuery && <span> → "{searchQuery}"</span>}
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1" staggerDelay={0.1}>
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold mb-2">NO RESULTS</h3>
              <p className="text-muted-foreground mono text-sm">
                {searchQuery
                  ? `Adjust search "${searchQuery}" or filters.`
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
