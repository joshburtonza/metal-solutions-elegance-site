import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { deliveryOptions } from '@/data/enhancedProducts';
import { Customer, DeliveryOption } from '@/types/ecommerce';
import { formatCurrency } from '@/lib/utils';
import { Truck, Clock, MapPin, Building2 } from 'lucide-react';

interface DeliveryOptionsFormProps {
  customer: Customer;
  onSubmit: (deliveryOption: DeliveryOption) => void;
}

export const DeliveryOptionsForm: React.FC<DeliveryOptionsFormProps> = ({ 
  customer, 
  onSubmit 
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  // Filter delivery options based on customer location
  const availableOptions = deliveryOptions.filter(option => {
    if (option.id === 'gauteng-local') {
      return customer.shippingAddress.province === 'Gauteng';
    }
    return option.available;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selected = availableOptions.find(option => option.id === selectedOption);
    if (selected) {
      onSubmit(selected);
    }
  };

  const getDeliveryIcon = (optionId: string) => {
    switch (optionId) {
      case 'gauteng-local':
        return <Truck className="h-5 w-5 text-primary" />;
      case 'national-standard':
        return <MapPin className="h-5 w-5 text-primary" />;
      case 'national-express':
        return <Clock className="h-5 w-5 text-primary" />;
      case 'collection':
        return <Building2 className="h-5 w-5 text-primary" />;
      default:
        return <Truck className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Delivery Address</h3>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              {customer.shippingAddress.street}<br />
              {customer.shippingAddress.suburb}<br />
              {customer.shippingAddress.city}, {customer.shippingAddress.province}<br />
              {customer.shippingAddress.postalCode}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Select Delivery Option</h3>
          
          <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
            {availableOptions.map((option) => (
              <Card key={option.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <Label 
                    htmlFor={option.id}
                    className="flex items-center space-x-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    
                    <div className="flex-1 flex items-center space-x-4">
                      {getDeliveryIcon(option.id)}
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{option.name}</h4>
                          <span className="font-medium">
                            {option.price === 0 ? 'Free' : formatCurrency(option.price)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {option.description}
                        </p>
                        <p className="text-sm text-primary font-medium">
                          {option.estimatedDays}
                        </p>
                      </div>
                    </div>
                  </Label>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>

        {/* Special notes for certain delivery options */}
        {selectedOption === 'collection' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Collection Information</h4>
            <p className="text-sm text-blue-800 mb-2">
              <strong>Address:</strong> RT Furniture Showroom<br />
              123 Industrial Street, Randburg, Gauteng, 2194
            </p>
            <p className="text-sm text-blue-800 mb-2">
              <strong>Collection Hours:</strong><br />
              Monday - Friday: 8:00 AM - 5:00 PM<br />
              Saturday: 9:00 AM - 1:00 PM<br />
              Sunday: Closed
            </p>
            <p className="text-sm text-blue-800">
              Please bring a copy of your order confirmation and valid ID when collecting.
            </p>
          </div>
        )}

        {selectedOption === 'gauteng-local' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Local Delivery Information</h4>
            <p className="text-sm text-green-800">
              Our delivery team will contact you within 24 hours to schedule a convenient 
              delivery time. Delivery is available Monday to Saturday between 8:00 AM and 5:00 PM.
            </p>
          </div>
        )}

        {(selectedOption === 'national-standard' || selectedOption === 'national-express') && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-2">National Delivery Information</h4>
            <p className="text-sm text-amber-800">
              Items will be carefully packaged and shipped via our trusted courier partners. 
              You will receive tracking information once your order is dispatched.
            </p>
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={!selectedOption}
      >
        Continue to Payment
      </Button>
    </form>
  );
};