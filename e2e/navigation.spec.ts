import { test, expect } from './fixtures/test-fixtures'

test.describe('Navigation', () => {
  test('sidebar links navigate to correct pages', async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible()

    // Navigate to Artists via sidebar
    await page.getByTestId('sidebar-link-artists').click()
    await expect(page).toHaveURL(/\/artists/)

    // Navigate to Venues
    await page.getByTestId('sidebar-link-venues').click()
    await expect(page).toHaveURL(/\/venues/)

    // Navigate to Bookings
    await page.getByTestId('sidebar-link-bookings').click()
    await expect(page).toHaveURL(/\/bookings/)

    // Navigate back to Dashboard
    await page.getByTestId('sidebar-link-dashboard').click()
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('dashboard shows all stat cards', async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId('stat-card-events')).toBeVisible()
    await expect(page.getByTestId('stat-card-artists')).toBeVisible()
    await expect(page.getByTestId('stat-card-venues')).toBeVisible()
    await expect(page.getByTestId('stat-card-messages')).toBeVisible()
  })

  test('header shows logo and user menu', async ({ authenticatedPage: page }) => {
    await expect(page.getByTestId('header')).toBeVisible()
    await expect(page.getByTestId('header-logo')).toBeVisible()
    await expect(page.getByTestId('header-user-menu')).toBeVisible()
  })

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/dashboard')

    await page.waitForURL('**/login', { timeout: 15000 })
    await expect(page).toHaveURL(/\/login/)
  })

  test('unknown route redirects to home', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz')

    await expect(page).toHaveURL('http://localhost:5173/')
  })
})
