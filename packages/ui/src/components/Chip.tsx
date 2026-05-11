import React from "react";
import { Icon } from "./Icon";

export type ChipColor = "accent" | "neutral";

export type ChipProps = {
  label: string;
  color?: ChipColor;
  /** Renders a × dismiss button inside the chip. Cannot be combined with onClick (nested buttons). */
  onDismiss?: React.MouseEventHandler<HTMLButtonElement>;
  /** Makes the whole chip a clickable button. Use this OR onDismiss, not both. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
};

export function Chip({
  label,
  color = "neutral",
  onDismiss,
  onClick,
  disabled = false,
  className = "",
}: ChipProps) {
  const bg =
    color === "accent"
      ? "bg-[#f1f3fe]"
      : "bg-[#f2f2f2]";
  const bgHover =
    color === "accent"
      ? "hover:bg-[#e7eafd]"
      : "hover:bg-[#e6e6e6]";
  const textColor =
    color === "accent"
      ? "text-[#1132ee]"
      : "text-[#1a1a1a]";

  const base = `inline-flex items-center h-[28px] pl-[8px] ${onDismiss ? "pr-[6px]" : "pr-[8px]"} gap-[4px] rounded-[6px] shrink-0`;
  const colors = disabled ? "bg-[#f7f7f7] text-[#999]" : `${bg} ${textColor}`;
  const hover = !disabled && onClick ? bgHover : "";

  const labelEl = (
    <span
      className="text-[13px] font-normal leading-[1.4] tracking-[0.065px] whitespace-nowrap"
      style={{ fontFamily: "Lato, sans-serif", fontFeatureSettings: "'ss07'" }}
    >
      {label}
    </span>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${base} ${colors} ${hover} cursor-pointer ${className}`}
      >
        {labelEl}
      </button>
    );
  }

  return (
    <span className={`${base} ${colors} ${className}`}>
      {labelEl}
      {onDismiss && (
        <button
          onClick={onDismiss}
          disabled={disabled}
          aria-label="Remove"
          className="shrink-0 flex items-center justify-center size-[16px] opacity-60 hover:opacity-100"
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </span>
  );
}
