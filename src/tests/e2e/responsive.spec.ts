import { test, expect } from '@playwright/test'

test.describe('Responsive mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('auth screen visible on mobile', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Sign in to your workspace')).toBeVisible()
  })
})
