/**
 * Enquiry query and mutation hooks
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  EnquiryService,
  type EnquiryWithDetails,
  type Enquiry,
  type EnquiryStatus,
} from '@/services'
import type { CreateEnquiryInput } from '@/lib/validations'
import { showSuccess, showError } from '@/lib/toast'

/**
 * Query key factory for enquiries
 */
export const enquiryKeys = {
  all: ['enquiries'] as const,
  lists: () => [...enquiryKeys.all, 'list'] as const,
  bySender: () => [...enquiryKeys.all, 'sender'] as const,
  forProvider: () => [...enquiryKeys.all, 'provider'] as const,
}

/**
 * Hook to get enquiries sent by the current user
 */
export function useSentEnquiries() {
  return useQuery<EnquiryWithDetails[], Error>({
    queryKey: enquiryKeys.bySender(),
    queryFn: () => EnquiryService.getBySender(),
  })
}

/**
 * Hook to get enquiries received as an artist/venue owner
 */
export function useReceivedEnquiries() {
  return useQuery<EnquiryWithDetails[], Error>({
    queryKey: enquiryKeys.forProvider(),
    queryFn: () => EnquiryService.getForProvider(),
  })
}

/**
 * Hook to create a new enquiry
 */
export function useCreateEnquiry() {
  const queryClient = useQueryClient()

  return useMutation<Enquiry, Error, CreateEnquiryInput>({
    mutationFn: (input) => EnquiryService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enquiryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: enquiryKeys.bySender() })
      showSuccess('Enquiry sent successfully!')
    },
    onError: (error) => {
      showError(error)
    },
  })
}

interface UpdateEnquiryStatusParams {
  id: string
  status: EnquiryStatus
}

/**
 * Hook to update enquiry status (provider action)
 */
export function useUpdateEnquiryStatus() {
  const queryClient = useQueryClient()

  return useMutation<Enquiry, Error, UpdateEnquiryStatusParams>({
    mutationFn: ({ id, status }) => EnquiryService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enquiryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: enquiryKeys.forProvider() })
    },
    onError: (error) => {
      showError(error)
    },
  })
}
