# Coding Aider Plugin

This plugin provides the Coding Aider Plan Generator skill for creating structured development plans that mirror the IntelliJ coding-aider plugin's plan system.

## Installation

Add this plugin to your Claude Code environment:

```bash
/plugin install coding-aider
```

## Usage

Once installed, the skill will automatically activate when you explicitly request:

- "Create a coding-aider plan"
- "Generate an aider plan"
- "I need a coding-aider plan for..."
- "Create a structured development plan like coding-aider"

## Features

The Coding Aider Plan Generator creates:

1. **Main Plan File** - Overview, problem description, goals, and constraints
2. **Checklist File** - Atomic implementation tasks for systematic development
3. **Context File** - Relevant files and their read/write permissions

## Generated Files

Plans are stored in `.coding-aider-plans/` directory:
- `{plan-name}.md` - Main plan document
- `{plan-name}_checklist.md` - Implementation checklist
- `{plan-name}_context.yaml` - File context configuration

## Example

```bash
"I need a coding-aider plan for implementing user authentication"
```

This generates a complete development plan with:
- Authentication overview and security goals
- Step-by-step implementation checklist
- Context files for auth controllers, services, and config

## License

MIT