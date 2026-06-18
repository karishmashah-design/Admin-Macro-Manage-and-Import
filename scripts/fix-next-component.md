# Fix Next DS Component

## What this loop does
Reads `component-fixes.json`, picks the first item in `pending`, pulls the Figma visual spec, compares against the current code in `packages/ui`, applies corrections, verifies the build, and moves the item to `done`. One component per iteration.

## Rules
- **Always verify git user first**: run `git config user.email`. Must be `cyvian.chen@commure.com` before any write.
- **Never skip the Figma visual pass** — use `search_design_system` (filter by library key from the json) then `get_design_context` or `get_screenshot` to actually see what the component looks like before writing any code. The whole point of this loop is to fix things that were built wrong without checking Figma.
- **One component per iteration** — pick the first `pending` item, fix it completely, then stop.
- **If the fix requires removing a component** — check the `remove` array too. Process removals after the current pending item if they're quick (just deleting a tab/export). 
- **No all-caps text anywhere** — not in labels, buttons, table headers, dividers, or anywhere else.
- **No round elements except Avatar** — date pickers, buttons, highlights must use rounded-rect, not circles.
- **Use DS tokens** — never hardcode colors. Use `var(--token-name, #fallback)`.
- **Never modify existing screens** in apps/ — only touch `packages/ui/src/` and `apps/ds-preview/src/`.

## Figma library key
`lk-fcc363be37010ee4c2e2489ab98a544f8aead88d6621d339262ac65cf0f342f93ffbddc528610a6260300d2e9ef1895220a2e86277db2264084322690dcb91fc`

## Steps per iteration

1. **Read** `component-fixes.json` — pick the first item in `pending`.
2. **Figma visual pass** — run `search_design_system` for the component name. Then call `get_design_context` or `get_screenshot` on the most relevant result. Study the visual: colors, spacing, shape, states, variants. Note what's wrong in the current code.
3. **Read the current component file** in `packages/ui/src/components/`.
4. **Apply fixes** — rewrite only what's wrong. Preserve correct parts and the same export API unless the user's notes say otherwise.
5. **Check ds-preview** — update `apps/ds-preview/src/App.tsx` if the preview demo needs to change to reflect the fix.
6. **Handle `remove` items** — if there are items in the `remove` array, delete their tab from ds-preview and remove their export from `index.ts`. Do this now if the current component's tab is being restructured anyway.
7. **Build check** — run `pnpm --filter ds-preview build`. Fix any errors.
8. **Update queue** — move the fixed component from `pending` to `done` in `component-fixes.json`. Add a `note` field with a one-line summary of what changed.
9. **If ambiguous** — move to a `questions` array with the question, continue to next.

## Port
ds-preview runs on port 5189 (or whichever port it grabbed — check if already running before starting).

## After fixing
If there are items in `pending`, schedule next wakeup at 60s. If `pending` is empty, report done.
