import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
}

export function RatingStars({
  rating,
  reviewCount,
  size = 'sm',
  className,
}: RatingStarsProps) {
  const rounded = Math.round(rating)
  const sizeClass = SIZE_CLASSES[size]

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      aria-label={`Rating: ${rating} out of 5${reviewCount ? `, ${reviewCount} reviews` : ''}`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            i < rounded
              ? 'fill-amber-400 text-amber-400'
              : 'text-muted-foreground/30'
          )}
        />
      ))}
      {reviewCount !== undefined && (
        <span className="ml-1 text-sm text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  )
}
