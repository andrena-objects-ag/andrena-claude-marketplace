---
name: Command Creator
description: Create custom slash commands with proper syntax, arguments, frontmatter, and features. Use when users need to create slash commands, want to automate frequent prompts, or need to organize commands for team workflows.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Command Creator

Create, structure, and validate custom slash commands for Claude Code with proper syntax, argument handling, and advanced features.

## Instructions

### 1. Understand Command Requirements

Before creating a slash command, gather this information:
- **Purpose**: What task should this command perform?
- **Frequency**: How often will this command be used?
- **Scope**: Personal command (user) or project command (team)?
- **Arguments**: Does the command need input parameters?
- **Integration**: Should it use bash commands, file references, or special features?

### 2. Choose Command Type and Location

#### Personal Commands
- **Location**: `~/.claude/commands/`
- **Use case**: Individual workflows, personal productivity tools
- **Description in /help**: Shows "(user)" after description

#### Project Commands
- **Location**: `.claude/commands/`
- **Use case**: Team workflows, shared utilities, project-specific tasks
- **Description in /help**: Shows "(project)" after description

#### Organization with Subdirectories
- **Structure**: `.claude/commands/category/command-name.md`
- **Benefit**: Organized descriptions showing "(project:category)" or "(user:category)"

### 3. Create Command File Structure

Basic command file structure:
```markdown
---
frontmatter fields
---

Command content and instructions
```

### 4. Write Effective Frontmatter

Include relevant frontmatter fields:

```yaml
---
description: Brief description of what the command does
argument-hint: [optional] [arguments] [pattern]
allowed-tools: Read, Write, Edit, Bash(git add:*), Bash(git status:*)
model: claude-3-5-haiku-20241022  # optional specific model
disable-model-invocation: false  # optional, prevents tool execution
---
```

**Frontmatter Fields Explained**:
- `description`: Brief summary shown in `/help` and command discovery
- `argument-hint`: Expected argument pattern shown during autocomplete
- `allowed-tools`: Specific tools this command can use (inherits from conversation if not specified)
- `model`: Force specific model for this command
- `disable-model-invocation`: Prevent this command from being called via SlashCommand tool

### 5. Handle Command Arguments

#### All Arguments with `$ARGUMENTS`
```markdown
---
description: Create a git commit with message
argument-hint: [message]
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
---

Create a git commit with message: $ARGUMENTS
```

#### Positional Arguments with `$1`, `$2`, etc.
```markdown
---
description: Review pull request with details
argument-hint: [pr-number] [priority] [assignee]
---

Review PR #$1 with priority $2 and assign to $3.
Focus on security, performance, and code style.
```

#### Mixed Arguments
```markdown
---
description: Process file with options
argument-hint: [filename] [option1] [option2]
---

Processing file: $1
Options specified: $2 and $3
Additional arguments: $ARGUMENTS
```

### 6. Add Advanced Features

#### Bash Command Integration
Use the `!` prefix to execute bash commands before the slash command runs:

```markdown
---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*)
description: Create informed git commit
---

## Context
- Current git status: !`git status`
- Current changes: !`git diff HEAD`
- Recent commits: !`git log --oneline -5`

## Task
Based on the above context, create a git commit.
```

#### File References
Use the `@` prefix to include file contents:

```markdown
Review the implementation in @src/utils/helpers.js

Compare @src/old-version.js with @src/new-version.js
```

#### Thinking Mode
Include extended thinking keywords for complex analysis:

```markdown
---
description: Deep code analysis
---

Please think step by step when analyzing this code.

Use extended thinking to provide comprehensive insights.
```

### 7. Write Command Content

Structure your command content effectively:

#### Simple Commands
```markdown
---
description: Quick code review
---

Review this code for:
- Security vulnerabilities
- Performance issues
- Code style violations
- Logic errors
```

#### Structured Commands
```markdown
---
description: Comprehensive security review
argument-hint: [target]
---

# Security Review for: $1

## Checklist
- [ ] Input validation
- [ ] Authentication/authorization
- [ ] Data sanitization
- [ ] Error handling
- [ ] Logging/monitoring

## Analysis
[Provide detailed security analysis here]

## Recommendations
[List specific security improvements]
```

#### Interactive Commands
```markdown
---
description: Generate test cases
argument-hint: [function-name] [test-type]
---

# Test Generation for: $1

## Test Type: $2

## Generated Tests
[Generate appropriate test cases based on the function and test type]

## Test Coverage
[Verify comprehensive coverage]
```

### 8. Validate the Command

Perform these validation checks:

#### Syntax Validation
- Markdown file with `.md` extension
- Valid YAML frontmatter (proper `---` boundaries)
- Correct argument placeholder syntax (`$1`, `$2`, `$ARGUMENTS`)

#### Functionality Validation
- Argument placeholders work correctly
- Bash commands have proper permissions in `allowed-tools`
- File references use correct `@` syntax
- Command name derived from filename (without extension)

#### Directory Validation
- File in correct location (personal vs project)
- Proper directory structure for organized commands
- Filename uses kebab-case or snake_case

## Best Practices

### Command Design
- **Single purpose**: Each command should do one thing well
- **Clear naming**: Command names should be intuitive and descriptive
- **Helpful descriptions**: Include what the command does and expected arguments
- **Error handling**: Provide guidance for common error scenarios

### Argument Handling
- **Use positional arguments** when you need structured input
- **Use `$ARGUMENTS`** for simple parameter passing
- **Provide defaults** for optional arguments in your command logic
- **Document expected formats** in argument hints

### Tool Permissions
- **Be specific** with `allowed-tools` to enhance security
- **List exact bash commands** when using bash integration
- **Inherit from conversation** when commands need general tool access

### Testing
- **Test with various argument combinations**
- **Verify bash commands execute correctly**
- **Check file references resolve properly**
- **Test command discovery with `/help`**

## Command Templates

### Template 1: Simple Utility Command
```markdown
---
description: Format JSON file
argument-hint: [filename]
---

Format JSON file: $1

Use proper indentation and validate JSON syntax.
```

### Template 2: Git Workflow Command
```markdown
---
description: Create feature branch
argument-hint: [branch-name]
allowed-tools: Bash(git checkout:*), Bash(git branch:*)
---

Create and switch to new feature branch: $1

## Steps:
1. Create branch: `git checkout -b $1`
2. Verify branch creation
3. Set up branch tracking if needed
```

### Template 3: Code Analysis Command
```markdown
---
description: Analyze code complexity
argument-hint: [file-or-directory]
allowed-tools: Read, Grep, Glob
---

Analyze code complexity for: $1

## Metrics to Evaluate:
- Cyclomatic complexity
- Code duplication
- Function length
- Nesting depth
- Dependency analysis

## Analysis Process:
1. Scan target files
2. Calculate complexity metrics
3. Identify areas for improvement
4. Provide optimization recommendations
```

### Template 4: Interactive Development Command
```markdown
---
description: Generate API documentation
argument-hint: [source-file] [output-format]
allowed-tools: Read, Write, Edit
---

Generate API documentation for: $1
Output format: $2

## Documentation Sections:
- Function signatures
- Parameter descriptions
- Return value documentation
- Usage examples
- Error conditions

## Output:
[Generate comprehensive documentation in specified format]
```

## Validation Commands

Use these commands to test your slash commands:

```bash
# List available commands
/help

# Test command with arguments
/your-command arg1 arg2

# Check command file exists
ls ~/.claude/commands/your-command.md

# Validate YAML syntax
head -n 10 ~/.claude/commands/your-command.md
```

## Troubleshooting

### Command Not Appearing in /help
- Check file location (personal vs project directory)
- Verify `.md` extension
- Ensure valid YAML frontmatter
- Check for syntax errors in frontmatter

### Arguments Not Working
- Verify placeholder syntax (`$1`, `$ARGUMENTS`)
- Check argument-hint format in frontmatter
- Test with different argument combinations

### Bash Commands Failing
- Verify `allowed-tools` includes specific bash commands
- Check bash command syntax and permissions
- Ensure bash commands use backticks with `!` prefix

### File References Not Loading
- Verify `@` prefix usage
- Check file paths and existence
- Ensure files are accessible in current context

## Examples

### Example 1: Git Commit Command
```markdown
---
description: Create git commit with staged changes
argument-hint: [message]
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
---

# Git Commit

Message: $ARGUMENTS

## Context
!`git status`
!`git diff --cached`

## Action
Create commit with proper formatting and include relevant context.
```

### Example 2: Code Review Command
```markdown
---
description: Review code changes in PR
argument-hint: [pr-number]
---

# PR Review: #$1

## Review Areas:
- Code correctness and logic
- Performance implications
- Security considerations
- Code style and readability
- Test coverage

## Process:
1. Examine the changes
2. Identify potential issues
3. Suggest improvements
4. Provide overall assessment
```

### Example 3: Documentation Generation
```markdown
---
description: Generate function documentation
argument-hint: [function-name]
---

# Documentation: $1

Generate comprehensive documentation including:
- Purpose and functionality
- Parameter descriptions
- Return value details
- Usage examples
- Error conditions
- Related functions
```

## Advanced Features

### Subcommands
Create command families using argument patterns:
```markdown
---
description: Database operations
argument-hint: [operation] [table] [options]
---

Database operation: $1
Target table: $2
Options: $3

## Operations:
- migrate: Run database migrations
- backup: Create backup
- restore: Restore from backup
- seed: Populate with test data
```

### Conditional Logic
Build commands that adapt to input:
```markdown
---
description: Smart file processor
argument-hint: [filename] [operation]
---

Processing file: $1
Operation: $2

## File Type Detection
[Determine file type and process accordingly]

## Operation Logic
[Apply different processing based on operation type]
```