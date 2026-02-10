import { Link } from 'react-router-dom'
import { Music, DollarSign, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { FavoriteButton } from './FavoriteButton'
import type { ArtistDiscoverResult } from '@/services'
import { useFilterStore } from '@/stores'
import { cn } from '@/lib/utils'

interface ArtistCardProps {
  artist: ArtistDiscoverResult
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const viewMode = useFilterStore((s) => s.viewMode)

  if (viewMode === 'list') {
    return (
      <Link to={`/artists/${artist.id}`} className="block">
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md" data-testid={`artist-card-${artist.id}`}>
          <div className="flex">
            <div className="w-32 shrink-0">
              {artist.primary_image_url ? (
                <OptimizedImage
                  src={artist.primary_image_url}
                  alt={artist.stage_name}
                  className="h-full w-full object-cover"
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <Music className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  }
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <Music className="h-8 w-8 text-muted-foreground/50" />
                </div>
              )}
            </div>
            <CardContent className="flex flex-1 items-center justify-between p-4">
              <div className="space-y-1">
                <h3 className="font-semibold">{artist.stage_name}</h3>
                {artist.genre_names.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {artist.genre_names.slice(0, 3).map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {artist.hourly_rate !== null && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {artist.hourly_rate}/hr
                    </span>
                  )}
                  {artist.years_experience !== null && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {artist.years_experience} yrs
                    </span>
                  )}
                </div>
              </div>
              <FavoriteButton vendorId={artist.id} vendorType="ARTIST" />
            </CardContent>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link to={`/artists/${artist.id}`} className="block">
      <Card
        className={cn('overflow-hidden group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1')}
        data-testid={`artist-card-${artist.id}`}
      >
        <div className="relative aspect-[4/3]">
          {artist.primary_image_url ? (
            <OptimizedImage
              src={artist.primary_image_url}
              alt={artist.stage_name}
              className="h-full w-full object-cover"
              fallback={
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <Music className="h-12 w-12 text-muted-foreground/50" />
                </div>
              }
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Music className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <FavoriteButton
              vendorId={artist.id}
              vendorType="ARTIST"
              className="bg-background/80 backdrop-blur-sm"
            />
          </div>
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold truncate">{artist.stage_name}</h3>
          {artist.genre_names.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {artist.genre_names.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {artist.hourly_rate !== null && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {artist.hourly_rate}/hr
              </span>
            )}
            {artist.years_experience !== null && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {artist.years_experience} yrs
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
