import React from "react";

export interface MenuProps {
  children: React.ReactNode;
  className?: string;
}

export interface MenuItemProps {
  icon?: React.ReactNode;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function Menu({ children, className = "" }: MenuProps) {
  return (
    <div className={`rounded-[12px] p-[6px] shadow-[0_4px_16px_2px_rgba(0,0,0,0.07)] bg-white border border-[rgba(0,0,0,0.1)] ${className}`}>
      {children}
    </div>
  );
}

export function MenuItem({
  icon,
  label,
  selected = false,
  disabled = false,
  onClick,
}: MenuItemProps) {
  const hoverClass = !disabled ? "hover:bg-[var(--surface-1,#f7f7f7)]" : "";
  const selectedClass = selected ? "bg-[#f1f3fe]" : "";

  return (
    <button
      className={`flex items-center w-full gap-[8px] h-[36px] px-[8px] rounded-[6px] transition-colors text-left cursor-pointer ${hoverClass} ${selectedClass} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {icon && <span className="shrink-0 text-[var(--accent,#1132ee)]">{icon}</span>}
      <span
        className="text-[13px] font-bold leading-none tracking-[0.13px] text-[var(--foreground-primary,#1a1a1a)]"
        style={{ fontFamily: "Lato, sans-serif" }}
      >
        {label}
      </span>
    </button>
  );
}
