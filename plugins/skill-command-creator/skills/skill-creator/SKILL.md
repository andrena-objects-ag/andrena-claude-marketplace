---
name: Skill Creator
description: Create comprehensive Agent Skills with proper structure, validation, and best practices. Use when you need to create new Agent Skills for personal or project use, or when users ask about creating skills, extending Claude's capabilities, or organizing expertise into reusable skills.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Skill Creator

Create, structure, and validate Agent Skills for Claude Code with proper YAML frontmatter, comprehensive instructions, and supporting files.

## Instructions

### 1. Understand the User's Requirements

Before creating a Skill, gather this information:
- **Purpose**: What capability should this Skill provide?
- **Target use cases**: When should Claude automatically invoke this Skill?
- **Scope**: Personal Skill or project Skill?
- **Complexity**: Simple single-file Skill or multi-file with supporting resources?
- **Tool restrictions**: Are there specific tools that should or shouldn't be allowed?

### 2. Create Skill Structure

Follow this directory structure:

```
skill-name/
├── SKILL.md (required)
├── reference.md (optional documentation)
├── examples.md (optional usage examples)
├── scripts/
│   └── helper.py (optional utilities)
└── templates/
    └── template.txt (optional templates)
```

### 3. Write SKILL.md with Proper Frontmatter

Create comprehensive frontmatter:

```yaml
---
name: Clear, Descriptive Skill Name
description: Specific description of what this Skill does and when Claude should use it. Include trigger terms and use cases.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash (optional - restrict tools if needed)
---
```

**Frontmatter Fields**:
- `name`: Clear, descriptive name (lowercase letters, numbers, hyphens only, max 64 chars)
- `description`: Must include both what the Skill does AND when to use it (max 1024 chars)
- `allowed-tools`: Optional - specify which tools the Skill can use without asking permission
- `model`: Optional - specific model to use when this Skill is active (e.g., claude-sonnet-4-20250514)
- `context`: Optional - set to `fork` to run Skill in a forked sub-agent context
- `agent`: Optional - specify agent type when using `context: fork` (e.g., Explore, Plan, general-purpose)
- `hooks`: Optional - define hooks scoped to this Skill's lifecycle (PreToolUse, PostToolUse, Stop)
- `user-invocable`: Optional - controls Skill visibility in slash menu (defaults to true)
- `disable-model-invocation`: Optional - prevents Skill from being called via Skill tool

### 4. Write Comprehensive Content

Structure SKILL.md with these sections:

```markdown
# Skill Name

## Overview
Brief description of the Skill's purpose and value.

## When This Skill Activates
Clear triggers and conditions for automatic invocation.

## Instructions
Step-by-step guidance for Claude.

## Examples
Concrete usage scenarios.

## Requirements (if applicable)
Dependencies, packages, or prerequisites.

## Troubleshooting
Common issues and solutions.
```

### 5. Add Supporting Files with Progressive Disclosure

Use **progressive disclosure** to keep context focused: put essential information in SKILL.md and detailed reference material in separate files that Claude reads only when needed.

**Keep SKILL.md under 500 lines for optimal performance.** If content exceeds this, split detailed material into separate files.

Create supporting files as needed:
- **reference.md**: Detailed documentation, API references (loaded when needed)
- **examples.md**: Specific usage examples and patterns (loaded when needed)
- **scripts/**: Utility scripts executed without loading contents into context
- **templates/**: Reusable templates or boilerplate

**Example structure with progressive disclosure:**
```
my-skill/
├── SKILL.md (required - overview and navigation)
├── reference.md (detailed API docs - loaded when needed)
├── examples.md (usage examples - loaded when needed)
└── scripts/
    └── helper.py (utility script - executed, not loaded)
```

**Link to supporting files in SKILL.md:**
```markdown
## Additional resources
- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)

## Utility scripts
To validate input files, run:
```bash
python scripts/helper.py input.txt
```
```

**Keep references one level deep.** Link directly from SKILL.md to reference files. Avoid deeply nested references (file A → file B → file C).

### 6. Validate the Skill

Perform these validation checks:

#### YAML Validation
- Opening `---` on line 1
- Closing `---` before Markdown content
- Valid YAML syntax (no tabs, correct indentation)
- Required fields present

#### Content Validation
- Description is specific and includes triggers
- Instructions are clear and actionable
- Examples are concrete and realistic
- File paths use forward slashes

#### Structure Validation
- Correct directory structure
- Files in appropriate locations
- Proper naming conventions

### 7. Create Personal or Project Skills

#### Personal Skills
Location: `~/.claude/skills/skill-name/`
Use for: Individual workflows, experimental features, personal tools

#### Project Skills
Location: `.claude/skills/skill-name/`
Use for: Team workflows, shared utilities, project-specific expertise

## Best Practices

### Description Writing
- **Be specific**: "Analyze Excel spreadsheets and create pivot tables" vs "Helps with data"
- **Include triggers**: "Use when working with Excel files, .xlsx files, or tabular data"
- **Specify outcomes**: What results can users expect?
- **Max 1024 characters**: Keep descriptions focused and concise

### Skill Design
- **Single purpose**: Each Skill should address one capability
- **Progressive disclosure**: Keep SKILL.md under 500 lines; put detailed docs in separate files
- **Tool permissions**: Restrict tools when Skill has limited scope
- **Forked context**: Use `context: fork` for complex multi-step operations to isolate conversation history
- **Visibility control**: Use `user-invocable: false` for Skills that Claude should invoke but users shouldn't call directly

### Invocation Control
- **Manual invocation**: Users type `/skill-name` (controlled by `user-invocable`)
- **Programmatic invocation**: Claude calls via Skill tool (controlled by `disable-model-invocation`)
- **Automatic discovery**: Claude reads description and loads when relevant (always enabled)

### Tool Restrictions with allowed-tools
Specify tools in two formats:

**Comma-separated string:**
```yaml
allowed-tools: Read, Grep, Glob
```

**YAML list (better readability):**
```yaml
allowed-tools:
  - Read
  - Grep
  - Glob
```

When specified, Claude can only use listed tools without permission during Skill execution. Omit for unrestricted tool access.

### Skills and Subagents
**Give subagents access to Skills:**
Custom subagents don't automatically inherit Skills. List Skills in subagent's `skills` field:

```yaml
# .claude/agents/code-reviewer.md
---
name: code-reviewer
description: Review code for quality and best practices
skills: pr-review, security-check
---
```

Full Skill content is injected at startup, not just made available for invocation.

**Note:** Built-in agents (Explore, Plan, general-purpose) cannot access your Skills. Only custom subagents with explicit `skills` field can use Skills.

**Run Skills in forked context:**
Use `context: fork` for complex multi-step operations with isolated conversation history:

```yaml
---
name: code-analysis
description: Analyze code quality and generate detailed reports
context: fork
agent: general-purpose
---
```

The `agent` field specifies which agent type to use (Explore, Plan, general-purpose, or custom agent name).

### Testing
- Test with scenarios matching your description
- Verify Skill activates automatically when expected
- Test supporting files and scripts work correctly
- For `context: fork` Skills, verify isolation works as expected

## Common Templates

### Simple Skill Template
```yaml
---
name: Task Name
description: Brief description of what this Skill does and when to use it
---

# Task Name

## Instructions
1. Step one
2. Step two
3. Step three

## Examples
- Example scenario one
- Example scenario two
```

### Complex Skill Template
```yaml
---
name: Advanced Task Name
description: Comprehensive description with specific triggers and use cases. Use when [specific conditions].
allowed-tools: Read, Write, Edit, Grep
model: claude-sonnet-4-20250514
context: fork
agent: general-purpose
user-invocable: true
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate.sh $TOOL_INPUT"
          once: true
---

# Advanced Task Name

## Quick Start
Immediate steps for common use cases.

## Detailed Instructions
Comprehensive guidance covering various scenarios.

For advanced usage, see [reference.md](reference.md).

## Examples
See [examples.md](examples.md) for detailed usage patterns.

## Requirements
List any dependencies or prerequisites.

## Scripts
Use scripts in the [scripts/](scripts/) directory for automation.
```

## Validation Commands

Use these commands to validate your Skill:

```bash
# Check file structure
ls -la ~/.claude/skills/skill-name/

# Validate YAML syntax
head -n 15 ~/.claude/skills/skill-name/SKILL.md

# Test Skill discovery
claude --debug  # Look for Skill loading errors
```

## Troubleshooting

### Skill Not Activating
- Check if description includes specific triggers
- Verify YAML frontmatter is valid
- Ensure Skill is in correct directory location

### YAML Errors
- Use spaces, not tabs for indentation
- Ensure proper opening/closing `---`
- Validate quote usage in strings

### File Path Issues
- Use forward slashes (`/`) in all paths
- Make paths relative to Skill directory
- Reference supporting files correctly

## Examples

### Example 1: PDF Processing Skill
```yaml
---
name: PDF Processor
description: Extract text, fill forms, and manipulate PDF files. Use when working with PDF documents, forms, or document extraction.
allowed-tools: Read, Write, Edit
---

# PDF Processor

Process PDF files for text extraction and form filling.

## Instructions
1. Read PDF files using appropriate tools
2. Extract text content
3. Process forms or merge documents as needed

## Requirements
- PDF processing packages installed
- File permissions for reading/writing PDFs
```

### Example 2: Code Review Skill
```yaml
---
name: Code Reviewer
description: Review code for security, performance, and style issues. Use when reviewing pull requests, code changes, or analyzing code quality.
allowed-tools: Read, Grep, Glob
---

# Code Reviewer

Comprehensive code review for security, performance, and style.

## Review Checklist
1. Security vulnerabilities
2. Performance bottlenecks
3. Code style adherence
4. Error handling
5. Test coverage

## Instructions
Examine code systematically using the checklist above.
```