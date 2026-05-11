import React, { useRef, useEffect, useState } from "react";

export type TextAreaProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  suffix?: React.ReactNode;
  className?: string;
};

export function TextArea({
  value = "",
  onChange,
  placeholder,
  disabled = false,
  suffix,
  className = "",
}: TextAreaProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize to hug content
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const borderColor = disabled
    ? "border-[#ccc]"
    : focused
    ? "border-[#1132ee]"
    : hovered
    ? "border-[#999]"
    : "border-[#ccc]";

  return (
    <div
      className={`flex items-start gap-[4px] min-h-[28px] px-[8px] py-[3.5px] rounded-[6px] border ${borderColor} bg-white transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 min-w-0 bg-transparent outline-none text-[13px] leading-[1.4] tracking-[0.07px] text-[var(--foreground-primary,#1a1a1a)] placeholder-[var(--foreground-tertiary,#808080)] disabled:cursor-not-allowed resize-none overflow-hidden"
        style={{ fontFamily: "Lato, sans-serif" }}
      />
      {suffix && (
        <span className="shrink-0 flex items-center pt-[2px]">{suffix}</span>
      )}
    </div>
  );
}
