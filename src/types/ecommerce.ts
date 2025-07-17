export interface Product {
  id: string;
  name: string;
  itemCode: string;
  category: string;
  dimensions: string;
  materials: string;
  image: string;
  price: number; // in ZAR
  originalPrice?: number; // for sales
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  description?: string;
  specifications?: string[];
  finishOptions?: string[];
  deliveryTime?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  finish?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  vat: number;
  total: number;
  itemCount: number;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  billingAddress: Address;
  shippingAddress: Address;
  sameAsShipping?: boolean;
}

export interface Address {
  street: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  available: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  vat: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryOption: DeliveryOption;
  createdAt: Date;
  estimatedDelivery?: Date;
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'in-production' | 'ready-for-delivery' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface CheckoutStep {
  id: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}