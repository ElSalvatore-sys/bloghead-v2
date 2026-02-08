import { test, expect } from './fixtures/test-fixtures'

test.describe('Booking & Discovery Pages', () => {
  test('artists page loads', async ({ authenticatedPage: page }) => {
    await page.getByTestId('sidebar-link-artists').click()
    await expect(page).toHaveURL(/\/artists/)

    // Page header should be visible on the artists page
    await expect(page.getByTestId('page-header')).toBeVisible({ timeout: 10000 })
  })

  test('venues page loads', async ({ authenticatedPage: page }) => {
    await page.getByTestId('sidebar-link-venues').click()
    await expect(page).toHaveURL(/\/venues/)

    await expect(page.getByTestId('page-header')).toBeVisible({ timeout: 10000 })
  })

  test('bookings page loads for authenticated user', async ({ authenticatedPage: page }) => {
    await page.getByTestId('sidebar-link-bookings').click()
    await expect(page).toHaveURL(/\/bookings/)

    await expect(page.getByTestId('bookings-page')).toBeVisible({ timeout: 10000 })
  })
})
