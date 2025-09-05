import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/types/ecommerce';
import { useToast } from '@/hooks/use-toast';

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

type WishlistAction = 
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: Product[] };

const wishlistReducer = (state: Product[], action: WishlistAction): Product[] => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      if (state.find(item => item.id === action.payload.id)) {
        return state; // Don't add if already exists
      }
      return [...state, action.payload];
    
    case 'REMOVE_FROM_WISHLIST':
      return state.filter(item => item.id !== action.payload);
    
    case 'CLEAR_WISHLIST':
      return [];
    
    case 'LOAD_WISHLIST':
      return action.payload;
    
    default:
      return state;
  }
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, dispatch] = useReducer(wishlistReducer, []);
  const { toast } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('rt-furniture-wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: parsedWishlist });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rt-furniture-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const removeFromWishlist = (productId: string) => {
    const product = wishlistItems.find(item => item.id === productId);
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    if (product) {
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};