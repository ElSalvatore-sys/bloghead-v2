import { Link } from 'react-router-dom'
import { MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FavoriteButton } from './FavoriteButton'
import type { VenueDiscoverResult } from '@/services'
import { useFilterStore } from '@/stores'
import { cn } from '@/lib/utils'

const VENUE_TYPE_LABELS: Record<string, string> = {
  BAR: 'Bar',
  CLUB: 'Club',
  RESTAURANT: 'Restaurant',
  HOTEL: 'Hotel',
  EVENT_SPACE: 'Event Space',
  OTHER: 'Other',
}

interface VenueCardProps {
  venue: VenueDiscoverResult
}

export function VenueCard({ venue }: VenueCardProps) {
  const viewMode = useFilterStore((s) => s.viewMode)

  if (viewMode === 'list') {
    return (
      <Link to={`/venues/${venue.id}`} className="block">
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md" data-testid={`venue-card-${venue.id}`}>
          <div className="flex">
            <div className="w-32 shrink-0">
              {venue.primary_image_url ? (
                <img
                  src={venue.primary_image_url}
                  alt={venue.venue_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <MapPin className="h-8 w-8 text-muted-foreground/50" />
                </div>
              )}
            </div>
            <CardContent className="flex flex-1 items-center justify-between p-4">
              <div className="space-y-1">
                <h3 className="font-semibold">{venue.venue_name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {VENUE_TYPE_LABELS[venue.type] ?? venue.type}
                  </Badge>
                  {venue.city_name && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {venue.city_name}
                    </span>
                  )}
                </div>
                {venue.amenity_names.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {venue.amenity_names.slice(0, 4).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <FavoriteButton vendorId={venue.id} vendorType="VENUE" />
            </CardContent>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link to={`/venues/${venue.id}`} className="block">
      <Card
        className={cn('overflow-hidden group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1')}
        data-testid={`venue-card-${venue.id}`}
      >
        <div className="relative aspect-[4/3]">
          {venue.primary_image_url ? (
            <img
              src={venue.primary_image_url}
              alt={venue.venue_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <MapPin className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <FavoriteButton
              vendorId={venue.id}
              vendorType="VENUE"
              className="bg-background/80 backdrop-blur-sm"
            />
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-background/80 backdrop-blur-sm text-foreground">
              {VENUE_TYPE_LABELS[venue.type] ?? venue.type}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold truncate">{venue.venue_name}</h3>
          {venue.city_name && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {venue.city_name}
            </span>
          )}
          {(venue.capacity_min || venue.capacity_max) && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-3 w-3" />
              {venue.capacity_min && venue.capacity_max
                ? `${venue.capacity_min} - ${venue.capacity_max}`
                : venue.capacity_max
                  ? `Up to ${venue.capacity_max}`
                  : `From ${venue.capacity_min}`}
            </span>
          )}
          {venue.amenity_names.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {venue.amenity_names.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {venue.amenity_names.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{venue.amenity_names.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
