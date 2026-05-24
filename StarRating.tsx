import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
}

export default function StarRating({ rating, size = 16, showValue = false }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-neutral-200 text-neutral-200 dark:fill-neutral-700 dark:text-neutral-700'
          }
        />
      ))}
      {showValue && (
        <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-1">{rating}</span>
      )}
    </div>
  );
}
