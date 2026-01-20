# Code Review Plugin

A comprehensive code review solution for Claude Code with both a skill and a dedicated agent. Features externalized, extensible review prompts with support for project-specific custom guidelines.

## Features

- **Dual-mode operation**: Default subagent review (isolated) or optional in-context review
- **Extensible guidelines**: Base prompts + project-specific custom guidelines
- **Comprehensive coverage**: Bugs, security, performance, quality, best practices, testing, documentation
- **Structured output**: Issues categorized by severity (Critical, Major, Minor)
- **Actionable feedback**: Each issue includes location, problem description, and suggested fixes

## Components

### Skill: `/code-review`
User-invocable skill that:
- Uses forked context with the code-reviewer agent by default
- Provides consistent, isolated reviews
- Can run in-context when needed with `--in-context`

### Agent: `code-reviewer`
Dedicated subagent that:
- Applies review guidelines from the shared prompt
- Incorporates any project-specific custom guidelines
- Produces structured, actionable feedback

### Shared Prompt: `prompts/review-prompt.md`
Externalized review guidelines defining:
- Review scope and criteria
- Structured review process
- Output format and severity levels
- Placeholder for custom guidelines injection

## Custom Guidelines

Projects can extend the base review guidelines by adding markdown files to `.claude/code-review/custom-guidelines.d/`:

### Setup

```bash
mkdir -p .claude/code-review/custom-guidelines.d
```

### Adding Custom Guidelines

Create `.md` files in the custom guidelines directory. Use numbered prefixes for ordering:

```bash
.claude/code-review/custom-guidelines.d/
├── 01-typescript-rules.md
├── 02-react-best-practices.md
├── 03-project-naming-conventions.md
└── 04-forbidden-patterns.md
```

### Example Custom Guideline

```markdown
# TypeScript Security Rules

When reviewing TypeScript code, also check for:

- **any types**: Flag usage of `any` - suggest proper types
- **type assertions**: Look for unsafe `as` casts
- **non-null assertions**: Flag `!` operator usage
- **optional chaining**: Ensure `?.` is used appropriately
```

Custom guidelines are automatically merged into the base prompt at the `{{CUSTOM_GUIDELINES}}` placeholder.

## Usage

### Default (Subagent Review)
```
/code-review
Review src/auth/login.ts for security issues
```

### In-Context Review
```
/code-review --in-context
Review the payment processing module
```

### Direct Agent Invocation
Claude will automatically invoke the code-reviewer agent when code review is needed based on task context.

## Review Categories

| Category | What's Checked |
|----------|----------------|
| **Bugs** | Logic errors, edge cases, null handling, race conditions |
| **Security** | Injection vulnerabilities, sensitive data exposure, auth issues |
| **Performance** | Inefficient algorithms, unnecessary allocations, missing optimizations |
| **Code Quality** | Readability, maintainability, naming conventions, complexity |
| **Best Practices** | Language idioms, SOLID principles, DRY, KISS |
| **Testing** | Missing coverage, untestable code, test quality |
| **Documentation** | Missing comments, incomplete docstrings |
| **Custom** | Any project-specific rules you've defined |

## Output Format

```
### Summary
[Brief overall assessment]

### Issues
- **Critical**: [Must-fix issues]
- **Major**: [Should-fix issues]
- **Minor**: [Nice-to-have improvements]

### Positive Feedback
[Well-done aspects]

### Questions
[Clarifications needed]
```

## Examples

Example custom guidelines are provided in `examples/custom-guidelines.d/`:
- `01-typescript-security.md` - TypeScript-specific security checks
- `02-project-specific.md` - Project naming conventions and forbidden patterns

## Version

1.0.0
