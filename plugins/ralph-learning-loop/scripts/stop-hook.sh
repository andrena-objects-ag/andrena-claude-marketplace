#!/bin/bash
# Ralph Learning Loop Stop Hook
# This hook prevents Claude from stopping if the learning loop is incomplete
# It checks the stop_hook_active flag to prevent infinite loops

# Read hook input from stdin
input=$(cat)

# Check if stop hook is already active (prevents infinite loops)
stop_hook_active=$(echo "$input" | jq -r '.stop_hook_active // false')

if [ "$stop_hook_active" = "true" ]; then
  # Another stop hook is already continuing, don't re-trigger
  exit 0
fi

# Check if we're in a Ralph Learning Loop context
# The loop sets environment variables that we can check
iteration="${RALPH_ITERATION:-0}"
max_iterations="${RALPH_MAX_ITERATIONS:-10}"

# If iteration count is less than max, continue the loop
if [ "$iteration" -lt "$max_iterations" ]; then
  echo "Ralph Learning Loop: Iteration $iteration of $max_iterations. Continuing..." >&2
  # Exit code 2 blocks stopping, forcing Claude to continue
  exit 2
fi

# Allow stop if max iterations reached
exit 0
