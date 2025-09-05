import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '@/types/ecommerce';
import { useToast } from '@/hooks/use-toast';

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  compareCount: number;
  maxCompareItems: number;
}

type CompareAction = 
  | { type: 'ADD_TO_COMPARE'; payload: Product }
  | { type: 'REMOVE_FROM_COMPARE'; payload: string }
  | { type: 'CLEAR_COMPARE' }
  | { type: 'LOAD_COMPARE'; payload: Product[] };

const MAX_COMPARE_ITEMS = 4;

const compareReducer = (state: Product[], action: CompareAction): Product[] => {
  switch (action.type) {
    case 'ADD_TO_COMPARE':
      if (state.find(item => item.id === action.payload.id)) {
        return state; // Don't add if already exists
      }
      if (state.length >= MAX_COMPARE_ITEMS) {
        return state; // Don't add if max reached
      }
      return [...state, action.payload];
    
    case 'REMOVE_FROM_COMPARE':
      return state.filter(item => item.id !== action.payload);
    
    case 'CLEAR_COMPARE':
      return [];
    
    case 'LOAD_COMPARE':
      return action.payload;
    
    default:
      return state;
  }
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, dispatch] = useReducer(compareReducer, []);
  const { toast } = useToast();

  // Load compare items from localStorage on mount
  useEffect(() => {
    const savedCompare = localStorage.getItem('rt-furniture-compare');
    if (savedCompare) {
      try {
        const parsedCompare = JSON.parse(savedCompare);
        dispatch({ type: 'LOAD_COMPARE', payload: parsedCompare });
      } catch (error) {
        console.error('Error loading compare from localStorage:', error);
      }
    }
  }, []);

  // Save compare items to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rt-furniture-compare', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product: Product) => {
    if (compareItems.length >= MAX_COMPARE_ITEMS) {
      toast({
        title: "Compare Limit Reached",
        description: `You can only compare up to ${MAX_COMPARE_ITEMS} products at once.`,
        variant: "destructive"
      });
      return;
    }

    if (!isInCompare(product.id)) {
      dispatch({ type: 'ADD_TO_COMPARE', payload: product });
      toast({
        title: "Added to Compare",
        description: `${product.name} has been added to your comparison list.`,
      });
    }
  };

  const removeFromCompare = (productId: string) => {
    const product = compareItems.find(item => item.id === productId);
    dispatch({ type: 'REMOVE_FROM_COMPARE', payload: productId });
    if (product) {
      toast({
        title: "Removed from Compare",
        description: `${product.name} has been removed from your comparison list.`,
      });
    }
  };

  const isInCompare = (productId: string): boolean => {
    return compareItems.some(item => item.id === productId);
  };

  const clearCompare = () => {
    dispatch({ type: 'CLEAR_COMPARE' });
    toast({
      title: "Compare Cleared",
      description: "All items have been removed from your comparison list.",
    });
  };

  const value: CompareContextType = {
    compareItems,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    compareCount: compareItems.length,
    maxCompareItems: MAX_COMPARE_ITEMS,
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = (): CompareContextType => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};