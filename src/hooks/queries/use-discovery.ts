/**
 * Discovery query hooks
 * Connects filter-store state to discover service methods
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  ArtistService,
  VenueService,
  type ArtistDiscoverResult,
  type VenueDiscoverResult,
  type VenueType,
} from '@/services'
import { useFilterStore } from '@/stores'

export const discoveryKeys = {
  all: ['discovery'] as const,
  artists: (filters: object) => [...discoveryKeys.all, 'artists', filters] as const,
  venues: (filters: object) => [...discoveryKeys.all, 'venues', filters] as const,
}

/**
 * Hook to discover artists with full filtering from filter-store
 */
export function useDiscoverArtists() {
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const categories = useFilterStore((s) => s.categories)
  const priceRange = useFilterStore((s) => s.priceRange)
  const sortBy = useFilterStore((s) => s.sortBy)
  const page = useFilterStore((s) => s.page)
  const pageSize = useFilterStore((s) => s.pageSize)

  const filters = { searchQuery, categories, priceRange, sortBy, page }

  return useQuery<{ data: ArtistDiscoverResult[]; count: number | null }, Error>({
    queryKey: discoveryKeys.artists(filters),
    queryFn: () =>
      ArtistService.discover({
        searchQuery: searchQuery || undefined,
        genreIds: categories.length > 0 ? categories : undefined,
        priceMin: priceRange?.[0],
        priceMax: priceRange?.[1],
        sortBy,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
    placeholderData: keepPreviousData,
  })
}

/**
 * Hook to discover venues with full filtering from filter-store
 */
export function useDiscoverVenues() {
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const categories = useFilterStore((s) => s.categories)
  const location = useFilterStore((s) => s.location)
  const venueTypes = useFilterStore((s) => s.venueTypes)
  const amenityIds = useFilterStore((s) => s.amenityIds)
  const sortBy = useFilterStore((s) => s.sortBy)
  const page = useFilterStore((s) => s.page)
  const pageSize = useFilterStore((s) => s.pageSize)

  const filters = { searchQuery, categories, location, venueTypes, amenityIds, sortBy, page }

  return useQuery<{ data: VenueDiscoverResult[]; count: number | null }, Error>({
    queryKey: discoveryKeys.venues(filters),
    queryFn: () =>
      VenueService.discover({
        searchQuery: searchQuery || undefined,
        cityId: location.cityId ?? undefined,
        venueTypes: venueTypes.length > 0 ? venueTypes as VenueType[] : undefined,
        amenityIds: amenityIds.length > 0 ? amenityIds : undefined,
        sortBy,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      }),
    placeholderData: keepPreviousData,
  })
}
