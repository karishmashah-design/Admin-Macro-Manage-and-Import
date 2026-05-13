import React from "react";
import { VisitStatus, VisitStatusValue } from "./Badge";

export type SecondaryNavItemProps = {
  name: string;
  chiefComplaint?: string;
  age?: number;
  gender?: "M" | "F" | "Other";
  duration?: string;
  time?: string;
  status?: VisitStatusValue;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
};

export function SecondaryNavItem({
  name,
  chiefComplaint,
  age,
  gender,
  duration,
  time,
  status,
  isSelected = false,
  onClick,
  className = "",
}: SecondaryNavItemProps) {
  // When `time` is provided (visits/previsit mode):
  //   left  = age · gender · duration
  //   right = appointment time
  // When `time` is NOT provided (scribes mode, legacy behavior):
  //   left  = chiefComplaint · age/gender
  //   right = duration
  const meta = time
    ? (age != null && gender ? `${age} · ${gender}` : undefined) ?? ""
    : [chiefComplaint, age != null && gender ? `${age} · ${gender}` : undefined]
        .filter(Boolean)
        .join(" · ");

  const rightContent = time ? time : duration;

  return (
    <div
      onClick={onClick}
      className={`flex flex-col gap-[4px] py-[12px] cursor-pointer transition-colors font-['Lato',sans-serif]
        ${isSelected
          ? "bg-[var(--litmus-25,#f1f3fe)] border-r-[2px] border-r-[var(--accent,#1132ee)] pl-[16px] pr-[14px]"
          : "bg-white hover:bg-[var(--surface-1,#f7f7f7)] px-[16px]"
        } ${className}`}
      style={{ fontFeatureSettings: "'ss07'" }}
    >
      <div className="flex items-center justify-between gap-[8px]">
        <span className="text-[13px] font-bold leading-[1.2] tracking-[0.13px] text-[var(--foreground-primary,#1a1a1a)] truncate">
          {name}
        </span>
        {status && <VisitStatus status={status} />}
      </div>
      <div className="flex items-center justify-between gap-[8px]">
        <span className="text-[13px] font-normal leading-[1.4] tracking-[0.065px] text-[var(--foreground-secondary,#666)] truncate">
          {meta}
        </span>
        {rightContent && (
          <span className="text-[12px] font-normal leading-[1.2] text-[var(--foreground-tertiary,#808080)] shrink-0">
            {rightContent}
          </span>
        )}
      </div>
    </div>
  );
}
