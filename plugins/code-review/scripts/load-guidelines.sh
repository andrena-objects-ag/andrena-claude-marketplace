#!/bin/bash
# Load code review guidelines with custom extensions
#
# Usage:
#   source "${CLAUDE_PLUGIN_ROOT}/scripts/load-guidelines.sh"
#   echo "$REVIEW_GUIDELINES"
#
# This script loads:
# 1. Base guidelines from prompts/review-prompt.md
# 2. Custom guidelines from .claude/code-review/custom-guidelines.d/*.md (if they exist)
#
# Custom guidelines are inserted where {{CUSTOM_GUIDELINES}} appears in the base prompt.

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT}"
CUSTOM_DIR="${CLAUDE_PROJECT_DIR}/.claude/code-review/custom-guidelines.d"

# Read the base guidelines
BASE_GUIDELINES=""
if [ -f "${PLUGIN_ROOT}/prompts/review-prompt.md" ]; then
    BASE_GUIDELINES=$(cat "${PLUGIN_ROOT}/prompts/review-prompt.md")
fi

# Collect custom guidelines
CUSTOM_CONTENT=""

if [ -d "$CUSTOM_DIR" ]; then
    # Find all .md files in custom directory, sorted alphabetically
    for file in "$CUSTOM_DIR"/*.md; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            CUSTOM_CONTENT="${CUSTOM_CONTENT}## Custom: ${filename%.md}

$(cat "$file")

"
        fi
    done
fi

# Replace {{CUSTOM_GUIDELINES}} placeholder
if [ -n "$CUSTOM_CONTENT" ]; then
    REVIEW_GUIDELINES="${BASE_GUIDELINES//\{\{CUSTOM_GUIDELINES\}\}/$CUSTOM_CONTENT}"
else
    REVIEW_GUIDELINES="${BASE_GUIDELINES//\{\{CUSTOM_GUIDELINES\}\}/}"
fi

# Export for use in calling scripts
export REVIEW_GUIDELINES
