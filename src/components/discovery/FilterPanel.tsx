import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFilterStore } from '@/stores'
import { useGenres, useCities, useAmenities } from '@/hooks/queries'

const VENUE_TYPE_OPTIONS = [
  { value: 'BAR', label: 'Bar' },
  { value: 'CLUB', label: 'Club' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'HOTEL', label: 'Hotel' },
  { value: 'EVENT_SPACE', label: 'Event Space' },
  { value: 'OTHER', label: 'Other' },
]

interface FilterPanelProps {
  vendorType: 'artist' | 'venue'
}

export function FilterPanel({ vendorType }: FilterPanelProps) {
  const categories = useFilterStore((s) => s.categories)
  const toggleCategory = useFilterStore((s) => s.toggleCategory)
  const priceRange = useFilterStore((s) => s.priceRange)
  const setPriceRange = useFilterStore((s) => s.setPriceRange)
  const location = useFilterStore((s) => s.location)
  const setLocation = useFilterStore((s) => s.setLocation)
  const venueTypes = useFilterStore((s) => s.venueTypes)
  const toggleVenueType = useFilterStore((s) => s.toggleVenueType)
  const amenityIds = useFilterStore((s) => s.amenityIds)
  const toggleAmenityId = useFilterStore((s) => s.toggleAmenityId)
  const resetFilters = useFilterStore((s) => s.resetFilters)

  const { data: genres } = useGenres()
  const { data: cities } = useCities()
  const { data: amenities } = useAmenities()

  return (
    <div className="space-y-6" data-testid="filter-panel">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-auto p-0"
          onClick={resetFilters}
          data-testid="filter-reset"
        >
          Reset
        </Button>
      </div>

      <Separator />

      {/* Genre / Category Filter */}
      {vendorType === 'artist' && genres && genres.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Genres</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {genres.map((genre) => (
              <div key={genre.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`genre-${genre.id}`}
                  checked={categories.includes(genre.id)}
                  onCheckedChange={() => toggleCategory(genre.id)}
                  data-testid={`genre-filter-${genre.slug}`}
                />
                <Label
                  htmlFor={`genre-${genre.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {genre.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter (artists only) */}
      {vendorType === 'artist' && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Price Range (per hour)</h4>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange?.[0] ?? ''}
                onChange={(e) => {
                  const min = e.target.value ? Number(e.target.value) : 0
                  const max = priceRange?.[1] ?? 1000
                  setPriceRange(min || max !== 1000 ? [min, max] : null)
                }}
                className="h-8"
                data-testid="price-min"
              />
              <span className="text-muted-foreground text-sm">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={priceRange?.[1] ?? ''}
                onChange={(e) => {
                  const max = e.target.value ? Number(e.target.value) : 1000
                  const min = priceRange?.[0] ?? 0
                  setPriceRange(min || max !== 1000 ? [min, max] : null)
                }}
                className="h-8"
                data-testid="price-max"
              />
            </div>
          </div>
        </>
      )}

      {/* Venue Type Filter */}
      {vendorType === 'venue' && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Venue Type</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {VENUE_TYPE_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`venue-type-${option.value}`}
                    checked={venueTypes.includes(option.value)}
                    onCheckedChange={() => toggleVenueType(option.value)}
                    data-testid={`venue-type-filter-${option.value.toLowerCase()}`}
                  />
                  <Label
                    htmlFor={`venue-type-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Amenity Filter */}
      {vendorType === 'venue' && amenities && amenities.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Amenities</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {amenities.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity.id}`}
                    checked={amenityIds.includes(amenity.id)}
                    onCheckedChange={() => toggleAmenityId(amenity.id)}
                    data-testid={`amenity-filter-${amenity.id}`}
                  />
                  <Label
                    htmlFor={`amenity-${amenity.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {amenity.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* City Filter */}
      {cities && cities.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-medium">City</h4>
            <Select
              value={location.cityId ?? 'all'}
              onValueChange={(value) =>
                setLocation(value === 'all' ? null : value)
              }
            >
              <SelectTrigger className="h-8" data-testid="city-filter">
                <SelectValue placeholder="All cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  )
}
