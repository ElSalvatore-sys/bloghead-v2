import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
  fallback?: React.ReactNode
  onError?: () => void
}

/**
 * Optimized image component with lazy loading and error handling
 *
 * Features:
 * - Lazy loading by default (loading="lazy")
 * - Async decoding for better performance
 * - Priority loading option for above-the-fold images
 * - Error fallback UI
 *
 * @param src - Image source URL
 * @param alt - Alt text (required for accessibility)
 * @param priority - If true, loads eagerly with high priority (default: false)
 * @param className - Additional CSS classes
 * @param fallback - Custom fallback UI on error
 * @param onError - Callback when image fails to load
 */
export function OptimizedImage({
  src,
  alt,
  priority = false,
  className,
  fallback,
  onError,
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      fallback || (
        <div
          className={cn(
            'flex items-center justify-center bg-secondary text-muted-foreground',
            className
          )}
          aria-label={`Failed to load image: ${alt}`}
        >
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      onError={handleError}
    />
  )
}
