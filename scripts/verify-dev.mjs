import { chromium, expect } from '@playwright/test';
const response = await fetch('http://localhost:5173/', { signal: AbortSignal.timeout(10000) });
if (!response.ok) throw new Error(`Development server returned ${response.status}`);
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://localhost:5173/#Button', { timeout: 15000 });
  await expect(page.locator('main h1')).toHaveText('Button');
  await page.getByRole('button', { name: 'Standard XAML button', exact: true }).click();
  await expect(page.locator('.native-example-output').first()).toContainText('You clicked: Button1');
  await page.locator('.wrapping-buttons').scrollIntoViewIfNeeded();
  await expect(page.locator('.wrapping-buttons')).toBeVisible();
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'test-results/dev-preview.png' });
  console.log('Development server, page rendering, Button interaction and scrolling passed.');
} finally {
  await browser.close();
}
