import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertCircle, MapPin, Users, Building2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/discovery/FavoriteButton'
import { RatingStars } from '@/components/discovery/RatingStars'
import { EnquiryModal } from '@/components/enquiry'
import {
  BackButton,
  ShareButton,
  ContactInfo,
  DetailSkeleton,
  MediaGallery,
  ReviewsPlaceholder,
  SimilarEntities,
} from '@/components/detail'
import { useVenue, useGetOrCreateThread } from '@/hooks/queries'

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
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const navigate = useNavigate()
  const getOrCreateThread = useGetOrCreateThread()

  const handleMessageClick = () => {
    if (!venue?.profile_id) return
    getOrCreateThread.mutate(
      { otherUserId: venue.profile_id },
      { onSuccess: (thread) => navigate(`/messages/${thread.id}`) }
    )
  }

  const handleEnquiryClick = () => {
    setEnquiryOpen(true)
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
    <div className="space-y-6 pb-24 lg:pb-0" data-testid="venue-detail">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <BackButton />
        <div className="flex items-center gap-1">
          <ShareButton title={venue.venue_name} />
          <FavoriteButton vendorId={venue.id} vendorType="VENUE" size="lg" />
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
          {/* Name + type + rating */}
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
            <RatingStars rating={4.3} reviewCount={0} size="md" className="mt-2" />
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

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Venue Type</p>
                <p className="font-semibold">{VENUE_TYPE_LABELS[venue.type] ?? venue.type}</p>
              </div>
            </div>
            {(venue.capacity_min || venue.capacity_max) && (
              <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-semibold">
                    {venue.capacity_min && venue.capacity_max
                      ? `${venue.capacity_min} - ${venue.capacity_max}`
                      : venue.capacity_max
                        ? `Up to ${venue.capacity_max}`
                        : `From ${venue.capacity_min}`}
                  </p>
                </div>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{cityName ?? location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {amenities.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2"
                  >
                    {a.icon && <span className="text-base">{a.icon}</span>}
                    <span className="text-sm font-medium">{a.name}</span>
                  </div>
                ))}
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
                  onEnquiryClick={handleEnquiryClick}
                  onMessageClick={handleMessageClick}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EnquiryModal
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
        entityType="VENUE"
        entityId={venue.id}
        entityName={venue.venue_name}
      />

      {/* Sticky mobile booking bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background p-4 lg:hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex-1" onClick={handleMessageClick}>
            Message
          </Button>
          <Button className="flex-1" onClick={handleEnquiryClick}>
            Send Enquiry
          </Button>
        </div>
      </div>
    </div>
  )
}
