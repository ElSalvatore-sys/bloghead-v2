/**
 * Form Helper Tests
 * Tests for React Hook Form utility functions
 */

import { describe, it, expect, vi } from 'vitest'
import type { FieldError, FieldErrors, UseFormReturn } from 'react-hook-form'
import {
  getFormError,
  getFormErrors,
  isFormDirty,
  isFormSubmitting,
  isFormSubmitted,
  getFormStateSummary,
  setServerError,
  setServerErrors,
} from '../form-helpers'

// ========== GET FORM ERROR ==========

describe('getFormError', () => {
  it('returns message when error exists', () => {
    const error: FieldError = { type: 'required', message: 'Required' }
    expect(getFormError(error)).toBe('Required')
  })

  it('returns undefined when no error', () => {
    expect(getFormError(undefined)).toBe(undefined)
  })

  it('returns undefined when error has no message', () => {
    const error: FieldError = { type: 'required' }
    expect(getFormError(error)).toBe(undefined)
  })
})

// ========== GET FORM ERRORS ==========

describe('getFormErrors', () => {
  it('flattens errors to string map', () => {
    const errors: FieldErrors = {
      email: { type: 'invalid', message: 'Invalid email' },
      name: { type: 'required', message: 'Name required' },
    }

    const result = getFormErrors(errors)

    expect(result).toEqual({
      email: 'Invalid email',
      name: 'Name required',
    })
  })

  it('returns empty object when no errors', () => {
    const result = getFormErrors({})
    expect(result).toEqual({})
  })

  it('skips errors without message', () => {
    const errors: FieldErrors = {
      email: { type: 'invalid', message: 'Invalid email' },
      name: { type: 'required' }, // no message
    }

    const result = getFormErrors(errors)

    expect(result).toEqual({
      email: 'Invalid email',
    })
  })

  it('handles nested error objects', () => {
    const errors: FieldErrors = {
      email: { type: 'invalid', message: 'Invalid' },
    }

    const result = getFormErrors(errors)
    expect(result.email).toBe('Invalid')
  })
})

// ========== FORM STATE HELPERS ==========

describe('isFormDirty', () => {
  it('returns formState.isDirty', () => {
    const formState = {
      isDirty: true,
      isSubmitting: false,
      isSubmitSuccessful: false,
      isValid: true,
      errors: {},
    } as UseFormReturn['formState']

    expect(isFormDirty(formState)).toBe(true)

    formState.isDirty = false
    expect(isFormDirty(formState)).toBe(false)
  })
})

describe('isFormSubmitting', () => {
  it('returns formState.isSubmitting', () => {
    const formState = {
      isDirty: false,
      isSubmitting: true,
      isSubmitSuccessful: false,
      isValid: true,
      errors: {},
    } as UseFormReturn['formState']

    expect(isFormSubmitting(formState)).toBe(true)

    formState.isSubmitting = false
    expect(isFormSubmitting(formState)).toBe(false)
  })
})

describe('isFormSubmitted', () => {
  it('returns formState.isSubmitSuccessful', () => {
    const formState = {
      isDirty: false,
      isSubmitting: false,
      isSubmitSuccessful: true,
      isValid: true,
      errors: {},
    } as UseFormReturn['formState']

    expect(isFormSubmitted(formState)).toBe(true)

    formState.isSubmitSuccessful = false
    expect(isFormSubmitted(formState)).toBe(false)
  })
})

describe('getFormStateSummary', () => {
  it('returns correct summary object', () => {
    const formState = {
      isDirty: true,
      isSubmitting: false,
      isSubmitSuccessful: true,
      isValid: true,
      errors: { email: { type: 'invalid' } },
    } as unknown as UseFormReturn['formState']

    const summary = getFormStateSummary(formState)

    expect(summary).toEqual({
      isDirty: true,
      isSubmitting: false,
      isSubmitted: true,
      isValid: true,
      errorCount: 1,
    })
  })

  it('counts multiple errors correctly', () => {
    const formState = {
      isDirty: false,
      isSubmitting: false,
      isSubmitSuccessful: false,
      isValid: false,
      errors: {
        email: { type: 'invalid' },
        password: { type: 'required' },
        name: { type: 'too_small' },
      },
    } as unknown as UseFormReturn['formState']

    const summary = getFormStateSummary(formState)
    expect(summary.errorCount).toBe(3)
  })
})

// ========== SERVER ERROR HELPERS ==========

describe('setServerError', () => {
  it('calls form.setError() with type: server', () => {
    const mockSetError = vi.fn()
    const mockForm = {
      setError: mockSetError,
    } as unknown as UseFormReturn<{ email: string }>

    setServerError(mockForm, 'email', 'This email is already registered')

    expect(mockSetError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'This email is already registered',
    })
  })

  it('sets correct field and message', () => {
    const mockSetError = vi.fn()
    const mockForm = {
      setError: mockSetError,
    } as unknown as UseFormReturn<{ username: string }>

    setServerError(mockForm, 'username', 'Username taken')

    expect(mockSetError).toHaveBeenCalledTimes(1)
    expect(mockSetError).toHaveBeenCalledWith('username', {
      type: 'server',
      message: 'Username taken',
    })
  })
})

describe('setServerErrors', () => {
  it('sets multiple errors in batch', () => {
    const mockSetError = vi.fn()
    const mockForm = {
      setError: mockSetError,
    } as unknown as UseFormReturn<{ email: string; username: string }>

    setServerErrors(mockForm, {
      email: 'Already registered',
      username: 'Already taken',
    })

    expect(mockSetError).toHaveBeenCalledTimes(2)
    expect(mockSetError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'Already registered',
    })
    expect(mockSetError).toHaveBeenCalledWith('username', {
      type: 'server',
      message: 'Already taken',
    })
  })

  it('handles partial error objects', () => {
    const mockSetError = vi.fn()
    const mockForm = {
      setError: mockSetError,
    } as unknown as UseFormReturn<{ email: string; username: string }>

    setServerErrors(mockForm, {
      email: 'Already registered',
    })

    expect(mockSetError).toHaveBeenCalledTimes(1)
    expect(mockSetError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'Already registered',
    })
  })

  it('skips undefined/null values', () => {
    const mockSetError = vi.fn()
    const mockForm = {
      setError: mockSetError,
    } as unknown as UseFormReturn<{ email: string; username: string }>

    setServerErrors(mockForm, {
      email: 'Error',
      username: undefined as unknown as string,
    })

    expect(mockSetError).toHaveBeenCalledTimes(1)
    expect(mockSetError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'Error',
    })
  })
})
