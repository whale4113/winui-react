import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FluentIcon } from "./controls";
export function InkSurface({ toolbar = true }: { toolbar?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null),
    [tool, setTool] = useState("pen"),
    [color, setColor] = useState("#0067c0"),
    [width, setWidth] = useState(3),
    [drawn, setDrawn] = useState(false);
  const strokes = useRef<ImageData[]>([]),
    active = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dpr = window.devicePixelRatio || 1;
    el.width = Math.round(el.clientWidth * dpr);
    el.height = Math.round(el.clientHeight * dpr);
    const ctx = el.getContext("2d");
    ctx?.scale(dpr, dpr);
  }, []);
  function point(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  }
  return (
    <div className="ink-surface">
      {toolbar && (
        <div className="ink-toolbar" role="toolbar" aria-label="墨迹工具">
          {["pen", "highlighter", "eraser"].map((x, i) => (
            <Button
              key={x}
              variant="ghost"
              aria-label={["钢笔", "荧光笔", "橡皮擦"][i]}
              aria-pressed={tool === x}
              onClick={() => setTool(x)}
            >
              <FluentIcon>{["\uED63", "\uED60", "\uE75C"][i]}</FluentIcon>
            </Button>
          ))}
          <label className="ink-color">
            <input
              type="color"
              aria-label="笔颜色"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
          <select
            aria-label="笔粗细"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
          >
            {[1, 3, 5, 8, 12].map((n) => (
              <option key={n} value={n}>
                {n}px
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            disabled={!drawn}
            onClick={() => {
              const el = ref.current,
                ctx = el?.getContext("2d");
              const last = strokes.current.pop();
              if (ctx && last) ctx.putImageData(last, 0, 0);
              setDrawn(strokes.current.length > 0);
            }}
          >
            撤销
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              const el = ref.current;
              el?.getContext("2d")?.clearRect(0, 0, el.width, el.height);
              strokes.current = [];
              setDrawn(false);
            }}
          >
            清除
          </Button>
        </div>
      )}
      <canvas
        ref={ref}
        aria-label="墨迹画布，使用鼠标或触控笔绘制"
        onPointerDown={(e) => {
          const ctx = e.currentTarget.getContext("2d");
          if (!ctx) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          active.current = true;
          strokes.current.push(
            ctx.getImageData(
              0,
              0,
              e.currentTarget.width,
              e.currentTarget.height,
            ),
          );
          if (strokes.current.length > 20) strokes.current.shift();
          ctx.beginPath();
          const [x, y] = point(e);
          ctx.moveTo(x, y);
          setDrawn(true);
        }}
        onPointerMove={(e) => {
          if (!active.current) return;
          const ctx = e.currentTarget.getContext("2d");
          if (!ctx) return;
          ctx.globalCompositeOperation =
            tool === "eraser" ? "destination-out" : "source-over";
          ctx.globalAlpha = tool === "highlighter" ? 0.22 : 1;
          ctx.strokeStyle = color;
          ctx.lineWidth =
            tool === "eraser"
              ? 24
              : tool === "highlighter"
                ? 18
                : width *
                  (e.pointerType === "pen" ? Math.max(0.3, e.pressure) * 2 : 1);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          const [x, y] = point(e);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y);
        }}
        onPointerUp={() => {
          active.current = false;
        }}
        onPointerCancel={() => {
          active.current = false;
        }}
      />
      <small>
        支持 Pointer Events 压感与擦除；不调用 Windows Ink 原生服务。
      </small>
    </div>
  );
}
export function ResizeSample() {
  const [size, setSize] = useState({ w: 280, h: 160 });
  const start = useRef({ x: 0, y: 0, w: 0, h: 0 });
  return (
    <div className="resize-area">
      <div className="resize-box" style={{ width: size.w, height: size.h }}>
        <strong>Resizable content</strong>
        <p>
          {size.w} × {size.h}
        </p>
        <div
          role="separator"
          aria-label="调整大小"
          aria-valuenow={size.w}
          aria-valuemin={160}
          aria-valuemax={460}
          tabIndex={0}
          className="resize-gripper"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            start.current = { x: e.clientX, y: e.clientY, ...size };
          }}
          onPointerMove={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId))
              setSize({
                w: Math.min(
                  460,
                  Math.max(160, start.current.w + e.clientX - start.current.x),
                ),
                h: Math.min(
                  260,
                  Math.max(100, start.current.h + e.clientY - start.current.y),
                ),
              });
          }}
          onKeyDown={(e) => {
            if (
              ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                e.key,
              )
            ) {
              e.preventDefault();
              setSize({
                w: Math.max(
                  160,
                  Math.min(
                    460,
                    size.w +
                      (e.key === "ArrowLeft"
                        ? -10
                        : e.key === "ArrowRight"
                          ? 10
                          : 0),
                  ),
                ),
                h: Math.max(
                  100,
                  Math.min(
                    260,
                    size.h +
                      (e.key === "ArrowUp"
                        ? -10
                        : e.key === "ArrowDown"
                          ? 10
                          : 0),
                  ),
                ),
              });
            }
          }}
        >
          <FluentIcon>{"\uE784"}</FluentIcon>
        </div>
      </div>
    </div>
  );
}
export function TitleBarSample() {
  const [closed, setClosed] = useState(false),
    [max, setMax] = useState(false);
  return closed ? (
    <Button onClick={() => setClosed(false)}>重新打开示例窗口</Button>
  ) : (
    <div className={"titlebar-sample " + (max ? "maximized" : "")}>
      <div>
        <FluentIcon name="document" />
        <span>Untitled — Sample app</span>
        <Input aria-label="标题栏搜索" placeholder="Search" />
        <button aria-label="示例窗口最大化" onClick={() => setMax(!max)}>
          □
        </button>
        <button aria-label="关闭示例窗口" onClick={() => setClosed(true)}>
          ×
        </button>
      </div>
      <p>TitleBar · icon, title, search, caption buttons</p>
    </div>
  );
}
