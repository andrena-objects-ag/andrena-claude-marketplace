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

### 2. Discover Existing Plugins

Before analyzing the idea, dynamically discover what plugins already exist:

1. **Read marketplace.json** (`.claude-plugin/marketplace.json`)
2. **Extract all plugins** with their names and descriptions
3. **Build a dynamic map** of existing plugin purposes

This ensures the command never gets outdated when new plugins are added.

### 2b. Check for Duplicates

Before implementing, check if this idea already exists as a feature in any plugin:

1. **For each discovered plugin**, read its README.md
2. **Scan for similar features** in:
   - Features section
   - Commands list
   - Skills list
   - Usage examples
3. **Compare semantically** - does the idea's purpose match an existing feature?
4. **If duplicate found**, present options via AskUserQuestion

**Duplicate detection criteria:**
- Same functionality described (e.g., "generate commit messages" vs "create git commits")
- Same component type (command, skill, agent)
- Similar workflow or purpose
- Overlapping keywords and descriptions

### 3. Analyze the Idea

Read the idea file and determine:
- **Type**: Is this a command (slash command), skill (capability), agent (specialized task), or hook (event handler)?
- **Scope**: Does it fit into an existing plugin or need a new one?
- **Complexity**: Simple (single file) or complex (multiple files, scripts)?

**Decision criteria for plugin placement:**

1. **Check against discovered plugins**: Does the idea's purpose align with any existing plugin's description?
2. **Semantic matching**: Look for thematic overlap between idea and plugin descriptions
3. **If no clear match**: Default to creating a new plugin

**Analysis approach:**
- Read each existing plugin's description from marketplace.json
- Compare idea's purpose with each plugin's description
- Identify best-fit plugin OR recommend new plugin
- Present options to user via AskUserQuestion

### 4. Handle Duplicates if Found

**If duplicate feature detected:**

Use AskUserQuestion to inform user and get direction:

```
Question: "This idea appears similar to an existing feature in [plugin-name]. How should we proceed?"
Options:
- "Skip - Idea already implemented" (Description: The [plugin-name] plugin already has this feature: [feature-description])
- "Enhance existing feature" (Description: Update the existing [feature-name] with details from this idea)
- "Implement as separate feature anyway" (Description: This idea is different enough to warrant separate implementation)
- "Archive idea without implementing" (Description: Mark as duplicate and move to ideas/archive/)
```

**Key**: Show user where the duplicate exists and let them decide how to proceed.

### 5. Use AskUserQuestion for Implementation Approach

**If NO duplicates found**, ask the user with **dynamically discovered options**:

**If existing plugin matches found:**
```
Question: "How should I implement the [idea-name] idea?"
Options:
- "Add to [plugin-name] plugin (Recommended)" (Description: Matches: [plugin-description])
- "Add to [other-plugin-name] plugin" (Description: Also fits: [other-plugin-description])
- "Create new plugin: [suggested-name]" (Description: This idea doesn't strongly match existing plugins)
- "Just show analysis, don't implement" (Description: I'll analyze and explain options without making changes)
```

**If no clear matches:**
```
Question: "How should I implement the [idea-name] idea?"
Options:
- "Create new plugin: [suggested-name] (Recommended)" (Description: No existing plugin matches this idea's purpose)
- "Add to [closest-plugin] anyway" (Description: Closest match is [plugin-name] but not a perfect fit)
- "Just show analysis, don't implement" (Description: I'll explain my analysis without making changes)
```

**Key**: Options are built from marketplace.json data, not hard-coded.

### 6. Implement the Idea

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

### 7. Mark Idea Status

**For implemented ideas**, update the original idea file:

```markdown
---
description: [original description]
status: IMPLEMENTED
implementation: plugins/[plugin-name]/[path-to-component]
date-implemented: YYYY-MM-DD
---

# [Idea Title]

**✅ IMPLEMENTED**: This idea has been implemented as [component type] in the `[plugin-name]` plugin.

[Rest of original content]
```

**For duplicate/skipped ideas**, mark accordingly:

```markdown
---
description: [original description]
status: DUPLICATE
existing-feature: plugins/[plugin-name] - [feature-description]
date-checked: YYYY-MM-DD
---

# [Idea Title]

**ℹ️ DUPLICATE**: This functionality already exists in the `[plugin-name]` plugin as [feature-name].

See: [link to plugin README or feature documentation]

[Rest of original content]
```

**For enhanced features**, mark as implemented with note:

```markdown
---
description: [original description]
status: ENHANCED_EXISTING
enhanced-feature: plugins/[plugin-name]/[feature-path]
date-enhanced: YYYY-MM-DD
---

# [Idea Title]

**✅ ENHANCED**: Existing feature in `[plugin-name]` plugin was enhanced with details from this idea.

Changes: [summary of enhancements]

[Rest of original content]
```

### 8. Archive Idea File

After marking status, move the idea file to appropriate archive location:

**For implemented/enhanced ideas:**
```bash
mv ideas/[idea-name].md ideas/archive/implemented/[idea-name].md
```

**For duplicates/skipped:**
```bash
mv ideas/[idea-name].md ideas/archive/duplicates/[idea-name].md
```

**Create archive directories if they don't exist:**
```bash
mkdir -p ideas/archive/implemented
mkdir -p ideas/archive/duplicates
```

**Archive structure:**
```
ideas/
├── [active-idea-1].md
├── [active-idea-2].md
└── archive/
    ├── implemented/
    │   ├── [old-idea-1].md (status: IMPLEMENTED)
    │   └── [old-idea-2].md (status: ENHANCED_EXISTING)
    └── duplicates/
        └── [duplicate-idea].md (status: DUPLICATE)
```

This keeps the ideas/ folder clean with only active, unimplemented ideas.

### 9. Report to User

Provide summary based on action taken:

**For implementations:**
- What was implemented (command/skill/agent/hook)
- Where it was placed (new plugin or existing plugin)
- Files created/modified
- Installation instructions
- Archive location of idea file
- Next steps (testing, usage examples)

**For duplicates:**
- Existing feature found in [plugin-name]
- Why it's considered a duplicate
- Where user can find the existing feature
- Archive location (ideas/archive/duplicates/)
- Suggestion to try the existing feature

**For enhancements:**
- What existing feature was enhanced
- Changes made to the feature
- Updated documentation
- Archive location (ideas/archive/implemented/)
- How to use the enhanced feature

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

## Dynamic Plugin Discovery Workflow

### Step-by-Step Process

**1. Read marketplace.json:**
```bash
Read .claude-plugin/marketplace.json
Extract: plugins[].name, plugins[].description
```

**2. Analyze idea against discovered plugins:**
```
For each plugin in marketplace:
  - Compare idea description with plugin description
  - Look for semantic overlap (keywords, domain, purpose)
  - Score similarity (high/medium/low)
```

**3. Present options dynamically:**
```
High similarity match → Recommend extending that plugin
Multiple matches → Show all options with fit explanations
No clear match → Recommend new plugin
```

## Examples

### Example 1: New Plugin (No Matches)

**Idea**: Create a command to generate API documentation from code

**Dynamic Discovery**:
1. Reads marketplace.json → 8 plugins discovered
2. Analyzes descriptions: No plugin mentions "API documentation"
3. Presents options:
   - "Create new plugin: api-doc-generator (Recommended)"
   - "Just show analysis"

**Implementation**: New plugin created

### Example 2: Extending Existing Plugin

**Idea**: Add security review checklist to validation

**Dynamic Discovery**:
1. Reads marketplace.json → 8 plugins discovered
2. Finds match: "adversarial-checkpoint-plugin: Adversarial checkpoint validation system..."
3. Presents options:
   - "Add to adversarial-checkpoint-plugin (Recommended)" - Matches validation/quality purpose
   - "Create new plugin: security-reviewer"
   - "Just show analysis"

**Implementation**: Skill added to existing plugin

### Example 3: Multiple Potential Matches

**Idea**: Document workflow patterns from conversations

**Dynamic Discovery**:
1. Reads marketplace.json → 8 plugins discovered
2. Finds two matches:
   - "documentation-learner: Extract key learnings from conversations..."
   - "skill-command-creator: Create comprehensive Agent Skills..."
3. Presents options:
   - "Add to documentation-learner (Recommended)" - Best match for workflow documentation
   - "Add to skill-command-creator" - Also handles documentation
   - "Create new plugin: workflow-documenter"
   - "Just show analysis"

**Implementation**: User chooses documentation-learner

### Example 4: Duplicate Detection

**Idea**: Create a command to extract learnings from conversations

**Dynamic Discovery**:
1. Reads marketplace.json → 8 plugins discovered
2. Reads documentation-learner README → Finds `/learn` command
3. Detects duplicate: "This idea matches existing `/learn` command"
4. Presents options:
   - "Skip - Idea already implemented (Recommended)" - documentation-learner has `/learn` command
   - "Enhance existing /learn command" - Add features from this idea
   - "Implement as separate feature anyway"
   - "Archive idea without implementing"

**User Selection**: "Skip - Idea already implemented"

**Result**:
- Idea marked with status: DUPLICATE
- Moved to ideas/archive/duplicates/extract-learnings.md
- User informed: "This functionality exists in documentation-learner plugin as /learn command"

### Example 5: Enhance Existing Feature

**Idea**: Add support for multiple documentation formats to learning extraction

**Dynamic Discovery**:
1. Reads marketplace.json → 8 plugins discovered
2. Reads documentation-learner README → Finds `/learn` command
3. Detects similarity but with new aspect
4. Presents options:
   - "Enhance existing /learn command (Recommended)" - Add format support to existing feature
   - "Implement as separate feature"
   - "Skip - Too similar"

**User Selection**: "Enhance existing /learn command"

**Result**:
- Updated /learn command with format options
- Updated documentation-learner README
- Plugin version bumped to 1.2.0
- Idea marked with status: ENHANCED_EXISTING
- Moved to ideas/archive/implemented/multi-format-learning.md

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

### Open/Closed Principle
- **ALWAYS read marketplace.json first** to discover existing plugins dynamically
- **NEVER hard-code plugin lists** - they will become outdated
- **Build options from actual marketplace data** - makes command future-proof
- **Let the marketplace define itself** - plugins are self-documenting

### Implementation Guidelines
- **Always read the idea file first** to understand requirements
- **Dynamically discover existing plugins** from marketplace.json
- **Compare idea semantically** with discovered plugin descriptions
- **Ask user for confirmation** before implementing with dynamic options
- **Follow marketplace guidelines** from CLAUDE.md
- **Update marketplace.json** when adding/modifying plugins
- **Version everything** properly (both plugin.json and marketplace.json)
- **Document thoroughly** in READMEs with examples
- **Test the mental model**: Does this idea naturally fit the plugin's purpose?

### Dynamic Discovery Process
1. Read `.claude-plugin/marketplace.json`
2. Extract all plugin names and descriptions
3. **Check for duplicates** - Read plugin READMEs to find existing features
4. **If duplicate found** - Present duplicate handling options
5. **If no duplicate** - Analyze idea against discovered plugins (semantic matching)
6. Build AskUserQuestion options from matches
7. Present dynamically generated options to user
8. Implement based on user selection
9. **Mark idea status** (IMPLEMENTED, DUPLICATE, ENHANCED_EXISTING)
10. **Archive idea file** to appropriate location

### Archiving Strategy
- **Keep ideas/ clean**: Only active, unimplemented ideas in main folder
- **Archive implemented**: Move to `ideas/archive/implemented/` after implementation
- **Archive duplicates**: Move to `ideas/archive/duplicates/` if feature exists
- **Preserve history**: Archived ideas maintain frontmatter with status and dates
- **Easy retrieval**: Archive structure makes it easy to find old ideas

This ensures the command **never needs updates when new plugins are added** - it adapts automatically, and keeps your ideas folder organized.

Begin by reading the idea file (if specified) or listing available ideas for user selection.
