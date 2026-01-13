---
description: Extract key learnings from conversations or analyze documentation structure. Usage: /learn [--analyze-docs] [topic]
argument-hint: [--analyze-docs] [topic]
---

# Learn from Conversation

This command has two modes:

1. **Default mode**: Analyze the current conversation and extract key learnings
2. **`--analyze-docs` mode**: Analyze existing documentation structure and identify improvement opportunities

## Mode Detection

- If `$ARGUMENTS` contains `--analyze-docs`: Run documentation analysis mode
- Otherwise: Run default learning extraction mode

---

# Default Mode: Extract Learnings

Analyze the current conversation and extract key learnings, especially regarding:

1. **Workflows**: How to accomplish tasks (e.g., creating PRs, getting ticket descriptions, running tests, deploying, debugging)
2. **Patterns**: Code patterns, architectural decisions, or conventions discovered
3. **Tools and Scripts**: Usage of helper scripts, pipeline tools, or development utilities
4. **Common Pitfalls**: Issues encountered and how they were resolved
5. **Best Practices**: Techniques that proved effective

## Your Task

1. **Analyze project structure** first:
   - Check if CLAUDE.md exists (read it to understand current documentation)
   - Look for existing .llm/ directory and its contents
   - Identify project structure (monorepo, single project, subdirectories)
   - Find existing README files and documentation locations

2. **Review the conversation** to identify actionable learnings and workflows

3. **Determine documentation placement**:
   - **If documentation structure is clear** (CLAUDE.md references specific files, .llm/ directory exists with organized files):
     - Follow existing structure and naming conventions
   - **If structure is unclear or learnings don't fit existing categories**:
     - Use AskUserQuestion to ask the user where to document the learnings
     - Suggest options based on the learning type:
       - General workflows → CLAUDE.md (or create if doesn't exist)
       - Specialized topics → .llm/[topic].md (suggest creating .llm/ directory if needed)
       - Component-specific → Component's local README.md or CLAUDE.md
     - Provide clear descriptions of what would go in each option

4. **Update documentation** by:
   - Adding new sections if the workflow is entirely new
   - Enhancing existing sections with additional details or examples
   - Creating new referenced markdown files in .llm/ for substantial new topics
   - Ensuring consistency with existing documentation style and structure

5. **Present changes** to the user:
   - Summarize what learnings were captured
   - Show which files were updated
   - Explain the rationale for placement decisions

## Using AskUserQuestion for Unclear Categorization

When the documentation structure is unclear or learnings don't fit existing categories, use AskUserQuestion:

**Example for multiple learning types:**
```
Question: "Where should I document these learnings?"
Options:
- "Update CLAUDE.md with general workflow" (Description: Add deployment workflow to main project documentation)
- "Create .llm/deployment.md for specialized topic" (Description: Create new file in .llm/ directory specifically for deployment processes)
- "Update backend/README.md for component-specific" (Description: Add to backend component documentation)
```

**Example when suggesting new structure:**
```
Question: "This project doesn't have a .llm/ directory yet. How should we organize documentation?"
Options:
- "Create .llm/ directory and organize by topic (Recommended)" (Description: Create .llm/deployment.md, .llm/testing.md, etc. Referenced from CLAUDE.md)
- "Add everything to CLAUDE.md" (Description: Keep all documentation in single file with sections)
- "Create topic-specific files in root" (Description: deployment.md, testing.md in project root)
```

## Important Guidelines

- **Analyze before acting**: Always examine existing documentation structure before making changes
- **Ask when unclear**: Use AskUserQuestion if documentation placement is ambiguous
- **Suggest good structure**: Recommend creating .llm/ directory for organized, topic-based documentation
- **Follow existing patterns**: Maintain consistency with the project's current documentation style
- Focus on **reproducible workflows** and **actionable guidance**
- Use **concrete examples** from the conversation (commands, code snippets, file paths)
- Maintain the **progressive disclosure** principle (overview in CLAUDE.md, details in referenced files)
- Don't duplicate information—**reference existing docs** when appropriate
- Ensure documentation is **clear for future LLM consumption** and human developers

## Recommended Documentation Structure

If the project lacks clear documentation organization, suggest this structure:

```
project-root/
├── CLAUDE.md                    # Main documentation hub with overview and references
├── README.md                    # Project description and quick start
└── .llm/                        # Detailed topic-specific documentation
    ├── workflows.md             # Common development workflows
    ├── deployment.md            # Deployment procedures
    ├── testing.md               # Testing strategies and patterns
    ├── troubleshooting.md       # Common issues and solutions
    └── [topic].md               # Other specialized topics
```

**Benefits of .llm/ directory:**
- Keeps detailed documentation organized and separate from code
- Easy to reference from CLAUDE.md
- Progressive disclosure (CLAUDE.md → .llm/topic.md)
- Clear namespace for LLM-optimized documentation

Begin by reading CLAUDE.md (if it exists) and exploring the project structure to understand current documentation organization, then analyze this conversation for learnings.

---

# --analyze-docs Mode: Documentation Structure Analysis

When `$ARGUMENTS` contains `--analyze-docs`, analyze the existing documentation structure and identify improvement opportunities.

## Your Task

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
- [description of overlap]

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

## Important Guidelines for Analysis Mode

- **Thorough scanning**: Check all common documentation locations
- **Concrete recommendations**: Provide specific file names and line numbers
- **Prioritized actions**: Rank recommendations by impact/effort
- **Skill/command focus**: Highlight opportunities for automation
- **Preserve context**: Explain why changes would improve organization
- **Respect existing patterns**: Note good patterns to maintain

## Examples

### Example 1: Duplicate Detection
```
# Issues Found - Duplicates
- sub-agents.md and subagents.md: These appear to serve the same purpose
- Recommendation: Consolidate into single file, remove duplicate
```

### Example 2: Large File Splitting
```
# Large Files
- plugins.md: 413 lines - could be split into:
  - plugins/quickstart.md (lines 1-170): Getting started guide
  - plugins/structure.md (lines 172-257): Directory structure
  - plugins/development.md (lines 259-413): Advanced development
```

### Example 3: Skill Extraction
```
# Modularization Opportunities - Skills
From plugins.md: "Convert existing configurations to plugins" section
- **Skill name**: plugin-migrator
- **Purpose**: Automatically migrate .claude/ configurations to plugin format
- **Content source**: plugins.md:303-388
```

When `--analyze-docs` is detected, skip the default learning extraction and perform this analysis instead.


