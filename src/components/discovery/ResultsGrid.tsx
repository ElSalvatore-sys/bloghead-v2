import { SearchX } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { CardSkeleton } from './CardSkeleton'
import { useFilterStore } from '@/stores'
import { cn } from '@/lib/utils'

interface ResultsGridProps {
  children: React.ReactNode
  isLoading: boolean
  isEmpty: boolean
  totalCount: number | null
  emptyTitle?: string
  emptyDescription?: string
  onClearFilters?: () => void
}

export function ResultsGrid({
  children,
  isLoading,
  isEmpty,
  totalCount,
  emptyTitle = 'No results found',
  emptyDescription = 'Try adjusting your filters or search query.',
  onClearFilters,
}: ResultsGridProps) {
  const viewMode = useFilterStore((s) => s.viewMode)

  if (isLoading) {
    return (
      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'flex flex-col gap-4'
        )}
        data-testid="results-loading"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <EmptyState
        icon={SearchX}
        title={emptyTitle}
        description={emptyDescription}
        action={
          onClearFilters
            ? { label: 'Clear filters', onClick: onClearFilters }
            : undefined
        }
      />
    )
  }

  return (
    <div data-testid="results-grid">
      {totalCount !== null && (
        <p className="text-sm text-muted-foreground mb-4" data-testid="results-count">
          {totalCount} {totalCount === 1 ? 'result' : 'results'} found
        </p>
      )}
      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'flex flex-col gap-4'
        )}
      >
        {children}
      </div>
    </div>
  )
}
