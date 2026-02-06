/**
 * useZodForm Hook
 * Generic wrapper for React Hook Form with Zod validation
 */

import { useForm, type UseFormProps, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type z } from 'zod'

/**
 * useZodForm - React Hook Form with Zod validation pre-configured
 *
 * @param schema - Zod schema for validation
 * @param props - Optional React Hook Form props (excluding resolver)
 * @returns useForm return value with proper typing
 *
 * @example
 * ```tsx
 * const form = useZodForm(loginSchema, {
 *   defaultValues: { email: '', password: '' },
 * })
 *
 * <form onSubmit={form.handleSubmit(onSubmit)}>
 *   <input {...form.register('email')} />
 *   {form.formState.errors.email?.message}
 * </form>
 * ```
 */
export function useZodForm<TFormData extends FieldValues>(
  schema: z.ZodType<TFormData>,
  props?: Omit<UseFormProps<TFormData>, 'resolver'>
) {
  return useForm<TFormData>({
    // Cast needed for Zod v4 compatibility with @hookform/resolvers
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    mode: 'onBlur', // Validate on blur for better UX
    ...props,
  })
}

/**
 * Type helper to infer form data type from a Zod schema
 */
export type FormData<TSchema extends z.ZodType> = z.infer<TSchema>
