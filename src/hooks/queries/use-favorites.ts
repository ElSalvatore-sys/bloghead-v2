/**
 * Favorites query and mutation hooks
 * Includes optimistic updates for instant "heart" feedback
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import {
  FavoriteService,
  type FavoriteWithVendor,
  type FavoriteType,
  type ArtistDiscoverResult,
  type VenueDiscoverResult,
} from '@/services'
import { showError } from '@/lib/toast'

/**
 * Query key factory for favorites
 */
export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
  list: (type?: FavoriteType) => [...favoriteKeys.lists(), type] as const,
  check: (vendorId: string, vendorType: FavoriteType) =>
    [...favoriteKeys.all, 'check', vendorId, vendorType] as const,
}

/**
 * Hook to get all favorites for the current user
 */
export function useFavorites(
  options?: Omit<
    UseQueryOptions<{ data: FavoriteWithVendor[]; count: number | null }, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: favoriteKeys.lists(),
    queryFn: () => FavoriteService.getFavorites(),
    ...options,
  })
}

/**
 * Hook to get favorites by type (VENUE or ARTIST)
 */
export function useFavoritesByType(
  favoriteType: FavoriteType,
  options?: Omit<
    UseQueryOptions<{ data: FavoriteWithVendor[]; count: number | null }, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: favoriteKeys.list(favoriteType),
    queryFn: () => FavoriteService.getFavoritesByType(favoriteType),
    ...options,
  })
}

/**
 * Hook to check if a vendor is favorited
 */
export function useIsFavorite(
  vendorId: string,
  vendorType: FavoriteType,
  options?: Omit<UseQueryOptions<boolean, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: favoriteKeys.check(vendorId, vendorType),
    queryFn: () => FavoriteService.checkIsFavorite(vendorId, vendorType),
    enabled: !!vendorId,
    ...options,
  })
}

/**
 * Hook to get enriched favorite artists (for card display)
 */
export function useFavoriteArtistsEnriched() {
  return useQuery<ArtistDiscoverResult[], Error>({
    queryKey: [...favoriteKeys.lists(), 'artists-enriched'] as const,
    queryFn: () => FavoriteService.getFavoriteArtistsEnriched(),
  })
}

/**
 * Hook to get enriched favorite venues (for card display)
 */
export function useFavoriteVenuesEnriched() {
  return useQuery<VenueDiscoverResult[], Error>({
    queryKey: [...favoriteKeys.lists(), 'venues-enriched'] as const,
    queryFn: () => FavoriteService.getFavoriteVenuesEnriched(),
  })
}

interface ToggleFavoriteParams {
  vendorId: string
  vendorType: FavoriteType
}

/**
 * Hook to toggle favorite status with OPTIMISTIC UPDATE
 * The heart icon updates instantly, rolls back on error
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vendorId, vendorType }: ToggleFavoriteParams) =>
      FavoriteService.toggleFavorite(vendorId, vendorType),

    // Optimistic update
    onMutate: async ({ vendorId, vendorType }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: favoriteKeys.check(vendorId, vendorType),
      })

      // Snapshot previous value
      const previousIsFavorite = queryClient.getQueryData<boolean>(
        favoriteKeys.check(vendorId, vendorType)
      )

      // Optimistically update the cache
      queryClient.setQueryData<boolean>(
        favoriteKeys.check(vendorId, vendorType),
        (old) => !old
      )

      // Return context with previous value
      return { previousIsFavorite, vendorId, vendorType }
    },

    // Rollback on error
    onError: (error, { vendorId, vendorType }, context) => {
      if (context?.previousIsFavorite !== undefined) {
        queryClient.setQueryData<boolean>(
          favoriteKeys.check(vendorId, vendorType),
          context.previousIsFavorite
        )
      }
      showError(error)
    },

    // Sync with server on settle
    onSettled: (_, __, { vendorId, vendorType }) => {
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.check(vendorId, vendorType),
      })
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.lists(),
      })
    },
  })
}

/**
 * Hook to add to favorites (non-toggle version)
 */
export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vendorId, vendorType }: ToggleFavoriteParams) =>
      FavoriteService.addFavorite(vendorId, vendorType),
    onSuccess: (_, { vendorId, vendorType }) => {
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.check(vendorId, vendorType),
      })
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.lists(),
      })
    },
    onError: (error) => {
      showError(error)
    },
  })
}

/**
 * Hook to remove from favorites (non-toggle version)
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vendorId, vendorType }: ToggleFavoriteParams) =>
      FavoriteService.removeFavorite(vendorId, vendorType),
    onSuccess: (_, { vendorId, vendorType }) => {
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.check(vendorId, vendorType),
      })
      queryClient.invalidateQueries({
        queryKey: favoriteKeys.lists(),
      })
    },
    onError: (error) => {
      showError(error)
    },
  })
}
