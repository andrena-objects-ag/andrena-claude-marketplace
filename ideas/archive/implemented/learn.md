---
description: Extract key learnings from the current conversation and update project documentation
status: IMPLEMENTED
implementation: plugins/documentation-learner/commands/learn.md
date-implemented: 2026-01-13
---

# Learn from Conversation

**✅ IMPLEMENTED**: This idea has been implemented as the `/learn` command in the `documentation-learner` plugin.

Analyze the current conversation and extract key learnings, especially regarding:

1. **Workflows**: How to accomplish tasks (e.g., creating PRs, getting ticket descriptions, running tests, deploying, debugging)
2. **Patterns**: Code patterns, architectural decisions, or conventions discovered
3. **Tools and Scripts**: Usage of helper scripts, pipeline tools, or development utilities
4. **Common Pitfalls**: Issues encountered and how they were resolved
5. **Best Practices**: Techniques that proved effective

## Your Task

1. **Review the conversation** to identify actionable learnings and workflows
2. **Categorize learnings** by topic:
   - General workflows → CLAUDE.md
   - Backend-specific → backend/README.md or backend/docs/
   - Frontend-specific → frontend/CLAUDE.md
   - E2E testing → frontend/apps/identity-e2e/.llm/
   - Pipeline/CI/CD → .llm/pipeline-management.md
   - Azure DevOps → .llm/backlog-management.md or .llm/commands.md
   - Deployment → .llm/deployment.md
   - Other specialized topics → appropriate .llm/*.md file

3. **Update documentation** by:
   - Adding new sections if the workflow is entirely new
   - Enhancing existing sections with additional details or examples
   - Creating new referenced markdown files in .llm/ for substantial new topics
   - Ensuring consistency with existing documentation style and structure

4. **Present changes** to the user:
   - Summarize what learnings were captured
   - Show which files were updated
   - Explain the rationale for placement decisions

## Important Guidelines

- Focus on **reproducible workflows** and **actionable guidance**
- Use **concrete examples** from the conversation (commands, code snippets, file paths)
- Maintain the **progressive disclosure** principle (overview in CLAUDE.md, details in referenced files)
- Follow existing **formatting conventions** (PowerShell commands with full paths, bash examples, etc.)
- Don't duplicate information—**reference existing docs** when appropriate
- Ensure documentation is **clear for future LLM consumption** and human developers

Begin by reading CLAUDE.md and any relevant referenced documentation files to understand the current state, then analyze this conversation for learnings.
