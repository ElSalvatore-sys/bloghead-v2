import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createQueryClient } from '@/test/helpers'

const mocks = vi.hoisted(() => ({
  useCreateEnquiry: vi.fn(),
  useAuth: vi.fn(),
  useZodForm: vi.fn(),
}))

vi.mock('@/hooks/queries', () => ({
  useCreateEnquiry: mocks.useCreateEnquiry,
}))

vi.mock('@/hooks/queries/use-enquiries', () => ({
  useCreateEnquiry: mocks.useCreateEnquiry,
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: mocks.useAuth,
}))

// Mock useZodForm to return a controllable form
vi.mock('@/lib/forms/use-zod-form', () => ({
  useZodForm: mocks.useZodForm,
}))

import { EnquiryModal } from '../EnquiryModal'

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  entityType: 'ARTIST' as const,
  entityId: 'artist-1',
  entityName: 'DJ Alpha',
}

function renderModal(props = {}) {
  const queryClient = createQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <EnquiryModal {...defaultProps} {...props} />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('EnquiryModal', () => {
  const mutateMock = vi.fn()
  let mockFormState: Record<string, any>
  let mockRegister: ReturnType<typeof vi.fn>
  let mockHandleSubmit: ReturnType<typeof vi.fn>
  let mockWatch: ReturnType<typeof vi.fn>
  let mockSetValue: ReturnType<typeof vi.fn>
  let mockReset: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    mocks.useAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@test.com' },
      profile: { first_name: 'Test', last_name: 'User', role: 'USER' },
    })

    mocks.useCreateEnquiry.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    })

    mockFormState = {
      errors: {},
    }

    mockRegister = vi.fn((name: string) => ({
      name,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    }))

    mockHandleSubmit = vi.fn((onValid) => (e: any) => {
      e?.preventDefault?.()
      onValid({
        entity_type: 'ARTIST',
        artist_id: 'artist-1',
        enquiry_type: 'GENERAL',
        name: 'Test User',
        email: 'test@test.com',
        message: 'Test message for the artist',
      })
    })

    mockWatch = vi.fn().mockReturnValue('GENERAL')
    mockSetValue = vi.fn()
    mockReset = vi.fn()

    mocks.useZodForm.mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      watch: mockWatch,
      setValue: mockSetValue,
      reset: mockReset,
      formState: mockFormState,
    })
  })

  it('renders modal with entity name', () => {
    renderModal()

    expect(screen.getAllByText('Send Enquiry').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Contact DJ Alpha/)).toBeInTheDocument()
  })

  it('renders all form fields', () => {
    renderModal()

    expect(screen.getByLabelText(/What is this about/)).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Event Date/)).toBeInTheDocument()
  })

  it('registers form fields with react hook form', () => {
    renderModal()

    expect(mockRegister).toHaveBeenCalledWith('name')
    expect(mockRegister).toHaveBeenCalledWith('email')
    expect(mockRegister).toHaveBeenCalledWith('phone')
    expect(mockRegister).toHaveBeenCalledWith('message')
    expect(mockRegister).toHaveBeenCalledWith('event_date')
  })

  it('shows validation error for message', () => {
    mockFormState.errors = {
      message: { message: 'Message is required' },
    }

    renderModal()

    expect(screen.getByText('Message is required')).toBeInTheDocument()
  })

  it('calls createEnquiry on valid submit', () => {
    renderModal()

    const submitButton = screen.getByTestId('enquiry-submit')
    fireEvent.click(submitButton)

    expect(mutateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        entity_type: 'ARTIST',
        artist_id: 'artist-1',
        name: 'Test User',
        email: 'test@test.com',
        message: 'Test message for the artist',
      }),
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    )
  })

  it('closes modal on successful submit', () => {
    const onOpenChange = vi.fn()
    renderModal({ onOpenChange })

    const submitButton = screen.getByTestId('enquiry-submit')
    fireEvent.click(submitButton)

    // Extract the onSuccess callback and call it
    const mutateCall = mutateMock.mock.calls[0]
    const options = mutateCall[1]
    options.onSuccess()

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('disables submit while loading', () => {
    mocks.useCreateEnquiry.mockReturnValue({
      mutate: mutateMock,
      isPending: true,
    })

    renderModal()

    const submitButton = screen.getByTestId('enquiry-submit')
    expect(submitButton).toBeDisabled()
  })
})
