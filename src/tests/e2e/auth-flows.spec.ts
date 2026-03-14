import { test, expect } from '@playwright/test'

test('login validation errors appear on empty submit', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: /sign in/i }).click()

  await expect(page.getByText('Email is required')).toBeVisible()
  await expect(page.getByText('Password is required')).toBeVisible()
})

test('register validation catches mismatched passwords', async ({ page }) => {
  await page.goto('/register')

  await page.getByLabel(/full name/i).fill('E2E Flow User')
  await page.getByLabel(/^email$/i).fill('e2e-flow-user@example.com')
  await page.getByLabel(/^password$/i).fill('Password1')
  await page.getByLabel(/confirm password/i).fill('Password2')
  await page.getByRole('button', { name: /create account/i }).click()

  await expect(page.getByText('Passwords do not match')).toBeVisible()
})

test('invalid login shows auth error message', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel(/email/i).fill(`missing-${Date.now()}@example.com`)
  await page.getByLabel(/password/i).fill('WrongPass123')
  await page.getByRole('button', { name: /sign in/i }).click()

  await expect(page.getByText(/Invalid email or password|Email not verified|Too many sign-in attempts/i)).toBeVisible()
})

test('auth callback without code redirects to login', async ({ page }) => {
  await page.goto('/auth/callback')
  await expect(page).toHaveURL(/\/login$/)
})

test('dashboard shows verification success banner from callback state', async ({ page }) => {
  await page.goto('/dashboard?auth=verified')
  await expect(page.getByText('Email verification successful. Your account is now active.')).toBeVisible()
})
