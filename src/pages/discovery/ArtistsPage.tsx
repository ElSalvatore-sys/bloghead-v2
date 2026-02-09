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
  ArtistCard,
} from '@/components/discovery'
import { useDiscoverArtists, useGenres } from '@/hooks/queries'
import { useFilterStore } from '@/stores'

export function ArtistsPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const hydrateFromParams = useFilterStore((s) => s.hydrateFromParams)
  const toSearchParams = useFilterStore((s) => s.toSearchParams)
  const resetFilters = useFilterStore((s) => s.resetFilters)

  const searchQuery = useFilterStore((s) => s.searchQuery)
  const categories = useFilterStore((s) => s.categories)
  const setCategories = useFilterStore((s) => s.setCategories)
  const priceRange = useFilterStore((s) => s.priceRange)
  const sortBy = useFilterStore((s) => s.sortBy)
  const page = useFilterStore((s) => s.page)

  const { data: genres } = useGenres()
  const genreChips = genres?.map((g) => ({ value: g.id, label: g.name })) ?? []

  // Hydrate filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.toString()) {
      hydrateFromParams(params)
    }
    // Only run on mount
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
  }, [searchQuery, categories, priceRange, sortBy, page])

  // Reset filters on unmount
  useEffect(() => {
    return () => {
      resetFilters()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data, isLoading } = useDiscoverArtists()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Discover Artists
        </h1>
        <p className="mt-1 text-muted-foreground">
          Find the perfect artist for your event
        </p>
      </div>

      {genreChips.length > 0 && (
        <div className="overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <ChipSelect
            options={genreChips}
            value={categories}
            onChange={setCategories}
            multiple
            className="flex-nowrap"
          />
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-4">
            <FilterPanel vendorType="artist" />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <SearchBar className="flex-1 min-w-[200px]" placeholder="Search artists..." />
            <FilterSheet vendorType="artist" />
            <SortDropdown vendorType="artist" />
            <ViewToggle />
          </div>

          <ActiveFilters vendorType="artist" />

          <ResultsGrid
            isLoading={isLoading}
            isEmpty={!isLoading && (data?.data?.length ?? 0) === 0}
            totalCount={data?.count ?? null}
            emptyTitle="No artists found"
            emptyDescription="Try adjusting your search or filters to find artists."
            onClearFilters={resetFilters}
          >
            {data?.data?.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </ResultsGrid>

          <Pagination totalCount={data?.count ?? null} />
        </main>
      </div>
    </div>
  )
}

export default ArtistsPage
