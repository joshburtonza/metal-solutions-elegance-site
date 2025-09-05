import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { formatCurrency } from '@/lib/utils';

export interface FilterOptions {
  categories: string[];
  materials: string[];
  priceRange: [number, number];
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  availableCategories: string[];
  availableMaterials: string[];
  priceRange: [number, number];
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  availableCategories,
  availableMaterials,
  priceRange
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    materials: [],
    priceRange: priceRange,
    inStock: false,
    isNew: false,
    isFeatured: false
  });

  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const categories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    updateFilters({ categories });
  };

  const handleMaterialChange = (material: string, checked: boolean) => {
    const materials = checked 
      ? [...filters.materials, material]
      : filters.materials.filter(m => m !== material);
    updateFilters({ materials });
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      categories: [],
      materials: [],
      priceRange: priceRange,
      inStock: false,
      isNew: false,
      isFeatured: false
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.materials.length > 0 || 
    filters.priceRange[0] !== priceRange[0] || 
    filters.priceRange[1] !== priceRange[1] ||
    filters.inStock || filters.isNew || filters.isFeatured;

  return (
    <div className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
              {hasActiveFilters && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4 space-y-6 p-4 border rounded-lg bg-card">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range</Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
              max={priceRange[1]}
              min={priceRange[0]}
              step={500}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency(filters.priceRange[0])}</span>
              <span>{formatCurrency(filters.priceRange[1])}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Materials</Label>
            <div className="grid grid-cols-1 gap-2">
              {availableMaterials.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={`material-${material}`}
                    checked={filters.materials.includes(material)}
                    onCheckedChange={(checked) => 
                      handleMaterialChange(material, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`material-${material}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {material}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Product Flags */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Product Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.inStock}
                  onCheckedChange={(checked) => updateFilters({ inStock: checked as boolean })}
                />
                <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                  In Stock Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-new"
                  checked={filters.isNew}
                  onCheckedChange={(checked) => updateFilters({ isNew: checked as boolean })}
                />
                <Label htmlFor="is-new" className="text-sm font-normal cursor-pointer">
                  New Products
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-featured"
                  checked={filters.isFeatured}
                  onCheckedChange={(checked) => updateFilters({ isFeatured: checked as boolean })}
                />
                <Label htmlFor="is-featured" className="text-sm font-normal cursor-pointer">
                  Featured Products
                </Label>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear All Filters
            </Button>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};