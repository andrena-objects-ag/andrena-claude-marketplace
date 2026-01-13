# Documentation Learner Plugin

Extract key learnings from conversations and automatically update project documentation with workflows, patterns, and best practices.

## Overview

The Documentation Learner plugin helps you capture and preserve knowledge from your Claude Code conversations. After solving problems, discovering workflows, or identifying patterns, use the `/learn` command to extract these insights and update your project documentation automatically.

## Installation

```bash
/plugin marketplace add andrena-objects-ag/andrena-claude-marketplace
/plugin install documentation-learner@andrena-marketplace
```

## Features

### `/learn` Command

Analyzes the current conversation and extracts actionable learnings, including:

- **Workflows**: How to accomplish tasks (creating PRs, running tests, deploying, debugging)
- **Patterns**: Code patterns, architectural decisions, conventions
- **Tools and Scripts**: Usage of helper scripts, pipeline tools, development utilities
- **Common Pitfalls**: Issues encountered and their resolutions
- **Best Practices**: Techniques that proved effective

## Usage

After a productive conversation where you've discovered new workflows or solved problems:

```
/learn
```

Claude will:
1. **Analyze your project structure** to understand existing documentation organization
2. **Review the conversation** for actionable learnings
3. **Determine placement** - either following existing structure or asking you where to document
4. **Update documentation files** (CLAUDE.md, README files, .llm/*.md files)
5. **Present a summary** of what was captured and where

## Documentation Organization

The `/learn` command adapts to your project's documentation structure:

### **If documentation structure exists:**
- Follows existing conventions and file organization
- Adds learnings to appropriate existing files
- Maintains consistency with current structure

### **If structure is unclear:**
- Uses AskUserQuestion to ask where to document learnings
- Suggests creating `.llm/` directory for organized topic-based documentation
- Provides options with clear descriptions of what goes where

### **Recommended structure** (suggested if project lacks organization):
```
project-root/
├── CLAUDE.md                    # Main documentation hub
├── README.md                    # Project overview
└── .llm/                        # Detailed topic-specific docs
    ├── workflows.md
    ├── deployment.md
    ├── testing.md
    └── [topic].md
```

## Best Practices

### When to Use `/learn`

Use the `/learn` command after:
- Solving a complex problem
- Discovering a new workflow
- Identifying code patterns or conventions
- Debugging and finding root causes
- Learning new tool usage
- Establishing best practices

### What Gets Captured

The command focuses on:
- **Reproducible workflows** with concrete steps
- **Actionable guidance** that can be followed later
- **Concrete examples** from the conversation (commands, code snippets, file paths)
- **Progressive disclosure** (overview in main docs, details in referenced files)

### What Doesn't Get Captured

- One-off solutions without broader applicability
- Highly context-specific information that won't generalize
- Duplicate information already in documentation

## Examples

### Example 1: Project with Existing Structure

After successfully deploying an application:

```
/learn
```

**Claude's process:**
1. Reads CLAUDE.md, finds references to `.llm/deployment.md`
2. Identifies deployment workflow in conversation
3. Updates `.llm/deployment.md` with step-by-step commands and gotchas
4. Reports what was added

### Example 2: Project Without Clear Structure

After discovering a testing pattern:

```
/learn
```

**Claude's process:**
1. Checks for CLAUDE.md - doesn't exist
2. Identifies testing learnings
3. Asks: "Where should I document the testing workflow?"
   - Option A: Create CLAUDE.md and add there
   - Option B: Create .llm/ directory with testing.md (Recommended)
   - Option C: Add to README.md
4. User selects Option B
5. Creates `.llm/testing.md` with the patterns
6. Suggests adding reference in CLAUDE.md

### Example 3: Multiple Learning Types

After a session with deployment, testing, and API learnings:

```
/learn
```

**Claude's process:**
1. Analyzes project structure - finds CLAUDE.md but no .llm/ directory
2. Identifies 3 different learning topics
3. Asks: "This project doesn't have a .llm/ directory. How should we organize?"
   - Option A: Create .llm/ with topic-specific files (Recommended)
   - Option B: Add all to CLAUDE.md with sections
4. User selects Option A
5. Creates `.llm/deployment.md`, `.llm/testing.md`, `.llm/api-integration.md`
6. Updates CLAUDE.md with references to new files

## Output

The `/learn` command provides:

1. **Summary of learnings captured**
   - What workflows or patterns were identified
   - Where they fit in the broader project context

2. **Files updated**
   - List of documentation files modified
   - Summary of changes made to each

3. **Rationale for placement**
   - Explanation of why learnings went to specific files
   - Consistency with existing documentation structure

## Guidelines

The command follows these principles:

- **Analyze before acting**: Always examine project structure before making changes
- **Ask when unclear**: Uses AskUserQuestion when documentation placement is ambiguous
- **Suggest good structure**: Recommends .llm/ directory for organized documentation
- **Adapt to existing patterns**: Follows project's current documentation conventions
- **Concrete over abstract**: Uses specific commands, file paths, and code snippets
- **Actionable over descriptive**: Focuses on "how to" rather than "what is"
- **Progressive disclosure**: Overview in CLAUDE.md, details in referenced files
- **Referenced over duplicated**: Links to existing docs rather than repeating content
- **LLM-optimized**: Documentation is clear for both future LLM consumption and human developers

## Future Enhancements

Potential future additions to this plugin:

- **Skill**: Automatic learning detection during conversations
- **Hook**: Post-conversation trigger to prompt for learning capture
- **Command**: `/review-learnings` to audit and refine existing documentation
- **Command**: `/learning-summary` to generate learning reports over time

## Support

For issues, feature requests, or contributions:
- Create an issue in the marketplace repository
- Check existing documentation and examples

## License

MIT License - see LICENSE file for details.

## Version History

- **v1.1.0**: Generic documentation structure support
  - Project structure analysis before acting
  - AskUserQuestion integration for unclear categorization
  - Recommended .llm/ directory structure
  - Adapts to existing documentation patterns
  - More flexible and project-agnostic approach

- **v1.0.0**: Initial release with `/learn` command
  - Conversation analysis and learning extraction
  - Documentation categorization
  - Automatic file updates with rationale
