/**
 * Email preference validation schemas
 */

import { z } from 'zod'

export const emailPreferencesSchema = z.object({
  booking_emails: z.boolean(),
  message_emails: z.boolean(),
  marketing_emails: z.boolean(),
})

export type EmailPreferencesInput = z.infer<typeof emailPreferencesSchema>
