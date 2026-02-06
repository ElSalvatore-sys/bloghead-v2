/**
 * Form Helper Utilities
 * Common helpers for working with React Hook Form
 */

import {
  type FieldErrors,
  type FieldValues,
  type UseFormReturn,
  type FieldError,
  type Path,
} from 'react-hook-form'

/**
 * Get error message from a field state
 *
 * @example
 * ```tsx
 * const error = getFormError(form.formState.errors.email)
 * // Returns: "Please enter a valid email" or undefined
 * ```
 */
export function getFormError(error: FieldError | undefined): string | undefined {
  return error?.message
}

/**
 * Get all current form errors as a flat object
 *
 * @example
 * ```tsx
 * const errors = getFormErrors(form.formState.errors)
 * // Returns: { email: "Required", password: "Too short" }
 * ```
 */
export function getFormErrors<T extends FieldValues>(
  errors: FieldErrors<T>
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const [key, value] of Object.entries(errors)) {
    if (value && typeof value === 'object' && 'message' in value) {
      const message = (value as FieldError).message
      if (message) {
        result[key] = message
      }
    }
  }

  return result
}

/**
 * Check if any field has been modified
 *
 * @example
 * ```tsx
 * const isDirty = isFormDirty(form.formState)
 * // Show "Unsaved changes" warning
 * ```
 */
export function isFormDirty<T extends FieldValues>(
  formState: UseFormReturn<T>['formState']
): boolean {
  return formState.isDirty
}

/**
 * Check if form is currently submitting
 */
export function isFormSubmitting<T extends FieldValues>(
  formState: UseFormReturn<T>['formState']
): boolean {
  return formState.isSubmitting
}

/**
 * Check if form has been successfully submitted
 */
export function isFormSubmitted<T extends FieldValues>(
  formState: UseFormReturn<T>['formState']
): boolean {
  return formState.isSubmitSuccessful
}

/**
 * Get form state summary for debugging/display
 */
export function getFormStateSummary<T extends FieldValues>(
  formState: UseFormReturn<T>['formState']
): {
  isDirty: boolean
  isSubmitting: boolean
  isSubmitted: boolean
  isValid: boolean
  errorCount: number
} {
  return {
    isDirty: formState.isDirty,
    isSubmitting: formState.isSubmitting,
    isSubmitted: formState.isSubmitSuccessful,
    isValid: formState.isValid,
    errorCount: Object.keys(formState.errors).length,
  }
}

/**
 * Reset form to specific default values
 *
 * @example
 * ```tsx
 * resetFormToDefaults(form, { email: 'new@example.com' })
 * ```
 */
export function resetFormToDefaults<T extends FieldValues>(
  form: UseFormReturn<T>,
  defaults: T
): void {
  form.reset(defaults)
}

/**
 * Clear a specific field's value and error
 */
export function clearField<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>
): void {
  form.setValue(fieldName, '' as T[typeof fieldName])
  form.clearErrors(fieldName)
}

/**
 * Set form error manually (for server-side validation errors)
 *
 * @example
 * ```tsx
 * setServerError(form, 'email', 'This email is already registered')
 * ```
 */
export function setServerError<T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldName: Path<T>,
  message: string
): void {
  form.setError(fieldName, {
    type: 'server',
    message,
  })
}

/**
 * Set multiple server errors at once
 *
 * @example
 * ```tsx
 * setServerErrors(form, {
 *   email: 'Already registered',
 *   username: 'Already taken',
 * })
 * ```
 */
export function setServerErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  errors: Partial<Record<Path<T>, string>>
): void {
  for (const [field, message] of Object.entries(errors)) {
    if (message) {
      form.setError(field as Path<T>, {
        type: 'server',
        message: message as string,
      })
    }
  }
}
