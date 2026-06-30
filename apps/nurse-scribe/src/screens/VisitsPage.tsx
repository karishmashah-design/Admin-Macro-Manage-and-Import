import React, { useState, useRef, useEffect, useContext } from "react";
import { IconButton, Icon } from "@ds/ui";
import { MicIcon } from "../components/MicIcon";
import { VisitListItem } from "../components/VisitListItem";
import type { PatientVisitStatus } from "../components/VisitListItem";
import { RecordingContext } from "../context/RecordingContext";

type Visit = {
  id: string;
  name: string;
  diagnosis: string;
  ageMeta: string;
  room: string;
  time: string;
  visitStatus: PatientVisitStatus;
};

const visits: Visit[] = [
  { id: "v0", name: "Emily Park",    diagnosis: "Chest Pain",               ageMeta: "52 · F", room: "—",       time: "14:55", visitStatus: "In Queue" },
  { id: "v00", name: "Marcus Webb",  diagnosis: "Abdominal Pain",           ageMeta: "34 · M", room: "—",       time: "14:40", visitStatus: "In Queue" },
  { id: "v1", name: "Maria Santos",  diagnosis: "Hip Fracture",             ageMeta: "72 · F", room: "Bed 4B",  time: "08:00", visitStatus: "Admitted" },
  { id: "v2", name: "Robert Kim",    diagnosis: "Congestive Heart Failure", ageMeta: "67 · M", room: "Bed 3A",  time: "09:30", visitStatus: "Observation" },
  { id: "v3", name: "Linda Torres",  diagnosis: "Post-op Colectomy",        ageMeta: "55 · F", room: "Bed 2C",  time: "10:15", visitStatus: "Discharge Pending" },
  { id: "v4", name: "David Chen",    diagnosis: "COPD Exacerbation",        ageMeta: "45 · M", room: "ICU-7",   time: "11:00", visitStatus: "Critical" },
  { id: "v5", name: "Sandra White",  diagnosis: "Elective Hysterectomy",    ageMeta: "38 · F", room: "Bed 5D",  time: "14:30", visitStatus: "Post-Op" },
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

export default function VisitsPage() {
  const { startRecording } = useContext(RecordingContext);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [template, setTemplate] = useState("");
  const [templateOpen, setTemplateOpen] = useState(false);
  const [visitType, setVisitType] = useState<"In-Person" | "Virtual">("In-Person");
  const templateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (templateRef.current && !templateRef.current.contains(e.target as Node)) {
        setTemplateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden" style={{ fontFamily: "Lato, sans-serif" }}>
      {/* Secondary sidebar */}
      <div
        className="shrink-0 flex flex-col bg-white overflow-hidden relative"
        style={{ width: 240, borderRight: "1px solid rgba(0,0,0,0.08)", height: "100vh" }}
      >
        {/* Date row */}
        <div className="flex items-center justify-between" style={{ padding: "12px 12px 0", height: 56 }}>
          <div className="flex items-center gap-[4px]">
            <Icon name="calendar_today" size={14} className="text-[var(--foreground-secondary,#666)]" />
            <span className="text-[13px] font-bold text-[var(--foreground-primary,#1a1a1a)]" style={{ letterSpacing: "0.13px" }}>
              Jun 22nd, Today
            </span>
          </div>
          <div className="flex items-center">
            <IconButton icon={<Icon name="chevron_left" size={16} />} variant="tertiary-neutral" size="small" aria-label="Previous day" />
            <IconButton icon={<Icon name="chevron_right" size={16} />} variant="tertiary-neutral" size="small" aria-label="Next day" />
          </div>
        </div>

        {/* Search + Filter row */}
        <div className="flex items-center gap-[8px]" style={{ padding: "8px 12px" }}>
          <button className="flex items-center gap-[4px] text-[13px] font-bold text-[var(--accent,#1132ee)]" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Icon name="search" size={14} /> Search
          </button>
          <button className="flex items-center gap-[4px] text-[13px] font-bold text-[var(--accent,#1132ee)]" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Icon name="filter_list" size={14} /> Filter
          </button>
        </div>

        {/* Visit list */}
        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 120 }}>
          {visits.map((v) => (
            <VisitListItem
              key={v.id}
              name={v.name}
              diagnosis={v.diagnosis}
              ageMeta={v.ageMeta}
              room={v.room}
              time={v.time}
              visitStatus={v.visitStatus}
              isSelected={selectedId === v.id}
              onClick={() => {
                setSelectedId(v.id);
                const parts = v.name.split(" ");
                setFirstName(parts[0] ?? "");
                setLastName(parts.slice(1).join(" "));
              }}
            />
          ))}
        </div>

        {/* Bottom sticky bar */}
        <div
          className="absolute bottom-0 bg-white flex flex-col gap-[8px]"
          style={{ width: 240, padding: "8px 12px 24px", borderTop: "1px solid rgba(0,0,0,0.08)" }}
        >
          <button
            onClick={() => { setFirstName(""); setLastName(""); setTemplate(""); setSelectedId(null); }}
            className="flex items-center justify-center gap-[8px] w-full font-bold rounded-[6px]"
            style={{ height: 48, fontSize: 17, letterSpacing: "0.34px", background: "white", border: "1px solid var(--foreground-primary,#1a1a1a)", color: "var(--foreground-primary,#1a1a1a)", cursor: "pointer", fontFamily: "Lato, sans-serif" }}
          >
            <MicIcon size={18} color="var(--foreground-primary,#1a1a1a)" />
            Record New Scribe
          </button>
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-[6px] text-[15px] font-bold text-[var(--accent,#1132ee)]" style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 12px 8px 0", letterSpacing: "0.15px" }}>
              <Icon name="calendar_add_on" size={18} /> Add Visit
            </button>
            <button className="flex items-center gap-[6px] text-[15px] font-bold text-[var(--accent,#1132ee)]" style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0 8px 12px", letterSpacing: "0.15px" }}>
              <Icon name="refresh" size={18} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center overflow-y-auto bg-white" style={{ paddingTop: 64 }}>
        <div style={{ width: 480 }}>
          <h1 className="text-center font-bold text-[var(--foreground-primary,#1a1a1a)]" style={{ fontSize: 24, marginBottom: 32 }}>
            New Visit
          </h1>

          <div className="flex flex-col" style={{ gap: 16 }}>
            <div className="flex flex-col" style={{ gap: 4 }}>
              <label className="font-bold text-[var(--foreground-primary,#1a1a1a)]" style={{ fontSize: 12, letterSpacing: "0.24px" }}>First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter patient first name" className="outline-none focus:border-[var(--accent,#1132ee)]" style={{ height: 48, border: "1px solid #ccc", borderRadius: 6, padding: "0 12px", fontSize: 15, color: "var(--foreground-primary,#1a1a1a)", fontFamily: "Lato, sans-serif", width: "100%", boxSizing: "border-box" }} />
            </div>

            <div className="flex flex-col" style={{ gap: 4 }}>
              <label className="font-bold text-[var(--foreground-primary,#1a1a1a)]" style={{ fontSize: 12, letterSpacing: "0.24px" }}>Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter patient last name" className="outline-none focus:border-[var(--accent,#1132ee)]" style={{ height: 48, border: "1px solid #ccc", borderRadius: 6, padding: "0 12px", fontSize: 15, color: "var(--foreground-primary,#1a1a1a)", fontFamily: "Lato, sans-serif", width: "100%", boxSizing: "border-box" }} />
            </div>

            <div className="flex" style={{ gap: 12 }}>
              <div ref={templateRef} className="flex flex-col flex-1 relative" style={{ gap: 4 }}>
                <label className="font-bold text-[var(--foreground-primary,#1a1a1a)]" style={{ fontSize: 12, letterSpacing: "0.24px" }}>Template</label>
                <button onClick={() => setTemplateOpen(o => !o)} className="flex items-center justify-between w-full outline-none hover:border-[var(--foreground-secondary,#666)] transition-colors" style={{ height: 48, border: "1px solid #ccc", borderRadius: 6, padding: "0 12px", fontSize: 15, background: "white", cursor: "pointer", fontFamily: "Lato, sans-serif", boxSizing: "border-box" }}>
                  <span style={{ color: template ? "var(--foreground-primary,#1a1a1a)" : "#808080" }}>{template || "Select Template"}</span>
                  <Icon name={templateOpen ? "arrow_drop_up" : "arrow_drop_down"} size={20} className="text-[var(--foreground-secondary,#666)] shrink-0" />
                </button>
                {templateOpen && (
                  <div className="absolute left-0 right-0 bg-white z-10 overflow-y-auto" style={{ top: "100%", marginTop: 4, border: "1px solid #ccc", borderRadius: 6, boxShadow: "0 4px 16px rgba(0,0,0,0.10)", maxHeight: 240 }}>
                    {TEMPLATES.map((t) => (
                      <button key={t} onClick={() => { setTemplate(t); setTemplateOpen(false); }} className={`flex items-center w-full text-left transition-colors text-[var(--foreground-primary,#1a1a1a)] outline-none ${template === t ? "bg-[var(--litmus-25,#f1f3fe)] font-bold" : "hover:bg-[var(--surface-1,#f7f7f7)]"}`} style={{ padding: "10px 12px", fontSize: 15, fontFamily: "Lato, sans-serif", border: "none", cursor: "pointer" }}>
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
                    <button key={vt} onClick={() => setVisitType(vt)} className="flex-1 text-[13px] font-bold transition-all" style={{ height: "100%", background: visitType === vt ? "white" : "transparent", color: visitType === vt ? "var(--foreground-primary,#1a1a1a)" : "#808080", border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "Lato, sans-serif", boxShadow: visitType === vt ? "0 4px 8px rgba(0,0,0,0.07)" : "none" }}>
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
