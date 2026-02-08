import { cn } from '@/lib/utils'

interface HeroBannerProps {
  title: string
  subtitle?: string
  backgroundImage?: string
  searchSlot?: React.ReactNode
  ctaButton?: React.ReactNode
  className?: string
}

export function HeroBanner({
  title,
  subtitle,
  backgroundImage,
  searchSlot,
  ctaButton,
  className,
}: HeroBannerProps) {
  return (
    <section
      data-testid="hero-banner"
      className={cn(
        'relative flex min-h-[300px] items-center justify-center overflow-hidden md:min-h-[400px]',
        className,
      )}
    >
      {backgroundImage ? (
        <>
          <img
            src={backgroundImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70" />
      )}

      <div className="relative z-10 mx-auto w-full max-w-[var(--max-w-container)] px-4 py-12 text-center text-white">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 md:text-xl">
            {subtitle}
          </p>
        )}
        {searchSlot && <div className="mt-8">{searchSlot}</div>}
        {ctaButton && <div className="mt-6">{ctaButton}</div>}
      </div>
    </section>
  )
}
