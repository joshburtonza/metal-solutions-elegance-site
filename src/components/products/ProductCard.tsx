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
        className={`relative overflow-hidden glass-card group transition-all duration-500 ${className || ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          animate={{
            boxShadow: isHovered
              ? '0 0 40px hsl(250 90% 72% / 0.1), 0 20px 60px hsl(0 0% 0% / 0.3)'
              : '0 0 0px transparent, 0 8px 32px hsl(0 0% 0% / 0.3)'
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Product Image */}
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden cursor-pointer rounded-t-2xl" onClick={() => setShowDetail(true)}>
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="px-2.5 py-1 bg-primary text-primary-foreground rounded-full text-[10px] tracking-wider font-bold">NEW</span>
            )}
            {product.isFeatured && (
              <span className="px-2.5 py-1 bg-accent text-accent-foreground rounded-full text-[10px] tracking-wider font-bold">FEATURED</span>
            )}
            {product.originalPrice && (
              <span className="px-2.5 py-1 bg-destructive text-destructive-foreground rounded-full text-[10px] tracking-wider font-bold">SALE</span>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div
            className="absolute top-3 right-3 flex flex-col gap-1.5 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <WishlistButton product={product} size="sm" variant="ghost" className="bg-card/80 backdrop-blur-lg rounded-full hover:bg-card" />
            <CompareButton product={product} size="sm" variant="ghost" className="bg-card/80 backdrop-blur-lg rounded-full hover:bg-card" />
            <Button variant="secondary" size="sm" onClick={() => setShowDetail(true)} className="bg-card/80 backdrop-blur-lg rounded-full hover:bg-card">
              <Eye className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Stock badge */}
          <div className="absolute bottom-3 left-3">
            {isOutOfStock ? (
              <span className="px-2.5 py-1 bg-destructive/90 backdrop-blur text-destructive-foreground rounded-full text-[10px] tracking-wider font-bold flex items-center gap-1">
                <Package className="h-3 w-3" /> OUT OF STOCK
              </span>
            ) : isLowStock ? (
              <span className="px-2.5 py-1 bg-primary/90 backdrop-blur text-primary-foreground rounded-full text-[10px] tracking-wider font-bold flex items-center gap-1">
                <Package className="h-3 w-3" /> {product.stock} LEFT
              </span>
            ) : null}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 relative z-10">
          <div>
            <span className="mono text-[10px] tracking-widest text-primary/40 block mb-1">
              {product.category} · {product.itemCode}
            </span>
            <h3 className="font-display font-bold text-lg text-foreground">{product.name}</h3>
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
            <span className="text-xs text-muted-foreground">{averageRating} ({reviewCount})</span>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-foreground/60">{product.materials}</p>
            <p className="mono text-xs text-muted-foreground">{product.dimensions}</p>
          </div>

          {/* Price */}
          <div className="flex items-end gap-2">
            <span className="font-display font-bold text-xl text-primary">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          {/* Finish selector */}
          {product.finishOptions && product.finishOptions.length > 1 && (
            <Select value={selectedFinish} onValueChange={setSelectedFinish}>
              <SelectTrigger className="bg-background/50 border-border/50 text-sm rounded-xl hover:border-primary/30 transition-colors">
                <SelectValue placeholder="Select finish" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50 rounded-xl">
                {product.finishOptions.map((finish) => (
                  <SelectItem key={finish} value={finish} className="text-sm">{finish}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold text-sm rounded-xl transition-all hover:shadow-[0_0_30px_hsl(250_90%_72%/0.3)]"
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>

          {product.deliveryTime && (
            <p className="mono text-[10px] text-muted-foreground text-center tracking-wider">
              Delivery: {product.deliveryTime}
            </p>
          )}
        </div>
      </motion.div>

      <ProductDetailModal
        product={product}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </>
  );
};
