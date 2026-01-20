---
name: code-review
description: Review code for bugs, security issues, performance problems, code quality, and adherence to best practices. Uses a structured review process with severity-categorized issues. Loads base guidelines from prompts/review-prompt.md and can be extended with custom guidelines from .claude/code-review/custom-guidelines.d/*.md. Default behavior uses a subagent for isolation; user can request in-context review.
user-invocable: true
agent: ./agents/code-reviewer.md
context: fork
---

# Code Review Skill

Conduct thorough code reviews using extensible review guidelines.

## How It Works

This skill uses a **forked context with a dedicated subagent** (code-reviewer) by default. This provides:
- Isolated review environment
- Clean context without previous conversation noise
- Consistent application of review guidelines

### Extensible Guidelines

The review guidelines are defined in two layers:

1. **Base guidelines** (`prompts/review-prompt.md`)
   - Core review scope and process
   - Standard output format
   - General review principles

2. **Custom guidelines** (project-specific, optional)
   - Located at `.claude/code-review/custom-guidelines.d/*.md`
   - Each `.md` file in this directory is automatically included
   - Files are processed alphabetically (use numbered prefixes for ordering)
   - Merged into base guidelines at the `{{CUSTOM_GUIDELINES}}` placeholder

## Setting Up Custom Guidelines

Create a directory in your project:

```bash
mkdir -p .claude/code-review/custom-guidelines.d
```

Add custom guideline files:

```bash
# Example: .claude/code-review/custom-guidelines.d/01-typescript.md
echo '# TypeScript Specific Rules

Check for:
- Unsafe `any` types - suggest proper typing
- Missing null checks - use optional chaining
- Incorrect React hooks usage
' > .claude/code-review/custom-guidelines.d/01-typescript.md
```

Custom guidelines are injected into the review prompt, so the agent will follow them automatically.

## Options

### Default: Subagent Review (Recommended)
```
/code-review
Review src/auth/login.ts
```
Uses the code-reviewer agent in a forked context for isolated, consistent reviews.

### In-Context Review
```
/code-review --in-context
Review the payment module
```
Performs the review in the current conversation context. Use when you want the review to have access to previous discussion or project-specific context.

## What Gets Reviewed

The review covers:
- **Bugs** - Logic errors, edge cases, null handling
- **Security** - Injection vulnerabilities, data exposure
- **Performance** - Inefficient algorithms, unnecessary allocations
- **Code Quality** - Readability, maintainability, naming
- **Best Practices** - Language idioms, SOLID principles
- **Testing** - Coverage, test quality
- **Documentation** - Comments, docstrings
- **Custom rules** - Any project-specific guidelines you've added

## Output Format

Reviews are structured as:
- **Summary** - Overall assessment
- **Issues** - Categorized as Critical, Major, or Minor
- **Positive Feedback** - Well-done aspects
- **Questions** - Clarifications needed

Each issue includes:
- Location (file:line or function)
- Problem description
- Suggested fix (with examples)

## Examples

Review a file:
```
Review src/auth/login.ts for security issues
```

Review changes:
```
Review the recent changes to the user service
```

Review for specific concerns:
```
Review payment-processing.js for bugs and edge cases
```
