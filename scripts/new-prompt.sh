#!/usr/bin/env bash
set -euo pipefail
DATE=$(date +"%Y-%m-%d")
SLUG="${1:-task}"
FILE="prompts/${DATE}-${SLUG}.md"
cp prompts/_TEMPLATE.md "$FILE"
echo "Created $FILE"