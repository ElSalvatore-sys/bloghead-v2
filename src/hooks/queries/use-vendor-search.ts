/**
 * Vendor Search query hook
 * THE CORE Bridebook hook - connects filter-store to venue/artist queries
 * Uses infinite query for pagination/infinite scroll
 */

import { useInfiniteQuery } from '@tanstack/react-query'
import { VenueService, ArtistService, type Venue, type Artist } from '@/services'
import { useFilterStore } from '@/stores'

/**
 * Query key factory for vendor search
 */
export const vendorSearchKeys = {
  all: ['vendors', 'search'] as const,
  venues: (filters: object) => [...vendorSearchKeys.all, 'venues', filters] as const,
  artists: (filters: object) => [...vendorSearchKeys.all, 'artists', filters] as const,
}

type VendorType = 'venue' | 'artist'

interface VendorSearchResult<T> {
  data: T[]
  count: number | null
  nextPage: number | null
}

const PAGE_SIZE = 20

/**
 * Hook to search vendors with filters from filter-store
 * Supports infinite scroll pagination
 */
export function useVendorSearch<T extends Venue | Artist = Venue>(
  vendorType: VendorType = 'venue'
) {
  // Get filter state from store
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const categories = useFilterStore((s) => s.categories)
  const priceRange = useFilterStore((s) => s.priceRange)
  const location = useFilterStore((s) => s.location)
  const sortBy = useFilterStore((s) => s.sortBy)
  const pageSize = useFilterStore((s) => s.pageSize)

  // Create filter object for query key
  const filters = {
    q: searchQuery,
    categories,
    priceRange,
    location,
    sortBy,
  }

  const queryKey =
    vendorType === 'venue'
      ? vendorSearchKeys.venues(filters)
      : vendorSearchKeys.artists(filters)

  return useInfiniteQuery<VendorSearchResult<T>>({
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam as number
      const limit = pageSize || PAGE_SIZE

      if (vendorType === 'venue') {
        // Search or list venues
        const listOptions = {
          limit,
          offset,
          cityId: location.cityId ?? undefined,
          // Note: We'd add more filter options here as the VenueService evolves
        }

        const result = searchQuery.length > 2
          ? await VenueService.search(searchQuery, { limit, offset })
          : await VenueService.list(listOptions)

        const hasMore =
          result.count !== null && offset + limit < result.count

        return {
          data: result.data as T[],
          count: result.count,
          nextPage: hasMore ? offset + limit : null,
        }
      } else {
        // Search or list artists
        const result = searchQuery.length > 2
          ? await ArtistService.search(searchQuery, { limit, offset })
          : await ArtistService.list({
              limit,
              offset,
              genreId: categories[0], // Use first category as genre filter
            })

        const hasMore =
          result.count !== null && offset + limit < result.count

        return {
          data: result.data as T[],
          count: result.count,
          nextPage: hasMore ? offset + limit : null,
        }
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    // Keep previous data while fetching new results (prevents flash)
    placeholderData: (previousData) => previousData,
  })
}

/**
 * Hook specifically for venue search
 */
export function useVenueSearch() {
  return useVendorSearch<Venue>('venue')
}

/**
 * Hook specifically for artist search
 */
export function useArtistSearch() {
  return useVendorSearch<Artist>('artist')
}

/**
 * Helper to get total count from infinite query pages
 */
export function getTotalCount<T>(
  pages: VendorSearchResult<T>[] | undefined
): number | null {
  return pages?.[0]?.count ?? null
}

/**
 * Helper to flatten infinite query pages to single array
 */
export function flattenPages<T>(
  pages: VendorSearchResult<T>[] | undefined
): T[] {
  return pages?.flatMap((page) => page.data) ?? []
}
