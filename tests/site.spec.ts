import { test, expect } from '@playwright/test';

const routes = ['/', '/about', '/portfolio', '/blog', '/resume', '/contact', '/success'];

const detailRoutes = ['/portfolio/streaming-lakehouse', '/blog/streaming-sla-playbook'];

test.describe('page rendering', () => {
  for (const route of [...routes, ...detailRoutes]) {
    test(`renders ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page.getByRole('main')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  }
});

test('mobile navigation toggles with keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 720 });
  await page.goto('/');

  const toggle = page.getByRole('button', { name: 'Menu' });
  const menuLinks = page.locator('[data-nav-menu] a');
  await expect(page.locator('[data-nav-menu]')).toHaveAttribute('aria-hidden', 'true');
  await expect(menuLinks.first()).toHaveAttribute('tabindex', '-1');
  await toggle.focus();
  await page.keyboard.press('Enter');

  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('[data-nav-menu]')).toHaveAttribute('aria-hidden', 'false');
  await expect(menuLinks.first()).not.toHaveAttribute('tabindex', '-1');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(menuLinks.first()).toHaveAttribute('tabindex', '-1');
});

test('theme toggle respects system setting and persists', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');

  await page.evaluate(() => localStorage.removeItem('theme'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  const toggle = page.getByRole('button', { name: /theme/i });
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('accessibility snapshot renders', async ({ page }) => {
  await page.goto('/');
  const snapshot = await page.accessibility.snapshot();
  expect(snapshot).toBeTruthy();
});

test('responsive layout has no horizontal overflow', async ({ page }) => {
  const sizes = [
    { width: 375, height: 720 },
    { width: 768, height: 900 },
    { width: 1280, height: 720 },
  ];

  for (const size of sizes) {
    await page.setViewportSize(size);
    await page.goto('/');
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 1;
    });
    expect(hasOverflow).toBeFalsy();
  }
});
