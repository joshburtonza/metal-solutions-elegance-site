import { useState, useMemo } from 'react';
import { Product } from '@/types/ecommerce';
import { FilterOptions } from '@/components/filters/AdvancedFilters';

export const useProductSearch = (products: Product[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    materials: [],
    priceRange: [0, 50000],
    inStock: false,
    isNew: false,
    isFeatured: false
  });

  // Extract unique values from products for filter options
  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(products.map(p => p.category))).sort();
    const materials = Array.from(new Set(
      products.flatMap(p => p.materials.split(', '))
    )).sort();
    const prices = products.map(p => p.price);
    const priceRange: [number, number] = [Math.min(...prices), Math.max(...prices)];

    return { categories, materials, priceRange };
  }, [products]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.materials.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.itemCode.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.categories.length > 0) {
      result = result.filter(product => filters.categories.includes(product.category));
    }

    if (filters.materials.length > 0) {
      result = result.filter(product => 
        filters.materials.some(material => 
          product.materials.toLowerCase().includes(material.toLowerCase())
        )
      );
    }

    if (filters.priceRange[0] > filterOptions.priceRange[0] || 
        filters.priceRange[1] < filterOptions.priceRange[1]) {
      result = result.filter(product => 
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
      );
    }

    if (filters.inStock) {
      result = result.filter(product => product.stock > 0);
    }

    if (filters.isNew) {
      result = result.filter(product => product.isNew);
    }

    if (filters.isFeatured) {
      result = result.filter(product => product.isFeatured);
    }

    return result;
  }, [products, searchQuery, filters, filterOptions.priceRange]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filteredProducts,
    filterOptions,
    resultCount: filteredProducts.length,
    totalCount: products.length
  };
};