# WinUI React Gallery

用 shadcn/ui `base-nova` / Base UI 构建的 React 组件源码与交互 Gallery。视觉基线为本地 `microsoft-ui-xaml` 的标准 XAML 主题模板，参考提交 `09cfc8ff3fbf556166dd813ae9b81646716f54bf`。

## 运行

```sh
npm install
npm run dev
npm test
npm run desktop:dev   # Tauri + WebView2 桌面应用
npm run desktop:build # 生成 Windows Release 可执行文件
```

开发预览默认运行于 http://localhost:5173。`npm test` 依次验证生成资源与源码一致、执行 TypeScript 检查和生产构建，再通过 Microsoft Edge 运行 Playwright。测试机器需要安装 Edge；测试会自动启动 4173 端口的生产预览。

Windows debug 宿主使用项目内 `.webview2-dev/main` 保存 WebView2 缓存和 localStorage，与 Release 的 AppData 配置隔离，避免开发/测试创建的目录权限或浏览器配置影响正常启动。可通过 `WEBVIEW2_USER_DATA_FOLDER` 显式覆盖；该变量指向的目录必须可写。Vite 不监听 WebView2 配置目录，避免 Cookies 文件锁引发 `EBUSY`。更改启动代码后，先关闭已有的 Gallery debug 进程，再重新运行 `npm run desktop:dev`，避免 Windows 锁定 exe 导致编译时报“拒绝访问”。

Vite 的依赖扫描入口固定为 `index.html`，不监听 `WinUI-Gallery`、`microsoft-ui-xaml`、桌面构建产物和系统截图目录。避免扫描大型参考仓库时服务器显示 ready 却无法返回页面，导致桌面窗口停留在空白页。`node scripts/verify-dev.mjs` 可对运行中的开发服务器检查真实页面渲染。

Windows 外观默认使用 System 模式：通过 UISettings 读取当前 dark/light、背景色、前景色及 Accent/AccentLight2/AccentDark1，并在系统设置变化后自动刷新。设置页可切换 System/Light/Dark 和查看原始系统强调色。Mica 使用 window-vibrancy，扩展到整个无边框客户区并设置透明底色；Windows 11 22H2 及以上读取 DWM backdrop type 2 确认启用，失败时保留实色背景。

## 对齐方式

- 从 `Common_themeresources_any.xaml` 自动提取每个主题 83 个颜色值，正确转换 XAML 的 ARGB 为 CSS RGBA。
- 以标准模板为控件实现基线，同时索引 125 份标准和 `perf2026` 主题字典，便于检查布局与主题资源。
- 对照控件正文 14px、按钮 4px 圆角、Checkbox/Radio 20px、ToggleSwitch 40×20px/12px 滑块、ContentDialog 最大宽度 548px/24px 内边距等定义实现。
- 使用 Windows 本机 Segoe UI Variable 与 Segoe Fluent Icons。其他平台字体回退会改变字形与文字测量结果。
- 控件页提供交互示例、相关控件与源码资源表；核心控件展示 Normal / PointerOver / Pressed / Disabled / Focused 状态。

```sh
npm run sync:winui   # 从本地微软参考源码重新生成主题与资源索引
npm run check:winui  # 检查生成文件没有偏离源码
node scripts/audit-winui.mjs # 生成完整组件/来源映射 COVERAGE.md
```

## 实现覆盖

当前有 **105 个可运行示例**，分为 12 类。包含基本输入、集合、日期时间、弹层、布局、媒体、工具栏菜单、导航、滚动、状态、文本、图标材质。参考源码中的独立主题控件均有对应示例；共享和兼容字典不计作控件。

详细对应关系与验证边界见 [COVERAGE.md](./COVERAGE.md)。示例覆盖不等于完整原生 API 覆盖，也不表示已经通过原生截图的逐像素差分验证。`perf2026` 字典是对照索引，未独立实现第二套模板。

重要差异在对应示例页的“实现范围”中显示，例如集合虚拟化与拖放、日期滚轮与多历法、系统 Mica/Acrylic 合成、Windows Ink/媒体/动画原生服务。WebView2、MapControl 和系统窗口管理需要原生宿主，本项目没有伪装成已经实现这些能力。

## 源码结构

- `src/components/ui/`：29 个 shadcn/ui Base UI 组件。
- `src/fluent/controls.tsx`：可组合 Fluent 控件和示例。
- `src/fluent/color-spectrum.tsx`：HSV 二维光谱、RGB/Hex/透明度联动。
- `src/fluent/navigation.tsx`：导航、面包屑与 TeachingTip。
- `src/fluent/additional.tsx`：Ink 画布、标题栏与调整手柄。
- `src/fluent/media-player.tsx`：HTML video 的播放、暂停、定位、静音和全屏。
- `src/fluent/catalog.ts`：分类、说明、命名空间和源码映射。
- `src/fluent/tokens.css` / `source-resources.json`：脚本生成的资源，不直接编辑。
- `src/styles.css`：依据 XAML 资源定义的控件样式、状态和 Gallery 布局。
- `src/index.ts`：可复用组件入口。
- `public/fluent-motion.webm`：通过 `scripts/generate-demo-media.mjs` 本地生成的视频素材。
- `tests/gallery.spec.ts`：全目录深浅主题渲染、资源和尺寸校验，以及关键交互测试。
- `microsoft-ui-xaml/`：原有微软参考仓库，未修改。

## 使用组件

```tsx
import { Button, FluentNumberBox, FluentTreeView } from './src'
import './src/styles.css'

<Button className="accent">保存</Button>
```

源码遵循本工程的 `@/` 路径别名；复制至其他工程时需要配置同样的别名。默认强调色为浅色 `#0067c0`、深色 `#60cdff`；也可设置 `--win-accent`。根元素的 `dark` 类控制主题。

## 验证

测试包含 105 个示例在深浅主题下渲染、166 个原始主题色值、关键 XAML 尺寸、树键盘导航、标签页增删、建议选择、数值步进、日历弹层、表格排序/全选、评分键盘交互、RGB/Hex 联动、Canvas 绘制与清除、真实视频播放，以及 390px 窄屏布局与主题持久化。

浏览器截图输出在 `test-results/catalog/light/` 和 `test-results/catalog/dark/`，覆盖 105 个现有 React 示例。这些截图用于浏览器渲染检查，不代替系统截图对照。

本机已安装原生 WinUI Gallery 3.0.4。系统截图证据存放于 `visual-evidence/native/` 和 `visual-evidence/tauri/`，通过 computer-use 的 Windows.Graphics.Capture 获取。具体已采集和缺失的控件见 [visual-evidence/STATUS.md](./visual-evidence/STATUS.md)；未采集或未复核的条目保持 pending，不声称全组件视觉通过。

```sh
node scripts/sync-gallery.mjs          # 索引本地 Gallery 的 126 个页面及示例来源
node scripts/audit-gallery-visuals.mjs # 刷新逐控件系统截图覆盖清单
node scripts/compare-system-captures.mjs native.jpg tauri.jpg output-directory crops.json
```

差分工具要求相同截图尺寸，或显式提供等尺寸裁剪区域 `{ "reference": { "left": 0, "top": 0, "width": 100, "height": 32 }, "candidate": { "left": 0, "top": 0, "width": 100, "height": 32 } }`。不会缩放图片；输出并排图、四倍增强差分图和误差数据。JPEG 噪声容差为 16/255，误差指标不自动代表通过。

桌面端使用真实窗口拖动、最小化、最大化/还原和关闭按钮。Release 文件位于 `src-tauri/target/release/winui-react-gallery.exe`。控件目录保持现有 105 个示例；目前仅 Button 和 CheckBox 按 Gallery 多示例结构单独移植，其余示例仍存在内容与原生行为差异。126 个上游页面还包含设计和基础知识页面，并不等于 126 个已移植控件。

## 上游

- [microsoft-ui-xaml](https://github.com/microsoft/microsoft-ui-xaml)
- [shadcn/ui](https://ui.shadcn.com/)
- [Base UI](https://base-ui.com/)

微软资源和 shadcn/ui 生成源码遵循各自上游 MIT 许可。微软参考仓库的许可证与第三方声明仍保留在其目录。
