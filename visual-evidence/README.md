# 系统截图验证记录

本轮结果是可运行的 Tauri 宿主、全目录采集和首批差分，**尚未完成 WinUI Gallery 的全量还原或全量原版视觉验收**。

- Windows Release 构建成功，使用系统 WebView2。
- 9 项自动化测试通过，包含 105 个示例在深浅主题下渲染和截图，以及 Button/CheckBox 原版示例交互。
- `tauri/`：105 个控件 × 两种主题，210 张完整主窗口系统截图及采集元数据。
- `native/`：已安装的 WinUI Gallery 3.0.4 的 Button、CheckBox 深色系统截图。
- `comparison/`：上述两个控件的指定区域并排图、差分图和数据，状态均为 `requires-review`。
- `inventory.json` / `STATUS.md`：逐项显示缺失参考和采集状态。已有截图不代表视觉通过。

所有 `native/` 和 `tauri/` 图片均通过 computer-use 的 Windows.Graphics.Capture 获取；浏览器截图仅位于 `test-results/catalog/`。采集器选择最大截图区域并拒绝小尺寸临时窗口。

原版窗口截图为 1139×586，当前 Tauri 窗口截图为 1442×864。因此目前只比较了显式裁剪的控件区域；没有缩放图片，也不能将该结果解释为整页布局通过。Button 裁剪为 164×32；CheckBox 连同标签为 180×32，具体原点见两个 `*-crops.json`。

差分发现示例区错误使用了 Card 背景资源，已依据 `WinUI-Gallery/WinUIGallery/Controls/ControlExample.xaml` 改为 `SolidBackgroundFillColorBase`。修正后仍有文字栅格化、边框和位置差异；当前噪声容差下的差异像素比例约为 Button 25.5%、CheckBox 22.2%，不满足像素一致性。原版 Mica 色调、页面内容、布局和更多交互仍需继续对齐。

可重复步骤：

1. `npm run desktop:build`。
2. `pwsh -NoProfile -File scripts/start-desktop-audit.ps1` 启动独立测试配置；普通用户直接运行 exe 使用默认用户配置。
3. 按 computer-use 技能初始化 `sky`，从 `list_windows` 唯一选择宿主窗口。
4. 在 `node_repl` 导入 `scripts/capture-desktop.mjs`。从 Home 开始，按目录分批调用 `captureNextBatch(sky, window, names, theme)`。使用预先定义的 Ctrl+Alt+Right 逐页导航，每页重新读取系统截图；先确认当前主题，主题切换后重新采集。
5. 原版参考需要逐页采集并与正确示例和状态配对，不能用浏览器截图或别的页面替代。
6. 使用 `compare-system-captures.mjs` 生成差分，然后运行 `audit-gallery-visuals.mjs` 和 `system-capture-contact-sheets.mjs` 更新清单与标题校验图。

`before/` 保留修正背景前的两个宿主截图。其旧裁剪坐标来自当时的另一窗口尺寸，不能直接用新坐标数值宣称改进百分比。
