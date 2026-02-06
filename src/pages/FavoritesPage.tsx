import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Music, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArtistCard } from '@/components/discovery/ArtistCard'
import { VenueCard } from '@/components/discovery/VenueCard'
import { useFavoriteArtistsEnriched, useFavoriteVenuesEnriched } from '@/hooks/queries'

function CardSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function FavoritesPage() {
  const navigate = useNavigate()
  const {
    data: artists,
    isLoading: artistsLoading,
  } = useFavoriteArtistsEnriched()
  const {
    data: venues,
    isLoading: venuesLoading,
  } = useFavoriteVenuesEnriched()

  useEffect(() => {
    document.title = 'Favorites | Bloghead'
    return () => {
      document.title = 'Bloghead'
    }
  }, [])

  const isLoading = artistsLoading || venuesLoading
  const hasArtists = (artists?.length ?? 0) > 0
  const hasVenues = (venues?.length ?? 0) > 0
  const hasAny = hasArtists || hasVenues

  return (
    <div className="space-y-6" data-testid="favorites-page">
      <PageHeader
        title="Favorites"
        description="Your saved artists and venues"
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
        </TabsList>

        {/* All tab */}
        <TabsContent value="all">
          {isLoading ? (
            <CardSkeletonGrid />
          ) : !hasAny ? (
            <EmptyState
              icon={Heart}
              title="No favorites yet"
              description="Browse artists and venues and tap the heart to save them here."
              action={{
                label: 'Browse Artists',
                onClick: () => navigate('/artists'),
              }}
            />
          ) : (
            <div className="space-y-8">
              {hasArtists && (
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Music className="h-5 w-5" />
                    Artists
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {artists!.map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                  </div>
                </div>
              )}
              {hasVenues && (
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Venues
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {venues!.map((venue) => (
                      <VenueCard key={venue.id} venue={venue} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Artists tab */}
        <TabsContent value="artists">
          {artistsLoading ? (
            <CardSkeletonGrid />
          ) : !hasArtists ? (
            <EmptyState
              icon={Music}
              title="No favorite artists yet"
              description="Browse artists to save some!"
              action={{
                label: 'Browse Artists',
                onClick: () => navigate('/artists'),
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {artists!.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Venues tab */}
        <TabsContent value="venues">
          {venuesLoading ? (
            <CardSkeletonGrid />
          ) : !hasVenues ? (
            <EmptyState
              icon={MapPin}
              title="No favorite venues yet"
              description="Browse venues to save some!"
              action={{
                label: 'Browse Venues',
                onClick: () => navigate('/venues'),
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {venues!.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FavoritesPage
