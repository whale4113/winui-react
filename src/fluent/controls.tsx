import {
  NavigationSample,
  BreadcrumbSample,
  TeachingTipSample,
} from "./navigation";
import { MediaPlayer } from "./media-player";
import { InkSurface, ResizeSample, TitleBarSample } from "./additional";
import { ColorSpectrumPicker } from "./color-spectrum";
import React, {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { Combobox } from "@base-ui/react/combobox";
import { NumberField } from "@base-ui/react/number-field";
import { Toolbar } from "@base-ui/react/toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { BasicDemo } from "@/basic-demos";

export const glyphs: Record<string, string> = {
  home: "\uE80F",
  search: "\uE721",
  settings: "\uE713",
  back: "\uE72B",
  forward: "\uE76C",
  down: "\uE70D",
  up: "\uE70E",
  add: "\uE710",
  close: "\uE711",
  save: "\uE74E",
  copy: "\uE8C8",
  cut: "\uE8C6",
  paste: "\uE77F",
  delete: "\uE74D",
  folder: "\uE8B7",
  document: "\uE8A5",
  star: "\uE734",
  starFill: "\uE735",
  info: "\uE946",
  check: "\uE73E",
  calendar: "\uE787",
  clock: "\uE823",
  person: "\uE77B",
  play: "\uE768",
  pause: "\uE769",
  more: "\uE712",
  menu: "\uE700",
  sun: "\uE706",
  moon: "\uE708",
  code: "\uE943",
  color: "\uE790",
  refresh: "\uE72C",
  bold: "\uE8DD",
  italic: "\uE8DB",
  underline: "\uE8DC",
  volume: "\uE767",
};
export function FluentIcon({
  name,
  children,
  className = "",
}: {
  name?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={"fluent-icon " + className}>
      {children || glyphs[name || "document"] || glyphs.document}
    </span>
  );
}
export function FluentNumberBox({
  value,
  onChange,
  min = 0,
  max = 100,
  disabled = false,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <NumberField.Root
      className="number-box"
      value={value}
      onValueChange={(v) => onChange(v ?? min)}
      min={min}
      max={max}
      disabled={disabled}
    >
      <NumberField.Group>
        <NumberField.Input aria-label="数值" />
        <NumberField.Decrement aria-label="减少">
          <FluentIcon name="down" />
        </NumberField.Decrement>
        <NumberField.Increment aria-label="增加">
          <FluentIcon name="up" />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}
export function FluentAutoSuggestBox({
  items,
  label = "搜索",
  onSelect,
}: {
  items: string[];
  label?: string;
  onSelect?: (v: string) => void;
}) {
  return (
    <Combobox.Root
      items={items}
      onValueChange={(v) => v && onSelect?.(String(v))}
    >
      <div className="auto-suggest">
        <Combobox.Input placeholder="输入以搜索" aria-label={label} />
        <Combobox.Trigger aria-label="显示建议">
          <FluentIcon name="search" />
        </Combobox.Trigger>
      </div>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} className="combo-positioner">
          <Combobox.Popup className="fluent-popup">
            <Combobox.Empty className="combo-empty">
              没有匹配结果
            </Combobox.Empty>
            <Combobox.List>
              {(item: string) => (
                <Combobox.Item className="combo-item" key={item} value={item}>
                  {item}
                  <Combobox.ItemIndicator>
                    <FluentIcon name="check" />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
export function FluentRating({
  value,
  onChange,
  max = 5,
  disabled = false,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div
      className="rating"
      role="radiogroup"
      aria-label="评分"
      onMouseLeave={() => setHover(0)}
    >
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          role="radio"
          aria-label={`${i + 1} 星`}
          aria-checked={value === i + 1}
          disabled={disabled}
          tabIndex={value === i + 1 || (!value && i === 0) ? 0 : -1}
          onMouseEnter={() => setHover(i + 1)}
          onClick={() => onChange(i + 1)}
          onKeyDown={(e) => {
            if (
              [
                "ArrowRight",
                "ArrowUp",
                "ArrowLeft",
                "ArrowDown",
                "Home",
                "End",
              ].includes(e.key)
            ) {
              e.preventDefault();
              const n =
                e.key === "Home"
                  ? 1
                  : e.key === "End"
                    ? max
                    : Math.max(
                        1,
                        Math.min(
                          max,
                          value +
                            (["ArrowRight", "ArrowUp"].includes(e.key)
                              ? 1
                              : -1),
                        ),
                      );
              onChange(n);
              (
                e.currentTarget.parentElement?.children[n - 1] as HTMLElement
              )?.focus();
            }
          }}
        >
          <FluentIcon name={(hover || value) > i ? "starFill" : "star"} />
        </button>
      ))}
    </div>
  );
}
export function FluentInfoBar({
  severity = "info",
  title,
  children,
  closable = true,
}: {
  severity?: "info" | "success" | "warning" | "error";
  title: string;
  children?: ReactNode;
  closable?: boolean;
}) {
  const [open, setOpen] = useState(true);
  return open ? (
    <div className={"fluent-info " + severity} role="status">
      <span className="severity-icon">
        <FluentIcon>{"\uF136"}</FluentIcon>
        <FluentIcon>
          {
            {
              info: "\uF13F",
              success: "\uF13E",
              warning: "\uF13C",
              error: "\uF13D",
            }[severity]
          }
        </FluentIcon>
      </span>
      <div>
        <strong>{title}</strong> {children}
      </div>
      {closable && (
        <button
          aria-label="关闭通知"
          className="icon-btn"
          onClick={() => setOpen(false)}
        >
          <FluentIcon name="close" />
        </button>
      )}
    </div>
  ) : (
    <Button onClick={() => setOpen(true)}>重新显示通知</Button>
  );
}
export type TreeNode = { id: string; label: string; children?: TreeNode[] };
export function FluentTreeView({
  nodes,
  label = "项目文件",
  onSelect,
}: {
  nodes: TreeNode[];
  label?: string;
  onSelect?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(
      new Set(nodes[0] ? [nodes[0].id] : []),
    ),
    [selected, setSelected] = useState(nodes[0]?.id),
    [focus, setFocus] = useState(nodes[0]?.id);
  const tree = useRef<HTMLDivElement>(null);
  const visible: { node: TreeNode; level: number; parent?: string }[] = [];
  function flatten(list: TreeNode[], level = 1, parent?: string) {
    list.forEach((node) => {
      visible.push({ node, level, parent });
      if (node.children && expanded.has(node.id))
        flatten(node.children, level + 1, node.id);
    });
  }
  flatten(nodes);
  function toggle(id: string) {
    setExpanded((old) => {
      const next = new Set(old);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function move(id: string) {
    setFocus(id);
    requestAnimationFrame(() =>
      tree.current
        ?.querySelector<HTMLElement>(`[data-tree-id="${id}"]`)
        ?.focus(),
    );
  }
  function key(
    e: KeyboardEvent<HTMLDivElement>,
    node: TreeNode,
    parent?: string,
  ) {
    const idx = visible.findIndex((v) => v.node.id === node.id);
    let next: string | undefined;
    if (e.key === "ArrowDown")
      next = visible[Math.min(idx + 1, visible.length - 1)]?.node.id;
    else if (e.key === "ArrowUp") next = visible[Math.max(idx - 1, 0)]?.node.id;
    else if (e.key === "Home") next = visible[0]?.node.id;
    else if (e.key === "End") next = visible.at(-1)?.node.id;
    else if (e.key === "ArrowRight" && node.children) {
      if (!expanded.has(node.id)) toggle(node.id);
      else next = node.children[0]?.id;
    } else if (e.key === "ArrowLeft") {
      if (expanded.has(node.id) && node.children) toggle(node.id);
      else next = parent;
    } else if (e.key === "Enter" || e.key === " ") {
      setSelected(node.id);
      onSelect?.(node.id);
    } else return;
    e.preventDefault();
    if (next) move(next);
  }
  return (
    <div ref={tree} role="tree" aria-label={label} className="fluent-tree">
      {visible.map(({ node, level, parent }) => (
        <div
          key={node.id}
          role="treeitem"
          aria-level={level}
          aria-selected={selected === node.id}
          aria-expanded={node.children ? expanded.has(node.id) : undefined}
          tabIndex={focus === node.id ? 0 : -1}
          data-tree-id={node.id}
          style={{ paddingInlineStart: (level - 1) * 28 + 8 }}
          onFocus={() => setFocus(node.id)}
          onKeyDown={(e) => key(e, node, parent)}
          onClick={() => {
            setFocus(node.id);
            setSelected(node.id);
            onSelect?.(node.id);
          }}
          onDoubleClick={() => node.children && toggle(node.id)}
        >
          <span
            className="tree-chevron"
            onClick={(e) => {
              e.stopPropagation();
              if (node.children) toggle(node.id);
            }}
          >
            {node.children && (
              <FluentIcon name={expanded.has(node.id) ? "down" : "forward"} />
            )}
          </span>
          <FluentIcon name={node.children ? "folder" : "document"} />
          <span>{node.label}</span>
        </div>
      ))}
    </div>
  );
}
export function FluentTabView() {
  const [tabs, setTabs] = useState([
      { id: "tab-1", name: "Document 1" },
      { id: "tab-2", name: "Document 2" },
      { id: "tab-3", name: "Document 3" },
    ]),
    [active, setActive] = useState("tab-1");
  const counter = useRef(3);
  return (
    <Tabs
      className="fluent-tabview"
      value={active}
      onValueChange={(v) => setActive(String(v))}
    >
      <div className="tab-strip">
        <TabsList>
          {tabs.map((t) => (
            <div
              className="document-tab"
              key={t.id}
              data-selected={active === t.id}
            >
              <TabsTrigger value={t.id}>
                <FluentIcon name="document" />
                {t.name}
              </TabsTrigger>
              <button
                className="icon-btn tab-close"
                aria-label={`关闭 ${t.name}`}
                onClick={() => {
                  const left = tabs.filter((x) => x.id !== t.id);
                  setTabs(left);
                  if (active === t.id) setActive(left[0]?.id || "");
                }}
              >
                <FluentIcon name="close" />
              </button>
            </div>
          ))}
        </TabsList>
        <Button
          variant="ghost"
          size="icon"
          aria-label="添加标签页"
          onClick={() => {
            counter.current++;
            const id = "tab-" + counter.current;
            setTabs([...tabs, { id, name: "Document " + counter.current }]);
            setActive(id);
          }}
        >
          <FluentIcon name="add" />
        </Button>
      </div>
      {tabs.map((t) => (
        <TabsContent key={t.id} value={t.id}>
          <h3>{t.name}</h3>
          <p>可添加、关闭或使用键盘切换文档标签。</p>
          <Input
            aria-label={t.name + " 内容"}
            placeholder="在此输入文档内容…"
          />
        </TabsContent>
      ))}
      {!tabs.length && (
        <div className="no-tabs">所有文档已关闭，使用 + 新建标签页。</div>
      )}
    </Tabs>
  );
}
export function FluentDatePicker({ time = false }: { time?: boolean }) {
  const now = new Date(),
    [day, setDay] = useState(now.getDate()),
    [month, setMonth] = useState(now.getMonth() + 1),
    [year, setYear] = useState(now.getFullYear()),
    [hour, setHour] = useState(12),
    [minute, setMinute] = useState(0);
  const days = new Date(year, month, 0).getDate();
  return (
    <div
      className="date-picker"
      aria-label={time ? "时间选择器" : "日期选择器"}
    >
      {(time
        ? [
            ["小时", hour, 24, setHour],
            ["分钟", minute, 60, setMinute],
          ]
        : [
            ["年", year, 2036, setYear],
            ["月", month, 12, setMonth],
            ["日", Math.min(day, days), days, setDay],
          ]
      ).map(([label, value, max, set]) => (
        <select
          key={String(label)}
          aria-label={String(label)}
          value={Number(value)}
          onChange={(e) => (set as (n: number) => void)(Number(e.target.value))}
        >
          {Array.from({ length: label === "年" ? 50 : Number(max) }, (_, i) =>
            label === "年" ? 2000 + i : time ? i : i + 1,
          ).map((n) => (
            <option key={n} value={n}>
              {String(n).padStart(2, "0")}
              {time ? "" : label === "年" ? "年" : label === "月" ? "月" : "日"}
            </option>
          ))}
        </select>
      ))}
      <FluentIcon name={time ? "clock" : "calendar"} />
    </div>
  );
}
export function FluentCalendarDatePicker() {
  const [date, setDate] = useState<Date | undefined>(),
    [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button className="calendar-trigger" />}>
        {date ? date.toLocaleDateString() : "选择日期"}
        <FluentIcon name="calendar" />
      </PopoverTrigger>
      <PopoverContent className="calendar-flyout">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(v) => {
            setDate(v);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
export { ColorSpectrumPicker as FluentColorPicker } from "./color-spectrum";
export function FluentCommandBar({ compact = false }: { compact?: boolean }) {
  const [liked, setLiked] = useState(false);
  return (
    <Toolbar.Root
      className={"fluent-commandbar " + (compact ? "compact" : "")}
      aria-label="文件操作工具栏"
    >
      {[
        ["add", "新建"],
        ["cut", "剪切"],
        ["copy", "复制"],
        ["paste", "粘贴"],
      ].map(([icon, label]) => (
        <Toolbar.Button
          key={label}
          className="appbar-button"
          onClick={() => toast.success(label + "操作已执行")}
        >
          <FluentIcon name={icon} />
          <span>{label}</span>
        </Toolbar.Button>
      ))}
      <Toolbar.Separator className="appbar-separator" />
      <Toolbar.Button
        className="appbar-button"
        aria-pressed={liked}
        onClick={() => setLiked(!liked)}
      >
        <FluentIcon name={liked ? "starFill" : "star"} />
        <span>收藏</span>
      </Toolbar.Button>
      <div className="toolbar-spacer" />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon" aria-label="更多操作" />}
        >
          <FluentIcon name="more" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => toast("已重命名")}>
            重命名
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast("已删除")}>
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Toolbar.Root>
  );
}
export function FluentMenuBar() {
  return (
    <div className="fluent-menubar" role="menubar" aria-label="应用菜单">
      {["文件", "编辑", "视图", "帮助"].map((label, i) => (
        <DropdownMenu key={label}>
          <DropdownMenuTrigger
            render={<Button variant="ghost" role="menuitem" />}
          >
            {label}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {(i === 0
              ? ["新建", "打开", "保存", "另存为"]
              : i === 1
                ? ["撤销", "剪切", "复制", "粘贴"]
                : i === 2
                  ? ["缩放", "全屏", "重置视图"]
                  : ["查看帮助", "关于"]
            ).map((x) => (
              <DropdownMenuItem key={x} onClick={() => toast(x + "操作已执行")}>
                {x}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  );
}
export function FluentMenuDemo({
  radio = false,
  toggle = false,
}: {
  radio?: boolean;
  toggle?: boolean;
}) {
  const [checked, setChecked] = useState(true),
    [value, setValue] = useState("详细信息");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button />}>
        显示菜单 <FluentIcon name="down" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => toast.success("已打开")}>
          <FluentIcon name="folder" />
          打开
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {toggle ? (
          <DropdownMenuCheckboxItem
            checked={checked}
            onCheckedChange={setChecked}
          >
            显示文件扩展名
          </DropdownMenuCheckboxItem>
        ) : radio ? (
          <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
            {["大图标", "列表", "详细信息"].map((x) => (
              <DropdownMenuRadioItem key={x} value={x}>
                {x}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        ) : (
          <>
            <DropdownMenuItem onClick={() => toast("已剪切")}>
              <FluentIcon name="cut" />
              剪切 <kbd>Ctrl+X</kbd>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("已复制")}>
              <FluentIcon name="copy" />
              复制 <kbd>Ctrl+C</kbd>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>不可用操作</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export function FluentList({
  grid = false,
  multiple = false,
}: {
  grid?: boolean;
  multiple?: boolean;
}) {
  const [values, setValues] = useState<string[]>(["Documents"]);
  const [focusIndex, setFocusIndex] = useState(0);
  const items = ["Documents", "Downloads", "Pictures", "Music"];
  return (
    <div
      className={grid ? "fluent-gridview" : "fluent-listview"}
      role="listbox"
      aria-label="选择文件夹"
      aria-multiselectable={multiple}
      onKeyDown={(e) => {
        const target = e.target as HTMLElement;
        const index = Number(target.dataset.index);
        const next =
          e.key === "ArrowDown" || e.key === "ArrowRight"
            ? Math.min(items.length - 1, index + 1)
            : e.key === "ArrowUp" || e.key === "ArrowLeft"
              ? Math.max(0, index - 1)
              : e.key === "Home"
                ? 0
                : e.key === "End"
                  ? items.length - 1
                  : -1;
        if (next >= 0) {
          e.preventDefault();
          setFocusIndex(next);
          if (!multiple) setValues([items[next]]);
          (e.currentTarget.children[next] as HTMLElement)?.focus();
        }
      }}
    >
      {items.map((x, i) => (
        <button
          role="option"
          aria-selected={values.includes(x)}
          tabIndex={i === focusIndex ? 0 : -1}
          onFocus={() => setFocusIndex(i)}
          data-index={i}
          key={x}
          onClick={() =>
            setValues(
              multiple
                ? values.includes(x)
                  ? values.filter((v) => v !== x)
                  : [...values, x]
                : [x],
            )
          }
        >
          <FluentIcon name="folder" />
          <span>{x}</span>
          {multiple && (
            <span className="selection-mark">
              {values.includes(x) ? "✓" : ""}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
export function FluentTable() {
  const [ascending, setAscending] = useState(true),
    [selected, setSelected] = useState<string[]>([]);
  const files = [
    "Annual report.docx",
    "Design system.fig",
    "Notes.txt",
    "Project brief.pdf",
  ];
  const rows = ascending ? files : [...files].reverse();
  return (
    <div className="table-scroll">
      <table className="fluent-table">
        <thead>
          <tr>
            <th>
              <Checkbox
                aria-label="选择所有文件"
                checked={selected.length === files.length}
                indeterminate={
                  selected.length > 0 && selected.length < files.length
                }
                onCheckedChange={(v) => setSelected(v ? files : [])}
              />
            </th>
            <th aria-sort={ascending ? "ascending" : "descending"}>
              <button onClick={() => setAscending(!ascending)}>
                名称 <FluentIcon name={ascending ? "up" : "down"} />
              </button>
            </th>
            <th>类型</th>
            <th>大小</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((x, i) => (
            <tr key={x} data-selected={selected.includes(x)}>
              <td>
                <Checkbox
                  aria-label={"选择 " + x}
                  checked={selected.includes(x)}
                  onCheckedChange={(v) =>
                    setSelected(
                      v ? [...selected, x] : selected.filter((y) => y !== x),
                    )
                  }
                />
              </td>
              <td>
                <FluentIcon name="document" /> {x}
              </td>
              <td>{x.split(".").pop()?.toUpperCase()}</td>
              <td>{(files.indexOf(x) + 1) * 24} KB</td>
            </tr>
          ))}
        </tbody>
      </table>
      <small>{selected.length} 个已选择</small>
    </div>
  );
}
export function FluentPager({ pips = false }: { pips?: boolean }) {
  const [page, setPage] = useState(1),
    total = pips ? 5 : 12;
  return (
    <div className={"fluent-pager " + (pips ? "pips" : "")} aria-label="分页">
      <Button
        variant="ghost"
        size="icon"
        disabled={page === 1}
        aria-label="上一页"
        onClick={() => setPage(page - 1)}
      >
        <FluentIcon name="back" />
      </Button>
      {pips ? (
        Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            className="pip"
            aria-label={"第 " + (i + 1) + " 页"}
            aria-current={page === i + 1 ? "page" : undefined}
            onClick={() => setPage(i + 1)}
          />
        ))
      ) : (
        <>
          <FluentNumberBox
            value={page}
            onChange={setPage}
            min={1}
            max={total}
          />
          <span> / {total}</span>
        </>
      )}
      <Button
        variant="ghost"
        size="icon"
        disabled={page === total}
        aria-label="下一页"
        onClick={() => setPage(page + 1)}
      >
        <FluentIcon name="forward" />
      </Button>
    </div>
  );
}
export function FluentRepeatButton() {
  const [count, setCount] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined),
    delay = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function stop() {
    clearTimeout(delay.current);
    clearInterval(timer.current);
  }
  useEffect(() => stop, []);
  function start() {
    stop();
    setCount((v) => v + 1);
    delay.current = setTimeout(() => {
      timer.current = setInterval(() => setCount((v) => v + 1), 80);
    }, 400);
  }
  return (
    <div className="demo-row">
      <Button
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          start();
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") stop();
        }}
      >
        按住增加
      </Button>
      <output aria-live="polite">{count}</output>
    </div>
  );
}
const treeNodes: TreeNode[] = [
  {
    id: "project",
    label: "Project",
    children: [
      {
        id: "src",
        label: "src",
        children: [
          { id: "app", label: "App.tsx" },
          { id: "style", label: "styles.css" },
        ],
      },
      {
        id: "assets",
        label: "Assets",
        children: [{ id: "logo", label: "Logo.svg" }],
      },
      { id: "package", label: "package.json" },
    ],
  },
  {
    id: "docs",
    label: "Documents",
    children: [{ id: "readme", label: "README.md" }],
  },
];
export function FluentRichEditBox() {
  const ref = useRef<HTMLDivElement>(null);
  const [formats, setFormats] = useState<string[]>([]);
  return (
    <div className="rich-edit">
      <Toolbar.Root aria-label="文本格式">
        {["bold", "italic", "underline"].map((format, i) => (
          <Toolbar.Button
            key={format}
            aria-label={["加粗", "斜体", "下划线"][i]}
            aria-pressed={formats.includes(format)}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => {
              ref.current?.focus();
              document.execCommand(format);
              setFormats(
                formats.includes(format)
                  ? formats.filter((f) => f !== format)
                  : [...formats, format],
              );
            }}
          >
            <FluentIcon name={format} />
          </Toolbar.Button>
        ))}
      </Toolbar.Root>
      <div
        ref={ref}
        role="textbox"
        aria-label="富文本内容"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
      >
        <p>
          在此输入文本，选中内容后设置<strong>加粗</strong>、<em>斜体</em>或
          <u>下划线</u>。
        </p>
      </div>
    </div>
  );
}
export function FluentContentDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>打开对话框</DialogTrigger>
      <DialogContent showCloseButton={false} className="win-content-dialog">
        <div className="dialog-body">
          <DialogTitle>Save your work?</DialogTitle>
          <DialogDescription>
            There are unsaved changes in your document. Do you want to save them
            before closing?
          </DialogDescription>
          <label className="control-label">
            <Checkbox /> 不再显示此消息
          </label>
        </div>
        <DialogFooter>
          <DialogClose
            render={
              <Button
                className="accent"
                onClick={() => toast.success("更改已保存")}
              />
            }
          >
            保存
          </DialogClose>
          <DialogClose render={<Button />}>不保存</DialogClose>
          <DialogClose render={<Button />}>取消</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export { MediaPlayer as FluentMediaPlayer } from "./media-player";
export function AdvancedDemo({ name }: { name: string }) {
  const [value, setValue] = useState(25),
    [on, setOn] = useState(false),
    [date, setDate] = useState<Date | undefined>(new Date()),
    [visible, setVisible] = useState(true),
    [index, setIndex] = useState(0),
    [text, setText] = useState("");
  const scroll = useRef<HTMLDivElement>(null);
  switch (name) {
    case "NumberBox":
      return (
        <div className="demo-column">
          <label>数量</label>
          <FluentNumberBox value={value} onChange={setValue} />
          <small>最小值 0 · 最大值 100 · 步长 1</small>
        </div>
      );
    case "AutoSuggestBox":
      return (
        <div className="demo-column">
          <label>查找控件</label>
          <FluentAutoSuggestBox
            items={[
              "Button",
              "CheckBox",
              "ComboBox",
              "ColorPicker",
              "CalendarView",
              "Slider",
              "TextBox",
              "ToggleSwitch",
            ]}
            label="查找控件"
            onSelect={setText}
          />
          <small aria-live="polite">
            {text ? "已选择：" + text : "方向键选择，Enter 确认，Escape 关闭。"}
          </small>
        </div>
      );
    case "PasswordBox":
      return (
        <div className="demo-column">
          <label htmlFor="fluent-password">密码</label>
          <div className="password-box">
            <Input
              id="fluent-password"
              type={on ? "text" : "password"}
              placeholder="输入密码"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="icon-btn"
              aria-label={on ? "隐藏密码" : "显示密码"}
              onClick={() => setOn(!on)}
            >
              <FluentIcon>{"\uE890"}</FluentIcon>
            </button>
          </div>
        </div>
      );
    case "CheckBox":
      return (
        <div className="demo-column">
          <label className="control-label">
            <Checkbox defaultChecked /> 已选中
          </label>
          <label className="control-label">
            <Checkbox /> 未选中
          </label>
          <label className="control-label">
            <Checkbox indeterminate /> 部分选中
          </label>
          <label className="control-label">
            <Checkbox disabled /> 已禁用
          </label>
          <label className="control-label">
            <Checkbox disabled defaultChecked /> 已选中并禁用
          </label>
        </div>
      );
    case "RadioButton":
    case "RadioButtons":
      return (
        <RadioGroup defaultValue="first" aria-label="选择一种选项">
          <label className="control-label">
            <RadioGroupItem value="first" /> Option 1
          </label>
          <label className="control-label">
            <RadioGroupItem value="second" /> Option 2
          </label>
          <label className="control-label">
            <RadioGroupItem value="third" /> Option 3
          </label>
          <label className="control-label">
            <RadioGroupItem value="disabled" disabled /> Disabled option
          </label>
        </RadioGroup>
      );
    case "ToggleSwitch":
      return (
        <div className="demo-column">
          <label className="control-label">
            <Switch checked={on} onCheckedChange={setOn} aria-label="开关" />
            {on ? "On" : "Off"}
          </label>
          <label className="control-label">
            <Switch disabled aria-label="禁用开关" />
            Disabled
          </label>
          <label className="control-label">
            <Switch disabled defaultChecked aria-label="已开启的禁用开关" />
            On, disabled
          </label>
        </div>
      );
    case "RepeatButton":
      return <FluentRepeatButton />;
    case "ToggleSplitButton":
      return (
        <div className="split">
          <Button
            aria-pressed={on}
            className={on ? "accent" : ""}
            onClick={() => setOn(!on)}
          >
            <FluentIcon name="star" /> {on ? "已收藏" : "收藏"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button aria-label="收藏选项" />}>
              <FluentIcon name="down" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => toast.success("已加入新集合")}>
                加入新集合
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOn(false)}>
                取消收藏
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    case "ColorPicker":
      return <ColorSpectrumPicker />;
    case "RatingControl":
      return (
        <div className="demo-column">
          <FluentRating value={index} onChange={setIndex} />
          <output aria-live="polite">
            {index ? `${index} / 5` : "未评分"}
          </output>
          <FluentRating value={3} onChange={() => {}} disabled />
        </div>
      );
    case "CalendarDatePicker":
      return <FluentCalendarDatePicker />;
    case "CalendarView":
      return <Calendar mode="single" selected={date} onSelect={setDate} />;
    case "DatePicker":
      return <FluentDatePicker />;
    case "TimePicker":
      return <FluentDatePicker time />;
    case "TabView":
      return <FluentTabView />;
    case "TreeView":
      return (
        <div className="demo-column wide">
          <FluentTreeView nodes={treeNodes} onSelect={setText} />
          <small>
            已选择：{text || "Project"} · 方向键导航，左右键展开与收起。
          </small>
        </div>
      );
    case "TableView":
      return <FluentTable />;
    case "ItemsView":
      return <FluentList grid multiple />;
    case "ItemContainer":
      return <FluentList multiple />;
    case "ListView":
    case "ListBox":
      return <FluentList />;
    case "GridView":
      return <FluentList grid />;
    case "ItemsRepeater":
      return (
        <div className="repeater">
          {Array.from({ length: 36 }, (_, i) => (
            <button
              key={i}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      );
    case "FlipView":
      return (
        <div className="flipview">
          <button
            aria-label="上一张"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            <FluentIcon name="back" />
          </button>
          <div className={"flip-art flip-" + index}>
            <FluentIcon name={["folder", "document", "person"][index]} />
            <span>{["Explore", "Create", "Connect"][index]}</span>
          </div>
          <button
            aria-label="下一张"
            disabled={index === 2}
            onClick={() => setIndex(index + 1)}
          >
            <FluentIcon name="forward" />
          </button>
          <div className="flip-count">{index + 1} / 3</div>
        </div>
      );
    case "SwipeControl":
      return (
        <div className="swipe-control">
          <p>向左滑动或使用操作按钮归档项目。</p>
          {visible ? (
            <div
              className="swipe-item"
              onPointerDown={(e) => {
                e.currentTarget.dataset.x = String(e.clientX);
              }}
              onPointerUp={(e) => {
                if (Number(e.currentTarget.dataset.x) - e.clientX > 80)
                  setVisible(false);
              }}
            >
              <FluentIcon name="document" />
              <span>Project proposal</span>
              <Button onClick={() => setVisible(false)}>归档</Button>
            </div>
          ) : (
            <>
              <p role="status">项目已归档</p>
              <Button onClick={() => setVisible(true)}>撤销</Button>
            </>
          )}
        </div>
      );
    case "RefreshContainer":
      return (
        <div className="demo-column">
          <Button
            disabled={on}
            onClick={() => {
              setOn(true);
              setTimeout(() => {
                setOn(false);
                setValue((v) => v + 1);
              }, 650);
            }}
          >
            <FluentIcon name="refresh" />
            {on ? "正在刷新…" : "刷新内容"}
          </Button>
          <div role="status">
            {on ? "正在获取最新内容" : `已加载 ${value} 项`}
          </div>
        </div>
      );
    case "ContentDialog":
      return <FluentContentDialog />;
    case "CommandBar":
    case "AppBarButton":
      return <FluentCommandBar />;
    case "CommandBarFlyout":
      return (
        <Popover>
          <PopoverTrigger render={<Button />}>显示命令浮层</PopoverTrigger>
          <PopoverContent className="command-flyout">
            <FluentCommandBar compact />
          </PopoverContent>
        </Popover>
      );
    case "AppBarToggleButton":
      return (
        <button
          className="appbar-button"
          aria-pressed={on}
          onClick={() => setOn(!on)}
        >
          <FluentIcon name={on ? "starFill" : "star"} />
          <span>收藏</span>
        </button>
      );
    case "AppBarSeparator":
      return (
        <div className="demo-row">
          <button className="appbar-button">
            <FluentIcon name="copy" />
            <span>复制</span>
          </button>
          <span className="appbar-separator" />
          <button className="appbar-button">
            <FluentIcon name="paste" />
            <span>粘贴</span>
          </button>
        </div>
      );
    case "MenuBar":
    case "MenuBarItem":
      return <FluentMenuBar />;
    case "MenuFlyout":
    case "MenuFlyoutItem":
      return <FluentMenuDemo />;
    case "ToggleMenuFlyoutItem":
      return <FluentMenuDemo toggle />;
    case "RadioMenuFlyoutItem":
      return <FluentMenuDemo radio />;
    case "NavigationBackButton":
      return (
        <div className="demo-row">
          <Button
            variant="ghost"
            size="icon"
            aria-label="返回"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            <FluentIcon name="back" />
          </Button>
          <span>页面 {index + 1}</span>
          <Button onClick={() => setIndex(index + 1)}>前往下一页</Button>
        </div>
      );
    case "SelectorBar":
      return (
        <Tabs defaultValue="Recent" className="selector-bar">
          <TabsList>
            {["Recent", "Shared", "Favorites"].map((x) => (
              <TabsTrigger key={x} value={x}>
                {x}
              </TabsTrigger>
            ))}
          </TabsList>
          {["Recent", "Shared", "Favorites"].map((x) => (
            <TabsContent value={x} key={x}>
              {x} items
            </TabsContent>
          ))}
        </Tabs>
      );
    case "PagerControl":
      return <FluentPager />;
    case "PipsPager":
      return <FluentPager pips />;
    case "InfoBadge":
      return (
        <div className="demo-row">
          <span className="info-badge">8</span>
          <span className="info-badge success">
            <FluentIcon name="check" />
          </span>
          <span className="info-badge warning">!</span>
          <span className="info-badge error">99+</span>
          <span className="info-badge dot" />
          <Button onClick={() => setValue(value + 1)}>
            通知 <span className="info-badge">{value}</span>
          </Button>
        </div>
      );
    case "InfoBar":
      return (
        <div className="demo-column wide">
          {(["info", "success", "warning", "error"] as const).map((s, i) => (
            <FluentInfoBar
              key={s}
              severity={s}
              title={["信息", "成功", "警告", "错误"][i]}
            >
              {
                [
                  "有可用的更新。",
                  "更改已保存。",
                  "请检查存储空间。",
                  "连接失败，请重试。",
                ][i]
              }
            </FluentInfoBar>
          ))}
        </div>
      );
    case "RichEditBox":
      return <FluentRichEditBox />;
    case "TextBlock":
      return (
        <div className="typography-demo">
          <p className="display">Display</p>
          <p className="title-large">Title large</p>
          <p className="title">Title</p>
          <p className="subtitle">Subtitle</p>
          <p className="body-large">Body large</p>
          <p>Body · Segoe UI Variable · 14px / 20px</p>
          <p className="caption">Caption · 12px / 16px</p>
        </div>
      );
    case "RichTextBlock":
      return (
        <article className="rich-text">
          <h3>Build with WinUI</h3>
          <p>
            使用 <strong>加粗文本</strong>、<em>斜体</em>、<u>下划线</u>和{" "}
            <a
              href="https://learn.microsoft.com/windows/apps/winui/"
              target="_blank"
              rel="noreferrer"
            >
              超链接
            </a>
            组织内容。
          </p>
          <p>
            Text can wrap across multiple lines, with inline formatting and
            selectable text.
          </p>
        </article>
      );
    case "ScrollView":
    case "ScrollViewer":
    case "AnnotatedScrollBar":
      return (
        <div className="scroll-demo">
          <div
            ref={scroll}
            className="scroll-content"
            tabIndex={0}
            aria-label="滚动内容"
          >
            {Array.from({ length: 30 }, (_, i) => (
              <div id={"section-" + i} key={i}>
                <FluentIcon name="document" />
                Item {i + 1}
                <span>
                  {i % 5 === 0 ? "Section " + (i / 5 + 1) : "Content"}
                </span>
              </div>
            ))}
          </div>
          {name === "AnnotatedScrollBar" && (
            <div className="scroll-annotations">
              {["A", "B", "C", "D", "E", "F"].map((x, i) => (
                <button
                  key={x}
                  onClick={() =>
                    scroll.current?.scrollTo({
                      top: i * 5 * 40,
                      behavior: "smooth",
                    })
                  }
                >
                  {x}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    case "Border":
      return (
        <div className="layout-border">
          <strong>Border</strong>
          <p>BorderThickness = 1</p>
          <p>CornerRadius = 4</p>
          <p>Padding = 24</p>
        </div>
      );
    case "Grid":
    case "RelativePanel":
    case "LayoutPanel":
    case "VariableSizedWrapGrid":
    case "StackPanel":
      return (
        <div className="layout-sample">
          <label className="control-label">
            <Switch
              checked={on}
              onCheckedChange={setOn}
              aria-label="切换布局方向"
            />
            {on ? "Vertical" : "Horizontal"}
          </label>
          <div
            className={"layout-blocks " + name + " " + (on ? "vertical" : "")}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        </div>
      );
    case "Canvas":
      return (
        <div className="canvas-sample">
          <div style={{ left: 24, top: 24 }}>Left: 24, Top: 24</div>
          <div style={{ left: 130, top: 100 }}>Left: 130, Top: 100</div>
          <div style={{ left: 250, top: 45 }}>Left: 250, Top: 45</div>
        </div>
      );
    case "SplitView":
    case "TwoPaneView":
      return (
        <div className={"splitview " + (!visible ? "pane-hidden" : "")}>
          <div className="splitview-pane">
            <h3>Pane</h3>
            {["Home", "Documents", "Settings"].map((x) => (
              <button
                key={x}
                aria-pressed={text === x}
                onClick={() => setText(x)}
              >
                {x}
              </button>
            ))}
          </div>
          <div className="splitview-content">
            <Button
              variant="ghost"
              size="icon"
              aria-label="展开或收起窗格"
              onClick={() => setVisible(!visible)}
            >
              <FluentIcon name="menu" />
            </Button>
            <h3>{text || "Content"}</h3>
            <p>
              {name === "TwoPaneView"
                ? "窄屏时自动切换为单窗格布局。"
                : "侧边窗格与内容区域。"}
            </p>
          </div>
        </div>
      );
    case "Viewbox":
      return (
        <div className="demo-column wide">
          <label>缩放 · {value}%</label>
          <Slider
            aria-label="缩放比例"
            min={20}
            max={100}
            value={[value]}
            onValueChange={(v) => setValue(Array.isArray(v) ? v[0] : v)}
          />
          <div className="viewbox">
            <span style={{ transform: `scale(${value / 50})` }}>Aa</span>
          </div>
        </div>
      );
    case "PersonPicture":
      return (
        <div className="demo-row">
          <span className="person-picture large">AL</span>
          <span className="person-picture">JD</span>
          <span className="person-picture small">
            <FluentIcon name="person" />
          </span>
          <span className="person-picture tiny">M</span>
        </div>
      );
    case "Image":
    case "ImageIcon":
      return (
        <img
          className={
            name === "ImageIcon" ? "sample-image-icon" : "sample-image"
          }
          alt="蓝色几何山景"
          src="/fluent-landscape.svg"
        />
      );
    case "SymbolIcon":
    case "FontIcon":
      return (
        <div className="icon-grid">
          {[
            "home",
            "save",
            "copy",
            "cut",
            "paste",
            "delete",
            "folder",
            "calendar",
            "person",
            "settings",
            "star",
            "search",
          ].map((x) => (
            <div key={x}>
              <FluentIcon name={x} />
              <span>{x}</span>
            </div>
          ))}
        </div>
      );
    case "PathIcon":
      return (
        <div className="demo-row">
          {[16, 24, 48].map((size) => (
            <svg
              key={size}
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-label={"矢量图标 " + size + "px"}
            >
              <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" />
            </svg>
          ))}
        </div>
      );
    case "AcrylicBrush":
    case "MicaBackdrop":
      return (
        <div className="material-demo">
          <div className="material-wallpaper" />
          <div
            className={
              name === "AcrylicBrush" ? "acrylic-sample" : "mica-sample"
            }
          >
            <strong>{name}</strong>
            <p>
              {name === "AcrylicBrush"
                ? "Backdrop blur + tint + noise"
                : "Theme background + subtle tint"}
            </p>
            <Button>Sample control</Button>
          </div>
        </div>
      );
    case "MediaPlayerElement":
      return <MediaPlayer />;
    case "AnimatedIcon":
      return (
        <button
          className={"animated-icon " + (on ? "is-open" : "")}
          aria-label="切换动画图标"
          aria-pressed={on}
          onClick={() => setOn(!on)}
        >
          <span />
          <span />
          <span />
        </button>
      );
    case "AnimatedVisualPlayer":
      return (
        <div className="demo-column">
          <div className={"animated-visual " + (on ? "running" : "")}>
            <span />
            <span />
            <span />
          </div>
          <Button onClick={() => setOn(!on)}>{on ? "暂停" : "播放动画"}</Button>
        </div>
      );
    case "ParallaxView":
      return (
        <div
          className="parallax"
          onScroll={(e) => setValue(e.currentTarget.scrollTop)}
        >
          <div
            className="parallax-image"
            style={{ transform: `translateY(${value * 0.35}px)` }}
          />
          <div className="parallax-text">
            <h2>ParallaxView</h2>
            <p>滚动查看前景与背景的速度差异。</p>
            <div>Continue scrolling</div>
            <p>Background translation ratio: 0.35</p>
          </div>
        </div>
      );
    case "InkCanvas":
    case "InkToolbar":
      return <InkSurface toolbar={name === "InkToolbar"} />;
    case "ResizeGripper":
      return <ResizeSample />;
    case "TitleBar":
      return <TitleBarSample />;
    case "SortIndicator":
      return (
        <Button variant="ghost" onClick={() => setOn(!on)}>
          Name <FluentIcon name={on ? "down" : "up"} />
        </Button>
      );
    case "ScrollBar":
      return <AdvancedDemo name="ScrollViewer" />;
    case "FlipViewItem":
      return <AdvancedDemo name="FlipView" />;
    case "GridViewItem":
      return <AdvancedDemo name="GridView" />;
    case "ListViewItem":
      return <AdvancedDemo name="ListView" />;
    case "Hyperlink":
      return (
        <a
          href="https://learn.microsoft.com/windows/apps/winui/"
          target="_blank"
          rel="noreferrer"
        >
          Learn more about WinUI
        </a>
      );
    case "MediaTransportControls":
      return <MediaPlayer />;
    case "FlyoutPresenter":
      return <AdvancedDemo name="Flyout" />;
    case "DateTimePickerFlyout":
      return (
        <Popover>
          <PopoverTrigger render={<Button />}>Choose date</PopoverTrigger>
          <PopoverContent className="date-time-flyout">
            <FluentDatePicker />
          </PopoverContent>
        </Popover>
      );
    case "RefreshVisualizer":
      return (
        <div className="demo-row">
          <span className="progress-ring" role="status" aria-label="正在刷新" />
          <span>Refreshing…</span>
        </div>
      );
    case "RevealBrush":
      return (
        <div
          className="reveal-sample"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--x", e.clientX - r.left + "px");
            e.currentTarget.style.setProperty("--y", e.clientY - r.top + "px");
          }}
        >
          <span>Move pointer to reveal</span>
        </div>
      );
    case "NavigationView":
      return <NavigationSample />;
    case "BreadcrumbBar":
      return <BreadcrumbSample />;
    case "TeachingTip":
      return <TeachingTipSample />;
    default:
      return <BasicDemo name={name} />;
  }
}
