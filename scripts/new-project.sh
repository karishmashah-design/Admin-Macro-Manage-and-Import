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

cp -r templates/project "$DEST"

# Replace PROJECT_NAME placeholder in files
find "$DEST" -type f | xargs sed -i '' "s/PROJECT_NAME/$NAME/g"

echo "Created $DEST"
echo "Running pnpm install..."
pnpm install

echo ""
echo "Done! Start it with:"
echo "  cd $DEST && pnpm dev"
