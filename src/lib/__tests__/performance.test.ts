import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reportWebVitals } from '../performance'

// Use vi.hoisted() to create mocks that survive hoisting
const mocks = vi.hoisted(() => ({
  mockOnCLS: vi.fn(),
  mockOnFCP: vi.fn(),
  mockOnLCP: vi.fn(),
  mockOnINP: vi.fn(),
  mockOnTTFB: vi.fn(),
}))

vi.mock('web-vitals', () => ({
  onCLS: mocks.mockOnCLS,
  onFCP: mocks.mockOnFCP,
  onLCP: mocks.mockOnLCP,
  onINP: mocks.mockOnINP,
  onTTFB: mocks.mockOnTTFB,
}))

describe('reportWebVitals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers handlers for all Core Web Vitals metrics', () => {
    reportWebVitals()

    expect(mocks.mockOnCLS).toHaveBeenCalledWith(expect.any(Function))
    expect(mocks.mockOnFCP).toHaveBeenCalledWith(expect.any(Function))
    expect(mocks.mockOnLCP).toHaveBeenCalledWith(expect.any(Function))
    expect(mocks.mockOnINP).toHaveBeenCalledWith(expect.any(Function))
    expect(mocks.mockOnTTFB).toHaveBeenCalledWith(expect.any(Function))
  })

  it('logs metrics to console when handlers are called', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    reportWebVitals()

    // Simulate a metric being reported
    const handler = mocks.mockOnCLS.mock.calls[0][0]
    const mockMetric = {
      name: 'CLS',
      value: 0.05,
      rating: 'good',
      delta: 0.05,
    }
    handler(mockMetric)

    expect(consoleSpy).toHaveBeenCalledWith('[Web Vitals] CLS:', {
      value: 0.05,
      rating: 'good',
      delta: 0.05,
    })

    consoleSpy.mockRestore()
  })

  it('can be called multiple times without errors', () => {
    expect(() => {
      reportWebVitals()
      reportWebVitals()
    }).not.toThrow()

    // Each call should register handlers
    expect(mocks.mockOnCLS).toHaveBeenCalledTimes(2)
    expect(mocks.mockOnFCP).toHaveBeenCalledTimes(2)
    expect(mocks.mockOnLCP).toHaveBeenCalledTimes(2)
    expect(mocks.mockOnINP).toHaveBeenCalledTimes(2)
    expect(mocks.mockOnTTFB).toHaveBeenCalledTimes(2)
  })
})
