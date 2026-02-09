import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIsFavorite, useToggleFavorite } from '@/hooks/queries'
import type { FavoriteType } from '@/services'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  vendorId: string
  vendorType: FavoriteType
  className?: string
}

export function FavoriteButton({ vendorId, vendorType, className }: FavoriteButtonProps) {
  const { data: isFavorite } = useIsFavorite(vendorId, vendorType)
  const { mutate: toggleFavorite, isPending } = useToggleFavorite()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 200)
    toggleFavorite({ vendorId, vendorType })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-8 w-8 rounded-full', className)}
      onClick={handleClick}
      disabled={isPending}
      data-testid="favorite-button"
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all duration-200',
          isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground',
          isAnimating && 'scale-125'
        )}
      />
      <span className="sr-only">
        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </span>
    </Button>
  )
}
