import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AlertCircle, MapPin, Users } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/discovery/FavoriteButton'
import { BookingRequestModal } from '@/components/booking'
import {
  BackButton,
  ShareButton,
  ContactInfo,
  DetailSkeleton,
  MediaGallery,
  ReviewsPlaceholder,
  SimilarEntities,
} from '@/components/detail'
import { useVenue, useArtistByProfile } from '@/hooks/queries'
import { useAuth } from '@/context/AuthContext'
import { useUIStore } from '@/stores'

const VENUE_TYPE_LABELS: Record<string, string> = {
  BAR: 'Bar',
  CLUB: 'Club',
  RESTAURANT: 'Restaurant',
  HOTEL: 'Hotel',
  EVENT_SPACE: 'Event Space',
  OTHER: 'Other',
}

export function VenueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: venue, isLoading, error } = useVenue(id ?? '')
  const [descExpanded, setDescExpanded] = useState(false)
  const { profile } = useAuth()
  const { data: userArtist } = useArtistByProfile(profile?.id ?? '')
  const openModal = useUIStore((s) => s.openModal)

  const handleBookingClick = () => {
    openModal('booking-request', {
      venueId: venue?.id,
      venueName: venue?.venue_name,
      artistId: userArtist?.id,
      entityType: 'venue',
    })
  }

  useEffect(() => {
    if (venue) {
      document.title = `${venue.venue_name} | Bloghead`
    }
    return () => {
      document.title = 'Bloghead'
    }
  }, [venue])

  if (isLoading) return <DetailSkeleton />

  if (error || !venue) {
    return (
      <div className="space-y-4">
        <BackButton />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message ?? 'Venue not found'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const amenities = venue.venue_amenities?.map((a) => a.amenities) ?? []
  const description = venue.description ?? ''
  const DESC_TRUNCATE = 300
  const shouldTruncateDesc = description.length > DESC_TRUNCATE

  const cityName = venue.cities?.name
  const location = [venue.street, cityName].filter(Boolean).join(', ')

  return (
    <div className="space-y-6" data-testid="venue-detail">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <BackButton />
        <div className="flex items-center gap-1">
          <ShareButton title={venue.venue_name} />
          <FavoriteButton vendorId={venue.id} vendorType="VENUE" />
        </div>
      </div>

      {/* Media gallery */}
      <MediaGallery
        media={venue.venue_media}
        altText={venue.venue_name}
        entityType="venue"
      />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Name + type */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{venue.venue_name}</h1>
              <Badge variant="outline">
                {VENUE_TYPE_LABELS[venue.type] ?? venue.type}
              </Badge>
            </div>
            {location && (
              <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {location}
              </p>
            )}
          </div>

          {/* Description */}
          {description && (
            <div>
              <p className="text-muted-foreground whitespace-pre-line">
                {shouldTruncateDesc && !descExpanded
                  ? `${description.slice(0, DESC_TRUNCATE)}...`
                  : description}
              </p>
              {shouldTruncateDesc && (
                <Button
                  variant="link"
                  className="mt-1 h-auto p-0"
                  onClick={() => setDescExpanded(!descExpanded)}
                >
                  {descExpanded ? 'Show less' : 'Read more'}
                </Button>
              )}
            </div>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map((a) => (
                  <Badge key={a.id} variant="secondary" className="gap-1.5 px-3 py-1">
                    {a.icon && <span>{a.icon}</span>}
                    {a.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Capacity */}
          {(venue.capacity_min || venue.capacity_max) && (
            <div className="flex items-center gap-2 rounded-lg border px-4 py-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-semibold">
                  {venue.capacity_min && venue.capacity_max
                    ? `${venue.capacity_min} - ${venue.capacity_max} guests`
                    : venue.capacity_max
                      ? `Up to ${venue.capacity_max} guests`
                      : `From ${venue.capacity_min} guests`}
                </p>
              </div>
            </div>
          )}

          {/* Reviews */}
          <ReviewsPlaceholder />

          {/* Similar */}
          <SimilarEntities entityType="venue" entityId={venue.id} />
        </div>

        {/* Right column — sidebar card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact {venue.venue_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactInfo
                  instagram={venue.instagram}
                  website={venue.website}
                  onBookingClick={handleBookingClick}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BookingRequestModal />
    </div>
  )
}
