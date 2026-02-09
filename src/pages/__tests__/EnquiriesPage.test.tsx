import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@/test/helpers'
import type { EnquiryWithDetails } from '@/services'

const mocks = vi.hoisted(() => ({
  useSentEnquiries: vi.fn(),
  useReceivedEnquiries: vi.fn(),
  useAuth: vi.fn(),
}))

vi.mock('@/hooks/queries/use-enquiries', () => ({
  useSentEnquiries: mocks.useSentEnquiries,
  useReceivedEnquiries: mocks.useReceivedEnquiries,
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: mocks.useAuth,
}))

import { EnquiriesPage } from '../EnquiriesPage'

const mockEnquiries: EnquiryWithDetails[] = [
  {
    id: 'enq-1',
    sender_id: 'user-1',
    entity_type: 'ARTIST',
    artist_id: 'artist-1',
    venue_id: null,
    enquiry_type: 'BOOKING',
    status: 'PENDING',
    name: 'Test User',
    email: 'test@test.com',
    phone: null,
    message: 'I would like to book you for a private event this summer.',
    event_date: '2024-07-15',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    sender: { id: 'user-1', first_name: 'Test', last_name: 'User' },
    artists: { id: 'artist-1', stage_name: 'DJ Alpha' },
    venues: null,
  },
  {
    id: 'enq-2',
    sender_id: 'user-1',
    entity_type: 'VENUE',
    artist_id: null,
    venue_id: 'venue-1',
    enquiry_type: 'PRICING',
    status: 'RESPONDED',
    name: 'Test User',
    email: 'test@test.com',
    phone: '+49123456789',
    message: 'What are your rates for a Friday night?',
    event_date: null,
    created_at: '2024-01-14T08:00:00Z',
    updated_at: '2024-01-14T12:00:00Z',
    sender: { id: 'user-1', first_name: 'Test', last_name: 'User' },
    artists: null,
    venues: { id: 'venue-1', venue_name: 'Club Neon' },
  },
]

function renderPage(initialRoute = '/enquiries') {
  const queryClient = createQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <EnquiriesPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('EnquiriesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useAuth.mockReturnValue({
      profile: { role: 'USER' },
    })
  })

  it('renders page title and tabs', () => {
    mocks.useSentEnquiries.mockReturnValue({
      data: [],
      isLoading: false,
    })
    mocks.useReceivedEnquiries.mockReturnValue({
      data: [],
      isLoading: false,
    })

    renderPage()

    expect(screen.getByText('My Enquiries')).toBeInTheDocument()
    expect(screen.getByText('Track your messages to artists and venues')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Sent/i })).toBeInTheDocument()
  })

  it('shows loading skeletons', () => {
    mocks.useSentEnquiries.mockReturnValue({
      data: undefined,
      isLoading: true,
    })
    mocks.useReceivedEnquiries.mockReturnValue({
      data: undefined,
      isLoading: false,
    })

    const { container } = renderPage()

    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThanOrEqual(3)
  })

  it('shows empty state for sent tab', () => {
    mocks.useSentEnquiries.mockReturnValue({
      data: [],
      isLoading: false,
    })
    mocks.useReceivedEnquiries.mockReturnValue({
      data: [],
      isLoading: false,
    })

    renderPage()

    expect(screen.getByText('No enquiries sent yet')).toBeInTheDocument()
    expect(screen.getByText('Browse artists and venues to get started')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Discover Artists' })).toHaveAttribute(
      'href',
      '/artists'
    )
  })

  it('renders enquiry cards when data exists', () => {
    mocks.useSentEnquiries.mockReturnValue({
      data: mockEnquiries,
      isLoading: false,
    })
    mocks.useReceivedEnquiries.mockReturnValue({
      data: [],
      isLoading: false,
    })

    renderPage()

    expect(screen.getByText('DJ Alpha')).toBeInTheDocument()
    expect(screen.getByText('Club Neon')).toBeInTheDocument()
    expect(screen.getByText(/I would like to book you/)).toBeInTheDocument()
    expect(screen.getByText(/What are your rates/)).toBeInTheDocument()
  })

  it('shows correct status badges', () => {
    mocks.useSentEnquiries.mockReturnValue({
      data: [mockEnquiries[0]],
      isLoading: false,
    })
    mocks.useReceivedEnquiries.mockReturnValue({
      data: [],
      isLoading: false,
    })

    renderPage()

    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('shows correct enquiry type badges', () => {
    mocks.useSentEnquiries.mockReturnValue({
      data: [mockEnquiries[0]],
      isLoading: false,
    })
    mocks.useReceivedEnquiries.mockReturnValue({
      data: [],
      isLoading: false,
    })

    renderPage()

    expect(screen.getByText('Booking')).toBeInTheDocument()
  })
})
