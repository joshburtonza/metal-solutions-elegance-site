import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface CartIconProps {
  onClick: () => void;
  className?: string;
}

export const CartIcon: React.FC<CartIconProps> = ({ onClick, className }) => {
  const { cart } = useCart();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "relative p-2 hover:bg-white/10 transition-all duration-300",
        className
      )}
    >
      <ShoppingBag className="h-6 w-6" />
      {cart.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-in zoom-in">
          {cart.itemCount > 99 ? '99+' : cart.itemCount}
        </span>
      )}
    </Button>
  );
};