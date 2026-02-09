/**
 * Filter Store
 * Vendor search filters with URL sync support
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type SortOption =
  | 'relevance'
  | 'price_low'
  | 'price_high'
  | 'rating'
  | 'newest'

export type ViewMode = 'grid' | 'list' | 'map'

interface FilterState {
  // Search
  searchQuery: string

  // Category filters
  categories: string[]
  priceRange: [number, number] | null
  location: {
    cityId: string | null
    radius: number
  }

  // Venue-specific filters
  venueTypes: string[]
  amenityIds: string[]

  // Sorting
  sortBy: SortOption

  // Pagination
  page: number
  pageSize: number

  // View mode
  viewMode: ViewMode
}

interface FilterActions {
  // Setters
  setSearchQuery: (query: string) => void
  setCategories: (categories: string[]) => void
  toggleCategory: (categoryId: string) => void
  setPriceRange: (range: [number, number] | null) => void
  setLocation: (cityId: string | null, radius?: number) => void
  setVenueTypes: (types: string[]) => void
  toggleVenueType: (type: string) => void
  setAmenityIds: (ids: string[]) => void
  toggleAmenityId: (id: string) => void
  setSortBy: (sort: SortOption) => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setViewMode: (mode: ViewMode) => void

  // Reset
  resetFilters: () => void

  // URL sync helpers
  hydrateFromParams: (params: URLSearchParams) => void
  toSearchParams: () => URLSearchParams

  // Computed
  getActiveFilterCount: () => number
}

const DEFAULT_STATE: FilterState = {
  searchQuery: '',
  categories: [],
  priceRange: null,
  location: {
    cityId: null,
    radius: 50,
  },
  venueTypes: [],
  amenityIds: [],
  sortBy: 'relevance',
  page: 1,
  pageSize: 20,
  viewMode: 'grid',
}

export const useFilterStore = create<FilterState & FilterActions>()(
  devtools(
    (set, get) => ({
      ...DEFAULT_STATE,

      // Search
      setSearchQuery: (query) =>
        set({ searchQuery: query, page: 1 }, false, 'setSearchQuery'),

      // Categories
      setCategories: (categories) =>
        set({ categories, page: 1 }, false, 'setCategories'),

      toggleCategory: (categoryId) =>
        set(
          (state) => {
            const exists = state.categories.includes(categoryId)
            return {
              categories: exists
                ? state.categories.filter((id) => id !== categoryId)
                : [...state.categories, categoryId],
              page: 1,
            }
          },
          false,
          'toggleCategory'
        ),

      // Price
      setPriceRange: (range) =>
        set({ priceRange: range, page: 1 }, false, 'setPriceRange'),

      // Location
      setLocation: (cityId, radius) =>
        set(
          (state) => ({
            location: {
              cityId,
              radius: radius ?? state.location.radius,
            },
            page: 1,
          }),
          false,
          'setLocation'
        ),

      // Venue types
      setVenueTypes: (types) =>
        set({ venueTypes: types, page: 1 }, false, 'setVenueTypes'),

      toggleVenueType: (type) =>
        set(
          (state) => {
            const exists = state.venueTypes.includes(type)
            return {
              venueTypes: exists
                ? state.venueTypes.filter((t) => t !== type)
                : [...state.venueTypes, type],
              page: 1,
            }
          },
          false,
          'toggleVenueType'
        ),

      // Amenities
      setAmenityIds: (ids) =>
        set({ amenityIds: ids, page: 1 }, false, 'setAmenityIds'),

      toggleAmenityId: (id) =>
        set(
          (state) => {
            const exists = state.amenityIds.includes(id)
            return {
              amenityIds: exists
                ? state.amenityIds.filter((a) => a !== id)
                : [...state.amenityIds, id],
              page: 1,
            }
          },
          false,
          'toggleAmenityId'
        ),

      // Sorting
      setSortBy: (sort) => set({ sortBy: sort, page: 1 }, false, 'setSortBy'),

      // Pagination
      setPage: (page) => set({ page }, false, 'setPage'),
      setPageSize: (size) =>
        set({ pageSize: size, page: 1 }, false, 'setPageSize'),

      // View
      setViewMode: (mode) => set({ viewMode: mode }, false, 'setViewMode'),

      // Reset to defaults
      resetFilters: () => set(DEFAULT_STATE, false, 'resetFilters'),

      // Hydrate from URL params
      hydrateFromParams: (params) => {
        const state: Partial<FilterState> = {}

        const q = params.get('q')
        if (q) state.searchQuery = q

        const categories = params.get('categories')
        if (categories) state.categories = categories.split(',').filter(Boolean)

        const priceMin = params.get('priceMin')
        const priceMax = params.get('priceMax')
        if (priceMin && priceMax) {
          state.priceRange = [Number(priceMin), Number(priceMax)]
        }

        const cityId = params.get('cityId')
        const radius = params.get('radius')
        if (cityId || radius) {
          state.location = {
            cityId: cityId || null,
            radius: radius ? Number(radius) : 50,
          }
        }

        const venueTypes = params.get('venueTypes')
        if (venueTypes) state.venueTypes = venueTypes.split(',').filter(Boolean)

        const amenityIds = params.get('amenityIds')
        if (amenityIds) state.amenityIds = amenityIds.split(',').filter(Boolean)

        const sort = params.get('sort') as SortOption | null
        if (sort) state.sortBy = sort

        const page = params.get('page')
        if (page) state.page = Number(page)

        const view = params.get('view') as ViewMode | null
        if (view) state.viewMode = view

        set(state, false, 'hydrateFromParams')
      },

      // Convert to URL params
      toSearchParams: () => {
        const state = get()
        const params = new URLSearchParams()

        if (state.searchQuery) params.set('q', state.searchQuery)
        if (state.categories.length > 0)
          params.set('categories', state.categories.join(','))
        if (state.priceRange) {
          params.set('priceMin', String(state.priceRange[0]))
          params.set('priceMax', String(state.priceRange[1]))
        }
        if (state.location.cityId) params.set('cityId', state.location.cityId)
        if (state.location.radius !== 50)
          params.set('radius', String(state.location.radius))
        if (state.venueTypes.length > 0)
          params.set('venueTypes', state.venueTypes.join(','))
        if (state.amenityIds.length > 0)
          params.set('amenityIds', state.amenityIds.join(','))
        if (state.sortBy !== 'relevance') params.set('sort', state.sortBy)
        if (state.page > 1) params.set('page', String(state.page))
        if (state.viewMode !== 'grid') params.set('view', state.viewMode)

        return params
      },

      // Count active filters (for "X filters active" badge)
      getActiveFilterCount: () => {
        const state = get()
        let count = 0

        if (state.searchQuery) count++
        if (state.categories.length > 0) count++
        if (state.priceRange) count++
        if (state.location.cityId) count++
        if (state.venueTypes.length > 0) count++
        if (state.amenityIds.length > 0) count++
        if (state.sortBy !== 'relevance') count++

        return count
      },
    }),
    { name: 'filter-store', enabled: import.meta.env.DEV }
  )
)
