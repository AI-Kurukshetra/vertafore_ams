import { test, expect } from '@playwright/test'

test('policies page loads', async ({ page }) => {
  await page.goto('/policies')
  await expect(page.getByRole('heading', { name: 'Policies', exact: true })).toBeVisible()
})
