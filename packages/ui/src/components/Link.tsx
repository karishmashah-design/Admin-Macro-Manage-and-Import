import React from "react";

const sizeConfig = {
  large:   { text: "text-[17px]", tracking: "tracking-[0.17px]", iconSize: 20, gap: "gap-[4px]" },
  medium:  { text: "text-[15px]", tracking: "tracking-[0.15px]", iconSize: 18, gap: "gap-[4px]" },
  small:   { text: "text-[13px]", tracking: "tracking-[0.065px]", iconSize: 16, gap: "gap-[4px]" },
  xsmall:  { text: "text-[12px]", tracking: "tracking-[0px]",    iconSize: 14, gap: "gap-[2px]" },
};

export type LinkProps = {
  label: string;
  href?: string;
  size?: keyof typeof sizeConfig;
  intent?: "default" | "neutral";
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
};

export function Link({
  label,
  href = "#",
  size = "medium",
  intent = "default",
  prefix,
  suffix,
  onClick,
  className = "",
}: LinkProps) {
  const { text, tracking, gap } = sizeConfig[size];
  const colorClass = intent === "default"
    ? "text-[var(--foreground-brand,#1132ee)]"
    : "text-[var(--foreground-secondary,#666)] hover:text-[var(--foreground-primary,#1a1a1a)]";
  const weight = intent === "default" ? "font-bold" : "font-normal";

  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex flex-wrap items-center ${gap} cursor-pointer transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--litmus-100,#cfd6fc)] focus-visible:rounded-[4px] font-['Lato',sans-serif] ${weight} ${text} ${tracking} ${colorClass} ${className}`}
      style={{ fontFeatureSettings: "'ss07'" }}
    >
      {prefix && <span className="flex items-center shrink-0">{prefix}</span>}
      {label}
      {suffix && <span className="flex items-center shrink-0">{suffix}</span>}
    </a>
  );
}
