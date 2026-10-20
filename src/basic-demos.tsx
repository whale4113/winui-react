import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search,
  Home,
  MousePointer2,
  TextCursorInput,
  ListChecks,
  PanelLeft,
  Layers,
  Table2,
  Bell,
  Palette,
  Moon,
  Sun,
  ChevronRight,
  ArrowUpRight,
  Copy,
  Check,
  Settings,
  Accessibility,
  Code2,
  Menu,
  X,
  Minus,
  Square,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";



import { catalog } from './fluent/catalog';
const all=catalog.map(c=>c.name);
export function BasicDemo({ name }: { name: string }) {
  const [on, setOn] = useState(false),
    [value, setValue] = useState(""),
    [count, setCount] = useState(10),
    [date, setDate] = useState<Date | undefined>(new Date()),
    [selected, setSelected] = useState("设计资源");
  const menu = (
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => toast.success("已新建文件")}>
        新建文件
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => toast.success("已复制链接")}>
        复制链接
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => toast("已归档")}>归档</DropdownMenuItem>
    </DropdownMenuContent>
  );
  switch (name) {
    case "Button":
      return (
        <div className="demo-row">
          <Button onClick={() => toast.success("操作成功")}>标准按钮</Button>
          <Button
            className="accent"
            onClick={() => toast.success("更改已保存")}
          >
            强调按钮
          </Button>
          <Button variant="ghost" onClick={() => toast("这是一条提示")}>
            低强调按钮
          </Button>
          <Button disabled>禁用按钮</Button>
        </div>
      );
    case "HyperlinkButton":
      return (
        <a
          className="link"
          href="https://learn.microsoft.com/windows/apps/design/"
          target="_blank"
          rel="noreferrer"
        >
          探索 Windows 设计 <ArrowUpRight size={15} />
        </a>
      );
    case "ToggleButton":
      return (
        <Button
          aria-pressed={on}
          className={on ? "accent" : ""}
          onClick={() => setOn(!on)}
        >
          {on ? <Check size={16} /> : <Copy size={16} />}{" "}
          {on ? "已选中" : "选择此项"}
        </Button>
      );
    case "DropDownButton":
    case "MenuFlyout":
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button />}>
            文件操作 <ChevronRight size={14} className="rotate-90" />
          </DropdownMenuTrigger>
          {menu}
        </DropdownMenu>
      );
    case "SplitButton":
      return (
        <div className="split">
          <Button
            className="accent"
            onClick={() => toast.success("已创建项目")}
          >
            创建项目
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button className="accent" aria-label="更多创建选项" />}
            >
              <ChevronRight size={14} className="rotate-90" />
            </DropdownMenuTrigger>
            {menu}
          </DropdownMenu>
        </div>
      );
    case "TextBox":
      return (
        <div className="field">
          <label htmlFor="name-input">显示名称</label>
          <Input
            id="name-input"
            placeholder="输入你的名字"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <small>
            {value ? `你好，${value}` : "这个名称将显示在你的个人资料中。"}
          </small>
        </div>
      );
    case "PasswordBox":
      return (
        <div className="field">
          <label htmlFor="password-input">密码</label>
          <Input
            id="password-input"
            type="password"
            placeholder="输入密码"
            autoComplete="new-password"
          />
        </div>
      );
    case "AutoSuggestBox":
      return (
        <div className="field">
          <label htmlFor="suggest">查找组件</label>
          <Input
            id="suggest"
            list="suggestions"
            placeholder="尝试输入 Button"
          />
          <datalist id="suggestions">
            {all.map((x) => (
              <option key={x} value={x} />
            ))}
          </datalist>
        </div>
      );
    case "NumberBox":
      return (
        <div className="field">
          <label htmlFor="number">数量</label>
          <div className="demo-row">
            <Button
              aria-label="减少"
              onClick={() => setCount(Math.max(0, count - 1))}
            >
              −
            </Button>
            <Input
              id="number"
              className="number"
              type="number"
              min="0"
              value={count}
              onChange={(e) => setCount(Math.max(0, Number(e.target.value)))}
            />
            <Button aria-label="增加" onClick={() => setCount(count + 1)}>
              ＋
            </Button>
          </div>
        </div>
      );
    case "TextArea":
      return (
        <div className="field">
          <label htmlFor="bio">个人简介</label>
          <Textarea
            id="bio"
            placeholder="介绍一下你自己…"
            maxLength={200}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <small>{value.length} / 200</small>
        </div>
      );
    case "CheckBox":
      return (
        <div className="stack">
          <label className="control-label">
            <Checkbox defaultChecked /> 接收产品更新
          </label>
          <label className="control-label">
            <Checkbox /> 接收每周设计灵感
          </label>
          <label className="control-label muted">
            <Checkbox disabled /> 此选项不可用
          </label>
        </div>
      );
    case "RadioButtons":
      return (
        <RadioGroup defaultValue="recommended">
          <label className="control-label">
            <RadioGroupItem value="recommended" /> 推荐设置
          </label>
          <label className="control-label">
            <RadioGroupItem value="custom" /> 自定义设置
          </label>
          <label className="control-label">
            <RadioGroupItem value="minimal" /> 最简设置
          </label>
        </RadioGroup>
      );
    case "ToggleSwitch":
      return (
        <div className="demo-row">
          <Switch checked={on} onCheckedChange={setOn} aria-label="开启通知" />
          <span>{on ? "通知已开启" : "通知已关闭"}</span>
        </div>
      );
    case "ComboBox":
      return (
        <Select
          defaultValue="zh"
          items={{ zh: "简体中文", en: "English", ja: "日本語" }}
        >
          <SelectTrigger className="w-64" aria-label="选择语言">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh">简体中文</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ja">日本語</SelectItem>
          </SelectContent>
        </Select>
      );
    case "Slider":
      return (
        <div className="field">
          <label>音量 · {count}%</label>
          <Slider
            value={[count]}
            onValueChange={(v) => setCount(Array.isArray(v) ? v[0] : v)}
            max={100}
            aria-label="音量"
          />
        </div>
      );
    case "CalendarDatePicker":
      return (
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      );
    case "TabView":
    case "Pivot":
      return (
        <Tabs defaultValue="design" className="w-full">
          <TabsList>
            <TabsTrigger value="design">设计</TabsTrigger>
            <TabsTrigger value="develop">开发</TabsTrigger>
            <TabsTrigger value="publish">发布</TabsTrigger>
          </TabsList>
          <TabsContent value="design" className="tab-body">
            从一致的设计语言开始，构建令人熟悉的体验。
          </TabsContent>
          <TabsContent value="develop" className="tab-body">
            组合 Base UI 组件，构建可访问的 React 界面。
          </TabsContent>
          <TabsContent value="publish" className="tab-body">
            运行 npm run build 生成生产版本。
          </TabsContent>
        </Tabs>
      );
    case "NavigationView":
      return (
        <div className="mini-nav">
          {["主页", "文档", "收藏", "设置"].map((x, i) => (
            <button
              className={selected === x ? "active" : ""}
              key={x}
              onClick={() => setSelected(x)}
            >
              {i === 3 ? <Settings size={17} /> : <PanelLeft size={17} />} {x}
            </button>
          ))}
          <p>当前页面：{selected}</p>
        </div>
      );
    case "BreadcrumbBar":
      return (
        <nav className="demo-row" aria-label="面包屑">
          {["主页", "设计资源", "组件"].map((x, i) => (
            <React.Fragment key={x}>
              {i > 0 && <ChevronRight size={14} />}
              <button className="link" onClick={() => setSelected(x)}>
                {x}
              </button>
            </React.Fragment>
          ))}
          <small>当前：{selected}</small>
        </nav>
      );
    case "Expander":
    case "TreeView":
      return (
        <Accordion className="w-full">
          {(name === "TreeView"
            ? ["项目 / src", "components / ui", "设计资源"]
            : ["个性化设置", "隐私与安全", "高级选项"]
          ).map((x) => (
            <AccordionItem value={x} key={x}>
              <AccordionTrigger>{x}</AccordionTrigger>
              <AccordionContent>
                {name === "TreeView" ? (
                  <div className="stack">
                    <span>▧ index.tsx</span>
                    <span>▧ styles.css</span>
                  </div>
                ) : (
                  <label className="control-label">
                    <Switch defaultChecked /> 启用此功能
                  </label>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
    case "ContentDialog":
      return (
        <Dialog>
          <DialogTrigger render={<Button />}>打开对话框</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>保存你的更改？</DialogTitle>
              <DialogDescription>
                你的工作区设置已更改。保存后会立即应用到当前项目。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button />}>取消</DialogClose>
              <DialogClose
                render={
                  <Button
                    className="accent"
                    onClick={() => toast.success("更改已保存")}
                  />
                }
              >
                保存更改
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    case "Flyout":
    case "TeachingTip":
      return (
        <Popover>
          <PopoverTrigger render={<Button />}>
            {name === "Flyout" ? "打开浮层" : "查看使用提示"}
          </PopoverTrigger>
          <PopoverContent>
            <strong>让灵感触手可及</strong>
            <p className="muted mt-2">将常用项目固定到侧边栏，随时继续工作。</p>
            <Button className="mt-4" onClick={() => toast.success("已固定")}>
              固定到侧边栏
            </Button>
          </PopoverContent>
        </Popover>
      );
    case "ToolTip":
      return (
        <Tooltip>
          <TooltipTrigger render={<Button />}>
            悬停或聚焦查看提示
          </TooltipTrigger>
          <TooltipContent>复制到剪贴板</TooltipContent>
        </Tooltip>
      );
    case "ListView":
      return (
        <div className="list-demo">
          {["设计资源", "项目文档", "图标素材"].map((x) => (
            <button
              key={x}
              className={selected === x ? "selected" : ""}
              onClick={() => setSelected(x)}
            >
              <span className="folder">▰</span>
              {x}
              {selected === x && <Check size={16} />}
            </button>
          ))}
        </div>
      );
    case "GridView":
      return (
        <div className="tile-grid">
          {["设计资源", "工作项目", "个人收藏"].map((x, i) => (
            <button
              key={x}
              onClick={() => setSelected(x)}
              className={selected === x ? "selected" : ""}
            >
              <span className={"tile-art art-" + i}>
                <Layers size={32} />
              </span>
              <strong>{x}</strong>
              <small>{i + 3} 个项目</small>
            </button>
          ))}
        </div>
      );
    case "TableView":
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>状态</th>
              <th>修改日期</th>
            </tr>
          </thead>
          <tbody>
            {["设计系统.fig", "组件文档.md", "品牌资源.zip"].map((x, i) => (
              <tr key={x}>
                <td>{x}</td>
                <td>
                  <Badge variant="secondary">
                    {i === 1 ? "进行中" : "已完成"}
                  </Badge>
                </td>
                <td>2026/10/{20 - i}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "ProgressBar":
      return (
        <div className="field">
          <label>正在同步 · {count}%</label>
          <Progress value={count} />
          <Button
            onClick={() =>
              setCount(count >= 100 ? 0 : Math.min(100, count + 20))
            }
          >
            增加进度
          </Button>
        </div>
      );
    case "ProgressRing":
      return (
        <div className="demo-row">
          <span className="progress-ring" role="status" aria-label="正在加载" />
          <span>正在加载，请稍候…</span>
        </div>
      );
    case "InfoBar":
      return (
        <div className="stack w-full">
          {[
            "提示：有新的设计资源可供下载。",
            "成功：所有更改已保存。",
            "警告：你的存储空间即将用尽。",
            "错误：无法连接，请稍后重试。",
          ].map((x, i) => (
            <div role="status" className={"info info-" + i} key={x}>
              <span>{["ⓘ", "✓", "⚠", "⊗"][i]}</span>
              {x}
            </div>
          ))}
        </div>
      );
    case "Badge":
      return (
        <div className="demo-row">
          <Badge>新功能</Badge>
          <Badge variant="secondary">进行中</Badge>
          <Badge variant="outline">草稿</Badge>
          <Badge variant="destructive">错误</Badge>
        </div>
      );
    case "Skeleton":
      return (
        <div className="demo-row">
          <Skeleton className="size-12 rounded-full" />
          <div className="stack">
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      );
    default:
      return null;
  }
}

