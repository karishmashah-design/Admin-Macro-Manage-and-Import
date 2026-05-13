#!/bin/bash
set -e

NAME=$1

if [ -z "$NAME" ]; then
  echo "Usage: pnpm new-project <project-name>"
  exit 1
fi

DEST="apps/$NAME"

if [ -d "$DEST" ]; then
  echo "Error: $DEST already exists."
  exit 1
fi

# Find next available port starting from 5173
PORT=5173
for config in apps/*/vite.config.ts; do
  USED=$(grep -o 'port: [0-9]*' "$config" 2>/dev/null | grep -o '[0-9]*' || echo "")
  if [ "$USED" = "$PORT" ]; then
    PORT=$((PORT + 1))
  fi
done

cp -r templates/project "$DEST"

# Replace PROJECT_NAME placeholder in files
find "$DEST" -type f | xargs sed -i '' "s/PROJECT_NAME/$NAME/g"

# Write port into vite config
cat > "$DEST/vite.config.ts" << EOF
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: $PORT },
});
EOF

# Append port to CLAUDE.md ports table
CLAUDE_MD="CLAUDE.md"
if grep -q "^- \`$NAME\`" "$CLAUDE_MD" 2>/dev/null; then
  echo "Port entry for $NAME already exists in CLAUDE.md"
else
  sed -i '' "s/^\\(\\*\\*Ports by app:\\*\\*\\)/\\1/" "$CLAUDE_MD"
  # Insert new port line after the last port entry
  sed -i '' "/^- \`.*\` → [0-9]/a\\
- \`$NAME\` → $PORT" "$CLAUDE_MD"
fi

echo "Created $DEST on port $PORT"
echo "Running pnpm install..."
pnpm install

echo ""
echo "Done! Start it with:"
echo "  pnpm --filter $NAME dev"
echo ""
echo "Add to CLAUDE.md ports: $NAME → $PORT"
