import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Cart, Product } from '@/types/ecommerce';
import { toast } from '@/hooks/use-toast';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number, finish?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getVATAmount: () => number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number; finish?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const VAT_RATE = 0.15; // 15% South African VAT

const calculateCartTotals = (items: CartItem[]): Cart => {
  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return {
    items,
    subtotal,
    vat,
    total,
    itemCount
  };
};

const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity, finish } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && item.finish === finish
      );

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity, finish }];
      }

      return calculateCartTotals(newItems);
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.product.id !== action.payload);
      return calculateCartTotals(newItems);
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        const newItems = state.items.filter(item => item.product.id !== productId);
        return calculateCartTotals(newItems);
      }

      const newItems = state.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      return calculateCartTotals(newItems);
    }

    case 'CLEAR_CART':
      return calculateCartTotals([]);

    case 'LOAD_CART':
      return calculateCartTotals(action.payload);

    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, calculateCartTotals([]));

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('rt-metal-cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rt-metal-cart', JSON.stringify(cart.items));
  }, [cart.items]);

  const addToCart = (product: Product, quantity = 1, finish?: string) => {
    if (product.stock < quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} items available`,
        variant: "destructive"
      });
      return;
    }

    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, finish } });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`
    });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart"
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart"
    });
  };

  const getCartTotal = () => cart.total;
  const getVATAmount = () => cart.vat;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getVATAmount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};