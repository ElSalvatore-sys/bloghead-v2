import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChipSelect } from '@/components/shared'
import {
  SearchBar,
  FilterPanel,
  FilterSheet,
  SortDropdown,
  ViewToggle,
  ActiveFilters,
  Pagination,
  ResultsGrid,
  VenueCard,
} from '@/components/discovery'
import { useDiscoverVenues } from '@/hooks/queries'
import { useFilterStore } from '@/stores'

const VENUE_TYPE_CHIPS = [
  { value: 'BAR', label: 'Bars' },
  { value: 'CLUB', label: 'Clubs' },
  { value: 'RESTAURANT', label: 'Restaurants' },
  { value: 'HOTEL', label: 'Hotels' },
  { value: 'EVENT_SPACE', label: 'Event Spaces' },
]

export function VenuesPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const hydrateFromParams = useFilterStore((s) => s.hydrateFromParams)
  const toSearchParams = useFilterStore((s) => s.toSearchParams)
  const resetFilters = useFilterStore((s) => s.resetFilters)

  const searchQuery = useFilterStore((s) => s.searchQuery)
  const categories = useFilterStore((s) => s.categories)
  const locationState = useFilterStore((s) => s.location)
  const venueTypes = useFilterStore((s) => s.venueTypes)
  const setVenueTypes = useFilterStore((s) => s.setVenueTypes)
  const amenityIds = useFilterStore((s) => s.amenityIds)
  const sortBy = useFilterStore((s) => s.sortBy)
  const page = useFilterStore((s) => s.page)

  // Hydrate filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.toString()) {
      hydrateFromParams(params)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync filters to URL when they change
  useEffect(() => {
    const params = toSearchParams()
    const search = params.toString()
    const currentSearch = new URLSearchParams(location.search).toString()

    if (search !== currentSearch) {
      navigate(`?${search}`, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, categories, locationState, venueTypes, amenityIds, sortBy, page])

  // Reset filters on unmount
  useEffect(() => {
    return () => {
      resetFilters()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data, isLoading } = useDiscoverVenues()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Discover Venues
        </h1>
        <p className="mt-1 text-muted-foreground">
          Find the perfect venue for your event
        </p>
      </div>

      <div className="overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <ChipSelect
          options={VENUE_TYPE_CHIPS}
          value={venueTypes}
          onChange={setVenueTypes}
          multiple
          className="flex-nowrap"
        />
      </div>

      <div className="flex gap-6">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-4">
            <FilterPanel vendorType="venue" />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <SearchBar className="flex-1 min-w-[200px]" placeholder="Search venues..." />
            <FilterSheet vendorType="venue" />
            <SortDropdown vendorType="venue" />
            <ViewToggle />
          </div>

          <ActiveFilters vendorType="venue" />

          <ResultsGrid
            isLoading={isLoading}
            isEmpty={!isLoading && (data?.data?.length ?? 0) === 0}
            totalCount={data?.count ?? null}
            emptyTitle="No venues found"
            emptyDescription="Try adjusting your search or filters to find venues."
            onClearFilters={resetFilters}
          >
            {data?.data?.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </ResultsGrid>

          <Pagination totalCount={data?.count ?? null} />
        </main>
      </div>
    </div>
  )
}

export default VenuesPage
