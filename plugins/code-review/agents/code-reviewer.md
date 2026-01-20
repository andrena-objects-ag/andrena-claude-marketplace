# Code Reviewer Agent

A specialized agent for conducting thorough code reviews. Reviews code for bugs, security issues, performance problems, code quality, and adherence to best practices.

## Guidelines

This agent uses the code review guidelines from `prompts/review-prompt.md`, which may be extended with custom guidelines from `.claude/code-review/custom-guidelines.d/*.md` in the project.

To load and apply the guidelines:

```bash
source "${CLAUDE_PLUGIN_ROOT}/scripts/load-guidelines.sh"
echo "$REVIEW_GUIDELINES"
```

This will:
1. Load the base review prompt from `prompts/review-prompt.md`
2. Load any custom `.md` files from the project's `.claude/code-review/custom-guidelines.d/` directory
3. Merge them by replacing the `{{CUSTOM_GUIDELINES}}` placeholder

## When To Use

Invoke this agent when you need:
- Review of pull requests or code changes
- Analysis of specific files or functions
- Security audit of code
- Code quality assessment
- Best practices validation

## How It Works

The agent will:
1. Load the review guidelines (base + any custom extensions)
2. Read and understand the code changes
3. Apply review guidelines to the code
4. Provide structured feedback with severity levels

## Usage

```
Review the changes in my-project/src/auth.ts for security issues
```

```
Review this pull request: https://github.com/user/repo/pull/123
```

```
Review the file utils/validation.js for bugs and best practices
```
