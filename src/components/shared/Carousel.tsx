import { useRef, useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CarouselProps {
  children: React.ReactNode
  slidesPerView?: number
  gap?: number
  showArrows?: boolean
  showDots?: boolean
  className?: string
}

export function Carousel({
  children,
  slidesPerView = 3,
  gap = 16,
  showArrows = true,
  showDots = false,
  className,
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [dotCount, setDotCount] = useState(1)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 1)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)

    const maxScroll = scrollWidth - clientWidth
    if (maxScroll > 0) {
      const childCount = el.children.length
      const totalDots = Math.max(1, childCount - slidesPerView + 1)
      setDotCount(totalDots)
      const progress = scrollLeft / maxScroll
      setActiveIndex(Math.round(progress * (totalDots - 1)))
    } else {
      setDotCount(1)
      setActiveIndex(0)
    }
  }, [slidesPerView])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    updateScrollState()

    el.addEventListener('scroll', updateScrollState, { passive: true })

    const observer = new ResizeObserver(updateScrollState)
    observer.observe(el)

    return () => {
      el.removeEventListener('scroll', updateScrollState)
      observer.disconnect()
    }
  }, [updateScrollState])

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.8
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }, [])

  const scrollToDot = useCallback(
    (index: number) => {
      const el = scrollRef.current
      if (!el) return
      const maxScroll = el.scrollWidth - el.clientWidth
      const targetScroll = dotCount > 1 ? (index / (dotCount - 1)) * maxScroll : 0
      el.scrollTo({ left: targetScroll, behavior: 'smooth' })
    },
    [dotCount],
  )

  return (
    <div
      data-testid="carousel"
      className={cn('group relative', className)}
    >
      <div
        ref={scrollRef}
        className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style={{ gap: `${gap}px` }}
      >
        {children}
      </div>

      {showArrows && canScrollLeft && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-background/80 opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {showArrows && canScrollRight && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-background/80 opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {showDots && dotCount > 1 && (
        <div className="mt-4 flex justify-center gap-1.5" role="tablist">
          {Array.from({ length: dotCount }, (_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all',
                i === activeIndex
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50',
              )}
              onClick={() => scrollToDot(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
