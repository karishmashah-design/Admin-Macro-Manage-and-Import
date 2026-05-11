import React, { useState } from "react";
import { Icon } from "./Icon";

export type TextFieldFeedback = "none" | "success" | "error";

export type TextFieldProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  feedback?: TextFieldFeedback;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

export function TextField({
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  feedback = "none",
  prefix,
  suffix,
  className = "",
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const borderColor = disabled
    ? "border-[#ccc]"
    : feedback === "success"
    ? "border-[#479e4c]"
    : feedback === "error"
    ? "border-[#bb1411]"
    : focused
    ? "border-[#1132ee]"
    : hovered
    ? "border-[#999]"
    : "border-[#ccc]";

  const trailingIcon =
    suffix ?? (feedback === "success" ? (
      <Icon name="check_circle" size={14} className="text-[#479e4c] shrink-0" />
    ) : feedback === "error" ? (
      <Icon name="error" size={14} className="text-[#bb1411] shrink-0" />
    ) : null);

  return (
    <div
      className={`flex items-center gap-[4px] min-h-[28px] px-[8px] py-[3.5px] rounded-[6px] border ${borderColor} bg-white transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {prefix && <span className="shrink-0 flex items-center">{prefix}</span>}
      <input
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        onKeyDown={onKeyDown}
        className="flex-1 min-w-0 bg-transparent outline-none text-[13px] leading-[1.4] tracking-[0.07px] text-[var(--foreground-primary,#1a1a1a)] placeholder-[var(--foreground-tertiary,#808080)] disabled:cursor-not-allowed"
        style={{ fontFamily: "Lato, sans-serif" }}
      />
      {trailingIcon && <span className="shrink-0">{trailingIcon}</span>}
    </div>
  );
}
