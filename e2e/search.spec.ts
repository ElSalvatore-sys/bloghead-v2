import { test, expect } from './fixtures/test-fixtures'

// Helper: navigate to a path via client-side (React Router) without full page reload
async function navigateTo(page: import('@playwright/test').Page, path: string) {
  await page.evaluate((p) => {
    window.history.pushState({}, '', p)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, path)
}

test.describe('Search', () => {
  test('search page loads with input and filters', async ({ authenticatedPage: page }) => {
    await navigateTo(page, '/search')

    await expect(page.getByTestId('search-page')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('search-page-input')).toBeVisible()
    await expect(page.getByTestId('search-filters')).toBeVisible()
  })

  test('typing a query updates the URL', async ({ authenticatedPage: page }) => {
    await navigateTo(page, '/search')
    await expect(page.getByTestId('search-page')).toBeVisible({ timeout: 10000 })

    const searchInput = page.getByTestId('search-page-input')
    await searchInput.fill('jazz')

    // Debounced — wait for URL to update
    await expect(page).toHaveURL(/q=jazz/, { timeout: 5000 })
  })

  test('filter type buttons toggle correctly', async ({ authenticatedPage: page }) => {
    await navigateTo(page, '/search')

    await expect(page.getByTestId('filter-type-all')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('filter-type-artists')).toBeVisible()
    await expect(page.getByTestId('filter-type-venues')).toBeVisible()

    // Click Artists filter
    await page.getByTestId('filter-type-artists').click()
    await expect(page).toHaveURL(/type=artists/, { timeout: 5000 })

    // Click Venues filter
    await page.getByTestId('filter-type-venues').click()
    await expect(page).toHaveURL(/type=venues/, { timeout: 5000 })
  })
})
