#!/bin/bash
# Reads packages/ui/src/index.ts and rewrites the component + icon list in CLAUDE.md

ROOT="$(git rev-parse --show-toplevel)"
INDEX="$ROOT/packages/ui/src/index.ts"
CLAUDE_MD="$ROOT/CLAUDE.md"

# Extract exported component/icon names (non-type exports)
COMPONENTS=$(grep -E '^export \{ ' "$INDEX" | grep -v '^export type' | grep -oE '\{[^}]+\}' | tr -d '{}' | tr ',' '\n' | tr -d ' ' | grep -v '^$' | sort)

COMPONENT_LINE=$(echo "$COMPONENTS" | tr '\n' ',' | sed 's/,$//' | sed 's/,/, /g')

# Replace the Available components line in CLAUDE.md
sed -i '' "s/^\`.*\` (import from \`@ds\/ui\`)/\`$COMPONENT_LINE\` (import from \`@ds\/ui\`)/" "$CLAUDE_MD"

echo "Synced DS component list to CLAUDE.md"
