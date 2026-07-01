import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import { Icon } from "@ds/ui";
import { MicIcon } from "../components/MicIcon";
import type { ScribeItemStatus } from "../components/ScribeListItem";
import { RecordingContext } from "../context/RecordingContext";

type ScribeEntry = {
  id: string;
  assessmentType: string;
  date: string;
  time: string;
  status: ScribeItemStatus;
};

type PatientGroup = {
  patientId: string;
  name: string;
  patientMeta: string;
  scribes: ScribeEntry[];
};

const STATUS_COLORS: Record<ScribeItemStatus, { color: string; icon: string }> = {
  "In Progress":  { color: "#1132ee", icon: "pending" },
  "Pending Sync": { color: "#b45309", icon: "schedule" },
  "Syncing":      { color: "#6d28d9", icon: "sync" },
  "Resyncing":    { color: "#6d28d9", icon: "sync" },
  "Error":        { color: "#bb1411", icon: "error" },
  "Synced":       { color: "#3f8d43", icon: "check_circle" },
};

const ALL_STATUSES: ScribeItemStatus[] = ["In Progress", "Pending Sync", "Syncing", "Resyncing", "Error", "Synced"];

const DATE_RANGE_OPTIONS = [
  { value: "today",   label: "Today" },
  { value: "past-7",  label: "Past 7 days" },
  { value: "past-30", label: "Past 30 days" },
  { value: "custom",  label: "Custom date range" },
];

const SORT_OPTIONS = [
  { value: "reverse-chron", label: "Reverse Chronological (Default)" },
  { value: "chron",         label: "Chronological" },
  { value: "name-az",       label: "Patient Name (A-Z)" },
  { value: "name-za",       label: "Patient Name (Z-A)" },
];

const DATE_INCLUDES: Record<string, string[]> = {
  "today":   ["Today"],
  "past-7":  ["Today", "Mon"],
  "past-30": ["Today", "Mon", "Sun"],
  "custom":  ["Today", "Mon", "Sun"],
};

const ALL_NOTE_TYPES: string[] = ["Admission Assessment", "Shift Assessment", "Triage", "Handoff", "End of Shift Narrative", "Discharge Summary", "ED Assessment"];

const patientGroups: PatientGroup[] = [
  {
    patientId: "p1", name: "Maria Santos", patientMeta: "Hip Fracture · 72 · F",
    scribes: [
      { id: "s_ds", assessmentType: "Discharge Summary",      date: "Today", time: "20:00", status: "In Progress" },
      { id: "s_eo", assessmentType: "End of Shift Narrative", date: "Today", time: "19:30", status: "Pending Sync" },
      { id: "s_ho", assessmentType: "Handoff",              date: "Today", time: "18:00", status: "Syncing" },
      { id: "s1",   assessmentType: "Shift Assessment",     date: "Today", time: "14:32", status: "Error" },
      { id: "s_s1", assessmentType: "Shift Assessment",     date: "Mon",   time: "22:15", status: "Resyncing" },
      { id: "s6",   assessmentType: "Admission Assessment", date: "Sun",   time: "11:45", status: "Synced" },
      { id: "s_tr", assessmentType: "Triage",               date: "Sun",   time: "08:20", status: "Synced" },
    ],
  },
  {
    patientId: "p2", name: "James Vetrovs", patientMeta: "Pneumonia · 60 · M",
    scribes: [
      { id: "s7",  assessmentType: "End of Shift Narrative", date: "Mon", time: "21:10", status: "Pending Sync" },
      { id: "s10", assessmentType: "Admission Assessment",   date: "Sun", time: "18:05", status: "Synced" },
      { id: "s11", assessmentType: "Triage",                 date: "Sun", time: "16:30", status: "Synced" },
    ],
  },
  {
    patientId: "p3", name: "Terry Philips", patientMeta: "DKA · 32 · F",
    scribes: [
      { id: "s8", assessmentType: "Admission Assessment", date: "Mon", time: "17:45", status: "Pending Sync" },
      { id: "s9", assessmentType: "Triage",               date: "Mon", time: "14:20", status: "Synced" },
    ],
  },
  {
    patientId: "p4", name: "Robert Kim", patientMeta: "CHF · 67 · M",
    scribes: [
      { id: "s2", assessmentType: "Shift Assessment", date: "Today", time: "09:15", status: "Pending Sync" },
    ],
  },
  {
    patientId: "p5", name: "Linda Torres", patientMeta: "Post-op Colectomy · 55 · F",
    scribes: [
      { id: "s3", assessmentType: "Triage", date: "Today", time: "08:45", status: "In Progress" },
    ],
  },
  {
    patientId: "p6", name: "David Chen", patientMeta: "COPD Exacerbation · 45 · M",
    scribes: [
      { id: "s4", assessmentType: "ED Assessment", date: "Today", time: "07:30", status: "Error" },
    ],
  },
  {
    patientId: "p7", name: "Sandra White", patientMeta: "Elective Hyst. · 38 · F",
    scribes: [
      { id: "s5", assessmentType: "Discharge Summary", date: "Today", time: "06:00", status: "Pending Sync" },
    ],
  },
];

const TEMPLATES = [
  "Admission Assessment",
  "Shift Assessment",
  "Handoff",
  "End of Shift Narrative",
  "Pre Admission Summary",
  "Discharge",
  "ED Gold Standard - HCA",
  "Progress Note",
  "Meeting Note",
];

const DATE_ORDER = ["Today", "Mon", "Sun"];
const DATE_LABELS: Record<string, string> = {
  "Today": "Today, Jun 29",
  "Mon":   "Mon, Jun 22",
  "Sun":   "Sun, Jun 21",
};

function mostRecentDate(scribes: ScribeEntry[]) {
  for (const d of DATE_ORDER) {
    if (scribes.some(s => s.date === d)) return d;
  }
  return scribes[scribes.length - 1]?.date ?? "";
}

type Props = {
  onSelectScribe: (id: string, template: string) => void;
};

export default function ScribesPage({ onSelectScribe }: Props) {
  const { startRecording } = useContext(RecordingContext);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [template, setTemplate] = useState("");
  const [templateOpen, setTemplateOpen] = useState(false);
  const [visitType, setVisitType] = useState<"In-Person" | "Virtual">("In-Person");
  const [collapsedPatients, setCollapsedPatients] = useState<Set<string>>(new Set());

  // Filter panel state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPanelPos, setFilterPanelPos] = useState({ top: 0, left: 0 });
  // Draft (in-panel, uncommitted)
  const [draftDateRange, setDraftDateRange] = useState<string | null>(null);
  const [draftSortBy, setDraftSortBy] = useState("reverse-chron");
  const [draftStatuses, setDraftStatuses] = useState<Set<ScribeItemStatus>>(new Set());
  // Applied (actually filters the list)
  const [activeDateRange, setActiveDateRange] = useState<string | null>(null);
  const [activeSortBy, setActiveSortBy] = useState("reverse-chron");
  const [activeStatuses, setActiveStatuses] = useState<Set<ScribeItemStatus>>(new Set());
  const [draftNoteTypes, setDraftNoteTypes] = useState<Set<string>>(new Set());
  const [activeNoteTypes, setActiveNoteTypes] = useState<Set<string>>(new Set());

  const templateRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (templateRef.current && !templateRef.current.contains(e.target as Node)) {
        setTemplateOpen(false);
      }
      if (
        filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node) &&
        filterBtnRef.current && !filterBtnRef.current.contains(e.target as Node)
      ) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleFilterClick() {
    if (filterOpen) { setFilterOpen(false); return; }
    if (filterBtnRef.current) {
      const rect = filterBtnRef.current.getBoundingClientRect();
      setFilterPanelPos({ top: rect.bottom + 4, left: rect.left });
    }
    setDraftDateRange(activeDateRange);
    setDraftSortBy(activeSortBy);
    setDraftStatuses(new Set(activeStatuses));
    setDraftNoteTypes(new Set(activeNoteTypes));
    setFilterOpen(true);
  }

  function applyFilter() {
    setActiveDateRange(draftDateRange);
    setActiveSortBy(draftSortBy);
    setActiveStatuses(new Set(draftStatuses));
    setActiveNoteTypes(new Set(draftNoteTypes));
    setFilterOpen(false);
  }

  function resetFilter() {
    setDraftDateRange(null);
    setDraftSortBy("reverse-chron");
    setDraftStatuses(new Set());
    setDraftNoteTypes(new Set());
  }

  function toggleDraftStatus(status: ScribeItemStatus) {
    setDraftStatuses(prev => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status); else next.add(status);
      return next;
    });
  }

  function toggleDraftNoteType(noteType: string) {
    setDraftNoteTypes(prev => {
      const next = new Set(prev);
      if (next.has(noteType)) next.delete(noteType); else next.add(noteType);
      return next;
    });
  }

  function handleSelect(id: string) {
    setSelectedId(id);
    onSelectScribe(id, template);
  }

  function togglePatient(patientId: string) {
    setCollapsedPatients(prev => {
      const next = new Set(prev);
      if (next.has(patientId)) next.delete(patientId); else next.add(patientId);
      return next;
    });
  }

  function toggleAll() {
    const allIds = patientGroups.map(pg => pg.patientId);
    setCollapsedPatients(prev => prev.size === allIds.length ? new Set() : new Set(allIds));
  }

  const displayGroups = useMemo(() => {
    let groups = patientGroups.map(pg => {
      let scribes = [...pg.scribes];
      if (activeStatuses.size > 0) {
        scribes = scribes.filter(s => activeStatuses.has(s.status));
      }
      if (activeNoteTypes.size > 0) {
        scribes = scribes.filter(s => activeNoteTypes.has(s.assessmentType));
      }
      if (activeDateRange) {
        const allowed = DATE_INCLUDES[activeDateRange] || [];
        scribes = scribes.filter(s => allowed.includes(s.date));
      }
      return { ...pg, scribes };
    }).filter(pg => pg.scribes.length > 0);

    if (activeSortBy === "name-az") {
      groups.sort((a, b) => a.name.localeCompare(b.name));
      return [{ label: null as string | null, patients: groups }];
    }
    if (activeSortBy === "name-za") {
      groups.sort((a, b) => b.name.localeCompare(a.name));
      return [{ label: null as string | null, patients: groups }];
    }
    const order = activeSortBy === "chron" ? [...DATE_ORDER].reverse() : DATE_ORDER;
    return order
      .map(label => ({ label, patients: groups.filter(pg => mostRecentDate(pg.scribes) === label) }))
      .filter(g => g.patients.length > 0);
  }, [activeStatuses, activeDateRange, activeSortBy, activeNoteTypes]);

  const allCollapsed = collapsedPatients.size === patientGroups.length;
  const hasActiveFilters = activeDateRange !== null || activeStatuses.size > 0 || activeNoteTypes.size > 0;

  return (
    <div className="flex flex-1 overflow-hidden" style={{ fontFamily: "Lato, sans-serif" }}>
      {/* Secondary sidebar */}
      <div
        className="shrink-0 flex flex-col bg-white overflow-hidden relative"
        style={{ width: 240, borderRight: "1px solid rgba(0,0,0,0.08)", height: "100vh" }}
      >
        {/* Header */}
        <div className="flex items-center" style={{ padding: "0 12px", height: 56 }}>
          <span className="font-bold text-[var(--foreground-primary,#1a1a1a)]" style={{ fontSize: 17, letterSpacing: "0.34px" }}>
            My Scribes
          </span>
        </div>

        {/* Search + Filter + Collapse row */}
        <div className="flex items-center justify-between" style={{ padding: "8px 12px" }}>
          <div className="flex items-center gap-[8px]">
            <button className="flex items-center gap-[4px] text-[13px] font-bold text-[var(--accent,#1132ee)]" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <Icon name="search" size={14} /> Search
            </button>
            <div style={{ position: "relative", display: "inline-flex" }}>
              <button
                ref={filterBtnRef}
                onClick={handleFilterClick}
                className="flex items-center gap-[4px] text-[13px] font-bold text-[var(--accent,#1132ee)]"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <Icon name="filter_list" size={14} /> Filter
              </button>
              {hasActiveFilters && (
                <span style={{ position: "absolute", top: -2, right: -6, width: 6, height: 6, background: "#1132ee", borderRadius: "50%" }} />
              )}
            </div>
          </div>
          <button
            onClick={toggleAll}
            style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color: "var(--accent,#1132ee)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "Lato, sans-serif" }}
          >
            <Icon name={allCollapsed ? "unfold_more" : "unfold_less"} size={14} />
            {allCollapsed ? "Expand All" : "Collapse All"}
          </button>
        </div>

        {/* Patient list */}
        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 80 }}>
          {displayGroups.map(dg => (
            <div key={dg.label ?? "sorted"}>
              {dg.label && (
                <div style={{ padding: "10px 12px 4px", fontSize: 11, fontWeight: 700, color: "var(--foreground-secondary,#666)", letterSpacing: "0.2px" }}>
                  {DATE_LABELS[dg.label] ?? dg.label}
                </div>
              )}
              {dg.patients.map((pg, i) => {
                const hasSelected = pg.scribes.some(s => selectedId === s.id);
                const isCollapsed = collapsedPatients.has(pg.patientId);
                return (
                  <div key={pg.patientId} style={{ borderTop: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none", borderRight: hasSelected ? "3px solid var(--accent,#1132ee)" : "3px solid transparent" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "10px 12px 6px 16px" }}>
                      <div style={{ cursor: "pointer" }} onClick={() => {
                        const parts = pg.name.split(" ");
                        setFirstName(parts[0] ?? "");
                        setLastName(parts.slice(1).join(" "));
                        setSelectedId(null);
                      }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground-primary,#1a1a1a)", letterSpacing: "0.14px" }}>{pg.name}</div>
                        <div style={{ fontSize: 12, color: "var(--foreground-secondary,#666)", marginTop: 1 }}>{pg.patientMeta}</div>
                      </div>
                      <button
                        onClick={() => togglePatient(pg.patientId)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--foreground-secondary,#666)", padding: "2px 0", marginTop: 1, flexShrink: 0 }}
                      >
                        <Icon name={isCollapsed ? "chevron_right" : "expand_more"} size={16} />
                      </button>
                    </div>
                    {!isCollapsed && (
                      <div style={{ marginBottom: 6 }}>
                        {pg.scribes.map(s => {
                          const cfg = STATUS_COLORS[s.status];
                          const isSel = selectedId === s.id;
                          return (
                            <div
                              key={s.id}
                              onClick={() => handleSelect(s.id)}
                              style={{ padding: "8px 16px 8px 36px", cursor: "pointer", background: isSel ? "var(--litmus-25,#f1f3fe)" : "transparent" }}
                              className="hover:bg-[var(--surface-1,#f7f7f7)]"
                            >
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                                <span style={{ fontSize: 13, fontWeight: isSel ? 700 : 400, color: "var(--foreground-primary,#1a1a1a)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {s.assessmentType}
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: cfg.color, whiteSpace: "nowrap", flexShrink: 0 }}>
                                  <Icon name={cfg.icon} size={13} />
                                  {s.status}
                                </span>
                              </div>
                              <div style={{ fontSize: 11, color: "var(--foreground-tertiary,#808080)", marginTop: 2 }}>{s.time}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom sticky bar */}
        <div
          className="absolute bottom-0 bg-white"
          style={{ width: 240, padding: "8px 12px 24px", borderTop: "1px solid rgba(0,0,0,0.08)", boxSizing: "border-box" }}
        >
          <button
            onClick={() => { setFirstName(""); setLastName(""); setTemplate(""); setSelectedId(null); }}
            className="flex items-center justify-center gap-[8px] font-bold rounded-[6px] w-full"
            style={{ height: 48, fontSize: 17, letterSpacing: "0.34px", background: "white", border: "1px solid var(--foreground-primary,#1a1a1a)", color: "var(--foreground-primary,#1a1a1a)", cursor: "pointer", fontFamily: "Lato, sans-serif" }}
          >
            <MicIcon size={18} color="var(--foreground-primary,#1a1a1a)" />
            Record New Scribe
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {filterOpen && (
        <div
          ref={filterPanelRef}
          style={{
            position: "fixed",
            top: filterPanelPos.top,
            left: filterPanelPos.left,
            zIndex: 1000,
            background: "white",
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)",
            width: 256,
            maxHeight: 480,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Lato, sans-serif",
          }}
        >
          <div style={{ overflowY: "auto", padding: "14px 14px 4px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground-primary,#1a1a1a)", marginBottom: 10 }}>All Filters</div>

            {/* Date range */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground-secondary,#666)", marginBottom: 4, letterSpacing: "0.2px" }}>Filter by date range</div>
              {DATE_RANGE_OPTIONS.map(opt => (
                <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="filterDateRange"
                    value={opt.value}
                    checked={draftDateRange === opt.value}
                    onChange={() => setDraftDateRange(opt.value)}
                    style={{ accentColor: "#1132ee", width: 14, height: 14, cursor: "pointer", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, color: "var(--foreground-primary,#1a1a1a)" }}>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Sort by */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground-secondary,#666)", marginBottom: 4, letterSpacing: "0.2px" }}>Sort by</div>
              {SORT_OPTIONS.map(opt => (
                <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="filterSortBy"
                    value={opt.value}
                    checked={draftSortBy === opt.value}
                    onChange={() => setDraftSortBy(opt.value)}
                    style={{ accentColor: "#1132ee", width: 14, height: 14, cursor: "pointer", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, color: "var(--foreground-primary,#1a1a1a)" }}>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Status */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground-secondary,#666)", marginBottom: 4, letterSpacing: "0.2px" }}>Filter by status</div>
              {ALL_STATUSES.map(status => (
                <label key={status} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={draftStatuses.has(status)}
                    onChange={() => toggleDraftStatus(status)}
                    style={{ accentColor: "#1132ee", width: 14, height: 14, cursor: "pointer", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, color: "var(--foreground-primary,#1a1a1a)" }}>{status}</span>
                </label>
              ))}
            </div>

            {/* Note Type */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground-secondary,#666)", marginBottom: 4, letterSpacing: "0.2px" }}>Filter by note type</div>
              {ALL_NOTE_TYPES.map(noteType => (
                <label key={noteType} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={draftNoteTypes.has(noteType)}
                    onChange={() => toggleDraftNoteType(noteType)}
                    style={{ accentColor: "#1132ee", width: 14, height: 14, cursor: "pointer", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, color: "var(--foreground-primary,#1a1a1a)" }}>{noteType}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px 14px", borderTop: "1px solid rgba(0,0,0,0.08)", background: "white", flexShrink: 0 }}>
            <button
              onClick={resetFilter}
              style={{ fontSize: 13, fontWeight: 700, color: "#1132ee", background: "none", border: "none", cursor: "pointer", fontFamily: "Lato, sans-serif", padding: 0 }}
            >
              Reset All
            </button>
            <button
              onClick={applyFilter}
              style={{ fontSize: 13, fontWeight: 700, color: "white", background: "#1a1a1a", border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "Lato, sans-serif", padding: "7px 20px" }}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center overflow-y-auto bg-white" style={{ paddingTop: 64 }}>
        <div style={{ width: 480 }}>
          <h1 className="text-center font-bold text-[var(--foreground-primary,#1a1a1a)]" style={{ fontSize: 24, marginBottom: 32 }}>
            New Scribe
          </h1>

          <div className="flex flex-col" style={{ gap: 16 }}>
            <div className="flex flex-col" style={{ gap: 4 }}>
              <label className="font-bold text-[var(--foreground-primary,#1a1a1a)]" style={{ fontSize: 12, letterSpacing: "0.24px" }}>First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter patient first name"
                className="outline-none focus:border-[var(--accent,#1132ee)]"
                style={{ height: 48, border: "1px solid #ccc", borderRadius: 6, padding: "0 12px", fontSize: 15, color: "var(--foreground-primary,#1a1a1a)", fontFamily: "Lato, sans-serif", width: "100%", boxSizing: "border-box" }} />
            </div>

            <div className="flex flex-col" style={{ gap: 4 }}>
              <label className="font-bold text-[var(--foreground-primary,#1a1a1a)]" style={{ fontSize: 12, letterSpacing: "0.24px" }}>Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter patient last name"
                className="outline-none focus:border-[var(--accent,#1132ee)]"
                style={{ height: 48, border: "1px solid #ccc", borderRadius: 6, padding: "0 12px", fontSize: 15, color: "var(--foreground-primary,#1a1a1a)", fontFamily: "Lato, sans-serif", width: "100%", boxSizing: "border-box" }} />
            </div>

            <div className="flex" style={{ gap: 12 }}>
              <div ref={templateRef} className="flex flex-col flex-1 relative" style={{ gap: 4 }}>
                <label className="font-bold text-[var(--foreground-primary,#1a1a1a)]" style={{ fontSize: 12, letterSpacing: "0.24px" }}>Template</label>
                <button onClick={() => setTemplateOpen(o => !o)}
                  className="flex items-center justify-between w-full outline-none hover:border-[var(--foreground-secondary,#666)] transition-colors"
                  style={{ height: 48, border: "1px solid #ccc", borderRadius: 6, padding: "0 12px", fontSize: 15, background: "white", cursor: "pointer", fontFamily: "Lato, sans-serif", boxSizing: "border-box" }}>
                  <span style={{ color: template ? "var(--foreground-primary,#1a1a1a)" : "#808080" }}>{template || "Select Template"}</span>
                  <Icon name={templateOpen ? "arrow_drop_up" : "arrow_drop_down"} size={20} className="text-[var(--foreground-secondary,#666)] shrink-0" />
                </button>
                {templateOpen && (
                  <div className="absolute left-0 right-0 bg-white z-10 overflow-y-auto"
                    style={{ top: "100%", marginTop: 4, border: "1px solid #ccc", borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.10)", maxHeight: 240 }}>
                    {TEMPLATES.map((t) => (
                      <button key={t} onClick={() => { setTemplate(t); setTemplateOpen(false); }}
                        className={`flex items-center w-full text-left transition-colors text-[var(--foreground-primary,#1a1a1a)] outline-none ${template === t ? "bg-[var(--litmus-25,#f1f3fe)] font-bold" : "hover:bg-[var(--surface-1,#f7f7f7)]"}`}
                        style={{ padding: "10px 12px", fontSize: 15, fontFamily: "Lato, sans-serif", border: "none", cursor: "pointer" }}>
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1" style={{ gap: 2 }}>
                <label className="font-bold text-[var(--foreground-primary,#1a1a1a)]" style={{ fontSize: 12, letterSpacing: "0.24px" }}>Visit Type</label>
                <div className="flex items-center" style={{ height: 48, background: "#f2f2f2", borderRadius: 8, padding: 2 }}>
                  {(["In-Person", "Virtual"] as const).map((vt) => (
                    <button key={vt} onClick={() => setVisitType(vt)} className="flex-1 text-[13px] font-bold transition-all"
                      style={{ height: "100%", background: visitType === vt ? "white" : "transparent", color: visitType === vt ? "var(--foreground-primary,#1a1a1a)" : "#808080", border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "Lato, sans-serif", boxShadow: visitType === vt ? "0 4px 8px rgba(0,0,0,0.07)" : "none" }}>
                      {vt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const name = [firstName, lastName].filter(Boolean).join(" ");
                if (!name || !template) return;
                startRecording({ patientName: name, template, visitType });
              }}
              className="flex items-center justify-center gap-[8px] font-bold text-white rounded-[8px] text-[15px] w-full"
              style={{ height: 52, background: (firstName || lastName) && template ? "var(--foreground-primary,#1a1a1a)" : "#ccc", border: "none", cursor: (firstName || lastName) && template ? "pointer" : "default", marginTop: 8, fontFamily: "Lato, sans-serif", transition: "background 0.2s" }}>
              <MicIcon size={20} color="white" />
              Start Recording
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
