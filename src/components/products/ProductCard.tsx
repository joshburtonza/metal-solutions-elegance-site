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
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Mock rating for demo
  const averageRating = 4.2;
  const reviewCount = 24;

  const handleAddToCart = () => {
    const finish = product.finishOptions && product.finishOptions.length > 0 
      ? selectedFinish || product.finishOptions[0] 
      : undefined;
    addToCart(product, 1, finish);
  };

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 3;
      const rotateY = (x / rect.width) * 3;
      setRotation({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock <= 3 && product.stock > 0;

  return (
    <>
      <motion.div
        ref={cardRef}
        className={`relative rounded-3xl overflow-hidden ${className}`}
        style={{
          transformStyle: "preserve-3d",
          backgroundColor: "hsl(0 0% 8%)",
        }}
        initial={{ y: 0 }}
        animate={{
          y: isHovered ? -5 : 0,
          rotateX: rotation.x,
          rotateY: rotation.y,
          perspective: 1000,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Glass reflection overlay */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.03) 100%)",
            backdropFilter: "blur(2px)",
          }}
          animate={{
            opacity: isHovered ? 0.7 : 0.5,
          }}
        />

        {/* Noise texture */}
        <motion.div
          className="absolute inset-0 opacity-20 mix-blend-overlay z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Chrome/Gold glow effect */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-2/3 z-20"
          style={{
            background: `
              radial-gradient(ellipse at bottom right, hsl(0 0% 75% / 0.3) -10%, transparent 70%),
              radial-gradient(ellipse at bottom left, hsl(27 49% 17% / 0.4) -10%, transparent 70%)
            `,
            filter: "blur(40px)",
          }}
          animate={{
            opacity: isHovered ? 0.8 : 0.6,
          }}
        />

        {/* Central gold glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-2/3 z-21"
          style={{
            background: `radial-gradient(circle at bottom center, hsl(27 49% 17% / 0.5) -20%, transparent 60%)`,
            filter: "blur(45px)",
          }}
          animate={{
            opacity: isHovered ? 0.75 : 0.55,
          }}
        />

        {/* Bottom border glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] z-25"
          style={{
            background: "linear-gradient(90deg, transparent 0%, hsl(0 0% 75% / 0.6) 50%, transparent 100%)",
          }}
          animate={{
            boxShadow: isHovered
              ? "0 0 20px 4px hsl(0 0% 75% / 0.7), 0 0 30px 6px hsl(27 49% 17% / 0.5)"
              : "0 0 15px 3px hsl(0 0% 75% / 0.5), 0 0 25px 5px hsl(27 49% 17% / 0.3)",
            opacity: isHovered ? 1 : 0.8,
          }}
        />

        {/* Product Image */}
        <div className="relative z-40">
          <div className="aspect-square overflow-hidden">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="default" className="bg-primary text-white font-medium">
                NEW
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-chrome text-black font-medium">
                FEATURED
              </Badge>
            )}
            {product.originalPrice && (
              <Badge variant="destructive" className="font-medium">
                SALE
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <motion.div 
            className="absolute top-3 right-3 flex flex-col gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <WishlistButton 
              product={product} 
              size="sm" 
              variant="ghost"
              className="bg-card/90 hover:bg-card"
            />
            <CompareButton 
              product={product} 
              size="sm" 
              variant="ghost"
              className="bg-card/90 hover:bg-card"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDetail(true)}
              className="bg-card/90 hover:bg-card"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Stock Status */}
          <div className="absolute bottom-3 left-3">
            {isOutOfStock ? (
              <Badge variant="destructive" className="flex items-center gap-1 font-medium">
                <Package className="h-3 w-3" />
                Out of Stock
              </Badge>
            ) : isLowStock ? (
              <Badge className="flex items-center gap-1 bg-primary text-white border-primary font-medium">
                <Package className="h-3 w-3" />
                Low Stock
              </Badge>
            ) : null}
          </div>
        </div>

        {/* Product Content */}
        <motion.div 
          className="relative p-6 space-y-4 z-40"
          animate={{
            z: 2
          }}
        >
          <div className="space-y-1">
            <h3 className="font-semibold text-xl text-white tracking-tight">{product.name}</h3>
            <p className="text-sm text-chrome-light font-medium">{product.itemCode}</p>
            <p className="text-sm text-white/80 font-medium uppercase tracking-wide">{product.category}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(averageRating)
                      ? 'fill-primary text-primary'
                      : 'text-white/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-white/90 font-medium">
              {averageRating} ({reviewCount})
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-white/90 font-medium">{product.materials}</p>
            <p className="text-xs text-chrome-light font-medium">{product.dimensions}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {product.originalPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-sm text-white/60 line-through font-medium">
                    {formatCurrency(product.originalPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
              )}
              <p className="text-xs text-white/70 font-medium">VAT included</p>
            </div>
          </div>

          {/* Finish Selection */}
          {product.finishOptions && product.finishOptions.length > 1 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Finish Options:</label>
              <Select value={selectedFinish} onValueChange={setSelectedFinish}>
                <SelectTrigger className="bg-black/50 border-white/30 text-white font-medium hover:border-chrome-light transition-colors">
                  <SelectValue placeholder="Select finish" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-white/30">
                  {product.finishOptions.map((finish) => (
                    <SelectItem key={finish} value={finish} className="text-white hover:bg-primary/20">
                      {finish}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-gold-glow transition-all hover:shadow-[0_0_40px_hsl(27_49%_17%/0.6)]"
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
            <p className="text-xs text-chrome-light text-center font-medium">
              Delivery: {product.deliveryTime}
            </p>
          )}
        </motion.div>
      </motion.div>

      <ProductDetailModal
        product={product}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </>
  );
};