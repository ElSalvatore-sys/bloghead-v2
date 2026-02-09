import { useSearchParams, Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArtistCard } from '@/components/discovery/ArtistCard'
import { VenueCard } from '@/components/discovery/VenueCard'
import {
  useFavoriteArtistsEnriched,
  useFavoriteVenuesEnriched,
} from '@/hooks/queries'

export function FavoritesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') ?? 'artists'

  const artists = useFavoriteArtistsEnriched()
  const venues = useFavoriteVenuesEnriched()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-8 w-8 text-red-500" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Favorites</h1>
          <p className="text-muted-foreground">
            Your saved artists and venues
          </p>
        </div>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => setSearchParams({ tab: value })}
      >
        <TabsList>
          <TabsTrigger value="artists">
            Artists{artists.data ? ` (${artists.data.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="venues">
            Venues{venues.data ? ` (${venues.data.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="artists" className="mt-6">
          {artists.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[280px]" />
              ))}
            </div>
          ) : artists.data?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.data.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">
                No favorite artists yet
              </h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Discover amazing artists and save them here
              </p>
              <Button asChild>
                <Link to="/artists">Browse Artists</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="venues" className="mt-6">
          {venues.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[280px]" />
              ))}
            </div>
          ) : venues.data?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.data.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">
                No favorite venues yet
              </h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Find your perfect venue and save it here
              </p>
              <Button asChild>
                <Link to="/venues">Browse Venues</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FavoritesPage
