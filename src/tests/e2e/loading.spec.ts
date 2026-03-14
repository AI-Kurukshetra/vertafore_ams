import { test, expect } from '@playwright/test'

test('no blank screen on login', async ({ page }) => {
  await page.goto('/login')
  const blank = await page.evaluate(() => document.body.innerHTML.trim().length === 0)
  expect(blank).toBe(false)
})
