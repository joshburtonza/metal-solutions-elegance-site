import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCompare } from '@/contexts/CompareContext';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, X, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface CompareDrawerProps {
  children: React.ReactNode;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({ children }) => {
  const { compareItems, removeFromCompare, clearCompare, compareCount } = useCompare();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const comparisonFields = [
    { key: 'price', label: 'Price', render: (value: number) => formatCurrency(value) },
    { key: 'category', label: 'Category' },
    { key: 'materials', label: 'Materials' },
    { key: 'dimensions', label: 'Dimensions' },
    { key: 'stock', label: 'Stock', render: (value: number) => `${value} available` },
    { key: 'deliveryTime', label: 'Delivery Time' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-4xl max-w-full">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Compare Products ({compareCount})
            </SheetTitle>
            {compareCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearCompare}>
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {compareCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No products to compare</h3>
              <p className="text-muted-foreground mb-4">Add products to compare their features side by side</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Product Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {compareItems.map((product) => (
                  <Card key={product.id} className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    
                    <CardContent className="p-4">
                      <div className="aspect-square overflow-hidden rounded-md mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                        <p className="text-primary font-medium">{formatCurrency(product.price)}</p>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            className="flex-1"
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Comparison Table */}
              {compareCount >= 2 && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Feature Comparison</h3>
                  <div className="space-y-4">
                    {comparisonFields.map((field) => (
                      <div key={field.key} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <div className="font-medium text-sm text-muted-foreground mb-2 md:col-span-full">
                          {field.label}
                        </div>
                        {compareItems.map((product) => {
                          const value = product[field.key as keyof typeof product];
                          const displayValue = field.render && typeof value === 'number' 
                            ? field.render(value) 
                            : String(value || 'N/A');
                          
                          return (
                            <div key={product.id} className="text-sm p-2 bg-background rounded border">
                              {displayValue}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};