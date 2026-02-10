/**
 * Performance optimization utilities
 *
 * Collection of utilities and patterns for improving React performance
 */

// Re-export existing useDebounce hook
export { useDebounce } from '@/hooks/use-debounce'

/**
 * Example: Using useDeferredValue for expensive filter rendering
 *
 * When you have expensive filter operations that block user input,
 * use React's useDeferredValue to defer the expensive computation:
 *
 * ```tsx
 * import { useDeferredValue, useMemo } from 'react'
 *
 * function FilterPanel({ filters, items }) {
 *   // Defer the filter value to prevent blocking input
 *   const deferredFilters = useDeferredValue(filters)
 *
 *   // Expensive filtering operation uses deferred value
 *   const filteredItems = useMemo(() => {
 *     return items.filter(item =>
 *       item.name.includes(deferredFilters.search) &&
 *       item.price >= deferredFilters.minPrice &&
 *       item.price <= deferredFilters.maxPrice
 *     )
 *   }, [items, deferredFilters])
 *
 *   // User can continue typing while filter re-renders in background
 *   return <ItemGrid items={filteredItems} />
 * }
 * ```
 *
 * Benefits:
 * - Input remains responsive during expensive filtering
 * - Filter results update after user finishes typing
 * - Better perceived performance for heavy computations
 *
 * When to use:
 * - Multi-field filter panels with large datasets
 * - Search results that trigger expensive filtering
 * - Any UI that blocks input during state updates
 */

/**
 * Best Practices for React Query Performance
 *
 * 1. Use staleTime to reduce unnecessary refetches:
 *    - queryClient defaults: { staleTime: 60000, gcTime: 300000 }
 *    - Override per query if needed
 *
 * 2. Use placeholderData for instant UI feedback:
 *    ```tsx
 *    const { data } = useQuery({
 *      queryKey: ['items', page],
 *      queryFn: () => fetchItems(page),
 *      placeholderData: keepPreviousData, // Keep old data while loading new
 *    })
 *    ```
 *
 * 3. Prefetch data on hover for instant navigation:
 *    ```tsx
 *    const queryClient = useQueryClient()
 *    const prefetchItem = (id: string) => {
 *      queryClient.prefetchQuery({
 *        queryKey: ['item', id],
 *        queryFn: () => fetchItem(id),
 *      })
 *    }
 *    <Link onMouseEnter={() => prefetchItem(id)}>...</Link>
 *    ```
 *
 * 4. Use select to transform data and prevent re-renders:
 *    ```tsx
 *    const { data: itemNames } = useQuery({
 *      queryKey: ['items'],
 *      queryFn: fetchItems,
 *      select: (items) => items.map(item => item.name), // Only re-render if names change
 *    })
 *    ```
 */

/**
 * Image Loading Best Practices
 *
 * 1. Use OptimizedImage component for all images:
 *    - Lazy loading by default
 *    - Priority loading for above-the-fold images
 *    - Error handling built-in
 *
 * 2. Preload critical images in index.html:
 *    ```html
 *    <link rel="preload" href="/hero.jpg" as="image" fetchpriority="high">
 *    ```
 *
 * 3. Use appropriate image formats:
 *    - WebP for photos (smaller file size)
 *    - PNG for logos/graphics with transparency
 *    - SVG for icons and simple graphics
 */
