import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order } from '@/types/ecommerce';
import { CheckCircle, Download, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderConfirmationProps {
  order: Order;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order }) => {
  const navigate = useNavigate();

  const handleDownloadInvoice = () => {
    // This would generate and download a PDF invoice
    console.log('Download invoice for order:', order.orderNumber);
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">Order Confirmed!</h2>
          <p className="text-muted-foreground">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>
      </div>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order Details</span>
            <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Order Information</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Order Number:</strong> {order.orderNumber}</p>
                <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
                <p><strong>Payment Status:</strong> 
                  <span className="ml-1 text-amber-600 font-medium">
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </p>
                <p><strong>Order Status:</strong> 
                  <span className="ml-1 text-blue-600 font-medium">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Customer Details</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {order.customer.firstName} {order.customer.lastName}</p>
                <p className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {order.customer.email}
                </p>
                <p className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {order.customer.phone}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Information */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Delivery Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-primary mb-1">{order.deliveryOption.name}</p>
                <p className="text-muted-foreground mb-2">{order.deliveryOption.description}</p>
                <p className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Expected: {order.deliveryOption.estimatedDays}
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Delivery Address</p>
                <div className="text-muted-foreground">
                  <p>{order.customer.shippingAddress.street}</p>
                  <p>{order.customer.shippingAddress.suburb}</p>
                  <p>{order.customer.shippingAddress.city}, {order.customer.shippingAddress.province}</p>
                  <p>{order.customer.shippingAddress.postalCode}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h4 className="font-medium mb-3">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start p-3 bg-muted rounded-lg">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-background rounded overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-medium">{item.product.name}</h5>
                      <p className="text-sm text-muted-foreground">{item.product.itemCode}</p>
                      {item.finish && (
                        <p className="text-sm text-muted-foreground">Finish: {item.finish}</p>
                      )}
                      <p className="text-sm">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.product.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>VAT (15%)</span>
              <span>{formatCurrency(order.vat)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery ({order.deliveryOption.name})</span>
              <span>
                {order.deliveryFee === 0 ? 'Free' : formatCurrency(order.deliveryFee)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-medium">
              <span>Total Paid</span>
              <span className="text-primary">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Order Confirmation</p>
                <p className="text-muted-foreground">
                  You'll receive an email confirmation with your order details within 15 minutes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Payment Processing</p>
                <p className="text-muted-foreground">
                  We'll contact you within 24 hours to arrange payment via PayFast or bank transfer.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Production & Delivery</p>
                <p className="text-muted-foreground">
                  Once payment is confirmed, we'll begin production and arrange delivery as selected.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => window.print()}>
          Print Order
        </Button>
        <Button onClick={handleContinueShopping}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};