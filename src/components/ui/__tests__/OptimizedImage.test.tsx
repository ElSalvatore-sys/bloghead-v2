import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OptimizedImage } from '../OptimizedImage'

describe('OptimizedImage', () => {
  it('renders image with lazy loading by default', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />)

    const img = screen.getByRole('img', { name: 'Test image' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test.jpg')
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('decoding', 'async')
    expect(img).not.toHaveAttribute('fetchpriority')
  })

  it('renders image with eager loading when priority is true', () => {
    render(<OptimizedImage src="/hero.jpg" alt="Hero image" priority />)

    const img = screen.getByRole('img', { name: 'Hero image' })
    expect(img).toHaveAttribute('loading', 'eager')
    expect(img).toHaveAttribute('fetchpriority', 'high')
    expect(img).toHaveAttribute('decoding', 'async')
  })

  it('applies custom className to image', () => {
    render(
      <OptimizedImage
        src="/test.jpg"
        alt="Test image"
        className="custom-class w-full h-auto"
      />
    )

    const img = screen.getByRole('img')
    expect(img).toHaveClass('custom-class', 'w-full', 'h-auto')
  })

  it('shows default fallback UI on image error', () => {
    render(<OptimizedImage src="/broken.jpg" alt="Broken image" />)

    const img = screen.getByRole('img')
    fireEvent.error(img)

    // Should show fallback with SVG icon
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Failed to load image: Broken image')).toBeInTheDocument()
  })

  it('shows custom fallback UI on image error', () => {
    const customFallback = <div data-testid="custom-fallback">Custom Error</div>

    render(
      <OptimizedImage
        src="/broken.jpg"
        alt="Broken image"
        fallback={customFallback}
      />
    )

    const img = screen.getByRole('img')
    fireEvent.error(img)

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
    expect(screen.getByText('Custom Error')).toBeInTheDocument()
  })

  it('calls onError callback when image fails to load', () => {
    const onError = vi.fn()

    render(
      <OptimizedImage src="/broken.jpg" alt="Broken image" onError={onError} />
    )

    const img = screen.getByRole('img')
    fireEvent.error(img)

    expect(onError).toHaveBeenCalledTimes(1)
  })

  it('applies className to fallback container', () => {
    render(
      <OptimizedImage
        src="/broken.jpg"
        alt="Broken image"
        className="w-32 h-32 rounded-md"
      />
    )

    const img = screen.getByRole('img')
    fireEvent.error(img)

    const fallback = screen.getByLabelText('Failed to load image: Broken image')
    expect(fallback).toHaveClass('w-32', 'h-32', 'rounded-md')
  })
})
