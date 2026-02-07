/**
 * Email preference query and mutation hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { EmailService, type EmailPreferences } from '@/services/email'
import type { EmailPreferencesInput } from '@/lib/validations/email'
import { showSuccess, showError } from '@/lib/toast'

export const emailPreferenceKeys = {
  all: ['email-preferences'] as const,
  current: () => [...emailPreferenceKeys.all, 'current'] as const,
}

/**
 * Hook to get email preferences for the current user
 */
export function useEmailPreferences() {
  return useQuery<EmailPreferences | null, Error>({
    queryKey: emailPreferenceKeys.current(),
    queryFn: () => EmailService.getPreferences(),
  })
}

/**
 * Hook to update email preferences
 */
export function useUpdateEmailPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (prefs: Partial<EmailPreferencesInput>) =>
      EmailService.updatePreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emailPreferenceKeys.current(),
      })
      showSuccess('Email preferences updated')
    },
    onError: (error) => {
      showError(error)
    },
  })
}
