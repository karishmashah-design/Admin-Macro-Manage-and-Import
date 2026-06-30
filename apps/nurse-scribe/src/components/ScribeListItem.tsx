import React from "react";

export type ScribeItemStatus = "In Progress" | "Pending Sync" | "Syncing" | "Resyncing" | "Error" | "Synced";

const STATUS_CFG: Record<ScribeItemStatus, { color: string; bg: string }> = {
  "In Progress":  { color: "#1132ee", bg: "rgba(17,50,238,0.1)" },
  "Pending Sync": { color: "#b45309", bg: "rgba(180,83,9,0.1)" },
  "Syncing":      { color: "#6d28d9", bg: "rgba(109,40,217,0.1)" },
  "Resyncing":    { color: "#6d28d9", bg: "rgba(109,40,217,0.1)" },
  "Error":        { color: "#bb1411", bg: "rgba(187,20,17,0.1)" },
  "Synced":       { color: "#144852", bg: "rgba(20,72,82,0.1)" },
};

type Props = {
  name: string;
  assessmentType: string;
  patientMeta: string;
  time: string;
  status: ScribeItemStatus;
  isSelected: boolean;
  onClick: () => void;
};

export function ScribeListItem({ name, assessmentType, patientMeta, time, status, isSelected, onClick }: Props) {
  const cfg = STATUS_CFG[status];
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 16px",
        cursor: "pointer",
        background: isSelected ? "var(--litmus-25,#f1f3fe)" : "white",
        borderLeft: isSelected ? "3px solid var(--accent,#1132ee)" : "3px solid transparent",
        fontFamily: "Lato, sans-serif",
      }}
      className="hover:bg-[var(--surface-1,#f7f7f7)]"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground-primary,#1a1a1a)", letterSpacing: "0.14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {name}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: "2px 6px", borderRadius: 4, whiteSpace: "nowrap", letterSpacing: "0.11px", flexShrink: 0 }}>
          {status}
        </span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 400, color: "var(--foreground-primary,#1a1a1a)", marginTop: 2, letterSpacing: "0.04px" }}>
        {assessmentType}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontSize: 12, color: "var(--foreground-secondary,#666)", letterSpacing: "0.065px" }}>
          {patientMeta}
        </span>
        <span style={{ fontSize: 11, color: "var(--foreground-tertiary,#808080)", whiteSpace: "nowrap", flexShrink: 0 }}>
          {time}
        </span>
      </div>
    </div>
  );
}
