import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertCircle, DollarSign, Clock, Wrench } from 'lucide-react'
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
  AvailabilityCalendar,
  ReviewsPlaceholder,
  SimilarEntities,
} from '@/components/detail'
import { useArtist, useGetOrCreateThread } from '@/hooks/queries'

export function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: artist, isLoading, error } = useArtist(id ?? '')
  const [bioExpanded, setBioExpanded] = useState(false)
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const navigate = useNavigate()
  const getOrCreateThread = useGetOrCreateThread()

  const handleMessageClick = () => {
    if (!artist?.profile_id) return
    getOrCreateThread.mutate(
      { otherUserId: artist.profile_id },
      { onSuccess: (thread) => navigate(`/messages/${thread.id}`) }
    )
  }

  const handleEnquiryClick = () => {
    setEnquiryOpen(true)
  }

  useEffect(() => {
    if (artist) {
      document.title = `${artist.stage_name} | Bloghead`
    }
    return () => {
      document.title = 'Bloghead'
    }
  }, [artist])

  if (isLoading) return <DetailSkeleton />

  if (error || !artist) {
    return (
      <div className="space-y-4">
        <BackButton />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message ?? 'Artist not found'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const genres = artist.artist_genres?.map((g) => g.genres?.name).filter(Boolean) ?? []
  const bio = artist.bio ?? ''
  const BIO_TRUNCATE = 300
  const shouldTruncateBio = bio.length > BIO_TRUNCATE

  return (
    <div className="space-y-6 pb-24 lg:pb-0" data-testid="artist-detail">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <BackButton />
        <div className="flex items-center gap-1">
          <ShareButton title={artist.stage_name} />
          <FavoriteButton vendorId={artist.id} vendorType="ARTIST" size="lg" />
        </div>
      </div>

      {/* Media gallery */}
      <MediaGallery
        media={artist.artist_media}
        altText={artist.stage_name}
        entityType="artist"
      />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Name + genres + rating */}
          <div>
            <h1 className="text-3xl font-bold">{artist.stage_name}</h1>
            {genres.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
            <RatingStars rating={4.5} reviewCount={0} size="md" className="mt-2" />
          </div>

          {/* Bio */}
          {bio && (
            <div>
              <p className="text-muted-foreground whitespace-pre-line">
                {shouldTruncateBio && !bioExpanded
                  ? `${bio.slice(0, BIO_TRUNCATE)}...`
                  : bio}
              </p>
              {shouldTruncateBio && (
                <Button
                  variant="link"
                  className="mt-1 h-auto p-0"
                  onClick={() => setBioExpanded(!bioExpanded)}
                >
                  {bioExpanded ? 'Show less' : 'Read more'}
                </Button>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {artist.hourly_rate !== null && (
              <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="font-semibold">${artist.hourly_rate}/hr</p>
                </div>
              </div>
            )}
            {artist.years_experience !== null && (
              <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-semibold">{artist.years_experience} years</p>
                </div>
              </div>
            )}
            {artist.has_equipment && (
              <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
                <Wrench className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Equipment</p>
                  <p className="font-semibold">Has own equipment</p>
                </div>
              </div>
            )}
          </div>

          {/* Availability */}
          <AvailabilityCalendar artistId={artist.id} />

          {/* Reviews */}
          <ReviewsPlaceholder />

          {/* Similar */}
          <SimilarEntities entityType="artist" entityId={artist.id} />
        </div>

        {/* Right column — sidebar card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Book {artist.stage_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {artist.hourly_rate !== null && (
                  <p className="text-2xl font-bold">${artist.hourly_rate}<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
                )}
                <ContactInfo
                  instagram={artist.instagram}
                  soundcloud={artist.soundcloud}
                  spotify={artist.spotify}
                  website={artist.website}
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
        entityType="ARTIST"
        entityId={artist.id}
        entityName={artist.stage_name}
      />

      {/* Sticky mobile booking bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background p-4 lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">From</p>
            <p className="text-lg font-bold">
              {artist.hourly_rate !== null ? `$${artist.hourly_rate}/hr` : 'Contact for pricing'}
            </p>
          </div>
          <Button onClick={handleEnquiryClick}>Send Enquiry</Button>
        </div>
      </div>
    </div>
  )
}
