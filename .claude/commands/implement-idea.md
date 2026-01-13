---
description: Implement ideas from the ideas folder as Claude Code plugins
argument-hint: [idea-name.md or empty to list all]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Implement Idea as Claude Code Plugin

Take an idea from the `ideas/` folder and implement it as a Claude Code plugin component (command, skill, agent, or hook).

## Your Task

### 1. Identify the Idea

**If `$ARGUMENTS` is provided:**
- Read the idea file: `ideas/$ARGUMENTS`
- If the file doesn't exist, list available ideas and ask which to implement

**If no arguments provided:**
- List all files in `ideas/` directory
- Use AskUserQuestion to ask which idea to implement
- Show idea filename and description from frontmatter

### 2. Analyze the Idea

Read the idea file and determine:
- **Type**: Is this a command (slash command), skill (capability), agent (specialized task), or hook (event handler)?
- **Scope**: Does it fit into an existing plugin or need a new one?
- **Complexity**: Simple (single file) or complex (multiple files, scripts)?

**Decision criteria for plugin placement:**

```
Is this idea related to existing plugin functionality?
├─ YES: Check which plugin it fits
│   ├─ gemini-web-search-agent: Web search, information retrieval
│   ├─ skill-command-creator: Creating skills/commands (NOT using them)
│   ├─ slidegen: Presentation creation (Marp, Slidev)
│   ├─ parallel-subagent-plugin: Parallel execution, background tasks
│   ├─ coding-aider: Development planning, structured plans
│   ├─ adversarial-checkpoint-plugin: Validation, quality checks, challenges
│   └─ documentation-learner: Documentation management, learning capture
│
└─ NO: Create new plugin
```

### 3. Use AskUserQuestion for Confirmation

Before implementing, ask the user:

```
Question: "How should I implement the [idea-name] idea?"
Options:
- "Add to [existing-plugin] plugin (Recommended)" (Description: This idea fits the [plugin]'s purpose of [description])
- "Create new plugin: [suggested-name]" (Description: This idea doesn't fit existing plugins and deserves its own plugin)
- "Just show analysis, don't implement" (Description: I'll analyze and explain where it should go without making changes)
```

### 4. Implement the Idea

**For existing plugin extension:**

1. Read the existing plugin structure
2. Determine which component type to add (command, skill, agent, hook)
3. Create the component file(s) in appropriate directory
4. Update `plugin.json` if needed (version bump, new component paths)
5. Update `marketplace.json` with new version
6. Update plugin's README.md with new feature

**For new plugin creation:**

1. Create plugin directory structure:
   ```
   plugins/[plugin-name]/
   ├── README.md
   ├── plugin.json
   └── [commands|skills|agents|hooks]/
       └── component files
   ```

2. Create `plugin.json` with:
   - Name, description, version (1.0.0)
   - Author: Peter Wegner <peter.wegner@andrena.de>
   - Repository: andrena-objects-ag/andrena-claude-marketplace
   - Keywords, category, tags
   - Component paths

3. Create comprehensive README.md with:
   - Overview, installation, features
   - Usage examples
   - Best practices
   - Version history

4. Add plugin entry to `marketplace.json`

5. Set appropriate `strict` mode:
   - `strict: false` if using `plugin.json` for components
   - `strict: true` if defining components in marketplace.json

### 5. Mark Idea as Implemented

Update the original idea file:

```markdown
---
description: [original description]
status: IMPLEMENTED
implementation: plugins/[plugin-name]/[path-to-component]
---

# [Idea Title]

**✅ IMPLEMENTED**: This idea has been implemented as [component type] in the `[plugin-name]` plugin.

[Rest of original content]
```

### 6. Report to User

Provide summary:
- What was implemented (command/skill/agent/hook)
- Where it was placed (new plugin or existing plugin)
- Files created/modified
- Installation instructions
- Next steps (testing, usage examples)

## Component Type Guidelines

### When to use each type:

**Slash Command (`/command-name`):**
- Simple, reusable prompts
- User explicitly invokes with `/`
- No complex logic, just prompt execution
- Examples: `/review`, `/explain`, `/optimize`

**Skill (model-invoked):**
- Complex capabilities with structured knowledge
- Claude discovers and invokes automatically
- Can have multiple supporting files, scripts
- Progressive disclosure (SKILL.md + reference files)
- Examples: PDF processing, data analysis, code review standards

**Agent (specialized context):**
- Task requires separate, isolated context
- Different tool permissions needed
- Specialized for specific domain
- Examples: Web researcher, content reviewer, formatter

**Hook (event-driven):**
- Runs automatically on tool events
- Validation, automation, monitoring
- PreToolUse, PostToolUse, Stop events
- Examples: Security validation, auto-formatting, checkpoint challenges

## Best Practices

### Plugin Naming
- Use kebab-case: `my-plugin-name`
- Descriptive and specific
- Avoid generic names like "utilities" or "helpers"

### Version Management
- Start at 1.0.0 for new plugins
- Bump PATCH for bug fixes (1.0.1)
- Bump MINOR for new features (1.1.0)
- Bump MAJOR for breaking changes (2.0.0)
- Update version in BOTH `plugin.json` AND `marketplace.json`

### Documentation
- Write comprehensive README.md for each plugin
- Include installation instructions
- Provide usage examples
- List features and capabilities
- Document version history

### Manifest Strategy
- Simple plugins (1-2 components): Use `plugin.json`, set `strict: false`
- Complex plugins (many components): Define in `marketplace.json`, set `strict: true`
- NEVER define components in BOTH places (causes conflicts)

### Categories
- `agents`: Web search, specialized agents, researchers
- `productivity`: Documentation, automation, utilities
- `development`: Planning, code generation, testing
- `utilities`: General-purpose tools

## Examples

### Example 1: Simple Command Idea

**Idea**: Create a command to generate API documentation from code

**Analysis**:
- Type: Slash command (simple, user-invoked)
- Fits: NEW plugin (doesn't match existing plugins)
- Complexity: Simple (single command file)

**Implementation**:
- Create new plugin: `api-doc-generator`
- Add command: `commands/generate-api-docs.md`
- Simple plugin.json with metadata

### Example 2: Complex Skill Idea

**Idea**: Skill for analyzing Excel spreadsheets with pivot tables

**Analysis**:
- Type: Skill (complex capability, auto-discovered)
- Fits: NEW plugin (specialized domain)
- Complexity: Complex (SKILL.md + reference docs + scripts)

**Implementation**:
- Create new plugin: `excel-analyzer`
- Create skill with progressive disclosure
- Include Python scripts for data processing
- Reference documentation for Excel APIs

### Example 3: Extend Existing Plugin

**Idea**: Add security review checklist to validation

**Analysis**:
- Type: Skill (structured knowledge)
- Fits: `adversarial-checkpoint-plugin` (validation/quality)
- Complexity: Medium (SKILL.md + checklist file)

**Implementation**:
- Add skill to existing plugin
- Create `skills/security-review/SKILL.md`
- Create `skills/security-review/checklist.md`
- Update plugin version to 1.1.0
- Update README with new feature

## Troubleshooting

### Idea is ambiguous
- Use AskUserQuestion to clarify scope
- Ask about preferred implementation approach
- Suggest multiple options with descriptions

### Unclear where to place
- Analyze all existing plugins
- Look for thematic/functional fit
- Default to creating new plugin if uncertain
- Let user decide via AskUserQuestion

### Complex dependencies
- Document requirements in README.md
- Add to plugin description
- Include setup instructions
- Note any external packages needed

## Important Notes

- **Always read the idea file first** to understand requirements
- **Check existing plugins** before creating new ones
- **Ask user for confirmation** before implementing
- **Follow marketplace guidelines** from CLAUDE.md
- **Update marketplace.json** when adding/modifying plugins
- **Version everything** properly
- **Document thoroughly** in READMEs
- **Test the mental model**: Does this idea naturally fit the plugin's purpose?

Begin by reading the idea file (if specified) or listing available ideas for user selection.
