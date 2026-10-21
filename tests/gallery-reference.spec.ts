import { test, expect } from '@playwright/test';

test('Gallery Button follows the upstream example and disable option', async ({ page }) => {
  await page.goto('http://localhost:4173/#Button');
  const button = page.getByRole('button', { name: 'Standard XAML button', exact: true });
  await button.click();
  await expect(page.locator('.native-example-output').first()).toContainText('You clicked: Button1');
  await expect(page.locator('.native-example-output').nth(1)).not.toContainText('Button1');
  await page.getByRole('button', { name: 'Pie', exact: true }).click();
  await expect(page.locator('.native-example-output').nth(1)).toContainText('You clicked: Button2');
  await expect(page.locator('.native-example-output').first()).toContainText('You clicked: Button1');
  await page.getByRole('checkbox', { name: 'Disable button', exact: true }).click();
  await expect(button).toBeDisabled();
  const source = page.locator('.native-source').first();
  await source.locator('summary').click();
  await expect(source.locator('pre')).toContainText('<Button Content="Standard XAML button"');
});

test('Gallery search opens the selected component from the title bar', async ({ page }) => {
  await page.goto('http://localhost:4173/');
  await page.getByRole('textbox', { name: '搜索组件', exact: true }).fill('ToggleSwitch');
  await page.getByRole('textbox', { name: '搜索组件', exact: true }).press('Enter');
  await expect(page.locator('main h1')).toHaveText('ToggleSwitch');
});

test('Gallery CheckBox cycles three states and synchronizes select all', async ({ page }) => {
  await page.goto('http://localhost:4173/#CheckBox');
  const three = page.getByRole('checkbox', {name:'Three-state CheckBox',exact:true});
  await three.click();
  await expect(three).toHaveAttribute('aria-checked','true');
  await three.click();
  await expect(three).toHaveAttribute('aria-checked','mixed');
  await three.click();
  await expect(three).toHaveAttribute('aria-checked','false');
  const all = page.getByRole('checkbox',{name:'Select all',exact:true});
  await expect(all).toHaveAttribute('aria-checked','mixed');
  await all.click();
  for (const name of ['Option 1','Option 2','Option 3']) await expect(page.getByRole('checkbox',{name,exact:true})).not.toBeChecked();
  await all.click();
  for (const name of ['Option 1','Option 2','Option 3']) await expect(page.getByRole('checkbox',{name,exact:true})).toBeChecked();
  await page.getByRole('checkbox',{name:'Option 1',exact:true}).click();
  await expect(all).toHaveAttribute('aria-checked','mixed');
});
