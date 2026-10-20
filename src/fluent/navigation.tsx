import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { FluentIcon } from "./controls";
export function NavigationSample() {
  const [selected, setSelected] = useState("Home"),
    [open, setOpen] = useState(true),
    [top, setTop] = useState(false);
  return (
    <div
      className={
        "navigation-sample " +
        (top ? "top-mode" : "") +
        (!open ? " compact-mode" : "")
      }
    >
      <div className="navigation-pane">
        <Button
          variant="ghost"
          size="icon"
          aria-label="展开或收起导航"
          onClick={() => setOpen(!open)}
        >
          <FluentIcon name="menu" />
        </Button>
        <nav aria-label="示例应用导航">
          {["Home", "Documents", "Downloads", "Settings"].map((x, i) => (
            <button
              key={x}
              aria-current={selected === x ? "page" : undefined}
              onClick={() => setSelected(x)}
            >
              <FluentIcon
                name={["home", "document", "folder", "settings"][i]}
              />
              <span>{x}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="navigation-content">
        <h2>{selected}</h2>
        <p>This is the {selected.toLowerCase()} page.</p>
        <Button onClick={() => setTop(!top)}>
          Pane display mode: {top ? "Top" : "Left"}
        </Button>
      </div>
    </div>
  );
}
export function BreadcrumbSample() {
  const all = ["Home", "Documents", "Design", "Components"],
    [index, setIndex] = useState(3);
  return (
    <div className="demo-column">
      <nav className="fluent-breadcrumb" aria-label="面包屑">
        {all.slice(0, index + 1).map((x, i) => (
          <React.Fragment key={x}>
            {i > 0 && <FluentIcon name="forward" />}
            <button
              aria-current={index === i ? "page" : undefined}
              onClick={() => setIndex(i)}
            >
              {x}
            </button>
          </React.Fragment>
        ))}
      </nav>
      <p>Current location: {all[index]}</p>
      {index < 3 && (
        <Button onClick={() => setIndex(index + 1)}>
          Open {all[index + 1]}
        </Button>
      )}
    </div>
  );
}
export function TeachingTipSample() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button />}>Show teaching tip</PopoverTrigger>
      <PopoverContent className="teaching-tip">
        <span className="tip-tail" />
        <button
          className="icon-btn tip-close"
          aria-label="关闭提示"
          onClick={() => setOpen(false)}
        >
          <FluentIcon name="close" />
        </button>
        <h3>Stay organized</h3>
        <p>Pin your favorite documents so they are always easy to find.</p>
        <div className="demo-row">
          <Button className="accent" onClick={() => setOpen(false)}>
            Got it
          </Button>
          <Button onClick={() => setOpen(false)}>Maybe later</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
