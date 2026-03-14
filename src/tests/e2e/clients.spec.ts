import { test, expect } from '@playwright/test'

test('clients page loads', async ({ page }) => {
  await page.goto('/clients')
  await expect(page.getByRole('heading', { name: 'Clients', exact: true })).toBeVisible()
})
