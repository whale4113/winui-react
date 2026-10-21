import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { categories, catalog, resources, type Entry } from "./fluent/catalog";
import { AdvancedDemo, FluentIcon, FluentInfoBar } from "./fluent/controls";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import { Switch } from "./components/ui/switch";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Slider } from "./components/ui/slider";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/sonner";
import "./styles.css";
import { desktop, windowAction, systemAccent, setMica, type AccentColors } from './desktop';
import { galleryReference } from './fluent/gallery-reference';
import { GalleryButton } from './fluent/gallery-button';
import { GalleryCheckBox } from './fluent/gallery-checkbox';

const categoryIcons = [
  "document",
  "add",
  "folder",
  "calendar",
  "info",
  "menu",
  "play",
  "more",
  "forward",
  "down",
  "info",
  "document",
  "color",
];
const limitations: Record<string, string> = {
  InkCanvas:
    "Canvas Pointer Events 实现绘制与压感，不调用 Windows Ink 原生服务。",
  InkToolbar: "Web 画笔、荧光笔、擦除、撤销与清除，不调用 InkPresenter。",
  TitleBar:
    "示例按钮仅操作示例窗口区域；系统窗口拖动和标题栏按钮需要原生宿主。",
  RevealBrush: "CSS 光照近似；未调用原生 Composition RevealBrush。",
  ItemsRepeater:
    "当前实现集合布局与项选择；尚未实现 WinUI 的虚拟化与布局测量协议。",
  ItemsView:
    "支持网格与多选；尚未实现 WinUI 的虚拟化、索引映射与全部选择策略。",
  TreeView: "支持层级、展开收起、单选、方向键、Home/End；尚未实现拖放和多选。",
  TableView: "支持列排序、全选及逐项选择；尚未实现列拖动、调整宽度和虚拟化。",
  TabView: "支持新增、关闭、切换与键盘导航；尚未实现拖出窗口与标签拖放。",
  DatePicker: "Web 日期字段与有效日期约束；尚未复刻原生滚轮惯性和非公历历法。",
  TimePicker: "Web 时间字段选择；尚未复刻原生滚轮惯性和全部区域格式。",
  CalendarView:
    "基于 react-day-picker；支持单日选择与月份导航，尚未实现 WinUI 的十年/年份选择面板。",
  CalendarDatePicker:
    "弹出日历与日期选择；日历层级导航仍受 react-day-picker 的实现边界约束。",
  ColorPicker:
    "提供色谱、RGBA 与 Hex 编辑；Web 光谱绘制与 WinUI 渲染引擎存在差异。",
  RefreshContainer: "提供异步刷新状态示例；尚未实现 WinUI 的下拉阻尼手势。",
  SwipeControl: "支持滑动阈值归档和撤销；尚未实现原生完整手势状态机。",
  MediaPlayerElement:
    "提供媒体传输控件的视觉与交互示例，使用本地生成的 WebM 视频与 HTMLVideoElement，不连接原生 MediaPlayer。",
  AnimatedVisualPlayer:
    "CSS 动画示例；不支持 WinUI IAnimatedVisualSource 或 Lottie 运行时协议。",
  AnimatedIcon: "CSS 状态动画；不支持 WinUI 的 AnimatedIconSource 状态图。",
  MicaBackdrop: "CSS 背景近似；浏览器无法读取桌面壁纸或调用系统 Mica 合成器。",
  AcrylicBrush:
    "CSS backdrop-filter、色调叠加近似；不调用 Windows Composition 的 AcrylicBrush。",
  RichEditBox:
    "Web contentEditable 与编辑命令，不实现 ITextDocument 全套原生文本服务。",
  LayoutPanel:
    "CSS 布局示例，不实现原生 VirtualizingLayout/NonVirtualizingLayout 协议。",
  RelativePanel:
    "CSS 定位与相邻关系示例，不实现原生 RelativePanel 的全部约束解析。",
  VariableSizedWrapGrid:
    "CSS Grid 跨行跨列布局，不实现 WinUI 原生面板测量算法。",
  MenuBar: "Base UI 菜单与键盘交互，系统菜单助记键行为未完整移植。",
};
Object.assign(limitations, {
  MediaTransportControls: limitations.MediaPlayerElement,
  DateTimePickerFlyout: limitations.DatePicker,
  GridViewItem: "支持项选择与视觉状态，未实现原生集合虚拟化与拖放协议。",
  ListViewItem: "支持单项选择与键盘移动，未实现原生集合虚拟化与拖放协议。",
});
function SourcePanel({ entry }: { entry: Entry }) {
  return (
    <div className="source-panel">
      <p>
        <strong>对照源码</strong>
      </p>
      <a
        href={
          "https://github.com/microsoft/microsoft-ui-xaml/blob/" +
          resources.referenceRevision +
          "/" +
          entry.source.replace("microsoft-ui-xaml/", "")
        }
        target="_blank"
        rel="noreferrer"
      >
        {entry.source.replace("microsoft-ui-xaml/", "")}
      </a>
      {!entry.hasThemeResource && (
        <p>此类型没有独立主题字典，使用共享资源或实现源码作为参考。</p>
      )}
      {Object.keys(entry.metrics).length > 0 && (
        <table>
          <thead>
            <tr>
              <th>XAML resource</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(entry.metrics)
              .slice(0, 24)
              .map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{String(value)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      <p>
        颜色取自本地 Common_themeresources_any.xaml；通过 npm run sync:winui
        可重新生成。
      </p>
    </div>
  );
}
function StateSamples({ name }: { name: string }) {
  if (
    ![
      "Button",
      "TextBox",
      "CheckBox",
      "ToggleSwitch",
      "RadioButton",
      "Slider",
    ].includes(name)
  )
    return null;
  return (
    <section className="state-section">
      <h2>Control states</h2>
      <p>Normal · PointerOver · Pressed · Disabled · Focused</p>
      <div className="state-grid">
        {["Normal", "PointerOver", "Pressed", "Disabled", "Focused"].map(
          (state, i) => (
            <div key={state}>
              <span>{state}</span>
              <div className={"state-preview state-" + state.toLowerCase()}>
                {name === "Button" ? (
                  <Button disabled={i === 3}>Button</Button>
                ) : name === "TextBox" ? (
                  <Input
                    disabled={i === 3}
                    placeholder="Text"
                    aria-label={state + " 文本框"}
                  />
                ) : name === "CheckBox" ? (
                  <Checkbox
                    disabled={i === 3}
                    defaultChecked
                    aria-label={state + " 复选框"}
                  />
                ) : name === "ToggleSwitch" ? (
                  <Switch
                    disabled={i === 3}
                    defaultChecked
                    aria-label={state + " 开关"}
                  />
                ) : name === "RadioButton" ? (
                  <RadioGroup defaultValue="on">
                    <RadioGroupItem
                      disabled={i === 3}
                      value="on"
                      aria-label={state + " 单选按钮"}
                    />
                  </RadioGroup>
                ) : (
                  <Slider
                    disabled={i === 3}
                    defaultValue={[45]}
                    aria-label={state + " 滑块"}
                  />
                )}
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
function ControlPage({
  entry,
  onNavigate,
}: {
  entry: Entry;
  onNavigate: (page: string) => void;
}) {
  const [tab, setTab] = useState("sample");
  const reference = galleryReference(entry.name);
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>{entry.name}</h1>
        </div>
        <div className="page-actions"><a
          className="doc-link"
          href={
            "https://learn.microsoft.com/windows/windows-app-sdk/api/winrt/" +
            entry.namespace.toLowerCase() +
            "." +
            entry.name.toLowerCase()
          }
          target="_blank"
          rel="noreferrer"
        >
          Documentation <FluentIcon name="forward" />
        </a>
        <a className="doc-link" href="https://github.com/microsoft/WinUI-Gallery" target="_blank" rel="noreferrer">Source <FluentIcon name="down" /></a></div>
      </div>
      <p className="control-description">{reference?.description || entry.description}</p>
      {entry.name === 'Button' ? <GalleryButton /> : entry.name === 'CheckBox' ? <GalleryCheckBox /> : <section className="sample-section" data-control={entry.name}>
        <h2>{reference?.examples[0]?.content?.match(/--- header\s+([^\r\n]+)/)?.[1] || `A simple ${entry.name}`}</h2>
        <div className="sample-frame">
          <div className="sample-stage">
            <AdvancedDemo name={entry.name} />
          </div>
          <div className="sample-tabs">
            <button
              className={tab === "sample" ? "active" : ""}
              onClick={() => setTab("sample")}
            >
              Example
            </button>
            <button
              className={tab === "source" ? "active" : ""}
              onClick={() => setTab("source")}
            >
              Source & resources
            </button>
            <span>{entry.namespace}</span>
          </div>
          {tab === "source" && <SourcePanel entry={entry} />}
        </div>
      </section>}
      <StateSamples name={entry.name} />
      {limitations[entry.name] && (
        <div className="implementation-boundary">
          <FluentIcon name="info" />
          <div>
            <strong>实现范围</strong>
            <p>{limitations[entry.name]}</p>
          </div>
        </div>
      )}
      <section className="related-controls">
        <h2>Related controls</h2>
        <div>
          {catalog
            .filter(
              (x) => x.category === entry.category && x.name !== entry.name,
            )
            .map((x) => (
              <button key={x.name} onClick={() => onNavigate(x.name)}>
                {x.name}
                <FluentIcon name="forward" />
              </button>
            ))}
        </div>
      </section>
    </>
  );
}
function App() {
  const initial = decodeURIComponent(location.hash.slice(1));
  const [page, setPage] = useState(initial || "Home"),
    [query, setQuery] = useState(""),
    [expanded, setExpanded] = useState<string[]>([]),
    [themeMode, setThemeMode] = useState<'system' | 'dark' | 'light'>(() => {
      const saved = localStorage.getItem('winui-theme-mode');
      return saved === 'dark' || saved === 'light' ? saved : 'system';
    }),
    [accent, setAccent] = useState(
      () => localStorage.getItem("winui-accent") || "default",
    ),
    [mobile, setMobile] = useState(false);
  const [systemColors, setSystemColors] = useState<AccentColors | null>(null);
  const [systemDark, setSystemDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches);
  const dark = themeMode === 'system' ? (systemColors ? systemColors.theme === 'dark' : systemDark) : themeMode === 'dark';
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemDark(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    let disposed = false;
    const refresh = () => { void systemAccent().then(colors => {
      if (!disposed) setSystemColors(old =>
        old?.theme === colors?.theme && old?.background === colors?.background && old?.foreground === colors?.foreground && old?.accent === colors?.accent && old?.light === colors?.light && old?.dark === colors?.dark ? old : colors);
    }).catch(error => console.warn('Cannot read Windows accent', error)); };
    refresh();
    window.addEventListener('focus', refresh);
    const timer = desktop ? window.setInterval(refresh, 2000) : undefined;
    return () => { disposed = true; window.removeEventListener('focus', refresh); window.clearInterval(timer); };
  }, []);
  function navigate(next: string) {
    setPage(next);
    setQuery("");
    setMobile(false);
    location.hash = encodeURIComponent(next);
    const cat = catalog.find((x) => x.name === next)?.category;
    if (cat) setExpanded((old) => (old.includes(cat) ? old : [...old, cat]));
    document.querySelector(".gallery-scroll")?.scrollTo(0, 0);
  }
  useEffect(() => {
    const change = () =>
      setPage(decodeURIComponent(location.hash.slice(1)) || "Home");
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    const shortcuts = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('.titlebar-search input')?.focus();
      }
      // Deterministic desktop capture traversal, enabled only for visual audit runs.
      if ((desktop || new URLSearchParams(location.search).has('visual-audit')) && event.ctrlKey && event.altKey && event.key === 'ArrowRight') {
        event.preventDefault();
        const index = catalog.findIndex(entry => entry.name === decodeURIComponent(location.hash.slice(1)));
        navigate(catalog[(index + 1) % catalog.length].name);
      }
    };
    window.addEventListener('keydown', shortcuts);
    return () => window.removeEventListener('keydown', shortcuts);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    void setMica(dark);
  }, [dark]);
  useEffect(() => { localStorage.setItem('winui-theme-mode', themeMode); }, [themeMode]);
  useEffect(() => {
    const color = accent === 'default' ? (dark ? systemColors?.light : systemColors?.dark) : accent;
    if (color) document.documentElement.style.setProperty('--win-accent', color);
    else document.documentElement.style.removeProperty('--win-accent');
    localStorage.setItem("winui-accent", accent);
  }, [accent, dark, systemColors]);
  const entry = catalog.find((x) => x.name === page),
    category = categories.find((x) => x.name === page),
    filtered = catalog.filter((x) =>
      (x.name + " " + x.category + " " + x.zh + " " + x.description)
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  const cards = (items: Entry[]) => (
    <div className="control-cards">
      {items.map((x) => (
        <button key={x.name} onClick={() => navigate(x.name)}>
          <span className="card-control-icon">
            {galleryReference(x.name)?.image ? <img src={galleryReference(x.name)!.image} alt="" /> : <FluentIcon
              name={
                categoryIcons[
                  categories.findIndex((c) => c.name === x.category)
                ] || "document"
              }
            />}
          </span>
          <div>
            <strong>{x.name}</strong>
            <p>{x.description}</p>
          </div>
          <FluentIcon name="forward" />
        </button>
      ))}
    </div>
  );
  return (
    <TooltipProvider>
      <div className="gallery">
        <header className="app-titlebar" data-tauri-drag-region>
          <button
            className="titlebar-back icon-btn"
            aria-label="后退"
            disabled={!location.hash}
            onClick={() => history.back()}
          >
            <FluentIcon name="back" />
          </button>
          <span className="win-logo">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span data-tauri-drag-region>WinUI Gallery</span>
          <div className="titlebar-search nav-search">
            <input aria-label="搜索组件" placeholder="Search controls and samples..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if(e.key === 'Enter' && filtered[0]) navigate(filtered[0].name); }} />
            <FluentIcon name="search" />
          </div>
          <div className="window-chrome">
            <button aria-label="最小化" disabled={!desktop} onClick={() => void windowAction('minimize')}>─</button>
            <button aria-label="最大化或还原" disabled={!desktop} onClick={() => void windowAction('toggleMaximize')}>□</button>
            <button aria-label="关闭窗口" disabled={!desktop} onClick={() => void windowAction('close')}>×</button>
          </div>
        </header>
        <aside className={"gallery-nav " + (mobile ? "nav-open" : "")}>
          <button
            className="nav-hamburger icon-btn"
            aria-label="切换导航"
            onClick={() => setMobile(!mobile)}
          >
            <FluentIcon name="menu" />
          </button>
          <div className="nav-search legacy-search" hidden>
            <input
              aria-label="侧栏搜索组件"
              placeholder="Search controls"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filtered[0])
                  navigate(filtered[0].name);
              }}
            />
            <FluentIcon name="search" />
          </div>
          <nav aria-label="控件导航">
            <button
              className={
                "gallery-nav-item " +
                (page === "Home" && !query ? "selected" : "")
              }
              onClick={() => navigate("Home")}
            >
              <FluentIcon name="home" />
              Home
            </button>
            <button
              className={
                "gallery-nav-item " +
                (page === "All controls" ? "selected" : "")
              }
              onClick={() => navigate("All controls")}
            >
              <FluentIcon name="document" />
              All controls
            </button>
            <div className="nav-divider" />
            {categories.slice(1).map((c, i) => (
              <div className="nav-category" key={c.name}>
                <button
                  className={
                    "gallery-nav-item " + (page === c.name ? "selected" : "")
                  }
                  onClick={() => {
                    setExpanded((old) =>
                      old.includes(c.name)
                        ? old.filter((n) => n !== c.name)
                        : [...old, c.name],
                    );
                    navigate(c.name);
                  }}
                >
                  <FluentIcon name={categoryIcons[i + 1]} />
                  <span>{c.name}</span>
                  <FluentIcon
                    name={expanded.includes(c.name) ? "down" : "forward"}
                  />
                </button>
                {expanded.includes(c.name) && (
                  <div className="nav-subitems">
                    {c.items.map((name) => (
                      <button
                        key={name}
                        className={page === name ? "selected" : ""}
                        onClick={() => navigate(name)}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="nav-footer">
            <button
              className={
                "gallery-nav-item " +
                (page === "Design resources" ? "selected" : "")
              }
              onClick={() => navigate("Design resources")}
            >
              <FluentIcon name="color" />
              Design resources
            </button>
            <button
              className={
                "gallery-nav-item " +
                (page === "Source inventory" ? "selected" : "")
              }
              onClick={() => navigate("Source inventory")}
            >
              <FluentIcon name="code" />
              Source inventory
            </button>
            <button
              className={
                "gallery-nav-item " + (page === "Settings" ? "selected" : "")
              }
              onClick={() => navigate("Settings")}
            >
              <FluentIcon name="settings" />
              Settings
            </button>
          </div>
        </aside>
        <div className={'gallery-main' + (entry ? ' control-detail' : '') + (page === 'Home' && !query ? ' home-detail' : '')}>
          <div className="gallery-toolbar">
            <button
              className="mobile-menu icon-btn"
              aria-label="打开导航"
              onClick={() => setMobile(!mobile)}
            >
              <FluentIcon name="menu" />
            </button>
            <div>
              {entry ? (
                <>
                  <button onClick={() => navigate(entry.category)}>
                    {entry.category}
                  </button>
                  <FluentIcon name="forward" />
                  <span>{entry.name}</span>
                </>
              ) : (
                <span>{query ? "Search results" : page}</span>
              )}
            </div>
            <button
              className="icon-btn"
              aria-label="切换深浅主题"
              onClick={() => setThemeMode(dark ? 'light' : 'dark')}
            >
              <FluentIcon name={dark ? "sun" : "moon"} />
            </button>
          </div>
          <div className="gallery-scroll">
            <main key={page}>
              {query ? (
                <>
                  <h1>Search results</h1>
                  <p className="page-subtitle">
                    {filtered.length} controls for “{query}”
                  </p>
                  {filtered.length ? (
                    cards(filtered)
                  ) : (
                    <div className="empty-search">
                      <FluentIcon name="search" />
                      <h2>未找到相关组件</h2>
                      <Button onClick={() => setQuery("")}>清除搜索</Button>
                    </div>
                  )}
                </>
              ) : entry ? (
                <ControlPage entry={entry} onNavigate={navigate} />
              ) : page === "Home" ? (
                <>
                  <div className="native-home-hero">
                    <p>Windows App SDK 2.5 (experimental)</p>
                    <h1>WinUI Gallery</h1>
                  </div>
                  <div className="home-resource-cards">
                    {[
                      ['Getting started', 'Get started with WinUI and explore detailed documentation.', 'All controls', 'code'],
                      ['Design', 'Guidelines and toolkits for creating stunning WinUI experiences.', 'Design resources', 'color'],
                      ['WinUI on GitHub', 'Explore the WinUI source code and repository.', 'Source inventory', 'folder'],
                    ].map(([title, description, target, icon]) => <button key={title} onClick={() => navigate(target)}><FluentIcon name={icon} /><strong>{title}</strong><p>{description}</p><FluentIcon name="forward" /></button>)}
                  </div>
                  <section className="home-samples">
                    <h2>Common controls</h2>
                    <div className="common-controls">
                      <div>
                        <label>Button</label>
                        <div className="demo-row">
                          <Button>Standard</Button>
                          <Button className="accent">Accent</Button>
                        </div>
                      </div>
                      <div>
                        <label>ToggleSwitch</label>
                        <div className="demo-row">
                          <Switch defaultChecked aria-label="主页开关" />
                          <span>On</span>
                        </div>
                      </div>
                      <div>
                        <label>TextBox</label>
                        <Input
                          placeholder="Enter text"
                          aria-label="主页文本输入"
                        />
                      </div>
                      <div>
                        <label>CheckBox</label>
                        <label className="control-label">
                          <Checkbox defaultChecked />
                          CheckBox
                        </label>
                      </div>
                    </div>
                  </section>
                  <h2>Control categories</h2>
                  <div className="category-cards">
                    {categories.slice(1).map((c, i) => (
                      <button key={c.name} onClick={() => navigate(c.name)}>
                        <FluentIcon name={categoryIcons[i + 1]} />
                        <strong>{c.name}</strong>
                        <p>{c.zh}</p>
                        <span>{c.items.length} controls</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : page === "Settings" ? (
                <>
                  <h1>Settings</h1>
                  <h2>Appearance</h2>
                  <div className="settings-row">
                    <div>
                      <strong>App theme</strong>
                      <p>系统当前主题：{systemColors?.theme ?? (systemDark ? 'dark' : 'light')}。默认跟随系统。</p>
                    </div>
                    <select
                      aria-label="应用主题"
                      value={themeMode}
                      onChange={(e) => setThemeMode(e.target.value as 'system' | 'light' | 'dark')}
                    >
                      <option value="system">System</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <div className="settings-row">
                    <div>
                      <strong>Accent color</strong>
                      <p>系统强调色：{systemColors?.accent ?? '—'}。默认跟随系统，并随深浅主题选择对应色阶。</p>
                    </div>
                    <div className="accent-swatches">
                      {["default", "#744da9", "#007f70", "#ad4b00"].map((x) => (
                        <button
                          key={x}
                          aria-label={"强调色 " + x}
                          aria-pressed={accent === x}
                          style={{
                            background: x === "default" ? (systemColors?.accent ?? "#0067c0") : x,
                          }}
                          onClick={() => setAccent(x)}
                        >
                          {accent === x && <FluentIcon name="check" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <h2>About</h2>
                  <p>React · shadcn/ui base-nova · Base UI</p>
                  <p>
                    Reference: local microsoft-ui-xaml resource dictionaries.
                  </p>
                </>
              ) : page === "Design resources" ? (
                <>
                  <h1>Design resources</h1>
                  <p className="page-subtitle">
                    从本地 XAML 直接生成的资源。当前：
                    {dark ? "Default (Dark)" : "Light"}。
                  </p>
                  <div className="resource-summary">
                    <strong>83 colors / theme</strong>
                    <span>Control corner radius: 4px</span>
                    <span>Overlay corner radius: 8px</span>
                    <span>Body: 14px / 20px</span>
                  </div>
                  <h2>Color resources</h2>
                  <div className="token-grid">
                    {Object.entries(
                      resources.themes[dark ? "Default" : "Light"],
                    ).map(([key, value]) => (
                      <div key={key}>
                        <span
                          className="token-swatch"
                          style={{ background: value }}
                        />
                        <div>
                          <strong>{key}</strong>
                          <code>{value}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                  <h2>Typography</h2>
                  <AdvancedDemo name="TextBlock" />
                </>
              ) : page === "Source inventory" ? (
                <>
                  <h1>Source inventory</h1>
                  <p className="page-subtitle">
                    本地 {resources.resources.length} 份主题字典与{" "}
                    {catalog.length} 个 Web 控件/布局/材质示例。
                  </p>
                  <FluentInfoBar title="对照标准" closable={false}>
                    资源值来自源码；示例页单独标注未移植的原生行为。
                  </FluentInfoBar>
                  <div className="source-inventory">
                    {resources.resources.map((r) => (
                      <details key={r.file}>
                        <summary>
                          {r.name}
                          <span>{r.variant} · {Object.keys(r.metrics).length} metrics</span>
                        </summary>
                        <code>{r.file}</code>
                        {Object.entries(r.metrics).map(([k, v]) => (
                          <div className="inventory-metric" key={k}>
                            <span>{k}</span>
                            <code>{v}</code>
                          </div>
                        ))}
                      </details>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h1>{page}</h1>
                  <p className="page-subtitle">
                    {category?.zh || "Controls"} ·{" "}
                    {page === "All controls"
                      ? catalog.length
                      : category?.items.length}{" "}
                    controls
                  </p>
                  {cards(
                    page === "All controls"
                      ? catalog
                      : catalog.filter((x) => x.category === page),
                  )}
                </>
              )}
            </main>
            <footer>
              <span>WinUI React Gallery</span>
              <span>Reference · microsoft-ui-xaml</span>
            </footer>
          </div>
        </div>
      </div>
      <Toaster theme={dark ? "dark" : "light"} richColors />
    </TooltipProvider>
  );
}
createRoot(document.getElementById("root")!).render(<App />);

