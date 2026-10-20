# WinUI React Gallery

用 shadcn/ui `base-nova` / Base UI 构建的 React 组件源码与交互 Gallery。视觉基线为本地 `microsoft-ui-xaml` 的标准 XAML 主题模板，参考提交 `09cfc8ff3fbf556166dd813ae9b81646716f54bf`。

## 运行

```sh
npm install
npm run dev
npm test
```

开发预览默认运行于 http://localhost:5173。`npm test` 依次验证生成资源与源码一致、执行 TypeScript 检查和生产构建，再通过 Microsoft Edge 运行 Playwright。测试机器需要安装 Edge；测试会自动启动 4173 端口的生产预览。

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

截图输出在 `test-results/`。当前未安装原生 WinUI Gallery，因此未执行与原生控件截图的逐像素对比；不能据此声称完整原生等效或全量 WCAG 认证。

## 上游

- [microsoft-ui-xaml](https://github.com/microsoft/microsoft-ui-xaml)
- [shadcn/ui](https://ui.shadcn.com/)
- [Base UI](https://base-ui.com/)

微软资源和 shadcn/ui 生成源码遵循各自上游 MIT 许可。微软参考仓库的许可证与第三方声明仍保留在其目录。
