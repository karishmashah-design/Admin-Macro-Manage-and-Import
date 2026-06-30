import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@ds/ui";

type GapPriority = "critical" | "confirm" | "optional";

type GapItem = {
  id: string;
  label: string;
  hint: string;          // actionable prompt — what to say or ask
  priority: GapPriority;
  required: boolean;
  conditionTag?: string; // why this item is surfaced for this patient
};

type TranscriptEvent = {
  text: string;
  atSecond: number;
  capturesIds: string[];
};

// Hip fracture · Shift Assessment — condition + template driven
// hints = actual cues for what to verbalize, not status messages
const DEMO_GAPS: GapItem[] = [
  { id: "pain_score",      label: "Pain score",            hint: "Ask 0–10, location, and how it compares to baseline",         priority: "critical", required: true  },
  { id: "dvt_prophylaxis", label: "DVT prophylaxis",       hint: "Confirm Lovenox given or state clinical reason if held",       priority: "critical", required: true  },
  { id: "neurovascular",   label: "Neurovascular check",   hint: "Verbalize cap refill, sensation, and toe movement",            priority: "critical", required: true  },
  { id: "wound_dressing",  label: "Wound / dressing",      hint: "Describe appearance, drainage, and dressing integrity",        priority: "confirm",  required: false, conditionTag: "Surgical site"      },
  { id: "mobility",        label: "Mobility today",        hint: "PT visit — state distance walked and level of assist",         priority: "confirm",  required: false, conditionTag: "Ortho recovery"     },
  { id: "weight_bearing",  label: "Weight bearing status", hint: "State current WB order: TTWB / WBAT / FWB",                   priority: "confirm",  required: false, conditionTag: "Hip fracture"       },
  { id: "fall_risk",       label: "Fall risk",             hint: "Any changes this shift? State current precautions in place",   priority: "confirm",  required: false, conditionTag: "High risk post-op"  },
  { id: "patient_ed",      label: "Patient education",     hint: "What was taught and confirm patient understanding",            priority: "optional", required: true  },
  { id: "discharge_goal",  label: "Discharge goal",        hint: "State target date, destination, and any barriers identified",  priority: "optional", required: false, conditionTag: "Discharge planning" },
];

const DEMO_TRANSCRIPT: TranscriptEvent[] = [
  { text: "Starting shift assessment for Maria Santos, room 4B. Hip fracture, day 2 post-op.",          atSecond: 4,  capturesIds: [] },
  { text: "Vitals stable — BP 128 over 82, heart rate 74, temp 98.4, SpO₂ 96% on room air.",            atSecond: 9,  capturesIds: [] },
  { text: "Patient reports pain at 4 out of 10, right hip incision site.",                               atSecond: 14, capturesIds: ["pain_score"] },
  { text: "She describes it as a dull ache, manageable with current oral pain regimen.",                 atSecond: 19, capturesIds: [] },
  { text: "Wound is clean and dry, dressing intact, no signs of redness, swelling, or drainage.",       atSecond: 25, capturesIds: ["wound_dressing"] },
  { text: "Right lower extremity — cap refill under 2 seconds, sensation intact, patient can wiggle toes.", atSecond: 32, capturesIds: ["neurovascular"] },
  { text: "PT came by at 10 AM. Maria walked 20 feet with a walker, weight bearing as tolerated.",       atSecond: 39, capturesIds: ["mobility", "weight_bearing"] },
  { text: "Lovenox 40mg given subcutaneously at 0800 per DVT prophylaxis protocol.",                     atSecond: 45, capturesIds: ["dvt_prophylaxis"] },
  { text: "Fall risk remains moderate. Bed alarm on, call light within reach, non-slip socks on.",       atSecond: 52, capturesIds: ["fall_risk"] },
  { text: "Reviewed discharge expectations with patient and family — goal is home with PT follow-up.",   atSecond: 59, capturesIds: ["discharge_goal"] },
];

const WAVEFORM_HEIGHTS = [20, 31, 46, 37, 31, 47, 32, 20, 12, 8, 8, 12, 12, 20, 16, 12, 30, 23, 38, 71, 60, 86, 59, 53, 39, 24, 52, 34, 43, 28, 20];

function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

type Props = {
  patientName?: string;
  template?: string;
  visitType?: string;
  onEnd?: () => void;
};

export default function RecordingCuePage({
  patientName = "Maria Santos",
  template = "Shift Assessment",
  visitType = "In-Person",
  onEnd,
}: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [waveOffset, setWaveOffset] = useState(0);
  const [capturedIds, setCapturedIds] = useState<Set<string>>(new Set());
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());
  const [transcriptLines, setTranscriptLines] = useState<string[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setWaveOffset(o => (o + 1) % WAVEFORM_HEIGHTS.length), 120);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    const events = DEMO_TRANSCRIPT.filter(e => e.atSecond === elapsed);
    if (events.length === 0) return;

    events.forEach(event => {
      if (event.text) setTranscriptLines(prev => [...prev, event.text]);

      if (event.capturesIds.length > 0) {
        const ids = new Set(event.capturesIds);
        setCapturedIds(prev => new Set([...prev, ...ids]));
        setFlashIds(prev => new Set([...prev, ...ids]));
        setTimeout(() => {
          setFlashIds(prev => {
            const next = new Set(prev);
            ids.forEach(id => next.delete(id));
            return next;
          });
        }, 1600);
      }
    });
  }, [elapsed]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcriptLines]);

  const requiredItems  = DEMO_GAPS.filter(g => g.required);
  const requiredDone   = requiredItems.filter(g => capturedIds.has(g.id)).length;
  const requiredMissing = requiredItems.length - requiredDone;
  const allRequiredDone = requiredMissing === 0;

  // Sort: required pending → contextual pending → optional pending → captured
  const sortedGaps = [...DEMO_GAPS].sort((a, b) => {
    const aCaptured = capturedIds.has(a.id);
    const bCaptured = capturedIds.has(b.id);
    if (aCaptured !== bCaptured) return aCaptured ? 1 : -1;
    if (a.required !== b.required) return a.required ? -1 : 1;
    const order: Record<GapPriority, number> = { critical: 0, confirm: 1, optional: 2 };
    return order[a.priority] - order[b.priority];
  });

  const firstCapturedIdx = sortedGaps.findIndex(g => capturedIds.has(g.id));
  // Index where contextual (non-required, non-captured) items start
  const firstContextualIdx = sortedGaps.findIndex(g => !capturedIds.has(g.id) && !g.required);

  const displayHeights = Array.from({ length: WAVEFORM_HEIGHTS.length }, (_, i) =>
    WAVEFORM_HEIGHTS[(i + waveOffset) % WAVEFORM_HEIGHTS.length]
  );

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh", fontFamily: "Lato, sans-serif", overflow: "hidden",
      background: "linear-gradient(135deg, #3a2fba 0%, #4c5ce6 40%, #2d1fa8 70%, #4c5ce6 100%)",
    }}>
      {/* Top bar */}
      <div style={{ height: 48, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "white", letterSpacing: "0.34px" }}>{patientName}</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{template} · {visitType}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", gap: 20, padding: "0 20px 20px", overflow: "hidden", minHeight: 0 }}>

        {/* ── Left: recording controls ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", paddingBottom: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, flex: 1, justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: "white", letterSpacing: "0.34px" }}>
                {paused ? "Paused" : "Recording"}
              </span>
              <span style={{ fontSize: 44, fontWeight: 700, color: "white", fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
                {formatTime(elapsed)}
              </span>
              {/* Required progress */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {requiredItems.map(g => (
                    <div key={g.id} style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: capturedIds.has(g.id) ? "white" : "rgba(255,255,255,0.3)",
                      transition: "background 0.4s ease",
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                  {requiredDone}/{requiredItems.length} required
                </span>
              </div>
            </div>
            {/* Waveform */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, height: 101, width: "100%", maxWidth: 335, overflow: "hidden" }}>
              {displayHeights.map((h, i) => (
                <div key={i} style={{
                  width: 5, flexShrink: 0, borderRadius: 3,
                  height: paused ? 4 : h,
                  background: paused ? "rgba(255,255,255,0.3)" : `rgba(255,255,255,${0.4 + (h / 101) * 0.6})`,
                  transition: "height 0.12s ease, background 0.3s ease",
                }} />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 335 }}>
            <button onClick={() => setPaused(p => !p)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, background: "transparent", border: "1.5px solid rgba(255,255,255,0.7)", borderRadius: 8, fontSize: 15, fontWeight: 700, color: "white", cursor: "pointer", fontFamily: "Lato, sans-serif" }}>
              <Icon name={paused ? "mic" : "pause"} size={18} />
              {paused ? "Resume Recording" : "Pause Recording"}
            </button>
            <button onClick={onEnd}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, background: "rgba(255,255,255,0.95)", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, color: "#1a1a1a", cursor: "pointer", fontFamily: "Lato, sans-serif" }}>
              <Icon name="stop_circle" size={18} />
              End Visit
            </button>
          </div>
        </div>

        {/* ── Right: transcript + cue list ── */}
        <div style={{ width: "min(540px, 48%)", flexShrink: 0, background: "white", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 4px 16px 2px rgba(0,0,0,0.12)" }}>

          {/* Header */}
          <div style={{ padding: "14px 20px 12px", borderBottom: "1px solid rgba(0,0,0,0.07)", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: "#1a1a1a", flex: 1, letterSpacing: "0.34px" }}>Cue Sheet</span>
              {requiredMissing > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", background: "rgba(187,20,17,0.08)", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#bb1411" }}>
                  <Icon name="error" size={12} />{requiredMissing} required missing
                </span>
              )}
              {allRequiredDone && capturedIds.size < DEMO_GAPS.length && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", background: "rgba(63,141,67,0.08)", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#3f8d43" }}>
                  <Icon name="check_circle" size={12} />Required done
                </span>
              )}
              {capturedIds.size === DEMO_GAPS.length && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", background: "rgba(63,141,67,0.1)", borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#3f8d43" }}>
                  <Icon name="check_circle" size={12} />All clear
                </span>
              )}
            </div>
          </div>

          {/* Live transcript */}
          <div ref={transcriptRef} style={{
            flexShrink: 0, maxHeight: 148, overflowY: "auto",
            padding: "10px 20px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            background: "rgba(0,0,0,0.015)",
          }}>
            {transcriptLines.length === 0 ? (
              <p style={{ margin: 0, color: "#bbb", fontSize: 12, fontStyle: "italic" }}>Listening…</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {transcriptLines.map((line, i) => (
                  <p key={i} style={{
                    margin: 0, fontSize: 12, lineHeight: 1.5,
                    color: i === transcriptLines.length - 1 ? "#333" : "#bbb",
                    transition: "color 2s ease",
                  }}>
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Cue list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {sortedGaps.map((g, idx) => {
                const captured = capturedIds.has(g.id);
                const flashing = flashIds.has(g.id);
                const showCapturedDivider = idx === firstCapturedIdx && firstCapturedIdx > 0;
                const showContextualDivider = !captured && idx === firstContextualIdx && firstContextualIdx > 0;

                return (
                  <div key={g.id}>
                    {showContextualDivider && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 4px 6px" }}>
                        <div style={{ flex: 1, height: 1, background: "rgba(180,83,9,0.15)" }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#b45309", letterSpacing: "0.2px" }}>Also relevant for this patient</span>
                        <div style={{ flex: 1, height: 1, background: "rgba(180,83,9,0.15)" }} />
                      </div>
                    )}
                    {showCapturedDivider && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 4px 8px" }}>
                        <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.07)" }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.2px" }}>Captured</span>
                        <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.07)" }} />
                      </div>
                    )}

                    <div style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "9px 12px", borderRadius: 8,
                      background: flashing
                        ? "rgba(63,141,67,0.08)"
                        : captured
                          ? "transparent"
                          : g.required
                            ? "rgba(187,20,17,0.03)"
                            : g.conditionTag
                              ? "rgba(180,83,9,0.02)"
                              : "transparent",
                      border: !captured && g.required
                        ? "1px solid rgba(187,20,17,0.10)"
                        : "1px solid transparent",
                      transition: "background 0.6s ease, border-color 0.4s ease",
                    }}>
                      {/* Icon / dot */}
                      {captured ? (
                        <Icon name="check_circle" size={16} style={{ color: "#3f8d43", flexShrink: 0, marginTop: 1 }} />
                      ) : (
                        <div style={{
                          width: 7, height: 7, borderRadius: "50%", flexShrink: 0, marginTop: 5,
                          background: g.required ? "#bb1411" : g.priority === "confirm" ? "#b45309" : "#c8c8c8",
                        }} />
                      )}

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: 14, fontWeight: captured ? 400 : 600,
                            color: captured ? "#aaa" : "#1a1a1a",
                            textDecoration: captured ? "line-through" : "none",
                            textDecorationColor: "#ccc",
                            transition: "color 0.4s ease",
                          }}>
                            {g.label}
                          </span>
                          {g.required && (
                            <span style={{
                              fontSize: 10, fontWeight: 700,
                              color: captured ? "#aaa" : "#bb1411",
                              background: captured ? "rgba(0,0,0,0.05)" : "rgba(187,20,17,0.1)",
                              padding: "1px 6px", borderRadius: 10, flexShrink: 0,
                              transition: "color 0.4s ease, background 0.4s ease",
                            }}>
                              Required
                            </span>
                          )}
                          {!g.required && g.conditionTag && (
                            <span style={{
                              fontSize: 10, fontWeight: 700,
                              color: captured ? "#bbb" : "#b45309",
                              background: captured ? "rgba(0,0,0,0.04)" : "rgba(180,83,9,0.08)",
                              padding: "1px 6px", borderRadius: 10, flexShrink: 0,
                              transition: "color 0.4s ease, background 0.4s ease",
                            }}>
                              {g.conditionTag}
                            </span>
                          )}
                        </div>
                        {!captured && (
                          <div style={{ fontSize: 12, color: "#999", marginTop: 2, lineHeight: 1.4 }}>
                            {g.hint}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
