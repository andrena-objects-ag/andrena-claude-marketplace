# Agents Directory

This directory contains agent definitions for the Claude Marketplace.

## Agent Structure

Each agent should be placed in its own subdirectory with the following structure:

```
agent-name/
├── plugin.json           # Plugin manifest
├── agent-name.md         # Agent definition file
└── README.md            # Optional: Agent documentation
```

## Agent Template

### plugin.json

```json
{
  "name": "agent-name",
  "description": "Brief description of what this agent does",
  "version": "1.0.0",
  "author": {
    "name": "Author Name",
    "email": "author@example.com"
  },
  "homepage": "https://github.com/author/agent-repo",
  "repository": "https://github.com/author/agent-repo",
  "license": "MIT",
  "keywords": ["relevant", "tags"],
  "category": "agents",
  "tags": ["additional", "search", "tags"],
  "agents": [
    "agent-name.md"
  ]
}
```

### agent-name.md

```markdown
---
name: agent-name
description: Brief description of the agent's purpose
tools: Bash, Glob, Grep, Read, Edit, Write, NotebookEdit, TodoWrite, BashOutput, KillShell, SlashCommand
model: sonnet
color: blue
---

You are a [Agent Role] with expertise in [specific domain]. Your primary role is to [main task].

You will:
1. [Key responsibility 1]
2. [Key responsibility 2]
3. [Key responsibility 3]

## Usage Patterns

[Explain common usage patterns and examples]

## When to Use This Agent

Use this agent when:
- [Condition 1]
- [Condition 2]
- [Condition 3]

## Best Practices

1. [Best practice 1]
2. [Best practice 2]
3. [Best practice 3]
```

## Available Agents

### Gemini Web Search Agent

- **Directory**: `gemini-web-search-agent/`
- **Purpose**: Web searches and current information retrieval using Gemini CLI
- **Specialization**: Finding up-to-date information online

## Adding New Agents

1. Create a new directory for your agent
2. Add the required `plugin.json` manifest
3. Add the agent definition `.md` file
4. Update the main marketplace configuration
5. Test the agent installation

## Guidelines

- Agent names should be kebab-case
- Provide clear, concise descriptions
- Include relevant keywords for discovery
- Test agents before submission
- Follow the agent metadata format precisely