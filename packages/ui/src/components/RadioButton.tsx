import React from "react";

export type RadioButtonProps = {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
};

export function RadioButton({
  checked = false,
  disabled = false,
  onChange,
  className = "",
}: RadioButtonProps) {
  function handleClick() {
    if (disabled || !onChange) return;
    onChange(!checked);
  }

  return (
    <div
      onClick={handleClick}
      role="radio"
      aria-checked={checked}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") handleClick(); }}
      className={`p-[5px] flex items-center justify-center shrink-0 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <div
        className={`
          size-[16px] rounded-full flex items-center justify-center transition-colors
          ${checked
            ? "bg-[var(--accent,#1132ee)] border-0"
            : "bg-white border border-[#b3b3b3] hover:border-[var(--foreground-primary,#1a1a1a)]"
          }
        `}
      >
        {checked && (
          <div className="size-[6px] rounded-full bg-white" />
        )}
      </div>
    </div>
  );
}

// ─── Radio Group ──────────────────────────────────────────────────────────────

export type RadioGroupOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type RadioGroupProps = {
  options: RadioGroupOption[];
  value: string;
  onChange: (value: string) => void;
  /** Stack direction. Default "vertical". */
  direction?: "vertical" | "horizontal";
  className?: string;
};

export function RadioGroup({
  options,
  value,
  onChange,
  direction = "vertical",
  className = "",
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={`flex ${direction === "horizontal" ? "flex-row gap-[16px]" : "flex-col gap-[4px]"} font-['Lato',sans-serif] ${className}`}
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`flex items-center gap-[6px] ${opt.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <RadioButton
            checked={value === opt.value}
            disabled={opt.disabled}
            onChange={() => !opt.disabled && onChange(opt.value)}
          />
          <span className="text-[13px] font-normal leading-[1.3] text-[var(--foreground-primary,#1a1a1a)] tracking-[0.13px]">
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}
