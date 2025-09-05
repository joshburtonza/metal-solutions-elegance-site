import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { CartSummary } from '@/components/checkout/CartSummary';
import { CustomerDetailsForm } from '@/components/checkout/CustomerDetailsForm';
import { DeliveryOptionsForm } from '@/components/checkout/DeliveryOptionsForm';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import { Customer, DeliveryOption, Order } from '@/types/ecommerce';
import { generateOrderNumber } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [currentStep, setCurrentStep] = useState(1);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const handleCustomerSubmit = (customerData: Customer) => {
    setCustomer(customerData);
    setCurrentStep(2);
  };

  const handleDeliverySubmit = (delivery: DeliveryOption) => {
    setSelectedDelivery(delivery);
    setCurrentStep(3);
  };

  const handleOrderSubmit = () => {
    if (!customer || !selectedDelivery) return;

    const newOrder: Order = {
      id: crypto.randomUUID(),
      orderNumber: generateOrderNumber(),
      customer,
      items: cart.items,
      subtotal: cart.subtotal,
      vat: cart.vat,
      deliveryFee: selectedDelivery.price,
      total: cart.total + selectedDelivery.price,
      status: 'pending',
      paymentStatus: 'pending',
      deliveryOption: selectedDelivery,
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
    };

    // Add to orders context
    addOrder(newOrder);
    setOrder(newOrder);
    clearCart();
    setCurrentStep(4);
  };

  if (cart.items.length === 0 && !order) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart before checking out.
            </p>
            <Button onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {currentStep > 1 ? 'Back' : 'Continue Shopping'}
              </Button>
              <h1 className="text-3xl font-bold">Checkout</h1>
            </div>
          </div>

          {/* Steps */}
          <CheckoutSteps currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {currentStep === 1 && 'Customer Details'}
                    {currentStep === 2 && 'Delivery Options'}
                    {currentStep === 3 && 'Review & Payment'}
                    {currentStep === 4 && 'Order Confirmation'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentStep === 1 && (
                    <CustomerDetailsForm onSubmit={handleCustomerSubmit} />
                  )}
                  
                  {currentStep === 2 && (
                    <DeliveryOptionsForm 
                      onSubmit={handleDeliverySubmit}
                      customer={customer!}
                    />
                  )}
                  
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">Customer Details</h3>
                        <p className="text-sm text-muted-foreground">
                          {customer?.firstName} {customer?.lastName}<br />
                          {customer?.email}<br />
                          {customer?.phone}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">Delivery</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedDelivery?.name}<br />
                          {selectedDelivery?.description}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <h3 className="font-medium mb-2 text-primary">Payment</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Secure payment processing with PayFast
                        </p>
                        <Button onClick={handleOrderSubmit} className="w-full" size="lg">
                          Place Order (Demo - No Real Payment)
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {currentStep === 4 && order && (
                    <OrderConfirmation order={order} />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              {currentStep < 4 && (
                <CartSummary 
                  cart={cart} 
                  deliveryOption={selectedDelivery}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}