import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer } from '@/types/ecommerce';
import { validateEmail, validatePhoneNumber, validateSouthAfricanPostalCode } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface CustomerDetailsFormProps {
  onSubmit: (customer: Customer) => void;
}

const southAfricanProvinces = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape'
];

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({ onSubmit }) => {
  const [customer, setCustomer] = useState<Customer>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    billingAddress: {
      street: '',
      suburb: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'South Africa'
    },
    shippingAddress: {
      street: '',
      suburb: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'South Africa'
    },
    sameAsShipping: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setCustomer(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (addressType: 'billingAddress' | 'shippingAddress', field: string, value: string) => {
    setCustomer(prev => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value
      }
    }));
  };

  const handleSameAsShippingChange = (checked: boolean) => {
    setCustomer(prev => ({
      ...prev,
      sameAsShipping: checked,
      billingAddress: checked ? { ...prev.shippingAddress } : prev.billingAddress
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Personal details validation
    if (!customer.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!customer.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!customer.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(customer.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!customer.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(customer.phone)) {
      newErrors.phone = 'Please enter a valid South African phone number';
    }

    // Shipping address validation
    if (!customer.shippingAddress.street.trim()) newErrors.shippingStreet = 'Street address is required';
    if (!customer.shippingAddress.suburb.trim()) newErrors.shippingSuburb = 'Suburb is required';
    if (!customer.shippingAddress.city.trim()) newErrors.shippingCity = 'City is required';
    if (!customer.shippingAddress.province) newErrors.shippingProvince = 'Province is required';
    if (!customer.shippingAddress.postalCode.trim()) {
      newErrors.shippingPostalCode = 'Postal code is required';
    } else if (!validateSouthAfricanPostalCode(customer.shippingAddress.postalCode)) {
      newErrors.shippingPostalCode = 'Please enter a valid 4-digit postal code';
    }

    // Billing address validation (if different from shipping)
    if (!customer.sameAsShipping) {
      if (!customer.billingAddress.street.trim()) newErrors.billingStreet = 'Street address is required';
      if (!customer.billingAddress.suburb.trim()) newErrors.billingSuburb = 'Suburb is required';
      if (!customer.billingAddress.city.trim()) newErrors.billingCity = 'City is required';
      if (!customer.billingAddress.province) newErrors.billingProvince = 'Province is required';
      if (!customer.billingAddress.postalCode.trim()) {
        newErrors.billingPostalCode = 'Postal code is required';
      } else if (!validateSouthAfricanPostalCode(customer.billingAddress.postalCode)) {
        newErrors.billingPostalCode = 'Please enter a valid 4-digit postal code';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // If same as shipping, copy shipping to billing
      const finalCustomer = customer.sameAsShipping 
        ? { ...customer, billingAddress: { ...customer.shippingAddress } }
        : customer;
      
      onSubmit(finalCustomer);
    } else {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={customer.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={errors.firstName ? 'border-destructive' : ''}
            />
            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={customer.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={errors.lastName ? 'border-destructive' : ''}
            />
            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={customer.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={customer.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="e.g., 011 123 4567 or +27 11 123 4567"
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Shipping Address</h3>
        
        <div className="space-y-2">
          <Label htmlFor="shippingStreet">Street Address *</Label>
          <Input
            id="shippingStreet"
            value={customer.shippingAddress.street}
            onChange={(e) => handleAddressChange('shippingAddress', 'street', e.target.value)}
            className={errors.shippingStreet ? 'border-destructive' : ''}
          />
          {errors.shippingStreet && <p className="text-sm text-destructive">{errors.shippingStreet}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shippingSuburb">Suburb *</Label>
            <Input
              id="shippingSuburb"
              value={customer.shippingAddress.suburb}
              onChange={(e) => handleAddressChange('shippingAddress', 'suburb', e.target.value)}
              className={errors.shippingSuburb ? 'border-destructive' : ''}
            />
            {errors.shippingSuburb && <p className="text-sm text-destructive">{errors.shippingSuburb}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shippingCity">City *</Label>
            <Input
              id="shippingCity"
              value={customer.shippingAddress.city}
              onChange={(e) => handleAddressChange('shippingAddress', 'city', e.target.value)}
              className={errors.shippingCity ? 'border-destructive' : ''}
            />
            {errors.shippingCity && <p className="text-sm text-destructive">{errors.shippingCity}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shippingProvince">Province *</Label>
            <Select
              value={customer.shippingAddress.province}
              onValueChange={(value) => handleAddressChange('shippingAddress', 'province', value)}
            >
              <SelectTrigger className={errors.shippingProvince ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {southAfricanProvinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.shippingProvince && <p className="text-sm text-destructive">{errors.shippingProvince}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shippingPostalCode">Postal Code *</Label>
            <Input
              id="shippingPostalCode"
              value={customer.shippingAddress.postalCode}
              onChange={(e) => handleAddressChange('shippingAddress', 'postalCode', e.target.value)}
              placeholder="e.g., 2000"
              maxLength={4}
              className={errors.shippingPostalCode ? 'border-destructive' : ''}
            />
            {errors.shippingPostalCode && <p className="text-sm text-destructive">{errors.shippingPostalCode}</p>}
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sameAsShipping"
            checked={customer.sameAsShipping}
            onCheckedChange={handleSameAsShippingChange}
          />
          <Label htmlFor="sameAsShipping">Billing address is the same as shipping address</Label>
        </div>

        {!customer.sameAsShipping && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Billing Address</h3>
            
            <div className="space-y-2">
              <Label htmlFor="billingStreet">Street Address *</Label>
              <Input
                id="billingStreet"
                value={customer.billingAddress.street}
                onChange={(e) => handleAddressChange('billingAddress', 'street', e.target.value)}
                className={errors.billingStreet ? 'border-destructive' : ''}
              />
              {errors.billingStreet && <p className="text-sm text-destructive">{errors.billingStreet}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingSuburb">Suburb *</Label>
                <Input
                  id="billingSuburb"
                  value={customer.billingAddress.suburb}
                  onChange={(e) => handleAddressChange('billingAddress', 'suburb', e.target.value)}
                  className={errors.billingSuburb ? 'border-destructive' : ''}
                />
                {errors.billingSuburb && <p className="text-sm text-destructive">{errors.billingSuburb}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billingCity">City *</Label>
                <Input
                  id="billingCity"
                  value={customer.billingAddress.city}
                  onChange={(e) => handleAddressChange('billingAddress', 'city', e.target.value)}
                  className={errors.billingCity ? 'border-destructive' : ''}
                />
                {errors.billingCity && <p className="text-sm text-destructive">{errors.billingCity}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingProvince">Province *</Label>
                <Select
                  value={customer.billingAddress.province}
                  onValueChange={(value) => handleAddressChange('billingAddress', 'province', value)}
                >
                  <SelectTrigger className={errors.billingProvince ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {southAfricanProvinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.billingProvince && <p className="text-sm text-destructive">{errors.billingProvince}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billingPostalCode">Postal Code *</Label>
                <Input
                  id="billingPostalCode"
                  value={customer.billingAddress.postalCode}
                  onChange={(e) => handleAddressChange('billingAddress', 'postalCode', e.target.value)}
                  placeholder="e.g., 2000"
                  maxLength={4}
                  className={errors.billingPostalCode ? 'border-destructive' : ''}
                />
                {errors.billingPostalCode && <p className="text-sm text-destructive">{errors.billingPostalCode}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg">
        Continue to Delivery Options
      </Button>
    </form>
  );
};