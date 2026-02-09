import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useFilterStore } from '@/stores'
import { useGenres, useAmenities } from '@/hooks/queries'

const VENUE_TYPE_LABELS: Record<string, string> = {
  BAR: 'Bar',
  CLUB: 'Club',
  RESTAURANT: 'Restaurant',
  HOTEL: 'Hotel',
  EVENT_SPACE: 'Event Space',
  OTHER: 'Other',
}

interface ActiveFiltersProps {
  vendorType: 'artist' | 'venue'
}

export function ActiveFilters({ vendorType: _vendorType }: ActiveFiltersProps) {
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const categories = useFilterStore((s) => s.categories)
  const priceRange = useFilterStore((s) => s.priceRange)
  const location = useFilterStore((s) => s.location)
  const venueTypes = useFilterStore((s) => s.venueTypes)
  const amenityIds = useFilterStore((s) => s.amenityIds)
  const sortBy = useFilterStore((s) => s.sortBy)
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery)
  const setCategories = useFilterStore((s) => s.setCategories)
  const setPriceRange = useFilterStore((s) => s.setPriceRange)
  const setLocation = useFilterStore((s) => s.setLocation)
  const setVenueTypes = useFilterStore((s) => s.setVenueTypes)
  const setAmenityIds = useFilterStore((s) => s.setAmenityIds)
  const setSortBy = useFilterStore((s) => s.setSortBy)
  const resetFilters = useFilterStore((s) => s.resetFilters)

  const { data: genres } = useGenres()
  const { data: amenities } = useAmenities()

  const amenityMap = new Map(amenities?.map((a) => [a.id, a.name]) ?? [])

  const hasActiveFilters =
    searchQuery || categories.length > 0 || priceRange || location.cityId || venueTypes.length > 0 || amenityIds.length > 0 || sortBy !== 'relevance'

  if (!hasActiveFilters) return null

  const removeCategory = (id: string) => {
    setCategories(categories.filter((c) => c !== id))
  }

  const genreMap = new Map(genres?.map((g) => [g.id, g.name]) ?? [])

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4" data-testid="active-filters">
      {searchQuery && (
        <Badge variant="secondary" className="gap-1">
          Search: {searchQuery}
          <button onClick={() => setSearchQuery('')} className="ml-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {categories.map((catId) => (
        <Badge key={catId} variant="secondary" className="gap-1">
          {genreMap.get(catId) ?? catId}
          <button onClick={() => removeCategory(catId)} className="ml-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {priceRange && (
        <Badge variant="secondary" className="gap-1">
          Price: {priceRange[0]} - {priceRange[1]}
          <button onClick={() => setPriceRange(null)} className="ml-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {location.cityId && (
        <Badge variant="secondary" className="gap-1">
          City filter active
          <button onClick={() => setLocation(null)} className="ml-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {venueTypes.map((type) => (
        <Badge key={type} variant="secondary" className="gap-1">
          {VENUE_TYPE_LABELS[type] ?? type}
          <button onClick={() => setVenueTypes(venueTypes.filter((t) => t !== type))} className="ml-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {amenityIds.map((id) => (
        <Badge key={id} variant="secondary" className="gap-1">
          {amenityMap.get(id) ?? id}
          <button onClick={() => setAmenityIds(amenityIds.filter((a) => a !== id))} className="ml-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {sortBy !== 'relevance' && (
        <Badge variant="secondary" className="gap-1">
          Sort: {sortBy.replace('_', ' ')}
          <button onClick={() => setSortBy('relevance')} className="ml-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={resetFilters}
        className="text-xs"
        data-testid="clear-all-filters"
      >
        Clear all
      </Button>
    </div>
  )
}
