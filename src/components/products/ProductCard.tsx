import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types/ecommerce';
import { ShoppingCart, Eye, Package } from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addToCart } = useCart();
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [showDetail, setShowDetail] = useState(false);

  const handleAddToCart = () => {
    const finish = product.finishOptions && product.finishOptions.length > 0 
      ? selectedFinish || product.finishOptions[0] 
      : undefined;
    addToCart(product, 1, finish);
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock <= 3 && product.stock > 0;

  return (
    <>
      <Card className={`group overflow-hidden glass-card hover:shadow-lg transition-all duration-300 ${className}`}>
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="default" className="bg-primary text-primary-foreground">
                NEW
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="secondary">
                FEATURED
              </Badge>
            )}
            {product.originalPrice && (
              <Badge variant="destructive">
                SALE
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDetail(true)}
              className="mb-2"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Stock Status */}
          <div className="absolute bottom-3 left-3">
            {isOutOfStock ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                Out of Stock
              </Badge>
            ) : isLowStock ? (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                <Package className="h-3 w-3 mr-1" />
                Low Stock
              </Badge>
            ) : null}
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="font-medium text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.itemCode}</p>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{product.materials}</p>
            <p className="text-xs text-muted-foreground">{product.dimensions}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {product.originalPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-medium text-primary">
                  {formatCurrency(product.price)}
                </span>
              )}
              <p className="text-xs text-muted-foreground">VAT included</p>
            </div>
          </div>

          {/* Finish Selection */}
          {product.finishOptions && product.finishOptions.length > 1 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Finish Options:</label>
              <Select value={selectedFinish} onValueChange={setSelectedFinish}>
                <SelectTrigger>
                  <SelectValue placeholder="Select finish" />
                </SelectTrigger>
                <SelectContent>
                  {product.finishOptions.map((finish) => (
                    <SelectItem key={finish} value={finish}>
                      {finish}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            className="w-full button-hover"
            disabled={isOutOfStock}
          >
            {isOutOfStock ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>

          {product.deliveryTime && (
            <p className="text-xs text-muted-foreground text-center">
              Delivery: {product.deliveryTime}
            </p>
          )}
        </CardContent>
      </Card>

      <ProductDetailModal
        product={product}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </>
  );
};