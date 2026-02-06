/**
 * Validation Schema Tests
 * Comprehensive tests for all Zod validation schemas
 */

import { describe, it, expect } from 'vitest'
import {
  germanPhoneSchema,
  germanPostalCodeSchema,
  emailSchema,
  passwordSchema,
  euroAmountSchema,
  dateSchema,
  futureDateSchema,
} from '../common'
import {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
} from '../auth'
import { vendorEnquirySchema } from '../vendor'
import { createArtistSchema } from '../artist'
import { createVenueSchema } from '../venue'
import { createWeddingSchema } from '../wedding'
import { createTaskSchema, createGuestSchema } from '../planning'

// ========== COMMON SCHEMAS ==========

describe('Common Schemas', () => {
  describe('germanPhoneSchema', () => {
    it('accepts valid German phone with +49 prefix', () => {
      const result = germanPhoneSchema.safeParse('+4915112345678')
      expect(result.success).toBe(true)
    })

    it('accepts valid German phone with 0 prefix', () => {
      const result = germanPhoneSchema.safeParse('015112345678')
      expect(result.success).toBe(true)
    })

    it('accepts null/undefined (nullish)', () => {
      expect(germanPhoneSchema.safeParse(null).success).toBe(true)
      expect(germanPhoneSchema.safeParse(undefined).success).toBe(true)
    })

    it('rejects too short numbers', () => {
      const result = germanPhoneSchema.safeParse('123')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Please enter a valid German phone number'
        )
      }
    })

    it('rejects non-German phone numbers', () => {
      const result = germanPhoneSchema.safeParse('+1555123456')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Please enter a valid German phone number'
        )
      }
    })
  })

  describe('germanPostalCodeSchema', () => {
    it('accepts valid 5-digit postal code', () => {
      expect(germanPostalCodeSchema.safeParse('65183').success).toBe(true)
      expect(germanPostalCodeSchema.safeParse('10115').success).toBe(true)
    })

    it('accepts null/undefined (nullish)', () => {
      expect(germanPostalCodeSchema.safeParse(null).success).toBe(true)
      expect(germanPostalCodeSchema.safeParse(undefined).success).toBe(true)
    })

    it('rejects 4-digit codes', () => {
      const result = germanPostalCodeSchema.safeParse('1234')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Postal code must be 5 digits')
      }
    })

    it('rejects 6-digit codes', () => {
      const result = germanPostalCodeSchema.safeParse('123456')
      expect(result.success).toBe(false)
    })

    it('rejects alpha characters', () => {
      const result = germanPostalCodeSchema.safeParse('ABCDE')
      expect(result.success).toBe(false)
    })
  })

  describe('emailSchema', () => {
    it('accepts valid email', () => {
      const result = emailSchema.safeParse('test@example.com')
      expect(result.success).toBe(true)
    })

    it('normalizes email to lowercase', () => {
      const result = emailSchema.safeParse('TEST@EXAMPLE.COM')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('test@example.com')
      }
    })

    it('trims whitespace', () => {
      const result = emailSchema.safeParse('  test@example.com  ')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('test@example.com')
      }
    })

    it('rejects invalid email', () => {
      const result = emailSchema.safeParse('invalid')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Please enter a valid email address'
        )
      }
    })

    it('rejects email without local part', () => {
      const result = emailSchema.safeParse('@no-local.com')
      expect(result.success).toBe(false)
    })
  })

  describe('passwordSchema', () => {
    it('accepts valid password with letter and number', () => {
      const result = passwordSchema.safeParse('Password1')
      expect(result.success).toBe(true)
    })

    it('rejects password under 8 characters', () => {
      const result = passwordSchema.safeParse('short')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Password must be at least 8 characters'
        )
      }
    })

    it('rejects password without letters', () => {
      const result = passwordSchema.safeParse('12345678')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes('letter'))).toBe(
          true
        )
      }
    })

    it('rejects password without numbers', () => {
      const result = passwordSchema.safeParse('NoNumber')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes('number'))).toBe(
          true
        )
      }
    })
  })

  describe('euroAmountSchema', () => {
    it('accepts positive whole numbers', () => {
      expect(euroAmountSchema.safeParse(100).success).toBe(true)
    })

    it('accepts amounts with 2 decimal places', () => {
      expect(euroAmountSchema.safeParse(99.99).success).toBe(true)
    })

    it('accepts zero', () => {
      expect(euroAmountSchema.safeParse(0).success).toBe(true)
    })

    it('rejects negative amounts', () => {
      const result = euroAmountSchema.safeParse(-1)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Amount must be positive')
      }
    })

    it('rejects more than 2 decimal places', () => {
      const result = euroAmountSchema.safeParse(100.999)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Amount must have at most 2 decimal places'
        )
      }
    })
  })

  describe('dateSchema', () => {
    it('accepts YYYY-MM-DD format', () => {
      expect(dateSchema.safeParse('2025-12-31').success).toBe(true)
    })

    it('rejects DD-MM-YYYY format', () => {
      const result = dateSchema.safeParse('31-12-2025')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Date must be in YYYY-MM-DD format'
        )
      }
    })

    it('rejects invalid string', () => {
      const result = dateSchema.safeParse('invalid')
      expect(result.success).toBe(false)
    })
  })

  describe('futureDateSchema', () => {
    it('accepts future date', () => {
      // Get tomorrow's date
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      const result = futureDateSchema.safeParse(tomorrowStr)
      expect(result.success).toBe(true)
    })

    it('rejects past date', () => {
      const result = futureDateSchema.safeParse('2020-01-01')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message.includes('future'))).toBe(
          true
        )
      }
    })
  })
})

// ========== AUTH SCHEMAS ==========

describe('Auth Schemas', () => {
  describe('loginSchema', () => {
    it('accepts valid login data', () => {
      const result = loginSchema.safeParse({
        email: 'a@b.com',
        password: 'x',
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid',
        password: 'password',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('signupSchema', () => {
    it('accepts valid signup data', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'Password1',
        confirmPassword: 'Password1',
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
      })
      expect(result.success).toBe(true)
    })

    it('rejects mismatched passwords', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'Password1',
        confirmPassword: 'Password2',
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Passwords do not match')
      }
    })

    it('rejects weak password', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'weak',
        confirmPassword: 'weak',
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('resetPasswordSchema', () => {
    it('accepts matching passwords', () => {
      const result = resetPasswordSchema.safeParse({
        password: 'NewPass123',
        confirmPassword: 'NewPass123',
      })
      expect(result.success).toBe(true)
    })

    it('rejects mismatched passwords', () => {
      const result = resetPasswordSchema.safeParse({
        password: 'NewPass123',
        confirmPassword: 'DifferentPass',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Passwords do not match')
      }
    })
  })
})

// ========== VENDOR ENQUIRY SCHEMA (CRITICAL) ==========

describe('Vendor Enquiry Schema', () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const validEnquiry = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+4915112345678',
    event_date: tomorrowStr,
    guest_count: 100,
    budget_range: '5000_10000' as const,
    message: 'We are looking for a DJ for our wedding party on the above date.',
    flexible_on_date: false,
  }

  it('accepts valid enquiry data', () => {
    const result = vendorEnquirySchema.safeParse(validEnquiry)
    expect(result.success).toBe(true)
  })

  describe('name field', () => {
    it('rejects empty name', () => {
      const result = vendorEnquirySchema.safeParse({
        ...validEnquiry,
        name: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects name over 100 chars', () => {
      const result = vendorEnquirySchema.safeParse({
        ...validEnquiry,
        name: 'a'.repeat(101),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('email field', () => {
    it('requires valid email', () => {
      const result = vendorEnquirySchema.safeParse({
        ...validEnquiry,
        email: 'invalid',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('phone field', () => {
    it('requires German phone format', () => {
      const result = vendorEnquirySchema.safeParse({
        ...validEnquiry,
        phone: '+1555123456',
      })
      expect(result.success).toBe(false)
    })

    it('allows null phone', () => {
      const result = vendorEnquirySchema.safeParse({
        ...validEnquiry,
        phone: null,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('event_date field', () => {
    it('requires future date', () => {
      const result = vendorEnquirySchema.safeParse({
        ...validEnquiry,
        event_date: '2020-01-01',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('guest_count field', () => {
    it('requires integer', () => {
      const result = vendorEnquirySchema.safeParse({
        ...validEnquiry,
        guest_count: 100.5,
      })
      expect(result.success).toBe(false)
    })

    it('requires at least 1', () => {
      const result = vendorEnquirySchema.safeParse({
        ...validEnquiry,
        guest_count: 0,
      })
      expect(result.success).toBe(false)
    })

    it('rejects over 10000', () => {
      const result = vendorEnquirySchema.safeParse({
        ...validEnquiry,
        guest_count: 10001,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('budget_range field', () => {
    it('accepts valid enum values', () => {
      const ranges = [
        'under_1000',
        '1000_2500',
        '2500_5000',
        '5000_10000',
        'over_10000',
      ]
      for (const range of ranges) {
        const result = vendorEnquirySchema.safeParse({
          ...validEnquiry,
          budget_range: range,
        })
        expect(result.success).toBe(true)
      }
    })

    it('rejects invalid budget range', () => {
      const result = vendorEnquirySchema.safeParse({
        ...validEnquiry,
        budget_range: 'invalid',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('message field', () => {
    it('requires at least 20 characters', () => {
      const result = vendorEnquirySchema.safeParse({
        ...validEnquiry,
        message: 'Too short',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 20')
      }
    })

    it('rejects over 2000 characters', () => {
      const result = vendorEnquirySchema.safeParse({
        ...validEnquiry,
        message: 'a'.repeat(2001),
      })
      expect(result.success).toBe(false)
    })
  })
})

// ========== OTHER SCHEMAS (COVERAGE) ==========

describe('Other Schemas', () => {
  describe('createArtistSchema', () => {
    it('requires stage_name min 2 chars', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'a',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2')
      }
    })

    it('accepts valid artist data', () => {
      const result = createArtistSchema.safeParse({
        stage_name: 'DJ Shadow',
        bio: 'Electronic music producer',
        years_experience: 10,
        hourly_rate: 150,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('createVenueSchema', () => {
    it('requires venue_name min 2 chars', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'a',
        type: 'BAR',
      })
      expect(result.success).toBe(false)
    })

    it('requires valid venue type enum', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Test Venue',
        type: 'INVALID',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid venue data', () => {
      const result = createVenueSchema.safeParse({
        venue_name: 'Grand Ballroom',
        type: 'EVENT_SPACE',
        capacity_min: 50,
        capacity_max: 500,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('createWeddingSchema', () => {
    it('requires partner names', () => {
      const result = createWeddingSchema.safeParse({
        partner1_name: '',
        partner2_name: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid wedding data', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      const result = createWeddingSchema.safeParse({
        partner1_name: 'Alice',
        partner2_name: 'Bob',
        wedding_date: tomorrowStr,
        guest_count_estimate: 150,
      })
      expect(result.success).toBe(true)
    })
  })

  describe('createTaskSchema', () => {
    it('requires title', () => {
      const result = createTaskSchema.safeParse({
        title: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid task data', () => {
      const result = createTaskSchema.safeParse({
        title: 'Book photographer',
        description: 'Research and book a wedding photographer',
        category: 'photography',
        priority: 'high',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('createGuestSchema', () => {
    it('requires first_name', () => {
      const result = createGuestSchema.safeParse({
        first_name: '',
        last_name: 'Doe',
      })
      expect(result.success).toBe(false)
    })

    it('requires last_name', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: '',
      })
      expect(result.success).toBe(false)
    })

    it('accepts valid guest data', () => {
      const result = createGuestSchema.safeParse({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        rsvp_status: 'pending',
        guest_type: 'bride_friend',
      })
      expect(result.success).toBe(true)
    })
  })
})
