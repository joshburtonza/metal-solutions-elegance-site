import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus, PaymentStatus } from '@/types/ecommerce';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: () => Order[];
  isLoading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('rt-furniture-orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        // Convert date strings back to Date objects
        const ordersWithDates = parsedOrders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
        }));
        setOrders(ordersWithDates);
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('rt-furniture-orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status }
          : order
      )
    );
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, paymentStatus: status }
          : order
      )
    );
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const getUserOrders = (): Order[] => {
    if (!user) return [];
    return orders.filter(order => order.customer.email === user.email);
  };

  const value: OrderContextType = {
    orders,
    addOrder,
    updateOrderStatus,
    updatePaymentStatus,
    getOrderById,
    getUserOrders,
    isLoading,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};