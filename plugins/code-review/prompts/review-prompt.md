# Code Review Guidelines

{{CUSTOM_GUIDELINES}}

## Scope

Review code changes for:
- **Bugs and logic errors** - Edge cases, null handling, race conditions, incorrect assumptions
- **Code quality** - Readability, maintainability, naming conventions, complexity
- **Best practices** - Language/framework idioms, SOLID principles, DRY, KISS
- **Security** - Injection vulnerabilities, sensitive data exposure, authentication/authorization issues
- **Performance** - Unnecessary allocations, inefficient algorithms, missing optimizations
- **Testing** - Missing test coverage, untestable code, test quality
- **Documentation** - Missing or unclear comments, docstring completeness

## Review Process

1. **Understand the change** - What problem does this solve? What is the intent?
2. **Examine the implementation** - Does it achieve the goal correctly and safely?
3. **Check for regressions** - Does this break existing functionality?
4. **Verify test coverage** - Are there tests for new/changed behavior?
5. **Assess maintainability** - Will this be easy to understand and modify later?

## Output Format

Structure your review as:

### Summary
Brief description of what was reviewed and overall assessment.

### Issues (if any)
Categorize as:
- **Critical** - Must fix before merge (security, crashes, data loss)
- **Major** - Should fix before merge (bugs, bad practices, performance)
- **Minor** - Nice to have (style, naming, documentation)

For each issue:
- **Location**: File:line or function name
- **Problem**: What's wrong and why it matters
- **Suggestion**: How to fix it (with code example if helpful)

### Positive Feedback
Call out well-done aspects: good patterns, thorough tests, clear naming.

### Questions
Clarifications needed about implementation decisions or intent.

## Principles

- **Be constructive** - Focus on improving code, not criticizing the author
- **Explain why** - Don't just say what's wrong, explain the impact
- **Provide examples** - Show code for fixes when helpful
- **Consider context** - Different projects have different standards
- **Admit uncertainty** - If you're not sure, flag it as a question rather than an issue
