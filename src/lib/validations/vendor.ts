/**
 * Vendor validation schemas
 * Booking request form and review form
 */

import { z } from 'zod'
import { requiredString, futureDateSchema, uuidSchema } from './common'

/**
 * Booking request form schema
 * Matches the booking_requests table columns
 * artist_id, venue_id, requester_id are added at the service layer
 */
export const createBookingRequestSchema = z.object({
  title: requiredString('Event title').max(200, 'Title is too long'),
  event_date: futureDateSchema,
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
  description: z.string().max(2000, 'Description is too long').optional(),
  proposed_rate: z.number().min(0, 'Rate must be positive').max(999999).optional(),
})

/**
 * Vendor review schema
 */
export const vendorReviewSchema = z.object({
  vendor_id: uuidSchema,
  booking_id: uuidSchema.optional(),

  // Ratings (1-5)
  rating_overall: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  rating_quality: z.number().int().min(1).max(5).optional(),
  rating_communication: z.number().int().min(1).max(5).optional(),
  rating_value: z.number().int().min(1).max(5).optional(),

  // Review text
  title: requiredString('Review title').max(100, 'Title is too long'),
  body: requiredString('Review')
    .min(50, 'Please write at least 50 characters')
    .max(2000, 'Review is too long'),

  // Recommendation
  would_recommend: z.boolean(),

  // Verification
  verified_booking: z.boolean().default(false),
})

// Type exports
export type CreateBookingRequestInput = z.infer<typeof createBookingRequestSchema>
export type VendorReviewInput = z.infer<typeof vendorReviewSchema>
