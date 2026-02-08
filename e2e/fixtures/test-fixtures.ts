import { test as base, type Page } from '@playwright/test'

const TEST_EMAIL = process.env.E2E_TEST_USER_EMAIL || 'dev-user@test.com'
const TEST_PASSWORD = process.env.E2E_TEST_USER_PASSWORD || 'TestPassword123!'

type TestFixtures = {
  authenticatedPage: Page
}

export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login via the actual UI — this is the most reliable way to get
    // a fully authenticated session (Supabase client initializes properly).
    await page.goto('/login')
    await page.getByLabel('Email').fill(TEST_EMAIL)
    await page.getByLabel('Password').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Wait for dashboard to appear (successful auth redirect)
    await page.waitForSelector('[data-testid="dashboard"]', { timeout: 15000 })

    await use(page)
  },
})

export { expect } from '@playwright/test'
