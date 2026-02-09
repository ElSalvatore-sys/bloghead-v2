import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@/test/helpers'

const mocks = vi.hoisted(() => ({
  useFavoriteArtistsEnriched: vi.fn(),
  useFavoriteVenuesEnriched: vi.fn(),
}))

vi.mock('@/hooks/queries/use-favorites', () => ({
  useFavoriteArtistsEnriched: mocks.useFavoriteArtistsEnriched,
  useFavoriteVenuesEnriched: mocks.useFavoriteVenuesEnriched,
}))

// ArtistCard and VenueCard read viewMode from filter store
vi.mock('@/stores', () => ({
  useFilterStore: vi.fn((selector: (s: { viewMode: string }) => string) =>
    selector({ viewMode: 'grid' })
  ),
}))

// Mock useIsFavorite / useToggleFavorite used by FavoriteButton inside cards
vi.mock('@/hooks/queries', () => ({
  useFavoriteArtistsEnriched: mocks.useFavoriteArtistsEnriched,
  useFavoriteVenuesEnriched: mocks.useFavoriteVenuesEnriched,
  useIsFavorite: vi.fn().mockReturnValue({ data: false }),
  useToggleFavorite: vi.fn().mockReturnValue({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn().mockReturnValue({ user: { id: 'user-123' } }),
}))

import { FavoritesPage } from '../FavoritesPage'
import type { ArtistDiscoverResult, VenueDiscoverResult } from '@/services'

const mockArtists: ArtistDiscoverResult[] = [
  {
    id: 'a-1',
    stage_name: 'DJ Alpha',
    bio: 'Test artist',
    hourly_rate: 50,
    years_experience: 3,
    has_equipment: true,
    primary_image_url: null,
    genre_names: ['House', 'Techno'],
  },
  {
    id: 'a-2',
    stage_name: 'DJ Beta',
    bio: null,
    hourly_rate: 75,
    years_experience: 5,
    has_equipment: false,
    primary_image_url: null,
    genre_names: ['Hip Hop'],
  },
]

const mockVenues: VenueDiscoverResult[] = [
  {
    id: 'v-1',
    venue_name: 'Club Neon',
    description: 'A great club',
    type: 'CLUB',
    city_name: 'Wiesbaden',
    street: 'Main St 1',
    capacity_min: 50,
    capacity_max: 200,
    primary_image_url: null,
    amenity_names: ['Sound System', 'Lighting'],
  },
]

function renderPage(initialRoute = '/favorites') {
  const queryClient = createQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <FavoritesPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('FavoritesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page title and tabs', () => {
    mocks.useFavoriteArtistsEnriched.mockReturnValue({
      data: [],
      isLoading: false,
    })
    mocks.useFavoriteVenuesEnriched.mockReturnValue({
      data: [],
      isLoading: false,
    })

    renderPage()

    expect(screen.getByText('My Favorites')).toBeInTheDocument()
    expect(screen.getByText('Your saved artists and venues')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Artists/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Venues/i })).toBeInTheDocument()
  })

  it('shows loading skeletons while fetching', () => {
    mocks.useFavoriteArtistsEnriched.mockReturnValue({
      data: undefined,
      isLoading: true,
    })
    mocks.useFavoriteVenuesEnriched.mockReturnValue({
      data: undefined,
      isLoading: false,
    })

    const { container } = renderPage()

    // Skeleton elements have animate-pulse class
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThanOrEqual(3)
  })

  it('shows empty state for artists when no favorites', () => {
    mocks.useFavoriteArtistsEnriched.mockReturnValue({
      data: [],
      isLoading: false,
    })
    mocks.useFavoriteVenuesEnriched.mockReturnValue({
      data: [],
      isLoading: false,
    })

    renderPage()

    expect(screen.getByText('No favorite artists yet')).toBeInTheDocument()
    expect(
      screen.getByText('Discover amazing artists and save them here')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse Artists' })).toHaveAttribute(
      'href',
      '/artists'
    )
  })

  it('shows empty state for venues tab', () => {
    mocks.useFavoriteArtistsEnriched.mockReturnValue({
      data: [],
      isLoading: false,
    })
    mocks.useFavoriteVenuesEnriched.mockReturnValue({
      data: [],
      isLoading: false,
    })

    renderPage('/favorites?tab=venues')

    expect(screen.getByText('No favorite venues yet')).toBeInTheDocument()
    expect(
      screen.getByText('Find your perfect venue and save it here')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse Venues' })).toHaveAttribute(
      'href',
      '/venues'
    )
  })

  it('renders artist cards when favorites exist', () => {
    mocks.useFavoriteArtistsEnriched.mockReturnValue({
      data: mockArtists,
      isLoading: false,
    })
    mocks.useFavoriteVenuesEnriched.mockReturnValue({
      data: [],
      isLoading: false,
    })

    renderPage()

    expect(screen.getByText('DJ Alpha')).toBeInTheDocument()
    expect(screen.getByText('DJ Beta')).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: /Artists \(2\)/i })
    ).toBeInTheDocument()
  })

  it('renders venue cards when favorites exist', () => {
    mocks.useFavoriteArtistsEnriched.mockReturnValue({
      data: [],
      isLoading: false,
    })
    mocks.useFavoriteVenuesEnriched.mockReturnValue({
      data: mockVenues,
      isLoading: false,
    })

    renderPage('/favorites?tab=venues')

    expect(screen.getByText('Club Neon')).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: /Venues \(1\)/i })
    ).toBeInTheDocument()
  })
})
