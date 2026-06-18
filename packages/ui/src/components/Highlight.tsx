import React from "react";

// Colors match the surface-highlight tokens from Figma:
// success: Green/100 default, Green/200 active
// warning: Orange/100 default, Orange/200 active
// danger:  Red/50 default, Red/200 active
// info:    Litmus/50 default, Litmus/100 active
// history: Neutral/100 default, Neutral/200 active

export type HighlightColor = "success" | "warning" | "danger" | "info" | "history";

const highlightColors: Record<HighlightColor, string> = {
  success: "bg-[var(--green-100,#dcefdd)]",
  warning: "bg-[var(--orange-100,#ffebcc)]",
  danger:  "bg-[var(--red-50,#fde8e8)]",
  info:    "bg-[var(--litmus-50,#e7eafd)]",
  history: "bg-[var(--neutral-100,#e6e6e6)]",
};

export type HighlightProps = {
  children: React.ReactNode;
  color?: HighlightColor;
  className?: string;
};

export function Highlight({ children, color = "info", className = "" }: HighlightProps) {
  return (
    <mark
      className={`${highlightColors[color]} rounded-[2px] px-[2px] not-italic ${className}`}
    >
      {children}
    </mark>
  );
}
