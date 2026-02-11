/**
 * HomePage tests
 */

import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomePage } from '../HomePage'

// Mock browser APIs
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  global.IntersectionObserver = class IntersectionObserver {
    root = null
    rootMargin = ''
    thresholds = []

    constructor(callback: IntersectionObserverCallback) {
      // Immediately call callback with mock entry
      setTimeout(() => {
        callback(
          [
            {
              isIntersecting: true,
              target: {} as Element,
              intersectionRatio: 1,
              boundingClientRect: {} as DOMRectReadOnly,
              intersectionRect: {} as DOMRectReadOnly,
              rootBounds: null,
              time: Date.now(),
            },
          ] as IntersectionObserverEntry[],
          this
        )
      }, 0)
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  } as any

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

// Mock auth context
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    profile: null,
    loading: false,
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('HomePage', () => {
  it(
    'renders without crashing',
    async () => {
      render(<HomePage />, { wrapper: createWrapper() })
      // Wait for lazy-loaded components
      await waitFor(
        () => {
          const headings = screen.getAllByRole('heading')
          expect(headings.length).toBeGreaterThan(0)
        },
        { timeout: 10000 }
      )
    },
    15000
  )

  it(
    'displays hero section with BLOGHEAD title',
    async () => {
      render(<HomePage />, { wrapper: createWrapper() })
      // Wait for lazy-loaded hero component with German text
      await waitFor(
        () => {
          const blogheadElements = screen.getAllByText(/BLOGHEAD/i)
          expect(blogheadElements.length).toBeGreaterThan(0)
        },
        { timeout: 10000 }
      )
    },
    15000
  )
})
