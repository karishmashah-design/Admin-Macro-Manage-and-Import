# Ambient Prototypes — Onboarding

Welcome! This repo is a shared workspace for design prototypes backed by a shared React component library.

---

## What's here

```
packages/ui/     # Shared design system — components, tokens, icons (Cyvian only)
apps/<name>/     # One folder per prototype
scripts/         # new-project.sh scaffold, DS sync
```

This is a **pnpm monorepo**. Always install from the root:

```bash
pnpm install
```

---

## Setup

1. Clone the repo: `git clone https://github.com/cyvianchen-design/Ambient-Prototypes.git`
2. Install dependencies: `pnpm install`
3. Scaffold a new prototype: `pnpm new-project <your-project-name>`
4. Start your app: `pnpm --filter <your-project-name> dev`

**Returning to work?** Always pull before starting a session so you have the latest DS components:

```bash
git pull
```

Claude Code also does this automatically at the start of every session — but if you're working outside Claude, pull manually.

---

## The one rule

**Never modify `packages/ui`.** That's Cyvian's design system — she owns it.

If your prototype needs a component that doesn't exist in `packages/ui` yet:
- Build it as a standalone component inside your own app: `apps/<your-project>/src/components/`
- It stays local to your prototype. That's fine.
- When Cyvian eventually adds it to the DS, future prototypes will use the real version.

Think of it like detaching a component in Figma — but cleaner, because you're building new screens from scratch each time, not copying frames.

---

## Using DS components

Import from `@ds/ui`:

```tsx
import { Button, Checkbox, TextField } from "@ds/ui";
```

See `packages/ui/src/index.ts` for the full list of what's available.

---

## Design tokens

Use CSS custom properties via Tailwind arbitrary values:

```tsx
className="text-[var(--foreground-primary,#1a1a1a)]"
```

Key tokens: `--foreground-primary`, `--foreground-secondary`, `--accent`, `--surface-1/2/3`

Full token list is in `packages/ui/src/styles/tokens.css`.

---

## Icons

```tsx
import { Icon } from "@ds/ui";
<Icon name="arrow_back" size={20} />   // any Material Symbol Rounded name
```

Custom icons (AmbientLogo, Dictation, etc.) are also exported from `@ds/ui`.

---

## Using Claude Code with this project

Open Claude Code in the project root — it will automatically load `CLAUDE.md` which has the full component docs, token reference, and conventions. You don't need to explain the project structure; Claude already knows it.

The project is also connected to the Scribe Design System Figma file. If you're building something and need to match a design, share a screenshot or Figma link and Claude will look up the component spec automatically.

---

## Deploying

```bash
cd "/Users/cyvianchen/Desktop/Ambient Prototypes"
npx vercel --prod
```

Ask Cyvian if you need Vercel access.
