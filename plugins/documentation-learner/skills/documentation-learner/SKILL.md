---
name: documentation-learner
description: Extract key learnings from conversations and update project documentation. Use when the user says "learn", "capture learnings", "document this", "save what we learned", "update docs from conversation", or after solving problems, discovering workflows, or identifying patterns. Also use for analyzing documentation structure when the user mentions "analyze docs", "review documentation structure", or "documentation audit".
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
---

# Documentation Learner

Capture knowledge from conversations and maintain well-organized project documentation.

## Mode Detection

- If the user mentions analyzing documentation structure or auditing docs: run **Docs Analysis** mode
- Otherwise: run **Learning Extraction** mode

---

# Learning Extraction Mode

Analyze the current conversation and extract key learnings, especially regarding:

1. **Workflows**: How to accomplish tasks (creating PRs, running tests, deploying, debugging)
2. **Patterns**: Code patterns, architectural decisions, or conventions discovered
3. **Tools and Scripts**: Usage of helper scripts, pipeline tools, or development utilities
4. **Common Pitfalls**: Issues encountered and how they were resolved
5. **Best Practices**: Techniques that proved effective

## Process

1. **Analyze project structure** first:
   - Check if CLAUDE.md exists (read it to understand current documentation)
   - Look for existing .llm/ directory and its contents
   - Identify project structure (monorepo, single project, subdirectories)
   - Find existing README files and documentation locations
   - Check for `.claude/rules/` directory (stack-specific conventions)

2. **Review the conversation** to identify actionable learnings and workflows

3. **Determine documentation placement**:
   - **If documentation structure is clear** (CLAUDE.md references specific files, .llm/ directory exists with organized files):
     - Follow existing structure and naming conventions
   - **If structure is unclear or learnings don't fit existing categories**:
     - Use AskUserQuestion to ask the user where to document the learnings
     - Suggest options based on the learning type (see Destination Guide below)

4. **Assess automation potential** for each learning (see Automation Verification section below)

5. **Update documentation** by:
   - Adding new sections if the workflow is entirely new
   - Enhancing existing sections with additional details or examples
   - Creating new referenced markdown files for substantial new topics
   - Ensuring consistency with existing documentation style and structure

6. **Present changes** to the user:
   - Summarize what learnings were captured
   - Show which files were updated
   - Highlight any automation opportunities identified
   - Explain the rationale for placement decisions

## Destination Guide

| Destination | When to use | Example content | Auto-verifiable? |
|-------------|-------------|-----------------|------------------|
| **CLAUDE.md** | Project-wide rules that AI should always follow | "Use repository pattern for data access" | Linters, hooks |
| **.claude/rules/\*.md** | Stack or framework-specific conventions | "Use composition over inheritance" | Linters, hooks |
| **.llm/\*.md** | Detailed how-to guides and workflows | "Deployment workflow for staging" | Usually not |
| **TECHNIQUES.md** | Specific technical patterns or solutions | "Error boundary pattern for resilient UIs" | Usually not |
| **PITFALLS.md** | Common errors and their solutions | "Environment variables need restart to take effect" | Sometimes (linters) |
| **NEW_FILE** | Topic too large for existing files | "ARCHITECTURE.md" | Depends on content |
| **Skip** | Well-known behavior, not worth documenting | | N/A |

**Suggest destinations based on learning type:**
- Hard rules that can be automatically checked → suggest CLAUDE.md or .claude/rules/
- Soft patterns and best practices → suggest TECHNIQUES.md or .llm/
- Common mistakes and their fixes → suggest PITFALLS.md
- Detailed workflows and processes → suggest .llm/[topic].md

## Automation Verification Assessment

For each learning, assess whether it could be automatically verified. This creates compound value — documented rules that are also enforced by tooling.

### Verification Methods

| Method | When to suggest | Examples |
|--------|-----------------|----------|
| **Linter rule** | Syntax patterns, naming conventions, forbidden constructs | Disallow certain API patterns, enforce naming |
| **PostToolUse hook** | File content validation after edits | Convention checks, required patterns |
| **Pre-commit hook** | Final validation before commit | Type checking, formatting |
| **N/A** | Soft guidelines, architectural decisions | "Prefer X over Y" patterns |

### Assessment Process

For each learning, determine its automation potential:

1. **Is it a syntax or pattern rule?** → Could be a linter rule
2. **Is it a file content convention?** → Could be a PostToolUse hook
3. **Is it a pre-commit requirement?** → Could be a pre-commit hook
4. **Is it a soft guideline?** → Documentation only

### When Suggesting Automation

If a learning has automation potential, include a note when presenting it to the user:

> "This rule could be automatically verified. Should I also create a verification approach (linter rule or hook)?"

**Let the user decide**: Always ask before creating hooks or lint rules. Some rules are better as documentation only.

### Stack Detection

When assessing automation, detect the project's stack to suggest appropriate tooling:
- JavaScript/TypeScript → ESLint rules
- Python → Ruff/flake8/pylint rules
- Java → Checkstyle/SpotBugs
- Go → Static analysis tools
- C# → Roslyn analyzers
- Generic → Claude Code hooks (PostToolUse, PreToolUse)

## Using AskUserQuestion for Unclear Categorization

When the documentation structure is unclear or learnings don't fit existing categories, use AskUserQuestion:

**Example for a learning with automation potential:**
```
Question: "Where should I document this learning?"
Context: "Rule: Never use raw SQL queries outside the repository layer"
Options:
- "CLAUDE.md - Core project rule (Recommended)" (Description: Hard rule that should always be followed. Could be auto-verified.)
- ".claude/rules/data-access.md" (Description: Stack-specific convention for data access patterns)
- "PITFALLS.md" (Description: Document as a common mistake to avoid)
- "Skip" (Description: Not worth documenting)
```

**Example for a soft learning without automation potential:**
```
Question: "Where should I document this learning?"
Context: "Pattern: Prefer event-driven communication between services"
Options:
- "TECHNIQUES.md" (Description: Technical pattern worth referencing)
- ".llm/architecture.md" (Description: Detailed architectural pattern)
- "CLAUDE.md" (Description: Core project convention)
- "Skip" (Description: Not worth documenting)
```

**Example when suggesting new structure:**
```
Question: "This project doesn't have organized documentation yet. How should we structure it?"
Options:
- "Create .llm/ directory with topic files (Recommended)" (Description: .llm/workflows.md, .llm/testing.md, etc. Referenced from CLAUDE.md)
- "Add everything to CLAUDE.md" (Description: Keep all documentation in single file with sections)
- "Create topic-specific files in root" (Description: TECHNIQUES.md, PITFALLS.md in project root)
```

## Recommended Documentation Structure

If the project lacks clear documentation organization, suggest this structure:

```
project-root/
├── CLAUDE.md                    # Main documentation hub with overview and references
├── README.md                    # Project description and quick start
├── TECHNIQUES.md                # Technical patterns and solutions
├── PITFALLS.md                  # Common errors and solutions
└── .llm/                        # Detailed topic-specific documentation
    ├── workflows.md             # Common development workflows
    ├── deployment.md            # Deployment procedures
    ├── testing.md               # Testing strategies and patterns
    └── [topic].md               # Other specialized topics
```

---

# Docs Analysis Mode

When the user asks to analyze documentation structure, identify improvement opportunities.

## Process

1. **Scan documentation locations**:
   - Check for `docs/` directory
   - Check for `CLAUDE.md` in project root
   - Check for `README.md` files
   - Check for `.llm/` directory
   - Look for markdown files in project root

2. **Analyze documentation structure**:
   - List all documentation files found
   - Count lines in each file (identify large files >300 lines)
   - Read file headers/sections to understand topics covered
   - Identify potential duplicate files (similar names or topics)

3. **Detect issues**:
   - **Duplicates**: Files with similar names (e.g., `sub-agents.md` and `subagents.md`) or overlapping content
   - **Large files**: Files that could benefit from splitting (>300 lines)
   - **Content overlap**: Files covering similar topics that could be consolidated
   - **Missing structure**: Lack of clear organization (no CLAUDE.md, scattered docs)

4. **Identify modularization opportunities**:
   - Large files that could be split into topic-specific modules
   - Sections that could become reusable skills or commands
   - Patterns/procedures that could be extracted as standalone components

5. **Generate actionable recommendations**:
   - For each issue found, provide specific remediation steps
   - Suggest file merges, splits, or reorganizations
   - Identify opportunities to create skills/commands from documentation sections

6. **Present analysis report** with:
   - Summary of documentation structure
   - List of issues found (duplicates, large files, overlaps)
   - Prioritized recommendations for improvement
   - Opportunities for skill/command extraction
   - Suggested new documentation structure

## Analysis Output Format

Present the analysis in this structure:

```
# Documentation Structure Analysis

## Overview
- Total documentation files: X
- Documentation locations: [list of directories]
- Total lines of documentation: X

## Issues Found

### Duplicates
- [file1] and [file2]: Similar names/purpose - consider merging

### Large Files (>300 lines)
- [file]: X lines - could be split into:
  - [module1]: [topic description]
  - [module2]: [topic description]

### Content Overlap
- [file1] and [file2] both cover [topic] - consider consolidating

## Modularization Opportunities

### Potential Skills to Create
From [file]: "[section title]" could become a skill for [purpose]
- **Skill name**: [suggested-name]
- **Purpose**: [what the skill would do]
- **Content source**: [file:line range]

### Potential Commands to Create
From [file]: "[procedure]" could become a command for [task]
- **Command name**: /command-name
- **Purpose**: [what the command would do]
- **Content source**: [file:line range]

## Recommendations
1. [Priority action item]
2. [Next priority action item]
3. [Additional suggestion]

## Suggested Structure
[Proposed directory/file organization]
```

---

# Guidelines

- **Analyze before acting**: Always examine existing documentation structure before making changes
- **Ask when unclear**: Use AskUserQuestion if documentation placement is ambiguous
- **Suggest good structure**: Recommend organized, topic-based documentation
- **Follow existing patterns**: Maintain consistency with the project's current documentation style
- **Assess automation**: For each learning, consider if it can be auto-verified
- Focus on **reproducible workflows** and **actionable guidance**
- Use **concrete examples** from the conversation (commands, code snippets, file paths)
- Maintain the **progressive disclosure** principle (overview in CLAUDE.md, details in referenced files)
- Don't duplicate information — **reference existing docs** when appropriate
- Ensure documentation is **clear for future LLM consumption** and human developers
- Keep all guidance **stack-independent** — examples may reference specific stacks but the core process must be generic

Begin by reading CLAUDE.md (if it exists) and exploring the project structure to understand current documentation organization, then analyze this conversation for learnings.
