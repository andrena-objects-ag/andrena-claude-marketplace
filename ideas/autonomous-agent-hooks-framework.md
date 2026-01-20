# Autonomous Agent Hooks Framework

> **Status**: PROPOSED | **Created**: 2026-01-20 | **Category**: Agent Architecture & Autonomy
> **Priority**: HIGH | **Complexity**: HIGH

## Overview

A comprehensive hooks framework that implements the **8 abstract agency patterns** to create truly autonomous Claude Code agents capable of self-direction, self-correction, and continuous improvement without human intervention.

## Problem Statement

Current Claude Code agents are **reactive** rather than **proactive**:
- They wait for explicit task assignment
- They require human direction between steps
- They don't learn from their own experiences
- They can't recognize when their approach isn't working
- They lack meta-cognitive awareness of their own capabilities

**The gap**: We have powerful tools (hooks, subagents, skills) but lack the orchestration layer that enables true agency.

## The 8 Agency Patterns

This framework implements these abstract patterns for autonomous operation:

### 1. Temporal Goal Decomposition
Agent breaks high-level goals into time-bounded milestones and self-monitors progress.

### 2. Dual-Loop Reflection Architecture
Inner loop executes tasks; outer loop evaluates effectiveness and adjusts strategy.

### 3. Capability Discovery & Extension
Agent discovers and adapts its own toolkit over time.

### 4. Contextual Memory Synthesis
Agent builds its own experience base from session patterns.

### 5. Negentropy-Driven Orchestration
Agent self-directs toward reducing system disorder (tech debt, failing tests).

### 6. Stop Hook Auto-Continue
Agent continues until quality gates pass (not first completion).

### 7. SubagentStop Pipeline Chaining
Automatic handoffs between specialized agents.

### 8. Prompt-Based Intelligent Decisions
LLM evaluates whether to continue based on context.

## Solution: Autonomous Agent Hooks Framework

### Architecture

```
plugins/autonomous-agent/
├── core/
│   ├── agency-coordinator.md          # Main agent with hook orchestration
│   ├── patterns/
│   │   ├── temporal-decomposition.md   # Pattern 1: Goal milestones
│   │   ├── dual-loop-reflection.md     # Pattern 2: Meta-cognition
│   │   ├── capability-discovery.md     # Pattern 3: Self-toolkit awareness
│   │   ├── memory-synthesis.md         # Pattern 4: Experience building
│   │   ├── negentropy-driver.md        # Pattern 5: Self-directed priorities
│   │   ├── auto-continue.md            # Pattern 6: Quality gates
│   │   ├── pipeline-chain.md           # Pattern 7: Agent handoffs
│   │   └── intelligent-decision.md      # Pattern 8: LLM evaluation
│   ├── hooks/
│   │   ├── session-start/
│   │   │   ├── bootstrap.sh            # Initialize agency systems
│   │   │   ├── capability-scan.sh      # Discover available tools
│   │   │   └── memory-load.sh          # Load past experiences
│   │   ├── pre-tool-use/
│   │   │   ├── capability-redirect.sh  # "Is there a better tool?"
│   │   │   └── strategy-check.sh       # "Should I change approach?"
│   │   ├── post-tool-use/
│   │   │   ├── efficiency-monitor.sh   # "Was this efficient?"
│   │   │   ├── pattern-detector.sh     # "What pattern is this?"
│   │   │   └── entropy-scanner.sh      # "What needs fixing?"
│   │   ├── subagent-stop/
│   │   │   ├── pipeline-orchestrator.sh # Chain to next agent
│   │   │   └── handoff-evaluator.sh    # "Who should handle this next?"
│   │   ├── stop/
│   │   │   ├── quality-gate.sh         # Continue until gates pass
│   │   │   ├── reflection-trigger.sh    # Every N operations
│   │   │   ├── milestone-check.sh       # Goal decomposition tracker
│   │   │   └── memory-capture.sh        # "What did we learn?"
│   │   └── user-prompt-submit/
│   │       ├── context-injector.sh     # Inject relevant memories
│   │       └── goal-parser.sh          # "What are we really trying to do?"
│   └── memory/
│       ├── patterns.json               # Discovered patterns (synthesized)
│       ├── capabilities.json           # Agent's own toolkit map
│       ├── experience.json             # Session learnings
│       └── entropy-map.json            # System disorder metrics
├── skills/
│   └── autonomous-agent/
│       └── SKILL.md                    # User-invocable entry point
├── prompts/
│   ├── reflection-prompt.md            # Meta-cognitive evaluation
│   ├── decision-prompt.md              # Continue/stop evaluation
│   └── pattern-prompt.md               # Pattern recognition
└── templates/
    ├── agency-config.json             # Configuration for agency level
    └── memory-structures.json          # Memory organization schemas
```

### Component Specifications

#### 1. Agency Coordinator (Core Agent)

**File**: `core/agency-coordinator.md`

```markdown
# Autonomous Agent Coordinator

Meta-agent that orchestrates agency patterns for truly autonomous coding.

## Responsibilities

1. **Goal Decomposition** - Break user requests into milestones
2. **Progress Monitoring** - Track milestone completion
3. **Reflection Triggering** - Initiate meta-cognitive checks
4. **Capability Awareness** - Know and adapt own toolkit
5. **Memory Management** - Synthesize and retrieve experiences
6. **Entropy Reduction** - Prioritize high-value work
7. **Pipeline Orchestration** - Hand off to specialists
8. **Quality Enforcement** - Continue until standards met

## When Activated

- User invokes: `/autonomous-agent`
- Automatic: Long-running tasks (>3 operations)
- Automatic: Multi-file changes
- Automatic: Test failure remediation

## Agency Level

Configure via `memory/agency-config.json`:
- **Level 1**: Task execution (current Claude)
- **Level 2**: Self-monitoring (add reflection hooks)
- **Level 3**: Self-directing (add entropy driver)
- **Level 4**: Self-improving (add memory synthesis)
- **Level 5**: Fully autonomous (all patterns active)
```

#### 2. Temporal Goal Decomposition Pattern

**File**: `core/patterns/temporal-decomposition.md`

```markdown
# Temporal Goal Decomposition Pattern

## How It Works

1. **Parse user goal**: "Build authentication system"
2. **Decompose to milestones**:
   ```
   - Milestone 1: Database schema (estimated: 15min)
   - Milestone 2: API endpoints (estimated: 30min)
   - Milestone 3: Frontend forms (estimated: 20min)
   - Milestone 4: Testing (estimated: 15min)
   ```
3. **Track progress**: Hook checks after each operation
4. **Adjust estimates**: Learn from actual vs. estimated
5. **Report progress**: User sees milestone completion

## Hook Integration

**SessionStart**: Create milestone plan
**Stop**: "Current milestone complete? No → continue. Yes → next milestone?"
**PostToolUse**: Update milestone progress

## Memory Structure

```json
{
  "current_goal": "Build authentication system",
  "milestones": [
    {
      "id": 1,
      "name": "Database schema",
      "success_criteria": ["users table exists", "indexes created", "migrations run"],
      "estimated_seconds": 900,
      "actual_seconds": null,
      "status": "pending"
    }
  ]
}
```

## Implementation

**Hook**: `hooks/stop/milestone-check.sh`

```bash
#!/bin/bash
source "${CLAUDE_PLUGIN_ROOT}/core/memory/load-memory.sh"

# Get current milestone
current_milestone=$(jq -r '.milestones[] | select(.status == "in_progress")' "$MEMORY_FILE")

# Check if complete
if is-milestone-complete "$current_milestone"; then
  # Mark complete, check if final
  if [ "$current_milestone.id" == "$(jq '.milestones | length' "$MEMORY_FILE")" ]; then
    echo "✅ All milestones complete!" >&2
    exit 0  # Allow stop
  else
    # Move to next milestone
    jq ".milestones[$current_milestone.id].status = \"complete\"" "$MEMORY_FILE" > "${MEMORY_FILE}.tmp"
    jq ".milestones[$(($current_milestone.id + 1))].status = \"in_progress\"" "$MEMORY_FILE.tmp" > "$MEMORY_FILE"
    echo "🎯 Milestone complete. Next: $(jq -r ".milestones[$(($current_milestone.id + 1))].name" "$MEMORY_FILE")" >&2
    exit 2  # Continue to next milestone
  fi
else
  echo "⏳ Milestone in progress..." >&2
  exit 2  # Continue working
fi
```
```

#### 3. Dual-Loop Reflection Architecture

**File**: `core/patterns/dual-loop-reflection.md`

```markdown
# Dual-Loop Reflection Architecture

## Concept

- **Inner Loop**: Execute tools, complete tasks (normal operation)
- **Outer Loop**: Every N operations or on failure → "What pattern am I seeing? Should I change approach?"

## When Reflection Triggers

1. **After N operations** (configurable, default: 5)
2. **On tool failure** (exit code != 0)
3. **On repeated patterns** (same tool 3x in a row)
4. **On timeout** (operation took too long)
5. **At milestone boundaries**

## Reflection Questions

The outer loop asks:
- What worked well in the last N operations?
- What failed or was inefficient?
- Am I stuck in a loop? Should I try a different approach?
- Is there a better tool for what I'm trying to do?
- What pattern is emerging that I should remember?

## Hook Integration

**PostToolUse**: Increment operation counter, trigger reflection if threshold met
**Stop**: Reflection before allowing stop

## Memory Structure

```json
{
  "inner_loop": {
    "operations_since_reflection": 3,
    "recent_operations": [
      {"tool": "Edit", "success": true, "duration_ms": 234},
      {"tool": "Bash", "success": false, "error": "command failed"}
    ]
  },
  "outer_loop": {
    "last_reflection": null,
    "reflection_interval": 5,
    "patterns_detected": [],
    "strategy_adjustments": []
  }
}
```

## Implementation

**Hook**: `hooks/stop/reflection-trigger.sh`

```bash
#!/bin/bash
source "${CLAUDE_PLUGIN_ROOT}/core/memory/load-memory.sh"

# Check if reflection needed
ops_since_reflection=$(jq -r '.inner_loop.operations_since_reflection' "$MEMORY_FILE")
reflection_interval=$(jq -r '.outer_loop.reflection_interval' "$MEMORY_FILE")

if [ "$ops_since_reflection" -ge "$reflection_interval" ]; then
  # Trigger reflection
  echo "🤔 Triggering reflection cycle..." >&2

  # Use prompt-based hook for intelligent evaluation
  reflection_result=$(cat <<EOF | jq -r '.decision'
{
  "recent_operations": $(jq '.inner_loop.recent_operations' "$MEMORY_FILE"),
  "patterns_detected": $(jq '.outer_loop.patterns_detected' "$MEMORY_FILE"),
  "question": "Analyze the recent operations. Should I change my approach? Respond with JSON: {\"continue\": true, \"reason\": \"...\", \"strategy_change\": \"...\" or null}"
}
EOF
)

  # Reset counter
  jq '.inner_loop.operations_since_reflection = 0' "$MEMORY_FILE" > "${MEMORY_FILE}.tmp"
  mv "${MEMORY_FILE}.tmp" "$MEMORY_FILE"

  # Check if reflection suggests stopping
  if [ "$(echo "$reflection_result" | jq -r '.continue')" == "false" ]; then
    echo "💡 Reflection: $(echo "$reflection_result" | jq -r '.reason')" >&2
    if [ -n "$(echo "$reflection_result" | jq -r '.strategy_change')" ]; then
      echo "🔄 Strategy change: $(echo "$reflection_result" | jq -r '.strategy_change')" >&2
    fi
    exit 0  # Allow stop
  fi
fi

exit 0
```
```

#### 4. Capability Discovery & Extension

**File**: `core/patterns/capability-discovery.md`

```markdown
# Capability Discovery & Extension Pattern

## Concept

Agent discovers and learns about its own capabilities:
- Available tools (Bash, Edit, MCP servers)
- Available skills (marketplace plugins)
- Available subagents (specialists)
- Proficiency with each (learns from experience)

## Discovery Process

**SessionStart**: Enumerate all capabilities
```bash
# Tools
claude --list-tools > memory/capabilities/tools.json

# MCP servers
cat ~/.claude/settings.json | jq '.mcpServers' > memory/capabilities/mcp.json

# Skills
ls plugins/*/skills/* > memory/capabilities/skills.txt

# Subagents
ls .claude/agents/* ~/.claude/agents/* > memory/capabilities/agents.txt
```

## Learning Proficiency

Track success rates per capability:
```json
{
  "tools": {
    "Edit": {
      "uses": 234,
      "success_rate": 0.95,
      "avg_duration_ms": 1234,
      "preferred_for": ["single-file changes", "small edits"]
    },
    "Bash": {
      "uses": 89,
      "success_rate": 0.87,
      "avg_duration_ms": 3456,
      "preferred_for": ["git operations", "running tests"]
    }
  }
}
```

## Capability Redirect

**PreToolUse Hook**: "Is there a better tool?"

```bash
#!/bin/bash
source "${CLAUDE_PLUGIN_ROOT}/core/memory/load-memory.sh"

input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name')
tool_input=$(echo "$input" | jq -r '.tool_input')

# Check if there's a more efficient tool
case "$tool_name" in
  "Bash")
    command=$(echo "$tool_input" | jq -r '.command // empty')

    # Git status? Use git Subagent instead
    if [[ "$command" == "git status"* ]] || [[ "$command" == "git diff"* ]]; then
      if has-subagent "git-expert"; then
        echo "💡 Redirecting to git-expert subagent (more efficient)" >&2
        # Suggest subagent use
      fi
    fi
    ;;

  "Edit")
    # Multi-file edit? Use batch Edit or Write
    file_count=$(count-edited-files "$tool_input")
    if [ "$file_count" -gt 5 ]; then
      if has-capability "batch-write"; then
        echo "💡 Consider batch-write for better performance" >&2
      fi
    fi
    ;;
esac

exit 0  # Allow original operation
```
```

#### 5. Contextual Memory Synthesis

**File**: `core/patterns/memory-synthesis.md`

```markdown
# Contextual Memory Synthesis Pattern

## Concept

Agent continuously synthesizes conversation state into structured memory:
- What worked?
- What failed?
- What patterns emerged?
- What should I remember for next time?

## Synthesis Triggers

1. **Every N turns** (default: 10)
2. **At session milestones**
3. **On task completion**
4. **On repeated failures**

## Memory Categories

```json
{
  "patterns": {
    "successful": [
      {
        "pattern": "When fixing tests, run them after each fix not at end",
        "context": "TDD workflow",
        "first_seen": "2026-01-20",
        "uses": 12,
        "success_rate": 0.95
      }
    ],
    "failed": [
      {
        "pattern": "Using Edit for large refactors",
        "context": "Code modification",
        "first_seen": "2026-01-18",
        "alternative": "Use Write for complete file replacement"
      }
    ]
  },
  "experiences": {
    "project_specific": {
      "this_project": {
        "test_command": "npm test -- --testPathPattern=unit",
        "build_command": "npm run build",
        "common_pitfalls": ["Don't forget to run migrations"]
      }
    }
  }
}
```

## Memory Retrieval

**UserPromptSubmit Hook**: Inject relevant memories

```bash
#!/bin/bash
source "${CLAUDE_PLUGIN_ROOT}/core/memory/load-memory.sh"

prompt=$(cat /dev/stdin | jq -r '.prompt')

# Check for relevant patterns
context=""

# Test-related prompt?
if echo "$prompt" | grep -qiE "test|spec|mock"; then
  if [ -f "$MEMORY_FILE" ]; then
    test_patterns=$(jq -r '.patterns.successful[] | select(.context | contains("TDD")) | .pattern' "$MEMORY_FILE")
    if [ -n "$test_patterns" ]; then
      context+="
## Relevant Past Experience

$test_patterns
"
    fi
  fi
fi

# Output injected context
echo "$context"
exit 0
```
```

#### 6. Negentropy-Driven Orchestration

**File**: `core/patterns/negentropy-driver.md`

```markdown
# Negentropy-Driven Orchestration Pattern

## Concept

Agent measures system "disorder" (entropy) and self-directs toward reducing it:
- Failing tests
- Type errors
- Lint warnings
- TODO/FIXME comments
- Tech debt indicators
- Security vulnerabilities

## Entropy Metrics

```bash
#!/bin/bash
# Calculate codebase entropy score

# Test failures (heavy weight)
test_failures=$(npm test 2>&1 | grep "failing" | awk '{print $1}' || echo "0")
test_score=$((test_failures * 100))

# Type errors
type_errors=$(npx tsc --noEmit 2>&1 | grep "error TS" | wc -l)
type_score=$((type_errors * 10))

# Lint warnings
lint_warnings=$(npx eslint . 2>&1 | wc -l)
lint_score=$((lint_warnings * 2))

# TODOs
todos=$(grep -r "TODO\|FIXME" --include="*.ts" --include="*.tsx" . | wc -l)
todo_score=$((todos * 5))

# Total entropy
total_entropy=$((test_score + type_score + lint_score + todo_score))

echo "$total_entropy"
```

## Self-Directed Task Selection

When no explicit task given, agent:
1. Scans for highest-entropy areas
2. Proposes: "I found X failing tests. Should I fix them?"
3. If approved, works autonomously until entropy reduced

## Hook Integration

**SessionStart**: Scan entropy, build priority list
**Stop**: "Did this reduce entropy? Yes → celebrate. No → try different approach."

## Implementation

**Hook**: `hooks/post-tool-use/entropy-scanner.sh`

```bash
#!/bin/bash
# After each operation, scan for entropy changes

source "${CLAUDE_PLUGIN_ROOT}/core/memory/load-memory.sh"

# Calculate current entropy
current_entropy=$(calculate-entropy)
previous_entropy=$(jq -r '.entropy.current // 0' "$MEMORY_FILE")

# Track changes
echo "📊 Entropy: $previous_entropy → $current_entropy" >&2

if [ "$current_entropy" -lt "$previous_entropy" ]; then
  improvement=$((previous_entropy - current_entropy))
  echo "✅ Reduced entropy by $improvement points!" >&2

  # Remember what worked
  learn-successful-pattern "$current_operation" "reduced entropy"
elif [ "$current_entropy" -gt "$previous_entropy" ]; then
  regression=$((current_entropy - previous_entropy))
  echo "⚠️  Entropy increased by $regression points" >&2

  # Consider different approach
  if [ "$regression" -gt 50 ]; then
    echo "💡 Consider trying a different approach" >&2
  fi
fi

# Update memory
jq ".entropy.current = $current_entropy" "$MEMORY_FILE" > "${MEMORY_FILE}.tmp"
mv "${MEMORY_FILE}.tmp" "$MEMORY_FILE"

exit 0
```
```

#### 7. Stop Hook Auto-Continue

**File**: `core/patterns/auto-continue.md`

```markdown
# Stop Hook Auto-Continue Pattern

## Concept

Agent continues working until quality gates pass, not just first completion.

## Quality Gates

Configurable per project:
```json
{
  "quality_gates": {
    "tests_passing": true,
    "no_type_errors": true,
    "no_lint_errors": true,
    "no_critical_todos": true,
    "coverage_threshold": 80
  }
}
```

## Implementation

**Hook**: `hooks/stop/quality-gate.sh`

```bash
#!/bin/bash
# Critical: Check stop_hook_active first!

input=$(cat)
stop_hook_active=$(echo "$input" | jq -r '.stop_hook_active // false')

if [ "$stop_hook_active" = "true" ]; then
  # Already in hook-triggered continuation
  # MUST allow stop to prevent infinite loop
  echo "⚠️  Already in continuation cycle. Allowing stop." >&2
  exit 0
fi

# Load quality gates
source "${CLAUDE_PLUGIN_ROOT}/core/memory/load-memory.sh"

gates=$(jq -r '.quality_gates' "$MEMORY_FILE")
failed_gates=()

# Check each gate
if [ "$(jq -r '.tests_passing' <<< "$gates")" == "true" ]; then
  if ! npm test -- --run; then
    failed_gates+=("tests_passing")
  fi
fi

if [ "$(jq -r '.no_type_errors' <<< "$gates")" == "true" ]; then
  if ! npx tsc --noEmit; then
    failed_gates+=("no_type_errors")
  fi
fi

if [ "$(jq -r '.no_lint_errors' <<< "$gates")" == "true" ]; then
  if ! npx eslint . --max-warnings 0; then
    failed_gates+=("no_lint_errors")
  fi
fi

# Block if any gates failed
if [ ${#failed_gates[@]} -gt 0 ]; then
  echo "🚫 Quality gates failed: ${failed_gates[*]}" >&2
  echo "🔄 Continuing to fix..." >&2
  exit 2  # Block stopping
fi

echo "✅ All quality gates passed!" >&2
exit 0  # Allow stop
```
```

#### 8. SubagentStop Pipeline Chaining

**File**: `core/patterns/pipeline-chain.md`

```markdown
# SubagentStop Pipeline Chaining Pattern

## Concept

Automatic handoffs between specialized agents create multi-agent workflows.

## Pipeline Definition

```json
{
  "pipeline": [
    {"agent": "code-reviewer", "input": "Review changes"},
    {"agent": "test-writer", "input": "Write tests for reviewed code"},
    {"agent": "implementer", "input": "Implement based on tests"},
    {"agent": "quality-check", "input": "Verify implementation"}
  ],
  "current_stage": 0
}
```

## Implementation

**Hook**: `hooks/subagent-stop/pipeline-orchestrator.sh`

```bash
#!/bin/bash
source "${CLAUDE_PLUGIN_ROOT}/core/memory/load-memory.sh"

pipeline=$(jq '.pipeline' "$MEMORY_FILE")
current_stage=$(jq '.current_stage' "$MEMORY_FILE")
total_stages=$(echo "$pipeline" | jq 'length')

# Check if pipeline complete
if [ "$current_stage" -ge "$total_stages" ]; then
  echo "✅ Pipeline complete!" >&2
  exit 0
fi

# Get next stage
next_agent=$(echo "$pipeline" | jq -r ".[$current_stage].agent")
next_input=$(echo "$pipeline" | jq -r ".[$current_stage].input")

# Advance stage
jq ".current_stage = $((current_stage + 1))" "$MEMORY_FILE" > "${MEMORY_FILE}.tmp"
mv "${MEMORY_FILE}.tmp" "$MEMORY_FILE"

# Trigger next agent
echo "➡️  Handing off to: $next_agent" >&2
echo "📝 Input: $next_input" >&2

# Output suggestion for Claude
echo ""
echo "## Next Step"
echo ""
echo "Use the **$next_agent** agent with: \"$next_input\""
echo ""

exit 0
```
```

#### 9. Prompt-Based Intelligent Decisions

**File**: `core/patterns/intelligent-decision.md`

```markdown
# Prompt-Based Intelligent Decisions Pattern

## Concept

Use LLM evaluation for context-aware continue/stop decisions.

## Implementation

**Hook**: `hooks/stop/intelligent-decision.json`

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You are evaluating whether Claude should continue working.\n\nContext:\n- Recent operations: $RECENT_OPERATIONS\n- Current task: $CURRENT_TASK\n- Time spent: $TIME_ELAPSED\n- User's original request: $USER_REQUEST\n\nEvaluate:\n1. Is the task truly complete?\n2. Are there obvious bugs or issues?\n3. Did Claude address all user requirements?\n4. Are there TODOs/FIXMEs in modified files?\n5. Would a reasonable person consider this \"done\"?\n\nReturn JSON: {\"ok\": true} if Claude should stop, or {\"ok\": false, \"reason\": \"explanation\", \"suggestion\": \"what to do next\"} if Claude should continue.",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```
```

### Configuration System

**File**: `templates/agency-config.json`

```json
{
  "agency_level": 3,
  "reflection_interval": 5,
  "memory_synthesis_interval": 10,
  "entropy_scan_interval": 3,
  "max_continuation_cycles": 5,
  "quality_gates": {
    "tests_passing": true,
    "no_type_errors": true,
    "no_lint_errors": false,
    "no_critical_todos": true,
    "coverage_threshold": null
  },
  "capabilities": {
    "auto_discover": true,
    "learn_proficiency": true,
    "suggest_alternatives": true
  },
  "memory": {
    "max_patterns": 100,
    "retention_days": 30,
    "synthesis_threshold": 5
  },
  "entropy": {
    "weights": {
      "test_failures": 100,
      "type_errors": 10,
      "lint_warnings": 2,
      "todos": 5
    },
    "auto_prioritize": true
  }
}
```

### Agency Levels

| Level | Name | Patterns Active | Autonomy |
|-------|------|-----------------|----------|
| 1 | Reactive | None | Manual - waits for tasks |
| 2 | Self-Monitoring | Reflection, Auto-Continue | Semi-auto - asks for confirmation |
| 3 | Self-Directing | + Negentropy, Capability | Auto - proposes work |
| 4 | Self-Improving | + Memory, Milestones | Auto - learns from experience |
| 5 | Fully Autonomous | All patterns | Full - complete agency |

### Use Cases

1. **Long-Running Refactors**
   - Decompose into milestones
   - Continue until all quality gates pass
   - Learn from each file refactored

2. **Test Failure Remediation**
   - Discover all failing tests
   - Fix one at a time, re-run
   - Learn patterns from fixes
   - Continue until all pass

3. **Feature Implementation**
   - Decompose into milestones (schema → API → frontend → tests)
   - Chain to appropriate specialists
   - Self-monitor progress
   - Continue until complete

4. **Tech Debt Reduction**
   - Scan entropy (failing tests, TODOs, errors)
   - Prioritize by impact
   - Work autonomously
   - Track entropy reduction

5. **Code Review & Fix**
   - Review code (code-reviewer agent)
   - Chain to implementer for fixes
   - Chain back to reviewer for validation
   - Continue until approved

## Technical Requirements

1. **Claude Code Version**: v2.1.0+ (advanced hook features)
2. **Memory System**: JSON-based persistent storage
3. **Hooks Required**: All 8 hook types
4. **Skills Integration**: Uses existing marketplace skills
5. **Subagent Support**: Multiple specialized agents

## Dependencies

**Existing Marketplace Plugins:**
- **code-review** - For code review agent
- **stop-hook-builder** - For quality gate templates
- **documentation-learner** - For memory synthesis
- **skill-command-creator** - For capability discovery

**New Components Required:**
- Agency coordinator agent
- 8 pattern implementations
- Memory system
- Configuration templates

## Success Criteria

- [ ] All 8 patterns implemented
- [ ] Agency level system working (1-5)
- [ ] Memory synthesis functional
- [ ] Capability discovery working
- [ ] Quality gates configurable
- [ ] Pipeline chaining operational
- [ ] Reflection cycles trigger appropriately
- [ ] Entropy scanning works
- [ ] Milestone tracking functional
- [ ] Prompt-based decisions working
- [ ] Documentation complete
- [ ] Example configurations provided
- [ ] Tested on real projects

## Risks & Mitigations

| Risk | Impact | Mitigation |
|-------|--------|------------|
| Infinite loops | HIGH | stop_hook_active checks, max cycle limits |
| Over-autonomy | MEDIUM | Configurable agency levels, human approval |
| Memory bloat | MEDIUM | Retention policies, pattern limits |
| Performance | LOW | Lazy entropy scans, efficient memory lookup |
| Wrong decisions | MEDIUM | Prompt evaluation with fallback to human |

## Phased Implementation

### Phase 1: Foundation (Week 1-2)
- Memory system
- Capability discovery
- Agency coordinator agent
- Basic configuration

### Phase 2: Core Patterns (Week 3-4)
- Stop hook auto-continue
- Milestone tracking
- Reflection triggers
- Quality gates

### Phase 3: Advanced Patterns (Week 5-6)
- Memory synthesis
- Negentropy driver
- Capability redirect
- Prompt-based decisions

### Phase 4: Integration (Week 7-8)
- Pipeline chaining
- Full agency level system
- Documentation
- Examples and templates

### Phase 5: Testing & Refinement (Week 9-10)
- Real-world testing
- Performance optimization
- Bug fixes
- Documentation polish

## Related Marketplace Plugins

- **code-review** - Provides code review agent
- **stop-hook-builder** - Quality gate templates
- **ralph-learning-loop** - Iteration patterns
- **documentation-learner** - Memory capture

## Next Steps

1. Design memory system architecture
2. Create agency coordinator agent
3. Implement core hooks (SessionStart, Stop, PostToolUse)
4. Build quality gate system
5. Add reflection cycle
6. Implement milestone tracking
7. Add capability discovery
8. Create memory synthesis
9. Build entropy scanner
10. Implement pipeline chaining
11. Add prompt-based decisions
12. Create configuration system
13. Write comprehensive documentation
14. Build example configurations
15. Test on real projects
16. Publish to marketplace

## Sources & Inspiration

### Abstract Agency Patterns
- **Temporal Goal Decomposition** - From project planning and milestone-based development
- **Dual-Loop Reflection** - From organizational learning theory (Argyris & Schön)
- **Capability Discovery** - From self-awareness in autonomous systems
- **Memory Synthesis** - From experience replay in RL agents
- **Negentropy Reduction** - From thermodynamics and systems theory
- **Auto-Continue** - From [Agentic Patterns](https://agentic-patterns.com/patterns/stop-hook-auto-continue-pattern/)
- **Pipeline Chaining** - From [GitHub Issue #4784](https://github.com/anthropics/claude-code/issues/4784)
- **Intelligent Decisions** - From [Official Claude Code Docs](https://code.claude.com/docs/en/hooks)

### Practical Implementations
- **Ralph Learning Loop** - Iteration with learning capture
- **Stop Hook Builder** - Intelligent quality gate configuration
- **Hooks Automation Patterns** - Community-discovered patterns
- **Claude Code Best Practices** - Official Anthropic guidance

### Theoretical Foundations
- **Cybernetics** - Feedback loops and control systems
- **Systems Thinking** - Holistic agent design
- **Organizational Learning** - Double-loop learning theory
- **Autonomous Agents** - Self-governing systems
- **Artificial General Intelligence** - Meta-cognitive architectures

## Keywords

autonomous, agency, self-aware, meta-cognitive, reflection, learning, adaptation, orchestration, multi-agent, pipeline, entropy, quality-gates, milestones, memory, capabilities, hooks, automation, continuous-improvement

---

**Created**: 2026-01-20
**Status**: PROPOSED
**Priority**: HIGH
**Complexity**: HIGH
**Estimated Effort**: 8-10 weeks
