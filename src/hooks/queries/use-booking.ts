/**
 * Booking query and mutation hooks
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  BookingService,
  type BookingWithDetails,
  type BookingDetail,
  type BookingStatus,
} from '@/services'
import type { CreateBookingRequestInput } from '@/lib/validations'
import { showSuccess, showError } from '@/lib/toast'

/**
 * Query key factory for bookings
 */
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  byUser: () => [...bookingKeys.all, 'user'] as const,
  forProvider: () => [...bookingKeys.all, 'provider'] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
}

/**
 * Hook to get bookings sent by the current user
 */
export function useUserBookings() {
  return useQuery<BookingWithDetails[], Error>({
    queryKey: bookingKeys.byUser(),
    queryFn: () => BookingService.getByUser(),
  })
}

/**
 * Hook to get bookings received as an artist/venue owner
 */
export function useProviderBookings() {
  return useQuery<BookingWithDetails[], Error>({
    queryKey: bookingKeys.forProvider(),
    queryFn: () => BookingService.getForProvider(),
  })
}

/**
 * Hook to get a single booking with details
 */
export function useBooking(id: string) {
  return useQuery<BookingDetail, Error>({
    queryKey: bookingKeys.detail(id),
    queryFn: () => BookingService.getById(id),
    enabled: !!id,
  })
}

interface CreateBookingParams {
  input: CreateBookingRequestInput
  artistId: string
  venueId: string
}

/**
 * Hook to create a new booking request
 */
export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ input, artistId, venueId }: CreateBookingParams) =>
      BookingService.create(input, artistId, venueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bookingKeys.byUser() })
      showSuccess('Booking request sent!')
    },
    onError: (error) => {
      showError(error)
    },
  })
}

interface UpdateStatusParams {
  id: string
  status: BookingStatus
  note?: string
}

/**
 * Hook to update booking status (accept/decline/cancel)
 */
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status, note }: UpdateStatusParams) =>
      BookingService.updateStatus(id, status, note),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bookingKeys.byUser() })
      queryClient.invalidateQueries({ queryKey: bookingKeys.forProvider() })
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(data.id) })

      const statusMessages: Record<BookingStatus, string> = {
        PENDING: 'Booking status updated',
        ACCEPTED: 'Booking accepted!',
        DECLINED: 'Booking declined',
        CANCELLED: 'Booking cancelled',
        COMPLETED: 'Booking marked as completed',
      }
      showSuccess(statusMessages[data.status])
    },
    onError: (error) => {
      showError(error)
    },
  })
}
