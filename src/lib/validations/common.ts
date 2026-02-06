/**
 * Common validation schemas and helpers
 * Shared validators used across multiple forms
 */

import { z } from 'zod'

/**
 * German phone number validation
 * Accepts +49 or 0 prefix formats
 */
export const germanPhoneSchema = z
  .string()
  .regex(
    /^(\+49|0)[1-9][0-9]{7,14}$/,
    'Please enter a valid German phone number'
  )
  .nullish()

/**
 * German postal code (5 digits)
 */
export const germanPostalCodeSchema = z
  .string()
  .regex(/^[0-9]{5}$/, 'Postal code must be 5 digits')
  .nullish()

/**
 * Email with normalization
 * Note: trim() before email() to handle whitespace
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Please enter a valid email address')

/**
 * Password with complexity requirements
 * Min 8 chars, at least one letter and one number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

/**
 * URL validation with better error message
 */
export const urlSchema = z
  .string()
  .url('Please enter a valid URL (e.g., https://example.com)')
  .nullish()

/**
 * Currency amount (Euro, max 2 decimal places)
 */
export const euroAmountSchema = z
  .number()
  .min(0, 'Amount must be positive')
  .multipleOf(0.01, 'Amount must have at most 2 decimal places')

/**
 * Date in YYYY-MM-DD format
 */
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')

/**
 * Future date validation
 */
export const futureDateSchema = dateSchema.refine(
  (date) => new Date(date) > new Date(),
  'Date must be in the future'
)

/**
 * UUID validation
 */
export const uuidSchema = z.string().uuid('Invalid ID format')

/**
 * Helper to create required string with field name
 */
export const requiredString = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, `${fieldName} is required`)

/**
 * Pagination params schema
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
})

export type PaginationInput = z.infer<typeof paginationSchema>
