import type { HTMLAttributes } from "react";
// Segoe Fluent glyphs correspond to WinUI SymbolThemeFontFamily.
export function FluentGlyph({
  code,
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { code: string }) {
  return (
    <span aria-hidden="true" className={"fluent-icon " + className} {...props}>
      {String.fromCodePoint(parseInt(code, 16))}
    </span>
  );
}
