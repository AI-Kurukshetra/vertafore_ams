import { Page } from '@playwright/test'

export const TEST_USER = {
  email: 'e2etest@vertafore-ams.com',
  password: 'TestPass123',
  fullName: 'E2E Test Agent',
}

export async function loginUser(page: Page) {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill(TEST_USER.email)
  await page.getByLabel(/password/i).fill(TEST_USER.password)
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL('/dashboard')
}
