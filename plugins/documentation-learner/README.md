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
1. Review the conversation for actionable learnings
2. Categorize learnings by topic (backend, frontend, testing, CI/CD, etc.)
3. Update appropriate documentation files (CLAUDE.md, README files, .llm/*.md files)
4. Present a summary of what was captured and where

## Documentation Organization

The `/learn` command intelligently routes learnings to the appropriate files:

| Learning Type | Destination |
|--------------|-------------|
| General workflows | `CLAUDE.md` |
| Backend-specific | `backend/README.md` or `backend/docs/` |
| Frontend-specific | `frontend/CLAUDE.md` |
| E2E testing | `frontend/apps/identity-e2e/.llm/` |
| Pipeline/CI/CD | `.llm/pipeline-management.md` |
| Azure DevOps | `.llm/backlog-management.md` or `.llm/commands.md` |
| Deployment | `.llm/deployment.md` |
| Specialized topics | Appropriate `.llm/*.md` file |

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

### Example 1: Capturing a Deployment Workflow

After successfully deploying an application with a multi-step process:

```
/learn
```

**Result**: Updates `.llm/deployment.md` with:
- Step-by-step deployment commands
- Environment configuration requirements
- Common deployment issues and solutions
- Rollback procedures

### Example 2: Documenting a Testing Pattern

After discovering how to test a complex component:

```
/learn
```

**Result**: Updates testing documentation with:
- Test setup requirements
- Mocking strategies used
- Assertion patterns
- Edge cases to consider

### Example 3: Capturing Azure DevOps Workflow

After learning how to manage backlog items via API:

```
/learn
```

**Result**: Updates `.llm/backlog-management.md` with:
- API authentication setup
- Query examples for fetching work items
- Update patterns for modifying items
- Common API gotchas

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

- **Concrete over abstract**: Uses specific commands, file paths, and code snippets
- **Actionable over descriptive**: Focuses on "how to" rather than "what is"
- **Organized over scattered**: Maintains consistent documentation structure
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

- **v1.0.0**: Initial release with `/learn` command
  - Conversation analysis and learning extraction
  - Intelligent documentation categorization
  - Automatic file updates with rationale
