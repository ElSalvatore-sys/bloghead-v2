import { Skeleton } from '@/components/ui/skeleton'

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card" data-testid="card-skeleton">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-3.5 rounded-sm" />
          ))}
          <Skeleton className="ml-1 h-3.5 w-8" />
        </div>
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
