import { CheckCircle, Circle, Clock, Truck, Package, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Order, OrderStatus } from '@/types/ecommerce';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface OrderTrackerProps {
  order: Order;
}

const orderSteps = [
  { 
    status: 'pending' as OrderStatus, 
    label: 'Order Placed', 
    icon: Circle,
    description: 'Your order has been received and is being processed'
  },
  { 
    status: 'confirmed' as OrderStatus, 
    label: 'Confirmed', 
    icon: CheckCircle,
    description: 'Order confirmed and payment verified'
  },
  { 
    status: 'in-production' as OrderStatus, 
    label: 'In Production', 
    icon: Clock,
    description: 'Your furniture is being crafted'
  },
  { 
    status: 'ready-for-delivery' as OrderStatus, 
    label: 'Ready for Delivery', 
    icon: Package,
    description: 'Order is ready and will be shipped soon'
  },
  { 
    status: 'shipped' as OrderStatus, 
    label: 'Shipped', 
    icon: Truck,
    description: 'Your order is on its way'
  },
  { 
    status: 'delivered' as OrderStatus, 
    label: 'Delivered', 
    icon: Home,
    description: 'Order has been delivered successfully'
  }
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500';
    case 'confirmed':
      return 'bg-blue-500';
    case 'in-production':
      return 'bg-orange-500';
    case 'ready-for-delivery':
      return 'bg-purple-500';
    case 'shipped':
      return 'bg-indigo-500';
    case 'delivered':
      return 'bg-green-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'failed':
      return 'bg-red-500';
    case 'refunded':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

export const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  const currentStepIndex = orderSteps.findIndex(step => step.status === order.status);
  
  if (order.status === 'cancelled') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Order Tracking
            <Badge variant="destructive">Cancelled</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This order has been cancelled.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order Tracking</span>
          <div className="flex gap-2">
            <Badge className={cn('text-white', getStatusColor(order.status))}>
              {order.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            <Badge className={cn('text-white', getPaymentStatusColor(order.paymentStatus))}>
              Payment {order.paymentStatus}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Order Number:</span>
            <p className="font-medium">{order.orderNumber}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Order Date:</span>
            <p className="font-medium">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Delivery Method:</span>
            <p className="font-medium">{order.deliveryOption.name}</p>
          </div>
          {order.estimatedDelivery && (
            <div>
              <span className="text-muted-foreground">Estimated Delivery:</span>
              <p className="font-medium">{formatDate(order.estimatedDelivery)}</p>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {orderSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.status} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'rounded-full p-2 transition-colors',
                    isCompleted 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {index < orderSteps.length - 1 && (
                    <div className={cn(
                      'w-px h-8 mt-2',
                      isCompleted ? 'bg-primary' : 'bg-border'
                    )} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    'font-medium',
                    isCurrent && 'text-primary'
                  )}>
                    {step.label}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                </div>

                {isCompleted && (
                  <div className="text-xs text-muted-foreground">
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Notes */}
        {order.notes && (
          <div className="pt-4 border-t">
            <span className="text-sm text-muted-foreground">Notes:</span>
            <p className="text-sm mt-1">{order.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};