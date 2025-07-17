import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { Cart, DeliveryOption } from '@/types/ecommerce';

interface CartSummaryProps {
  cart: Cart;
  deliveryOption?: DeliveryOption | null;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ cart, deliveryOption }) => {
  const deliveryFee = deliveryOption?.price || 0;
  const finalTotal = cart.total + deliveryFee;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {cart.items.map((item, index) => (
            <div key={`${item.product.id}-${index}`} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-sm">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.product.itemCode}
                  {item.finish && ` • ${item.finish}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
              <span className="text-sm font-medium ml-4">
                {formatCurrency(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(cart.subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">VAT (15%)</span>
            <span>{formatCurrency(cart.vat)}</span>
          </div>
          
          {deliveryOption && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Delivery ({deliveryOption.name})
              </span>
              <span>
                {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
              </span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between text-lg font-medium">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(finalTotal)}</span>
          </div>
        </div>

        {/* Delivery Info */}
        {deliveryOption && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">{deliveryOption.name}</p>
            <p className="text-xs text-muted-foreground">{deliveryOption.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated delivery: {deliveryOption.estimatedDays}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};