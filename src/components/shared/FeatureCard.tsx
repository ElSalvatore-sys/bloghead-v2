import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  className?: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  className,
}: FeatureCardProps) {
  return (
    <Card
      data-testid="feature-card"
      className={cn(
        'p-6 text-center shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {ctaLabel && ctaHref && (
        <Link
          to={ctaHref}
          className="mt-3 inline-block text-sm text-primary hover:underline"
        >
          {ctaLabel}
        </Link>
      )}
    </Card>
  )
}
