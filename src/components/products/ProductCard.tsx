import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types/ecommerce';
import { ShoppingCart, Eye, Package, Star } from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';
import { WishlistButton } from '@/components/wishlist/WishlistButton';
import { CompareButton } from '@/components/compare/CompareButton';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addToCart } = useCart();
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [showDetail, setShowDetail] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const averageRating = 4.2;
  const reviewCount = 24;

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
      <motion.div
        className={`relative overflow-hidden bg-card border-2 border-border group hover:border-primary/40 transition-colors duration-500 ${className || ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => setShowDetail(true)}>
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.08 : 1, filter: isHovered ? 'saturate(0.5)' : 'saturate(1)' }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNew && (
              <span className="px-2 py-1 bg-foreground text-background mono text-[10px] tracking-wider font-bold">NEW</span>
            )}
            {product.isFeatured && (
              <span className="px-2 py-1 bg-primary text-primary-foreground mono text-[10px] tracking-wider font-bold">FEATURED</span>
            )}
            {product.originalPrice && (
              <span className="px-2 py-1 bg-destructive text-destructive-foreground mono text-[10px] tracking-wider font-bold">SALE</span>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div
            className="absolute top-3 right-3 flex flex-col gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <WishlistButton product={product} size="sm" variant="ghost" className="bg-card/90 hover:bg-card" />
            <CompareButton product={product} size="sm" variant="ghost" className="bg-card/90 hover:bg-card" />
            <Button variant="secondary" size="sm" onClick={() => setShowDetail(true)} className="bg-card/90 hover:bg-card">
              <Eye className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Stock badge */}
          <div className="absolute bottom-3 left-3">
            {isOutOfStock ? (
              <span className="px-2 py-1 bg-destructive text-destructive-foreground mono text-[10px] tracking-wider font-bold flex items-center gap-1">
                <Package className="h-3 w-3" /> OUT OF STOCK
              </span>
            ) : isLowStock ? (
              <span className="px-2 py-1 bg-primary text-primary-foreground mono text-[10px] tracking-wider font-bold flex items-center gap-1">
                <Package className="h-3 w-3" /> {product.stock} LEFT
              </span>
            ) : null}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div>
            <span className="mono text-[10px] tracking-widest text-primary/60 block mb-1">
              {product.category} — {product.itemCode}
            </span>
            <h3 className="font-display font-bold text-lg text-foreground tracking-tight">{product.name}</h3>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= Math.round(averageRating) ? 'fill-primary text-primary' : 'text-border'}`}
                />
              ))}
            </div>
            <span className="mono text-xs text-muted-foreground">{averageRating} ({reviewCount})</span>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-foreground/80">{product.materials}</p>
            <p className="mono text-xs text-muted-foreground">{product.dimensions}</p>
          </div>

          {/* Price */}
          <div className="flex items-end gap-2">
            <span className="font-display font-bold text-xl text-primary">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="mono text-sm text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          {/* Finish selector */}
          {product.finishOptions && product.finishOptions.length > 1 && (
            <Select value={selectedFinish} onValueChange={setSelectedFinish}>
              <SelectTrigger className="bg-background border-border mono text-xs hover:border-primary transition-colors">
                <SelectValue placeholder="Select finish" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {product.finishOptions.map((finish) => (
                  <SelectItem key={finish} value={finish} className="mono text-xs">{finish}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-sm tracking-wider transition-all hover:shadow-[0_0_30px_hsl(46_75%_55%/0.4)]"
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'OUT OF STOCK' : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                ADD TO CART
              </>
            )}
          </Button>

          {product.deliveryTime && (
            <p className="mono text-[10px] text-muted-foreground text-center tracking-wider">
              DELIVERY: {product.deliveryTime.toUpperCase()}
            </p>
          )}
        </div>

        {/* Gold accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ transformOrigin: 'left' }}
        />
      </motion.div>

      <ProductDetailModal
        product={product}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </>
  );
};
