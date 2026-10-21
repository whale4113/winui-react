# Mica 与系统强调色：实现及视觉验证状态

## 最新原生验证（2026-10-21）

已补齐无边框客户区的 `DwmExtendFrameIntoClientArea(-1)` 和原生/WebView 透明底色，使用 window-vibrancy apply_mica 后读取 DWM 状态，当前机器返回 backdrop type 2（MainWindow/Mica）。系统截图 `../mica-system-dark.jpg` 与 `../mica-settings-dark.jpg` 已确认可见的深色 Mica 色调。

`../system-appearance.json` 是运行中 WebView 经真实 Tauri IPC 读取的结果：Windows 主题 dark，背景 #000000，前景 #ffffff，Accent #a94dc1，AccentLight2 #db9ee5，AccentDark1 #8e3aa7。默认 System 模式跟随 Windows，深色控件使用 #db9ee5；设置页显示系统原始强调色。每两秒和窗口获得焦点时刷新，手动 Light/Dark 仍可覆盖并切回 System。

以下历史记录中“尚无新 Mica 构建的有效截图”已由上述记录取代；105 个组件的全量状态视觉验收依然未完成。

本次已接入 window-vibrancy 0.8 的 apply_mica，窗口与 WebView 背景透明，主题切换同步原生 Mica 深浅模式。只有原生调用成功才启用透明 CSS；不支持时保留实色背景。Windows UISettings 读取 Accent、AccentLight2、AccentDark1，默认强调色按主题取色，每两秒和窗口获得焦点时刷新；手动覆盖保留。

## 已验证

- `cargo check --manifest-path src-tauri/Cargo.toml` 成功。
- `npm run desktop:build` 成功生成 Release exe。
- 全目录基础测试 9 项通过，包含 105 个组件的深浅主题渲染。它不是系统视觉验收。
- 修正后的针对性测试 5 项通过，包含 Windows 强调色主题选择、刷新、手动覆盖、Mica 失败回退、Button 独立输出及 CheckBox 三态/组合行为。
- 使用 Windows.Graphics.Capture 采集原版 Button、CheckBox、DropDownButton 的部分状态，包含页面滚动及独立菜单弹出层。带 maximized 的截图为 1536×816，早期截图为 1139×586，不允许混作整页配对。
- 系统交互确认并修复 CheckBox 的 mixed → unchecked → checked 全选行为；修复 Button 两个示例共用输出、输出未换行，以及底部缺少长文本布局示例。

## 尚未通过

105 个组件逐项、逐交互态的系统截图配对及视觉还原验收尚未完成。当前新增参考图片不能解释为视觉通过。旧 `../comparison` 不包含本次 Mica 构建，不能作为其验收结果。

新构建启动后窗口处于最小化状态，computer-use 激活及刷新恢复时反复返回 `user input was detected in this window; call get_window_state before continuing` 与 `window is minimized; call activate_window, refresh with get_window, then retry get_window_state`。一次恢复失败后停止输入，没有以其他窗口截图冒充宿主结果。因此，本次尚无新 Mica 构建与原版的有效配对差分；真实 Mica 外观、真实系统强调色和全部交互态仍需桌面复核。

## 继续采集

从 `sky.list_windows()` 唯一选择正确窗口，激活并读取截图后人工核对可见页面、主题、交互和滚动位置。使用 `scripts/capture-desktop.mjs` 的 `saveObservedState` 保存刚观察到的系统帧；它保存全部表面和元数据（包括菜单弹出层）。每次输入之后都重新观察，不能复用旧截图坐标。

参考与宿主必须具有相同主题、窗口尺寸、DPI、示例、滚动位置和交互状态。使用 `scripts/compare-system-captures.mjs` 输出原尺寸差分及并排图，逐项复核文字、布局、控件几何、背景、focus、hover、pressed、disabled、checked/mixed、展开及键盘操作等适用状态。缺少截图或未复核的项目保持 pending，不能自动标为通过。
