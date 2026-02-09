import { useState } from 'react'
import { Music, MapPin, ImageIcon } from 'lucide-react'
import { ImageLightbox } from '@/components/shared'
import type { ArtistMedia, VenueMedia } from '@/services'

type MediaItem = ArtistMedia | VenueMedia

interface MediaGalleryProps {
  media: MediaItem[]
  altText: string
  entityType?: 'artist' | 'venue'
}

export function MediaGallery({ media, altText, entityType = 'artist' }: MediaGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter to images only (V1)
  const images = media.filter(
    (m) => (m as Record<string, unknown>).media_type === 'IMAGE' || !(m as Record<string, unknown>).media_type
  )

  if (images.length === 0) {
    const PlaceholderIcon = entityType === 'venue' ? MapPin : Music
    return (
      <div
        className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted"
        data-testid="media-placeholder"
      >
        <PlaceholderIcon className="h-16 w-16 text-muted-foreground/30" />
      </div>
    )
  }

  // Hero = primary or first
  const primaryIndex = images.findIndex(
    (m) => (m as Record<string, unknown>).is_primary
  )
  const heroIndex = primaryIndex >= 0 ? primaryIndex : 0
  const heroImage = images[heroIndex]

  // Reorder: hero first, then rest
  const orderedImages = [heroImage, ...images.filter((_, i) => i !== heroIndex)]

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const lightboxImages = orderedImages.map((img, i) => ({
    url: img.url,
    alt: `${altText} ${i + 1}`,
  }))

  const remaining = orderedImages.length - 4

  // Single image — just hero
  if (orderedImages.length === 1) {
    return (
      <div data-testid="media-gallery">
        <button
          type="button"
          className="w-full overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
          onClick={() => openLightbox(0)}
        >
          <img
            src={heroImage.url}
            alt={altText}
            className="aspect-video w-full object-cover"
          />
        </button>
        <ImageLightbox
          images={lightboxImages}
          initialIndex={currentIndex}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
        />
      </div>
    )
  }

  // Two images — hero + one side image
  if (orderedImages.length === 2) {
    return (
      <div data-testid="media-gallery">
        {/* Desktop */}
        <div className="hidden md:flex gap-1 rounded-xl overflow-hidden" style={{ height: '400px' }}>
          <button
            type="button"
            className="flex-[2] overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => openLightbox(0)}
          >
            <img
              src={orderedImages[0].url}
              alt={altText}
              className="h-full w-full object-cover transition-transform hover:scale-[1.02]"
            />
          </button>
          <button
            type="button"
            className="flex-1 overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => openLightbox(1)}
          >
            <img
              src={orderedImages[1].url}
              alt={`${altText} 2`}
              className="h-full w-full object-cover transition-transform hover:scale-[1.02]"
            />
          </button>
        </div>
        {/* Mobile */}
        <MobileHero image={orderedImages[0]} altText={altText} count={2} onOpen={() => openLightbox(0)} />
        <ImageLightbox
          images={lightboxImages}
          initialIndex={currentIndex}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
        />
      </div>
    )
  }

  // 3+ images — full bento grid
  return (
    <div data-testid="media-gallery">
      {/* Desktop bento grid */}
      <div className="hidden md:flex gap-1 rounded-xl overflow-hidden" style={{ height: '400px' }}>
        {/* Hero — left side */}
        <button
          type="button"
          className="flex-[2] overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring"
          onClick={() => openLightbox(0)}
        >
          <img
            src={orderedImages[0].url}
            alt={altText}
            className="h-full w-full object-cover transition-transform hover:scale-[1.02]"
          />
        </button>

        {/* Right column */}
        <div className="flex flex-1 flex-col gap-1">
          <button
            type="button"
            className="flex-1 overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => openLightbox(1)}
          >
            <img
              src={orderedImages[1].url}
              alt={`${altText} 2`}
              className="h-full w-full object-cover transition-transform hover:scale-[1.02]"
            />
          </button>

          <button
            type="button"
            className="flex-1 overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => openLightbox(2)}
          >
            <img
              src={orderedImages[2].url}
              alt={`${altText} 3`}
              className="h-full w-full object-cover transition-transform hover:scale-[1.02]"
            />
          </button>

          {orderedImages.length >= 4 && (
            <button
              type="button"
              className="relative flex-1 overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring"
              onClick={() => openLightbox(3)}
            >
              <img
                src={orderedImages[3].url}
                alt={`${altText} 4`}
                className="h-full w-full object-cover"
              />
              {remaining > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="flex items-center gap-1 text-lg font-semibold text-white">
                    <ImageIcon className="h-5 w-5" />
                    +{remaining}
                  </span>
                </div>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile — hero + view all button */}
      <MobileHero
        image={orderedImages[0]}
        altText={altText}
        count={orderedImages.length}
        onOpen={() => openLightbox(0)}
      />

      <ImageLightbox
        images={lightboxImages}
        initialIndex={currentIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </div>
  )
}

/** Mobile hero with "View all N photos" button */
function MobileHero({
  image,
  altText,
  count,
  onOpen,
}: {
  image: MediaItem
  altText: string
  count: number
  onOpen: () => void
}) {
  return (
    <div className="md:hidden">
      <button
        type="button"
        className="w-full overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
        onClick={onOpen}
      >
        <img
          src={image.url}
          alt={altText}
          className="aspect-video w-full object-cover"
        />
      </button>
      {count > 1 && (
        <button
          type="button"
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/80"
          onClick={onOpen}
        >
          <ImageIcon className="h-4 w-4" />
          View all {count} photos
        </button>
      )}
    </div>
  )
}
