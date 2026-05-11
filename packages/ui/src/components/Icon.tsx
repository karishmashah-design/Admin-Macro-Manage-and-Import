import React from "react";

type IconProps = {
  name: string;
  filled?: boolean;
  size?: number;
  className?: string;
};

export function Icon({ name, filled = false, size = 24, className }: IconProps) {
  return (
    <span
      className={`material-symbols-rounded ${className ?? ""}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}`,
        userSelect: "none",
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {name}
    </span>
  );
}
