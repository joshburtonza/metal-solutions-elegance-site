import { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  helpful: number;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt' | 'helpful'>) => void;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  reviews,
  onAddReview
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;

    setIsSubmitting(true);
    try {
      await onAddReview({
        rating,
        title,
        comment,
        userAvatar: undefined,
        verified: true // For demo purposes
      });
      
      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onStarClick?.(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="flex items-center gap-4 pb-6 border-b">
        <div className="text-center">
          <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
          {renderStars(Math.round(averageRating))}
          <div className="text-sm text-muted-foreground mt-1">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </div>
        </div>
        
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(r => r.rating === stars).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            
            return (
              <div key={stars} className="flex items-center gap-2 text-sm">
                <span className="w-12">{stars} star</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-muted-foreground">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Review Form */}
      {isAuthenticated ? (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Write a Review</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Rating</Label>
                {renderStars(rating, true, setRating)}
              </div>
              
              <div>
                <Label htmlFor="review-title" className="text-sm font-medium">
                  Review Title
                </Label>
                <input
                  id="review-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="review-comment" className="text-sm font-medium">
                  Your Review
                </Label>
                <Textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell others about your experience with this product"
                  rows={4}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={rating === 0 || !title || !comment || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Please sign in to write a review</p>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.userAvatar} />
                  <AvatarFallback>
                    {review.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{review.userName}</span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  
                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-muted-foreground mb-3">{review.comment}</p>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};