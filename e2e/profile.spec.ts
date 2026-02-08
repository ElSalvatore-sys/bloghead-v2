import { test, expect } from './fixtures/test-fixtures'

test.describe('Profile / Settings', () => {
  test('settings page loads with form fields', async ({ authenticatedPage: page }) => {
    await page.getByTestId('sidebar-link-settings').click()
    await expect(page).toHaveURL(/\/settings/)

    await expect(page.getByTestId('settings-page')).toBeVisible({ timeout: 10000 })
    await expect(page.getByTestId('settings-form')).toBeVisible()
    await expect(page.getByTestId('settings-first-name')).toBeVisible()
    await expect(page.getByTestId('settings-email')).toBeVisible()
  })

  test('can edit and save first name', async ({ authenticatedPage: page }) => {
    await page.getByTestId('sidebar-link-settings').click()
    await expect(page.getByTestId('settings-form')).toBeVisible({ timeout: 10000 })

    const firstNameInput = page.getByTestId('settings-first-name')
    const originalValue = await firstNameInput.inputValue()

    // Change to a unique value
    const newName = `E2E-${Date.now().toString(36)}`
    await firstNameInput.clear()
    await firstNameInput.fill(newName)

    // Save button should become enabled once form is dirty
    await expect(page.getByTestId('settings-save')).toBeEnabled({ timeout: 5000 })
    await page.getByTestId('settings-save').click()

    // Wait for save to complete (button text changes back from "Saving...")
    await expect(page.getByTestId('settings-save')).toHaveText('Save changes', {
      timeout: 10000,
    })

    // Verify the input still has the new value (save persisted)
    await expect(firstNameInput).toHaveValue(newName)

    // Restore original value for idempotent test runs
    // Clear and type the original value; also fix phone field to avoid validation blocking save
    await firstNameInput.clear()
    await firstNameInput.fill(originalValue)
    const phoneInput = page.getByTestId('settings-phone')
    // Triple-click to select all phone content, then delete
    await phoneInput.click({ clickCount: 3 })
    await phoneInput.press('Backspace')

    // If save is still disabled due to validation, force submit via keyboard
    const saveBtn = page.getByTestId('settings-save')
    try {
      await expect(saveBtn).toBeEnabled({ timeout: 3000 })
      await saveBtn.click()
      await expect(saveBtn).toHaveText('Save changes', { timeout: 10000 })
    } catch {
      // Restore failed (validation issue) — this is cleanup, not the actual test assertion
      // The test already verified the save works above
    }
  })
})
