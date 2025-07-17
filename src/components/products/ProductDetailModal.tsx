import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types/ecommerce';
import { ShoppingCart, Package, Clock, Ruler, Palette, CheckCircle } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  open,
  onOpenChange
}) => {
  const { addToCart } = useCart();
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    const finish = product.finishOptions && product.finishOptions.length > 0 
      ? selectedFinish || product.finishOptions[0] 
      : undefined;
    addToCart(product, quantity, finish);
    onOpenChange(false);
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock <= 3 && product.stock > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{product.name}</span>
            <div className="flex gap-2">
              {product.isNew && <Badge variant="default">NEW</Badge>}
              {product.isFeatured && <Badge variant="secondary">FEATURED</Badge>}
              {product.originalPrice && <Badge variant="destructive">SALE</Badge>}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-muted-foreground">{product.itemCode}</p>
              <Badge variant="outline">{product.category}</Badge>
            </div>

            {/* Price */}
            <div className="space-y-1">
              {product.originalPrice ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <Badge variant="destructive">
                    Save {formatCurrency(product.originalPrice - product.price)}
                  </Badge>
                </div>
              ) : (
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
              )}
              <p className="text-sm text-muted-foreground">VAT included</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {isOutOfStock ? (
                <span className="text-destructive font-medium">Out of Stock</span>
              ) : isLowStock ? (
                <span className="text-amber-600 font-medium">
                  Only {product.stock} left in stock
                </span>
              ) : (
                <span className="text-green-600 font-medium">In Stock</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            <Separator />

            {/* Product Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                <span className="font-medium">Dimensions:</span>
                <span className="text-muted-foreground">{product.dimensions}</span>
              </div>

              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="font-medium">Materials:</span>
                <span className="text-muted-foreground">{product.materials}</span>
              </div>

              {product.deliveryTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Delivery Time:</span>
                  <span className="text-muted-foreground">{product.deliveryTime}</span>
                </div>
              )}
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Specifications</h3>
                <ul className="space-y-1">
                  {product.specifications.map((spec, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Finish Selection */}
            {product.finishOptions && product.finishOptions.length > 1 && (
              <div className="space-y-3">
                <label className="font-medium">Finish Options:</label>
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

            {/* Quantity Selection */}
            <div className="space-y-3">
              <label className="font-medium">Quantity:</label>
              <Select 
                value={quantity.toString()} 
                onValueChange={(value) => setQuantity(parseInt(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: Math.min(10, product.stock) }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              className="w-full button-hover"
              size="lg"
              disabled={isOutOfStock}
            >
              {isOutOfStock ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add {quantity} to Cart - {formatCurrency(product.price * quantity)}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};