import { test, expect } from '@playwright/test';

test('Windows accent follows theme and refresh, while manual overrides persist', async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as any;
    w.isTauri = true;
    w.accent = { theme: 'light', background: '#ffffff', foreground: '#000000', accent: '#ab44bb', light: '#e4b5ef', dark: '#752080' };
    w.__TAURI_INTERNALS__ = { invoke: async (command: string) => {
      if (command === 'system_accent') return { ...w.accent };
      if (command === 'set_mica') return 2;
      throw new Error(command);
    } };
  });
  await page.goto('http://localhost:4173/#Settings');
  await expect(page.locator('html')).toHaveClass(/native-mica/);
  await expect(page.locator('html')).toHaveAttribute('data-native-backdrop', '2');
  const color = () => page.locator('html').evaluate(el => el.style.getPropertyValue('--win-accent'));
  await expect.poll(color).toBe('#752080');
  await page.evaluate(() => { (window as any).accent.theme = 'dark'; window.dispatchEvent(new Event('focus')); });
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect.poll(color).toBe('#e4b5ef');
  await page.evaluate(() => { (window as any).accent.theme = 'light'; window.dispatchEvent(new Event('focus')); });
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.getByRole('button', { name: '切换深浅主题' }).click();
  await expect.poll(color).toBe('#e4b5ef');
  await page.evaluate(() => { (window as any).accent.light = '#ffe0ff'; window.dispatchEvent(new Event('focus')); });
  await expect.poll(color).toBe('#ffe0ff');
  await page.getByRole('button', { name: '强调色 #007f70', exact: true }).click();
  await expect.poll(color).toBe('#007f70');
  await page.getByRole('button', { name: '切换深浅主题' }).click();
  await expect.poll(color).toBe('#007f70');
  await page.getByRole('button', { name: '强调色 default', exact: true }).click();
  await expect.poll(color).toBe('#752080');
  await page.getByRole('combobox', { name: '应用主题' }).selectOption('system');
  await page.evaluate(() => { (window as any).accent.theme = 'dark'; window.dispatchEvent(new Event('focus')); });
  await expect.poll(color).toBe('#ffe0ff');
  await page.reload();
  await expect(page.getByRole('combobox', { name: '应用主题' })).toHaveValue('system');
});

test('unsupported native backdrop keeps an opaque fallback', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).isTauri = true;
    (window as any).__TAURI_INTERNALS__ = { invoke: async () => { throw new Error('Unsupported'); } };
  });
  await page.goto('http://localhost:4173/');
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('html')).not.toHaveClass(/native-mica/);
  await expect(page.locator('body')).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});
