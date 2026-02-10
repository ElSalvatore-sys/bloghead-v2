import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDebounce } from '../performance-utils'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('delays value update by specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated', delay: 300 })

    // Value should not update immediately
    expect(result.current).toBe('initial')

    // Fast-forward time by 299ms (just before delay)
    vi.advanceTimersByTime(299)
    expect(result.current).toBe('initial')

    // Fast-forward time by 1ms more (reaches delay)
    vi.advanceTimersByTime(1)

    waitFor(() => {
      expect(result.current).toBe('updated')
    })
  })

  it('uses default delay of 300ms when not specified', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated' })
    expect(result.current).toBe('initial')

    vi.advanceTimersByTime(300)

    waitFor(() => {
      expect(result.current).toBe('updated')
    })
  })

  it('cancels previous timeout when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    )

    expect(result.current).toBe('first')

    // Update value multiple times quickly
    rerender({ value: 'second' })
    vi.advanceTimersByTime(100)

    rerender({ value: 'third' })
    vi.advanceTimersByTime(100)

    rerender({ value: 'fourth' })
    vi.advanceTimersByTime(100)

    // Only the last value should be kept (previous timeouts canceled)
    expect(result.current).toBe('first')

    // After full delay from last update
    vi.advanceTimersByTime(200)

    waitFor(() => {
      expect(result.current).toBe('fourth')
    })
  })

  it('clears timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    const { rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'test' } }
    )

    rerender({ value: 'updated' })
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('works with different value types', () => {
    // Test with number
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 0 } }
    )

    numberRerender({ value: 42 })
    vi.advanceTimersByTime(100)

    waitFor(() => {
      expect(numberResult.current).toBe(42)
    })

    // Test with object
    const { result: objectResult, rerender: objectRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: { count: 0 } } }
    )

    const newObj = { count: 5 }
    objectRerender({ value: newObj })
    vi.advanceTimersByTime(100)

    waitFor(() => {
      expect(objectResult.current).toEqual(newObj)
    })
  })
})
