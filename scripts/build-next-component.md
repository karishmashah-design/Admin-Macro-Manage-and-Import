# Build Next DS Component

You are running an autonomous overnight loop to build Scribe Design System components into `packages/ui` of the Ambient Prototypes repo at `/Users/cyvianchen/Desktop/Ambient Prototypes`.

## Your job each iteration

1. **Read the queue** — read `/Users/cyvianchen/Desktop/Ambient Prototypes/component-queue.json`
2. **Check for work** — if `pending` is empty, print "Queue empty — all components built!" and stop (do not schedule another iteration).
3. **Take the first item** from `pending`. If this exact item was the last thing you attempted AND it's still in `pending` (meaning it failed last time), move it to `questions` with note "Failed on second attempt — needs manual review" and take the next item instead.
4. **Look up the component in Figma**:
   - Use `search_design_system` with the component name as query, fileKey `p8vIIGE9wPsJI9llj4luac`, filtered to libraryKey `lk-fcc363be37010ee4c2e2489ab98a544f8aead88d6621d339262ac65cf0f342f93ffbddc528610a6260300d2e9ef1895220a2e86277db2264084322690dcb91fc`
   - Use `get_design_context` on the matching component to get full specs
   - If the component is not found or the spec is too ambiguous to build confidently, move it to `questions` with a specific note, save the queue, and move on to the next item.
5. **Build the component** in `packages/ui/src/components/`:
   - Follow all rules in CLAUDE.md (tokens, Tailwind, no hardcoded colors, no all-caps, etc.)
   - Apply Figma token name translations: `--text/default` → `--foreground-primary`, `--text/subheading` → `--foreground-secondary`, `--text/brand` → `--accent`, `--surface/3` → `--surface-3`, etc.
   - Build all meaningful variants as props on one component (not separate files)
   - Export the new component(s) from `packages/ui/src/index.ts`
   - Add the component to `apps/ds-preview/src/App.tsx` using the existing tab/section pattern:
     - Each tab is a `function XxxTab()` using the `Section` and `Row` helpers already defined in the file
     - Simple atomic components (Divider, Notification Dot, Tooltip, etc.) should be grouped onto the most relevant existing tab rather than getting their own tab
     - Complex or large components (Table, Audio Player, Date Picker, etc.) should get their own new tab: add to the `tabs` array, add a new `function XxxTab()`, and register in `tabComponents`
     - Show all meaningful variants and states using `Section` (for visual groups) and `Row` (for labeled rows of variants)
   - Add the component name to the "Available components" list in CLAUDE.md
6. **Type-check** — run `cd "/Users/cyvianchen/Desktop/Ambient Prototypes" && pnpm --filter @ds/ui build 2>&1 | tail -20` to verify it compiles. If it fails, fix the errors before moving on.
7. **Update the queue** — move the item from `pending` to `done`, save `component-queue.json`.
8. **Stop** — the loop framework will restart you for the next component. Do not loop internally.

## Rules

- **One component per iteration.** Never try to build two at once.
- **Questions are fine.** If anything is ambiguous — unclear variants, missing token mappings, component looks outdated vs what's in `packages/ui` — move it to `questions` immediately with a specific note. Do not guess on ambiguous specs.
- **Never modify existing components.** Only add new files and new exports. Do not touch files for components already in `done`.
- **Never build app-local components.** Everything goes in `packages/ui`.
- **Keep ds-preview in sync.** Every new component needs a preview entry.
- **Verify CLAUDE.md ownership** before any write: run `git config user.email` — it must be `cyvian.chen@commure.com`. If it's not, stop immediately and add a note to `questions`.

## What to put in `questions`

Move an item to questions (with a clear note) if:
- The Figma spec is not found in the library search
- The component has variants that are unclear or contradictory
- It depends on another component that isn't built yet
- The Figma design looks significantly different from what's described in CLAUDE.md (possible outdated spec)
- The component is highly complex and you're not confident you'd get it right without input

## Queue file format reminder

```json
{
  "pending": [{ "name": "ComponentName", "figma_page": "PageName" }],
  "done": [{ "name": "ComponentName", "note": "built as X.tsx" }],
  "questions": [{ "name": "ComponentName", "figma_page": "PageName", "question": "Specific question here" }]
}
```
