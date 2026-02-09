/**
 * Enquiry validation schemas
 */

import { z } from 'zod'
import { requiredString, emailSchema } from './common'

export const enquiryTypeValues = ['BOOKING', 'PRICING', 'AVAILABILITY', 'GENERAL'] as const
export type EnquiryType = (typeof enquiryTypeValues)[number]

export const createEnquirySchema = z.object({
  entity_type: z.enum(['ARTIST', 'VENUE']),
  artist_id: z.string().uuid().optional(),
  venue_id: z.string().uuid().optional(),
  enquiry_type: z.enum(enquiryTypeValues).default('GENERAL'),
  name: requiredString('Name'),
  email: emailSchema,
  phone: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().nullish()
  ),
  message: requiredString('Message').max(2000, 'Message must be under 2000 characters'),
  event_date: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish()
  ),
})

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>
