import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

const mocks = vi.hoisted(() => ({
  useIsFavorite: vi.fn(),
  useToggleFavorite: vi.fn(),
  useAuth: vi.fn(),
  toast: Object.assign(vi.fn(), { success: vi.fn() }),
}))

vi.mock('@/hooks/queries/use-favorites', () => ({
  useIsFavorite: mocks.useIsFavorite,
  useToggleFavorite: mocks.useToggleFavorite,
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: mocks.useAuth,
}))

vi.mock('sonner', () => ({
  toast: mocks.toast,
}))

import { FavoriteButton } from '../FavoriteButton'

describe('FavoriteButton', () => {
  const mutateMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useAuth.mockReturnValue({ user: { id: 'user-123' } })
    mocks.useToggleFavorite.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    })
  })

  it('renders heart outline when not favorited', () => {
    mocks.useIsFavorite.mockReturnValue({ data: false })

    render(<FavoriteButton vendorId="v-1" vendorType="ARTIST" />)

    const heart = screen.getByTestId('favorite-button').querySelector('svg')
    expect(heart).not.toHaveClass('fill-red-500')
  })

  it('renders filled red heart when favorited', () => {
    mocks.useIsFavorite.mockReturnValue({ data: true })

    render(<FavoriteButton vendorId="v-1" vendorType="ARTIST" />)

    const heart = screen.getByTestId('favorite-button').querySelector('svg')
    expect(heart).toHaveClass('fill-red-500')
    expect(heart).toHaveClass('text-red-500')
  })

  it('calls toggleFavorite on click', () => {
    mocks.useIsFavorite.mockReturnValue({ data: false })

    render(<FavoriteButton vendorId="v-1" vendorType="ARTIST" />)

    fireEvent.click(screen.getByTestId('favorite-button'))

    expect(mutateMock).toHaveBeenCalledWith(
      { vendorId: 'v-1', vendorType: 'ARTIST' },
      expect.objectContaining({ onSuccess: expect.any(Function) })
    )
  })

  it('stops event propagation on click', () => {
    mocks.useIsFavorite.mockReturnValue({ data: false })

    const parentHandler = vi.fn()

    render(
      <div onClick={parentHandler}>
        <FavoriteButton vendorId="v-1" vendorType="ARTIST" />
      </div>
    )

    fireEvent.click(screen.getByTestId('favorite-button'))

    expect(parentHandler).not.toHaveBeenCalled()
  })

  it('shows sign-in toast when not authenticated', () => {
    mocks.useAuth.mockReturnValue({ user: null })
    mocks.useIsFavorite.mockReturnValue({ data: false })

    render(<FavoriteButton vendorId="v-1" vendorType="ARTIST" />)

    fireEvent.click(screen.getByTestId('favorite-button'))

    expect(mocks.toast).toHaveBeenCalledWith('Sign in to save favorites')
    expect(mutateMock).not.toHaveBeenCalled()
  })

  it('renders correct sizes', () => {
    mocks.useIsFavorite.mockReturnValue({ data: false })

    const { rerender } = render(
      <FavoriteButton vendorId="v-1" vendorType="ARTIST" size="sm" />
    )

    let heart = screen.getByTestId('favorite-button').querySelector('svg')
    expect(heart).toHaveClass('h-4', 'w-4')

    rerender(
      <FavoriteButton vendorId="v-1" vendorType="ARTIST" size="lg" />
    )

    heart = screen.getByTestId('favorite-button').querySelector('svg')
    expect(heart).toHaveClass('h-6', 'w-6')
  })

  it('has correct aria-label for add/remove', () => {
    mocks.useIsFavorite.mockReturnValue({ data: false })

    const { rerender } = render(
      <FavoriteButton vendorId="v-1" vendorType="ARTIST" />
    )

    expect(screen.getByText('Add to favorites')).toBeInTheDocument()

    mocks.useIsFavorite.mockReturnValue({ data: true })
    rerender(<FavoriteButton vendorId="v-1" vendorType="ARTIST" />)

    expect(screen.getByText('Remove from favorites')).toBeInTheDocument()
  })
})
