---
description: Extract key learnings from the current conversation and update project documentation
---

# Learn from Conversation

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
