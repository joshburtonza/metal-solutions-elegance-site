import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { CartItem as CartItemType } from '@/types/ecommerce';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.product.id);
    } else {
      updateQuantity(item.product.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 p-4 glass-card rounded-lg">
      <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 space-y-2">
        <div>
          <h4 className="font-medium text-sm">{item.product.name}</h4>
          <p className="text-xs text-muted-foreground">{item.product.itemCode}</p>
          {item.finish && (
            <p className="text-xs text-muted-foreground">Finish: {item.finish}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="text-sm font-medium w-8 text-center">
              {item.quantity}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="h-8 w-8 p-0"
              disabled={item.quantity >= item.product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFromCart(item.product.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {formatCurrency(item.product.price * item.quantity)}
          </span>
          {item.quantity > 1 && (
            <span className="text-xs text-muted-foreground">
              {formatCurrency(item.product.price)} each
            </span>
          )}
        </div>
      </div>
    </div>
  );
};