import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CategoryCardProps {
  icon: LucideIcon
  title: string
  count?: number
  href: string
  className?: string
}

export function CategoryCard({
  icon: Icon,
  title,
  count,
  href,
  className,
}: CategoryCardProps) {
  return (
    <Link to={href} data-testid="category-card">
      <Card
        className={cn(
          'flex flex-col items-center gap-3 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
          className,
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <span className="text-sm font-medium">{title}</span>
        {count !== undefined && (
          <span className="text-xs text-muted-foreground">
            {count.toLocaleString()}
          </span>
        )}
      </Card>
    </Link>
  )
}
