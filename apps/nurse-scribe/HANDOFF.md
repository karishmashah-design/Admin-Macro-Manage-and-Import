# Nurse Scribe Prototype — Handoff to Cyvian

**From:** Karishma Shah (karishma.shah@commure.com)  
**To:** Cyvian Chen (cyvian.chen@commure.com)

---

## Quick Links

| Resource | URL |
|---|---|
| Live prototype | https://nurse-scribe.vercel.app |
| Vercel dashboard | https://vercel.com/karishmashah-projects/nurse-scribe |
| Karishma's fork (code) | https://github.com/karishmashah-design/Ambient-Prototypes |
| Cyvian's repo (merge target) | https://github.com/cyvianchen-design/Ambient-Prototypes |
| Figma — Recording screen (Physician 360 ref) | https://www.figma.com/design/uZj6qgqSAa9N0uA6JD6PLK/Super-App-V2?node-id=7659-115488 |
| Figma — Design System | https://www.figma.com/design/p8vIIGE9wPsJI9llj4luac/Scribe-Design-System |

---

## What Was Built

### Screen 1 — Review & Edit
`VersionSwitcher: R1 / Review & Edit`

- **Sidebar:** Patient list grouped by date, collapsible per patient, filter panel (date range / sort / status), expand/collapse all
- **Detail panel:** Tab switcher (template tab + Transcripts tab), section accordion, field types (text, radio, multiselect chips), citation badge system (hover-triggered popovers showing transcript source), inline editing
- **`hasTranscript` flag:** Transcripts tab is non-clickable (not grayed, just disabled) when no transcript exists for that scribe
- **Badge placement:** Citation badges appear next to field *labels* (not after field values) to avoid line-wrap issues with long text

### Screen 2 — Recording Cue
`Full-screen overlay — triggered via RecordingContext when nurse hits Start Recording`

**Left panel (gradient):**
- Recording / Paused status label
- Live timer
- Required-field progress dots (one dot per required item, fills white when captured)
- Animated waveform (flattens when paused)
- Pause Recording button (stroke-only, no fill)
- End Visit button (white fill)

**Right panel (white):**
- Live transcript feed — text appears as nurse speaks, most recent line dark, older lines muted
- Cue Sheet — condition-aware gap list with three visual tiers (see Design Decisions)

---

## Recording Entry Points

Three ways to start recording:

1. **Visits page** → click patient name → first/last name auto-fills → select template → Start Recording
2. **Scribes page** → click patient name → first/last name auto-fills → select template → Start Recording
3. **"Record New Scribe"** button on either page → clears form → type new patient name → select template → Start Recording

Start Recording button is disabled (gray) until both name and template are filled.

---

## Architecture

### Key new files

| File | Purpose |
|---|---|
| `src/context/RecordingContext.tsx` | React context holding `RecordingInfo` (patientName, template, visitType) and `startRecording()`. Lets ScribesPage / VisitsPage (deep inside VersionSwitcher) trigger the fullscreen overlay at App level — without prop-drilling through the DS `VersionSwitcher` component. |
| `src/screens/RecordingCuePage.tsx` | The recording screen. Contains `DEMO_GAPS` (condition-aware gap items) and `DEMO_TRANSCRIPT` (simulated speech events). These two constants are the **production integration points** — replace with real data. |
| `src/screens/ScribesPage.tsx` | Updated: uses RecordingContext, patient name click-to-fill, Start Recording wiring |
| `src/screens/VisitsPage.tsx` | Same updates as ScribesPage |
| `src/App.tsx` | Wraps everything in `RecordingContext.Provider`. When recording is active, `VersionSwitcher` is replaced by fullscreen `RecordingCuePage`. |

### Pre-existing / unchanged
- `packages/ui/` — **DO NOT MODIFY** (Cyvian-owned DS)
- `src/screens/ScribeDetailPage.tsx` — Review & Edit screen, citation system, hover popovers

### Recording flow diagram
```
ScribesPage / VisitsPage
  └─ useContext(RecordingContext) → startRecording({ patientName, template, visitType })
       └─ App.tsx sets recording state
            └─ VersionSwitcher unmounts, RecordingCuePage mounts fullscreen
                 └─ onEnd() → clears recording state → VersionSwitcher remounts
```

---

## Cue Sheet Design Decisions

### 1. Condition-aware gap list — not a generic checklist
The right panel shows 8–12 items specific to the patient's **condition + template**, not all 500 EHR fields.

- Hip fracture → DVT prophylaxis, neurovascular check, wound/dressing, mobility, weight-bearing status
- Pneumonia → SpO₂ trend, breath sounds, culture status, temperature
- CHF → daily weight, fluid balance, edema, O₂ requirements

Currently hardcoded for Maria Santos (hip fracture) in `DEMO_GAPS`. In production, this would be a `CONDITION_GAPS` lookup: `condition keyword → GapItem[]`.

### 2. Three-tier visual system

| Tier | Visual | Meaning |
|---|---|---|
| Required | Red dot + red `Required` badge + red tint border | Must be verbalized before ending |
| Also relevant | Amber dot + amber condition tag (`Hip fracture`, `Ortho recovery`, etc.) + `Also relevant for this patient` divider | Surfaced because of this patient's specific condition — not generic |
| Captured | Green check + strikethrough + badges fade gray | Confirmed captured — stays visible for verification |

### 3. Items stay visible when captured — they never disappear
Earlier version made items animate out. Revised after thinking through nurse mental model: the nurse needs to see what's **done** as confirmation, not just what's left. Disappearing items removed the ability to verify that required items were actually covered.

### 4. Transcript-driven captures
Capture events are tied to specific utterances (e.g., "Patient reports pain at 4 out of 10" → `pain_score` captured). In production, this would be NLP entity extraction from a live speech-to-text stream.

In `DEMO_TRANSCRIPT`, each entry is: `{ text: string, atSecond: number, capturesIds: string[] }`.

### 5. RecordingContext pattern
The fullscreen overlay needs to live above `VersionSwitcher` (a DS component we can't modify). React Context at App level is the clean solution — no prop drilling, no DS changes needed.

### 6. Safety net mental model — not form-filling
Nurses have a rehearsed assessment flow. The cue sheet is NOT a script. It's a "did I miss anything?" safety net. Hints are actionable prompts, not field names:
- ✅ "Ask 0–10, location, and how it compares to baseline"
- ❌ "Pain score: not yet covered"

---

## What Cyvian Takes Over

### Immediate — to make demo production-quality

1. **Wire condition/diagnosis into RecordingCuePage**
   - Add `condition?: string` to `RecordingInfo` in `RecordingContext.tsx`
   - In `ScribesPage.tsx` / `VisitsPage.tsx`, pass `patientMeta` (e.g. "Hip Fracture · 72 · F") as condition when calling `startRecording()`
   - In `RecordingCuePage.tsx`, replace `DEMO_GAPS` with a lookup: `CONDITION_GAPS[condition] ?? DEFAULT_GAPS`

2. **Replace DEMO_TRANSCRIPT with live speech-to-text**
   - Web Speech API (`window.SpeechRecognition`) for browser prototype
   - Or server-sent events / WebSocket from a backend ASR service
   - Each transcript result triggers NLP entity extraction → maps to gap IDs

3. **Build CONDITION_GAPS map** (in production this might come from backend config)
   ```ts
   const CONDITION_GAPS: Record<string, GapItem[]> = {
     "hip fracture":  [...],
     "pneumonia":     [...],
     "chf":           [...],
     "dka":           [...],
     "chest pain":    [...],
     "copd":          [...],
     "post-op":       [...],
   };
   ```

### Next milestone

- **End Visit → navigate to new scribe** — currently End Visit just returns to the VersionSwitcher home. Should navigate to `ScribeDetailPage` with the newly created scribe loaded.
- **Partial capture state** — nurse mentions a topic but key detail is missing (e.g., mentions pain but no score → amber partial state with prompt). GapItem already has a `priority` field; extend to support partial.
- **Mobile responsive** — prototype is desktop-first. Right panel collapses or tabs on narrow screens.
- **Condition clusters** — add condition groups: ortho, cardiac, respiratory, neuro, metabolic, surgical, psych, sepsis.

### DS work (Cyvian-owned)
- `src/components/MicIcon.tsx` → move to `packages/ui` if used across multiple prototypes
- `src/components/ScribeListItem.tsx` and `VisitListItem.tsx` → evaluate for `packages/ui` promotion

---

## Getting the Code (for Cyvian)

### Option A — Pull from Karishma's fork
```bash
# In Cyvian's local clone of Ambient-Prototypes:
git remote add karishma https://github.com/karishmashah-design/Ambient-Prototypes.git
git fetch karishma
git checkout -b nurse-scribe karishma/main
# Review, then merge into main
```

### Option B — GitHub PR
Karishma opens a PR from `karishmashah-design/Ambient-Prototypes → cyvianchen-design/Ambient-Prototypes`.

> **Note for Karishma:** GitHub token in the git remote has expired. To refresh:
> ```bash
> git remote set-url origin https://github.com/karishmashah-design/Ambient-Prototypes.git
> gh auth login
> git push origin main
> ```

---

## Running Locally

```bash
# Prerequisites: Node.js 18+, pnpm
git clone https://github.com/karishmashah-design/Ambient-Prototypes.git
cd Ambient-Prototypes
pnpm install
pnpm --filter nurse-scribe dev -- --port 5175
# Open: http://localhost:5175
```

**Deploy to Vercel (Karishma's project):**
```bash
cd Ambient-Prototypes
npx vercel --prod
```

---

## Video Walkthrough Script
*Record as a Loom (~6 min) and attach link to the PR.*

**Intro (30s)**
> "This is the nurse ambient scribe prototype covering the end-to-end flow — starting a recording, the live cue sheet, and reviewing the completed note."

**Part 1 — Entry points (1 min)**
- Go to Visits, click Maria Santos → name auto-fills
- Select Shift Assessment → Start Recording activates
- Show same from Scribes tab
- Show Record New Scribe clearing the form

**Part 2 — Recording Cue screen (2 min)**
- Walk through the layout: left = recording controls, right = white panel
- Watch transcript lines appear in real time
- Point out the three tiers: red Required, amber condition-tagged contextual, green Captured
- Show that captured items stay visible (don't disappear) — nurse can verify required items were hit
- Wait for DVT prophylaxis to capture (shows required badge going gray)

**Part 3 — Pause (30s)**
- Hit Pause → waveform flattens, timer stops, captures freeze
- Resume → everything restarts

**Part 4 — Review & Edit (2 min)**
- Hit End Visit → back to main app
- Switch to Review & Edit screen
- Select Maria Santos → Shift Assessment in sidebar
- Walk through fields, hover a citation badge to show transcript popover
- Show Handoff scribe → Transcripts tab non-clickable

**Part 5 — Handoff callouts (30s)**
> "Two constants to replace for production: `DEMO_GAPS` (swap with condition-driven lookup) and `DEMO_TRANSCRIPT` (swap with live speech-to-text). Everything else is wired."
