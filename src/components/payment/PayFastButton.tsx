import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Cart, Customer, DeliveryOption } from '@/types/ecommerce';
import { generateOrderNumber } from '@/lib/utils';

interface PayFastButtonProps {
  cart: Cart;
  customer: Customer;
  deliveryOption: DeliveryOption;
  onPaymentStart?: () => void;
  onPaymentComplete?: (success: boolean, orderNumber?: string) => void;
}

export const PayFastButton: React.FC<PayFastButtonProps> = ({
  cart,
  customer,
  deliveryOption,
  onPaymentStart,
  onPaymentComplete
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    onPaymentStart?.();

    try {
      const orderNumber = generateOrderNumber();
      const totalAmount = cart.total + deliveryOption.price;

      // Simulate PayFast integration
      // In a real implementation, this would:
      // 1. Send order data to your backend
      // 2. Backend creates PayFast payment session
      // 3. Redirect user to PayFast payment page
      // 4. Handle callback from PayFast
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      // Simulate successful payment (80% success rate for demo)
      const paymentSuccess = Math.random() > 0.2;

      if (paymentSuccess) {
        toast({
          title: "Payment Successful!",
          description: `Order ${orderNumber} has been placed successfully.`,
        });
        onPaymentComplete?.(true, orderNumber);
      } else {
        toast({
          title: "Payment Failed",
          description: "Your payment could not be processed. Please try again.",
          variant: "destructive",
        });
        onPaymentComplete?.(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "An error occurred while processing your payment.",
        variant: "destructive",
      });
      onPaymentComplete?.(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={isProcessing}
      className="w-full"
      size="lg"
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay with PayFast - R{(cart.total + deliveryOption.price).toFixed(2)}
        </>
      )}
    </Button>
  );
};