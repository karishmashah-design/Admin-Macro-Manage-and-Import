import React from "react";

export type CheckboxState = "unselected" | "selected" | "indeterminate";

export type CheckboxProps = {
  state?: CheckboxState;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
  className?: string;
};

export function Checkbox({
  state = "unselected",
  disabled = false,
  onChange,
  className = "",
}: CheckboxProps) {
  const filled = state === "selected" || state === "indeterminate";

  function handleClick() {
    if (disabled || !onChange) return;
    onChange(state !== "selected");
  }

  return (
    <div
      onClick={handleClick}
      className={`p-[5px] flex items-center justify-center shrink-0 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <div
        className={`
          relative size-[16px] rounded-[2px] flex items-center justify-center transition-colors
          ${filled
            ? "bg-[var(--accent,#1132ee)] border-0"
            : "bg-white border border-[#b3b3b3] hover:border-[var(--foreground-primary,#1a1a1a)]"
          }
        `}
      >
        {state === "selected" && (
          <svg width="9" height="7" viewBox="0 0 11 9" fill="none">
            <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {state === "indeterminate" && (
          <svg width="8" height="2" viewBox="0 0 10 2" fill="none">
            <path d="M1 1H9" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </div>
  );
}
