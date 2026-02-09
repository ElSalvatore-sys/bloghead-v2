/**
 * Discovery Hook Tests
 * Tests for useDiscoverArtists and useDiscoverVenues
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/helpers'

const mocks = vi.hoisted(() => ({
  discoverArtists: vi.fn(),
  discoverVenues: vi.fn(),
}))

vi.mock('@/services', () => ({
  ArtistService: { discover: mocks.discoverArtists },
  VenueService: { discover: mocks.discoverVenues },
}))

vi.mock('@/stores', () => ({
  useFilterStore: (selector?: (s: Record<string, unknown>) => unknown) => {
    const state = {
      searchQuery: '',
      categories: [] as string[],
      priceRange: null,
      location: { cityId: null, radius: 50 },
      venueTypes: [] as string[],
      amenityIds: [] as string[],
      sortBy: 'relevance',
      page: 1,
      pageSize: 20,
    }
    return selector ? selector(state) : state
  },
}))

import {
  useDiscoverArtists,
  useDiscoverVenues,
  discoveryKeys,
} from '../queries/use-discovery'

const wrapper = createWrapper()

beforeEach(() => {
  vi.clearAllMocks()
})

// ========== DISCOVERY KEYS ==========

describe('discoveryKeys', () => {
  it('generates base key', () => {
    expect(discoveryKeys.all).toEqual(['discovery'])
  })

  it('generates artists key with filters', () => {
    const filters = { searchQuery: 'test', page: 1 }
    const key = discoveryKeys.artists(filters)
    expect(key).toEqual(['discovery', 'artists', filters])
  })

  it('generates venues key with filters', () => {
    const filters = { sortBy: 'newest', page: 2 }
    const key = discoveryKeys.venues(filters)
    expect(key).toEqual(['discovery', 'venues', filters])
  })
})

// ========== USE DISCOVER ARTISTS ==========

describe('useDiscoverArtists', () => {
  it('calls ArtistService.discover and returns data', async () => {
    const mockData = {
      data: [
        {
          id: 'a1',
          stage_name: 'DJ Test',
          bio: null,
          hourly_rate: 100,
          years_experience: 5,
          has_equipment: true,
          primary_image_url: null,
          genre_names: ['House'],
        },
      ],
      count: 1,
    }
    mocks.discoverArtists.mockResolvedValue(mockData)

    const { result } = renderHook(() => useDiscoverArtists(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockData)
    expect(mocks.discoverArtists).toHaveBeenCalledWith({
      searchQuery: undefined,
      genreIds: undefined,
      priceMin: undefined,
      priceMax: undefined,
      sortBy: 'relevance',
      limit: 20,
      offset: 0,
    })
  })

  it('passes undefined for empty searchQuery', async () => {
    mocks.discoverArtists.mockResolvedValue({ data: [], count: 0 })

    const { result } = renderHook(() => useDiscoverArtists(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // searchQuery is '' which is falsy, so should pass undefined
    expect(mocks.discoverArtists).toHaveBeenCalledWith(
      expect.objectContaining({ searchQuery: undefined })
    )
  })

  it('passes undefined for empty categories', async () => {
    mocks.discoverArtists.mockResolvedValue({ data: [], count: 0 })

    const { result } = renderHook(() => useDiscoverArtists(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // categories is [] which has length 0, so should pass undefined for genreIds
    expect(mocks.discoverArtists).toHaveBeenCalledWith(
      expect.objectContaining({ genreIds: undefined })
    )
  })

  it('handles error from service', async () => {
    mocks.discoverArtists.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useDiscoverArtists(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Network error')
  })
})

// ========== USE DISCOVER VENUES ==========

describe('useDiscoverVenues', () => {
  it('calls VenueService.discover and returns data', async () => {
    const mockData = {
      data: [
        {
          id: 'v1',
          venue_name: 'Club Test',
          description: null,
          type: 'CLUB',
          city_name: 'Wiesbaden',
          street: null,
          capacity_min: 50,
          capacity_max: 200,
          primary_image_url: null,
          amenity_names: [],
        },
      ],
      count: 1,
    }
    mocks.discoverVenues.mockResolvedValue(mockData)

    const { result } = renderHook(() => useDiscoverVenues(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockData)
    expect(mocks.discoverVenues).toHaveBeenCalledWith({
      searchQuery: undefined,
      cityId: undefined,
      venueTypes: undefined,
      amenityIds: undefined,
      sortBy: 'relevance',
      limit: 20,
      offset: 0,
    })
  })

  it('passes undefined for null cityId', async () => {
    mocks.discoverVenues.mockResolvedValue({ data: [], count: 0 })

    const { result } = renderHook(() => useDiscoverVenues(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // location.cityId is null, so cityId should be undefined via ?? undefined
    expect(mocks.discoverVenues).toHaveBeenCalledWith(
      expect.objectContaining({ cityId: undefined })
    )
  })

  it('handles error from service', async () => {
    mocks.discoverVenues.mockRejectedValue(new Error('Server error'))

    const { result } = renderHook(() => useDiscoverVenues(), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Server error')
  })

  it('returns null count when service returns null', async () => {
    mocks.discoverVenues.mockResolvedValue({ data: [], count: null })

    const { result } = renderHook(() => useDiscoverVenues(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.count).toBeNull()
  })
})
