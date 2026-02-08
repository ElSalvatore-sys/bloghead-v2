import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  viewAllHref?: string
  viewAllLabel?: string
  onPrev?: () => void
  onNext?: () => void
  className?: string
}

export function SectionHeader({
  title,
  viewAllHref,
  viewAllLabel = 'View All',
  onPrev,
  onNext,
  className,
}: SectionHeaderProps) {
  return (
    <div
      data-testid="section-header"
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
        {title}
      </h2>

      <div className="flex items-center gap-2">
        {(onPrev !== undefined || onNext !== undefined) && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={onPrev}
              disabled={onPrev === undefined}
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onNext}
              disabled={onNext === undefined}
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="text-sm font-medium text-primary hover:underline"
          >
            {viewAllLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
