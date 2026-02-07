import { describe, it, expect } from 'vitest'
import { emailPreferencesSchema } from '../email'

describe('emailPreferencesSchema', () => {
  it('accepts valid preferences with all booleans', () => {
    const result = emailPreferencesSchema.safeParse({
      booking_emails: true,
      message_emails: false,
      marketing_emails: false,
    })
    expect(result.success).toBe(true)
  })

  it('accepts all-true preferences', () => {
    const result = emailPreferencesSchema.safeParse({
      booking_emails: true,
      message_emails: true,
      marketing_emails: true,
    })
    expect(result.success).toBe(true)
  })

  it('accepts all-false preferences', () => {
    const result = emailPreferencesSchema.safeParse({
      booking_emails: false,
      message_emails: false,
      marketing_emails: false,
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing booking_emails', () => {
    const result = emailPreferencesSchema.safeParse({
      message_emails: true,
      marketing_emails: false,
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing message_emails', () => {
    const result = emailPreferencesSchema.safeParse({
      booking_emails: true,
      marketing_emails: false,
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing marketing_emails', () => {
    const result = emailPreferencesSchema.safeParse({
      booking_emails: true,
      message_emails: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-boolean values', () => {
    const result = emailPreferencesSchema.safeParse({
      booking_emails: 'yes',
      message_emails: 1,
      marketing_emails: null,
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty object', () => {
    const result = emailPreferencesSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
