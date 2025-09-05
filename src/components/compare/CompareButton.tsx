import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/contexts/CompareContext';
import { Product } from '@/types/ecommerce';
import { cn } from '@/lib/utils';

interface CompareButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
  showText?: boolean;
}

export const CompareButton: React.FC<CompareButtonProps> = ({
  product,
  size = 'md',
  variant = 'ghost',
  className,
  showText = false
}) => {
  const { addToCompare, removeFromCompare, isInCompare, compareCount, maxCompareItems } = useCompare();
  const inCompare = isInCompare(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  const isDisabled = !inCompare && compareCount >= maxCompareItems;

  return (
    <Button
      variant={variant}
      size={buttonSize}
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        'transition-colors duration-200',
        inCompare && 'text-primary bg-primary/10 border-primary/20',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
      title={isDisabled ? `You can only compare up to ${maxCompareItems} products` : undefined}
    >
      <BarChart3 
        className={cn(
          iconSize,
          inCompare && 'text-primary',
          showText && 'mr-2'
        )} 
      />
      {showText && (
        <span>{inCompare ? 'Remove from Compare' : 'Compare'}</span>
      )}
    </Button>
  );
};