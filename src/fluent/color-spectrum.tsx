import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FluentIcon } from "./controls";
function hsvToHex(h: number, s: number, v: number) {
  const c = v * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = v - c;
  const rgb =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return (
    "#" +
    rgb
      .map((n) =>
        Math.round((n + m) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
function hexToHsv(hex: string) {
  const [r, g, b] = [1, 3, 5].map(
      (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
    ),
    max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  let h =
    d === 0
      ? 0
      : max === r
        ? 60 * (((g - b) / d) % 6)
        : max === g
          ? 60 * ((b - r) / d + 2)
          : 60 * ((r - g) / d + 4);
  if (h < 0) h += 360;
  return [h, max === 0 ? 0 : d / max, max];
}
export function ColorSpectrumPicker() {
  const [hsv, setHsv] = useState(() => hexToHsv("#0067c0")),
    [alpha, setAlpha] = useState(100),
    [draft, setDraft] = useState<string | null>(null),
    [more, setMore] = useState(false),
    [mode, setMode] = useState("RGB");
  const [h, s, v] = hsv,
    hex = hsvToHex(h, s, v),
    rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  function choose(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setHsv([
      Math.max(
        0,
        Math.min(359.99, ((e.clientX - rect.left) / rect.width) * 360),
      ),
      1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
      v,
    ]);
    setDraft(null);
  }
  return (
    <div className="color-picker spectrum-picker">
      <div className="color-spectrum-grid">
        <div
          role="slider"
          aria-label="颜色光谱"
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={Math.round(h)}
          aria-valuetext={`色相 ${Math.round(h)}，饱和度 ${Math.round(s * 100)}%`}
          tabIndex={0}
          className="hsv-spectrum"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            choose(e);
          }}
          onPointerMove={(e) => {
            if (e.currentTarget.hasPointerCapture(e.pointerId)) choose(e);
          }}
          onKeyDown={(e) => {
            if (
              [
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "ArrowDown",
                "Home",
                "End",
              ].includes(e.key)
            ) {
              e.preventDefault();
              setHsv([
                e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? 359
                    : Math.max(
                        0,
                        Math.min(
                          359,
                          h +
                            (e.key === "ArrowLeft"
                              ? -1
                              : e.key === "ArrowRight"
                                ? 1
                                : 0),
                        ),
                      ),
                Math.max(
                  0,
                  Math.min(
                    1,
                    s +
                      (e.key === "ArrowUp"
                        ? 0.01
                        : e.key === "ArrowDown"
                          ? -0.01
                          : 0),
                  ),
                ),
                v,
              ]);
              setDraft(null);
            }
          }}
        >
          <div className="spectrum-value-overlay" style={{ opacity: 1 - v }} />
          <span
            className="spectrum-cursor"
            style={{
              left: (h / 360) * 100 + "%",
              top: (1 - s) * 100 + "%",
              background: hex,
            }}
          />
        </div>
        <div className="color-preview-checker">
          <div style={{ background: hex, opacity: alpha / 100 }} />
        </div>
      </div>
      <div className="color-sliders">
        <div
          className="value-track"
          style={
            { "--channel-color": hsvToHex(h, s, 1) } as React.CSSProperties
          }
        >
          <Slider
            aria-label="明度"
            min={0}
            max={100}
            value={[v * 100]}
            onValueChange={(n) => {
              setHsv([h, s, (Array.isArray(n) ? n[0] : n) / 100]);
              setDraft(null);
            }}
          />
        </div>
        <div
          className="alpha-track"
          style={{ "--channel-color": hex } as React.CSSProperties}
        >
          <Slider
            aria-label="不透明度"
            min={0}
            max={100}
            value={[alpha]}
            onValueChange={(n) => setAlpha(Array.isArray(n) ? n[0] : n)}
          />
        </div>
      </div>
      <button
        className="color-more"
        aria-expanded={more}
        onClick={() => setMore(!more)}
      >
        {more ? "Less" : "More"}
        <FluentIcon name={more ? "up" : "down"} />
      </button>
      {more && (
        <div className="color-entry-panel">
          <Select
            value={mode}
            onValueChange={(n) => setMode(String(n))}
            items={{ RGB: "RGB", HSV: "HSV" }}
          >
            <SelectTrigger aria-label="颜色表示">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RGB">RGB</SelectItem>
              <SelectItem value="HSV">HSV</SelectItem>
            </SelectContent>
          </Select>
          <Input
            className="hex-field"
            aria-label="十六进制颜色"
            value={draft ?? hex}
            onChange={(e) => {
              setDraft(e.target.value);
              if (/^#[0-9a-f]{6}$/i.test(e.target.value))
                setHsv(hexToHsv(e.target.value));
            }}
            onBlur={() => setDraft(null)}
          />
          <div className="color-channel-fields">
            {(mode === "RGB" ? rgb : [h, s * 100, v * 100]).map((n, i) => (
              <label key={i}>
                <input
                  type="number"
                  min={0}
                  max={mode === "RGB" ? 255 : i === 0 ? 359 : 100}
                  aria-label={
                    (mode === "RGB"
                      ? ["红色", "绿色", "蓝色"]
                      : ["色相", "饱和度", "明度"])[i]
                  }
                  value={Math.round(n)}
                  onChange={(e) => {
                    if (mode === "RGB") {
                      const next = [...rgb];
                      next[i] = Math.max(
                        0,
                        Math.min(255, Number(e.target.value)),
                      );
                      setHsv(
                        hexToHsv(
                          "#" +
                            next
                              .map((c) => c.toString(16).padStart(2, "0"))
                              .join(""),
                        ),
                      );
                    } else {
                      const next = [...hsv];
                      next[i] =
                        Math.max(
                          0,
                          Math.min(i === 0 ? 359 : 100, Number(e.target.value)),
                        ) / (i === 0 ? 1 : 100);
                      setHsv(next);
                    }
                    setDraft(null);
                  }}
                />
                <span>
                  {
                    (mode === "RGB"
                      ? ["Red", "Green", "Blue"]
                      : ["Hue", "Saturation", "Value"])[i]
                  }
                </span>
              </label>
            ))}
            <label>
              <input
                type="number"
                min={0}
                max={100}
                aria-label="透明度百分比"
                value={alpha}
                onChange={(e) =>
                  setAlpha(Math.max(0, Math.min(100, Number(e.target.value))))
                }
              />
              <span>Opacity</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
