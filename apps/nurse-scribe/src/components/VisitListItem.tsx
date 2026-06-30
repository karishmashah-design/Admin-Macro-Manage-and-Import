import React from "react";
import { Icon } from "@ds/ui";

export type PatientVisitStatus = "In Queue" | "Admitted" | "Observation" | "Discharge Pending" | "Post-Op" | "Critical";

const STATUS_CFG: Record<PatientVisitStatus, { color: string; icon: string }> = {
  "In Queue":          { color: "#808080", icon: "schedule" },
  "Admitted":          { color: "#1132ee", icon: "check_circle" },
  "Observation":       { color: "#7c3aed", icon: "visibility" },
  "Discharge Pending": { color: "#b45309", icon: "pending" },
  "Post-Op":           { color: "#144852", icon: "healing" },
  "Critical":          { color: "#bb1411", icon: "error" },
};

type Props = {
  name: string;
  diagnosis: string;
  ageMeta: string;
  room: string;
  time: string;
  visitStatus: PatientVisitStatus;
  isSelected: boolean;
  onClick: () => void;
};

export function VisitListItem({ name, diagnosis, ageMeta, room, time, visitStatus, isSelected, onClick }: Props) {
  const cfg = STATUS_CFG[visitStatus];
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
        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: cfg.color, whiteSpace: "nowrap", flexShrink: 0 }}>
          <Icon name={cfg.icon} size={13} />
          {visitStatus}
        </span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 400, color: "var(--foreground-primary,#1a1a1a)", marginTop: 2, letterSpacing: "0.04px" }}>
        {diagnosis}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontSize: 12, color: "var(--foreground-secondary,#666)", letterSpacing: "0.065px" }}>
          {ageMeta} · {room}
        </span>
        <span style={{ fontSize: 11, color: "var(--foreground-tertiary,#808080)", whiteSpace: "nowrap", flexShrink: 0 }}>
          {time}
        </span>
      </div>
    </div>
  );
}
