import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from '@/types/ecommerce';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
  showText?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  size = 'md',
  variant = 'ghost',
  className,
  showText = false
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';

  return (
    <Button
      variant={variant}
      size={buttonSize}
      onClick={handleClick}
      className={cn(
        'transition-colors duration-200',
        inWishlist && 'text-red-500 hover:text-red-600',
        className
      )}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={cn(
          iconSize,
          inWishlist ? 'fill-current' : '',
          showText && 'mr-2'
        )} 
      />
      {showText && (
        <span>{inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
      )}
    </Button>
  );
};