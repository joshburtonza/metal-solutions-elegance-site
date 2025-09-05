import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/types/ecommerce';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';

interface ProductRecommendationsProps {
  products: Product[];
  currentProduct?: Product;
  title?: string;
  maxItems?: number;
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  products,
  currentProduct,
  title = "Recommended for You",
  maxItems = 4
}) => {
  const { cart } = useCart();
  const { wishlistItems } = useWishlist();
  const { isAuthenticated } = useAuth();

  const recommendations = useMemo(() => {
    let filtered = products;

    // If viewing a specific product, exclude it from recommendations
    if (currentProduct) {
      filtered = filtered.filter(p => p.id !== currentProduct.id);
    }

    // Personalization based on user behavior
    if (isAuthenticated) {
      // Get categories from cart items
      const cartCategories = cart.items.map(item => item.product.category);
      const wishlistCategories = wishlistItems.map(item => item.category);
      const userPreferences = [...cartCategories, ...wishlistCategories];

      if (userPreferences.length > 0) {
        // Score products based on user preferences
        const scoredProducts = filtered.map(product => {
          let score = 0;
          
          // Higher score for matching categories
          if (userPreferences.includes(product.category)) {
            score += 3;
          }
          
          // Boost featured products
          if (product.isFeatured) {
            score += 2;
          }
          
          // Boost new products
          if (product.isNew) {
            score += 1;
          }
          
          // Boost products in similar price range
          if (currentProduct) {
            const priceDiff = Math.abs(product.price - currentProduct.price);
            const priceRange = currentProduct.price * 0.3; // 30% price range
            if (priceDiff <= priceRange) {
              score += 2;
            }
          }
          
          return { product, score };
        });

        // Sort by score and return top products
        filtered = scoredProducts
          .sort((a, b) => b.score - a.score)
          .map(item => item.product);
      }
    }

    // If viewing a specific product, prioritize same category
    if (currentProduct) {
      const sameCategory = filtered.filter(p => p.category === currentProduct.category);
      const otherProducts = filtered.filter(p => p.category !== currentProduct.category);
      filtered = [...sameCategory, ...otherProducts];
    }

    // Fallback: show featured and new products
    if (!isAuthenticated || cart.items.length === 0) {
      filtered = filtered.sort((a, b) => {
        const aScore = (a.isFeatured ? 2 : 0) + (a.isNew ? 1 : 0);
        const bScore = (b.isFeatured ? 2 : 0) + (b.isNew ? 1 : 0);
        return bScore - aScore;
      });
    }

    return filtered.slice(0, maxItems);
  }, [products, currentProduct, cart.items, wishlistItems, isAuthenticated, maxItems]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <div key={product.id} className="min-w-0">
              <ProductCard product={product} className="h-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};