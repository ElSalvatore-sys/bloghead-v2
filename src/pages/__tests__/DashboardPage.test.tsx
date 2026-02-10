import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@/test/helpers'
import { mockProfile } from '@/test/mocks/data'

const mocks = vi.hoisted(() => ({
  useCurrentProfile: vi.fn(),
  useFavorites: vi.fn(),
  useSentEnquiries: vi.fn(),
  useUnreadCount: vi.fn(),
}))

vi.mock('@/hooks', () => ({
  useCurrentProfile: mocks.useCurrentProfile,
  useFavorites: mocks.useFavorites,
  useSentEnquiries: mocks.useSentEnquiries,
  useUnreadCount: mocks.useUnreadCount,
}))

import { DashboardPage } from '../DashboardPage'

const mockFavoritesData = [
  {
    id: 'fav-1',
    profile_id: 'user-123',
    favorite_type: 'ARTIST' as const,
    artist_id: 'artist-1',
    venue_id: null,
    created_at: '2024-01-01T00:00:00Z',
    artists: { id: 'artist-1', stage_name: 'DJ Alpha' },
    venues: null,
  },
  {
    id: 'fav-2',
    profile_id: 'user-123',
    favorite_type: 'VENUE' as const,
    artist_id: null,
    venue_id: 'venue-1',
    created_at: '2024-01-02T00:00:00Z',
    artists: null,
    venues: { id: 'venue-1', venue_name: 'The Loft', type: 'CLUB' },
  },
]

const mockEnquiriesData = [
  {
    id: 'enq-1',
    sender_id: 'user-123',
    entity_type: 'ARTIST' as const,
    artist_id: 'artist-1',
    venue_id: null,
    enquiry_type: 'BOOKING' as const,
    status: 'PENDING' as const,
    name: 'Test User',
    email: 'test@example.com',
    phone: null,
    message: 'Booking request',
    event_date: '2024-07-15',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    sender: { id: 'user-123', first_name: 'Test', last_name: 'User' },
    artists: { id: 'artist-1', stage_name: 'DJ Alpha' },
    venues: null,
  },
]

function renderPage() {
  const queryClient = createQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useCurrentProfile.mockReturnValue({
      data: mockProfile,
      isLoading: false,
      isError: false,
      error: null,
    })
    mocks.useFavorites.mockReturnValue({
      data: { data: mockFavoritesData, count: 2 },
      isLoading: false,
    })
    mocks.useSentEnquiries.mockReturnValue({
      data: mockEnquiriesData,
      isLoading: false,
    })
    mocks.useUnreadCount.mockReturnValue({
      data: 3,
      isLoading: false,
    })
  })

  it('renders welcome message with user display name', () => {
    renderPage()
    expect(screen.getByText(/Welcome back, TestyMcTest/)).toBeInTheDocument()
  })

  it('shows loading skeleton when profile is loading', () => {
    mocks.useCurrentProfile.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    })
    renderPage()
    expect(screen.getByTestId('dashboard-loading')).toBeInTheDocument()
  })

  it('shows error alert when profile fails', () => {
    mocks.useCurrentProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('fail'),
    })
    renderPage()
    expect(screen.getByText('Failed to load profile')).toBeInTheDocument()
  })

  it('renders 3 stat cards with correct counts', () => {
    renderPage()
    const favStat = screen.getByTestId('stat-favorites')
    const enqStat = screen.getByTestId('stat-enquiries')
    const msgStat = screen.getByTestId('stat-messages')

    expect(favStat).toHaveTextContent('2')
    expect(enqStat).toHaveTextContent('1')
    expect(msgStat).toHaveTextContent('3')
  })

  it('stat cards link to correct pages', () => {
    renderPage()
    expect(screen.getByTestId('stat-favorites').closest('a')).toHaveAttribute(
      'href',
      '/favorites'
    )
    expect(screen.getByTestId('stat-enquiries').closest('a')).toHaveAttribute(
      'href',
      '/enquiries'
    )
    expect(screen.getByTestId('stat-messages').closest('a')).toHaveAttribute(
      'href',
      '/messages'
    )
  })

  it('renders 4 quick action cards', () => {
    renderPage()
    expect(screen.getByTestId('action-artists')).toBeInTheDocument()
    expect(screen.getByTestId('action-venues')).toBeInTheDocument()
    expect(screen.getByTestId('action-favorites')).toBeInTheDocument()
    expect(screen.getByTestId('action-enquiries')).toBeInTheDocument()
  })

  it('quick action cards link to correct pages', () => {
    renderPage()
    expect(screen.getByTestId('action-artists').closest('a')).toHaveAttribute(
      'href',
      '/artists'
    )
    expect(screen.getByTestId('action-venues').closest('a')).toHaveAttribute(
      'href',
      '/venues'
    )
    expect(screen.getByTestId('action-favorites').closest('a')).toHaveAttribute(
      'href',
      '/favorites'
    )
    expect(screen.getByTestId('action-enquiries').closest('a')).toHaveAttribute(
      'href',
      '/enquiries'
    )
  })

  it('shows recent favorites with entity names', () => {
    renderPage()
    const section = screen.getByTestId('recent-favorites')
    expect(section).toHaveTextContent('DJ Alpha')
    expect(section).toHaveTextContent('The Loft')
  })

  it('shows recent enquiries with entity name and status', () => {
    renderPage()
    const section = screen.getByTestId('recent-enquiries')
    expect(section).toHaveTextContent('DJ Alpha')
    expect(section).toHaveTextContent('PENDING')
  })

  it('shows getting started card when no activity', () => {
    mocks.useFavorites.mockReturnValue({
      data: { data: [], count: 0 },
      isLoading: false,
    })
    mocks.useSentEnquiries.mockReturnValue({
      data: [],
      isLoading: false,
    })
    renderPage()
    expect(screen.getByTestId('getting-started')).toBeInTheDocument()
  })

  it('hides getting started card when user has activity', () => {
    renderPage()
    expect(screen.queryByTestId('getting-started')).not.toBeInTheDocument()
  })
})
