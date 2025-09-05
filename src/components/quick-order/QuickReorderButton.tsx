import { useState } from 'react';
import { RotateCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types/ecommerce';

export const QuickReorderButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { addToCart } = useCart();
  const { getUserOrders } = useOrders();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const orders = getUserOrders()
    .filter(order => order.status === 'delivered')
    .slice(0, 5); // Show last 5 delivered orders

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart(item.product, item.quantity, item.finish);
    });

    toast({
      title: "Items Added to Cart",
      description: `${order.items.length} items from order #${order.orderNumber} have been added to your cart.`,
    });

    setIsOpen(false);
  };

  if (!isAuthenticated || orders.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Quick Reorder
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quick Reorder</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {orders.map((order) => (
            <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">Order #{order.orderNumber}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)} • {order.items.length} items
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatCurrency(order.total)}</span>
                    <Badge variant="default" className="bg-green-500">
                      Delivered
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>

                <Button 
                  onClick={() => handleReorder(order)}
                  className="w-full"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add All Items to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};