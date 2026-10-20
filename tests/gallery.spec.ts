import { test, expect } from "@playwright/test";
import { catalog, resources } from "../src/fluent/catalog";
const base = "http://localhost:4173/";
test("all catalog controls render with a visible example in both themes", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base);
  await expect(page.locator("main h1")).toHaveText("WinUI React Gallery");
  await page.screenshot({
    path: "test-results/fluent-home-light.png",
    fullPage: true,
  });
  for (const dark of [false, true]) {
    if (dark) await page.getByRole("button", { name: "切换深浅主题" }).click();
    for (const c of catalog) {
      await page.goto(base + "#" + encodeURIComponent(c.name));
      await expect(page.locator("main h1")).toHaveText(c.name);
      const stage = page.locator(".sample-stage");
      await expect(stage).toBeVisible();
      expect(
        await stage.evaluate((el) => el.childElementCount),
        c.name + " must not render an empty example",
      ).toBeGreaterThan(0);
      expect(
        await stage.evaluate((el) => el.getBoundingClientRect().height),
        c.name + " example has height",
      ).toBeGreaterThan(100);
    }
  }
  expect(errors).toEqual([]);
});
test("XAML metrics match browser dimensions and tokens", async ({ page }) => {
  await page.goto(base + "#ToggleSwitch");
  const sw = page.locator(".sample-stage [data-slot=switch]").first();
  await expect(sw).toHaveCSS("width", "40px");
  await expect(sw).toHaveCSS("height", "20px");
  await expect(sw.locator("[data-slot=switch-thumb]")).toHaveCSS(
    "width",
    "12px",
  );
  await page.goto(base + "#CheckBox");
  const check = resources.resources.find((r) => r.name === "CheckBox")!;
  await expect(
    page.locator(".sample-stage [data-slot=checkbox]").first(),
  ).toHaveCSS("width", check.metrics.CheckBoxSize + "px");
  await page.goto(base + "#RadioButton");
  await expect(
    page.locator(".sample-stage [data-slot=radio-group-item]").first(),
  ).toHaveCSS("width", "20px");
  await page.goto(base + "#Button");
  const button = page.locator(".sample-stage [data-slot=button]").first();
  await expect(button).toHaveCSS("font-size", "14px");
  await expect(button).toHaveCSS("border-radius", "4px");
  for (const dark of [false, true]) {
    if (dark) await page.getByRole("button", { name: "切换深浅主题" }).click();
    const colors = resources.themes[dark ? "Default" : "Light"];
    for (const [key, value] of Object.entries(colors)) {
      const actual = await page.locator("html").evaluate(
        (el, key) =>
          getComputedStyle(el)
            .getPropertyValue("--" + key)
            .trim(),
        key,
      );
      const normalize = (color: string) => {
        let c = color.toLowerCase().slice(1);
        if (c.length === 3 || c.length === 4)
          c = c
            .split("")
            .map((x) => x + x)
            .join("");
        if (c.length === 6) c += "ff";
        return c;
      };
      expect(
        normalize(actual),
        key + " must match source ARGB conversion",
      ).toBe(normalize(value));
    }
  }
  await page.goto(base + "#ContentDialog");
  await page.getByRole("button", { name: "打开对话框" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS("width", "548px");
  await expect(dialog.locator(".dialog-body")).toHaveCSS("padding", "24px");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
test("tree, tabs, auto suggestions, number field, calendar and table work", async ({
  page,
}) => {
  await page.goto(base + "#TreeView");
  const root = page.getByRole("treeitem", { name: "Project", exact: true });
  await root.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("treeitem", { name: "src", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("treeitem", { name: "App.tsx", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("treeitem", { name: "App.tsx", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.goto(base + "#TabView");
  const strip = await page.locator(".tab-strip").boundingBox();
  const panel = await page.getByRole("tabpanel").boundingBox();
  expect(strip!.y + strip!.height).toBeLessThanOrEqual(panel!.y + 1);
  await page.getByRole("button", { name: "添加标签页" }).click();
  await expect(page.getByRole("tab", { name: "Document 4" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("button", { name: "关闭 Document 4" }).click();
  await expect(page.getByRole("tab", { name: "Document 4" })).toHaveCount(0);
  await page.goto(base + "#AutoSuggestBox");
  await page.getByRole("combobox", { name: "查找控件" }).fill("Toggle");
  await expect(
    page.getByRole("option", { name: "ToggleSwitch" }),
  ).toBeVisible();
  await page.getByRole("combobox", { name: "查找控件" }).press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.locator(".sample-stage")).toContainText(
    "已选择：ToggleSwitch",
  );
  await page.goto(base + "#NumberBox");
  await page.getByRole("button", { name: "增加", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "数值" })).toHaveValue("26");
  await page.goto(base + "#CalendarDatePicker");
  await page.getByRole("button", { name: "选择日期" }).click();
  await expect(page.locator("[data-slot=calendar]")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goto(base + "#TableView");
  await page.getByRole("checkbox", { name: "选择所有文件" }).click();
  await expect(page.locator(".table-scroll small")).toHaveText("4 个已选择");
  await page.getByRole("button", { name: "名称" }).click();
  await expect(page.locator("thead th[aria-sort]")).toHaveAttribute(
    "aria-sort",
    "descending",
  );
});
test("search, persistence and mobile layout", async ({ page }) => {
  await page.goto(base);
  await page.getByRole("textbox", { name: "搜索组件" }).fill("not-a-control");
  await expect(
    page.getByRole("heading", { name: "未找到相关组件" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "清除搜索" }).click();
  await page.getByRole("button", { name: "切换深浅主题" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass("dark");
  await page.screenshot({
    path: "test-results/fluent-home-dark.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of [
    "Home",
    "Button",
    "ToggleSwitch",
    "TabView",
    "TreeView",
    "CalendarDatePicker",
    "TableView",
    "Settings",
    "All controls",
  ]) {
    await page.goto(base + "#" + encodeURIComponent(name));
    expect(
      await page
        .locator(".gallery-main")
        .evaluate((el) => el.scrollWidth - el.clientWidth),
      name + " must not overflow the main pane",
    ).toBeLessThanOrEqual(1);
  }
  await page.goto(base + "#Button");
  await page.screenshot({
    path: "test-results/fluent-button-mobile.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "打开导航" }).click();
  await expect(page.locator(".gallery-nav")).toHaveClass(/nav-open/);
});
test("reference screenshots and additional interactive controls", async ({
  page,
}) => {
  await page.goto(base + "#Button");
  for (const dark of [false, true]) {
    if (dark) await page.getByRole("button", { name: "切换深浅主题" }).click();
    for (const name of [
      "Button",
      "CheckBox",
      "ToggleSwitch",
      "TextBox",
      "RadioButton",
      "Slider",
      "TabView",
      "ColorPicker",
      "CalendarView",
    ]) {
      await page.goto(base + "#" + name);
      await page.locator("main").screenshot({
        path: `test-results/${name}-${dark ? "dark" : "light"}.png`,
      });
    }
  }
  await page.goto(base + "#RatingControl");
  await page.getByRole("radio", { name: "3 星" }).first().click();
  await expect(
    page.getByRole("radio", { name: "3 星" }).first(),
  ).toHaveAttribute("aria-checked", "true");
  await page.getByRole("radio", { name: "3 星" }).first().press("ArrowRight");
  await expect(
    page.getByRole("radio", { name: "4 星" }).first(),
  ).toHaveAttribute("aria-checked", "true");
  await page.goto(base + "#ColorPicker");
  await page.getByRole("button", { name: "More", exact: true }).click();
  await page.getByRole("textbox", { name: "十六进制颜色" }).fill("#ff0000");
  await page.getByRole("textbox", { name: "十六进制颜色" }).blur();
  await expect(page.getByRole("spinbutton", { name: "红色" })).toHaveValue(
    "255",
  );
  await expect(page.getByRole("spinbutton", { name: "绿色" })).toHaveValue("0");
  await page.goto(base + "#InkToolbar");
  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  await page.mouse.move(box!.x + 30, box!.y + 30);
  await page.mouse.down();
  await page.mouse.move(box!.x + 100, box!.y + 100, { steps: 8 });
  await page.mouse.up();
  await expect(
    page.getByRole("button", { name: "撤销", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "清除", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "撤销", exact: true }),
  ).toBeDisabled();
  await page.goto(base + "#MediaPlayerElement");
  await page.getByRole("button", { name: "播放", exact: true }).click();
  await expect(page.locator("video")).toHaveJSProperty("paused", false);
  await page.getByRole("button", { name: "暂停", exact: true }).click();
  await expect(page.locator("video")).toHaveJSProperty("paused", true);
  await page.goto(base + "#ComboBox");
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "English" }).click();
  await expect(page.getByRole("combobox")).toContainText("English");
});

test("collection selection follows keyboard focus and spectrum matches XAML layout", async ({
  page,
}) => {
  await page.goto(base + "#ListView");
  const first = page.getByRole("option", { name: "Documents" });
  await first.focus();
  await first.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Downloads" })).toBeFocused();
  await expect(page.getByRole("option", { name: "Downloads" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.goto(base + "#ColorPicker");
  await expect(page.locator(".spectrum-picker")).toHaveCSS("width", "312px");
  await expect(page.locator(".hsv-spectrum")).toHaveCSS("width", "256px");
  await expect(
    page.locator(".color-spectrum-grid .color-preview-checker"),
  ).toHaveCSS("width", "44px");
  await expect(page.locator(".color-spectrum-grid")).toHaveCSS("gap", "12px");
  await expect(page.getByRole("textbox", { name: "十六进制颜色" })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "More", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "十六进制颜色" })).toHaveValue(
    "#0067c0",
  );
  await page.getByRole("combobox", { name: "颜色表示" }).click();
  await page.getByRole("option", { name: "HSV", exact: true }).click();
  await expect(
    page.getByRole("spinbutton", { name: "色相", exact: true }),
  ).toBeVisible();
});
