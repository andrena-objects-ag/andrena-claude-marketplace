# Skill & Command Creator Plugin

A comprehensive toolkit for creating Agent Skills and slash commands in Claude Code with templates, validation, and best practices guidance.

## Overview

This plugin provides two powerful Skills:

1. **Skill Creator** - Create comprehensive Agent Skills with proper structure, validation, and best practices
2. **Command Creator** - Create custom slash commands with proper syntax, arguments, and advanced features

## Installation

```bash
/plugin marketplace add p-wegner/claude-marketplace
/plugin install skill-command-creator@claude-marketplace
```

## Features

### Skill Creator
- **Structured Creation**: Follow proper Skill directory structure and naming conventions
- **YAML Validation**: Ensure correct frontmatter syntax and required fields
- **Best Practices**: Implement Claude's recommended Skill development patterns
- **Template Library**: Access proven templates for different Skill types
- **Validation Tools**: Built-in validation for syntax, structure, and functionality
- **Supporting Files**: Create reference docs, examples, scripts, and templates

### Command Creator
- **Argument Handling**: Support for positional arguments (`$1`, `$2`) and all arguments (`$ARGUMENTS`)
- **Frontmatter Management**: Proper YAML configuration with all supported fields
- **Advanced Features**: Bash integration, file references, thinking mode
- **Tool Permissions**: granular control over allowed tools
- **Validation**: Syntax checking and functionality testing
- **Organization**: Support for subdirectories and command categorization

## Usage

### Creating Skills

Simply describe the Skill you want to create:

```
I need to create a Skill for analyzing Excel spreadsheets and creating pivot tables. It should handle .xlsx files and generate charts.
```

The Skill Creator will automatically:
- Analyze your requirements
- Suggest proper directory structure
- Create comprehensive SKILL.md with correct frontmatter
- Provide templates and examples
- Validate the final Skill

### Creating Commands

Describe the command you need:

```
I want a slash command to create git commits with automatic staged file detection and commit message generation.
```

The Command Creator will automatically:
- Determine command type (personal/project)
- Create proper file structure
- Write frontmatter with appropriate tool permissions
- Handle argument parsing
- Add bash integration if needed
- Include validation and error handling

## Skills Included

### Skill Creator
**When it activates**: Automatically when you mention creating skills, extending Claude's capabilities, or organizing expertise into reusable skills.

**Capabilities**:
- Create personal and project Skills
- Generate proper YAML frontmatter
- Structure multi-file Skills with supporting resources
- Validate Skill syntax and functionality
- Provide templates and best practices

### Command Creator
**When it activates**: Automatically when you mention creating slash commands, automating frequent prompts, or organizing commands for team workflows.

**Capabilities**:
- Create personal and project commands
- Handle complex argument patterns
- Integrate bash commands and file references
- Manage tool permissions and security
- Organize commands in subdirectories

## Examples

### Example 1: Creating a Data Analysis Skill

```
I need a Skill for analyzing sales data in CSV files, generating reports, and creating visualizations.
```

**Result**: Complete Skill with:
- Proper directory structure
- CSV processing capabilities
- Report generation templates
- Visualization examples
- Data validation scripts

### Example 2: Creating a Deployment Command

```
Create a slash command for deploying applications with environment selection and rollback capabilities.
```

**Result**: Full-featured command with:
- Environment argument handling
- Deployment script integration
- Rollback functionality
- Status reporting
- Error handling

## Best Practices

### Skill Development
- **Single Purpose**: Each Skill should address one specific capability
- **Clear Descriptions**: Include specific triggers and use cases
- **Progressive Disclosure**: Keep SKILL.md focused, reference other files
- **Tool Restrictions**: Limit tools when Skill has narrow scope

### Command Development
- **Intuitive Naming**: Command names should clearly indicate functionality
- **Argument Design**: Use positional arguments for structured input
- **Tool Permissions**: Be specific with allowed tools for security
- **Error Handling**: Provide clear guidance for common issues

## Validation and Testing

Both Skills include comprehensive validation:

### Automatic Validation
- YAML syntax checking
- Directory structure verification
- File naming convention compliance
- Tool permission validation

### Manual Testing
```bash
# Test Skills
claude --debug  # Check for loading errors

# Test Commands
/help  # Verify command appears
/your-command test-args  # Test functionality
```

## Troubleshooting

### Skills Not Working
- Check directory location (`~/.claude/skills/` vs `.claude/skills/`)
- Validate YAML frontmatter syntax
- Ensure description includes specific triggers
- Verify file permissions and accessibility

### Commands Not Appearing
- Confirm file location (personal vs project)
- Check `.md` extension and valid YAML
- Verify argument placeholder syntax
- Test with `/help` command

## Support

For issues, feature requests, or contributions:
- Create an issue in the marketplace repository
- Check existing documentation and examples
- Review validation error messages carefully

## License

MIT License - see LICENSE file for details.

## Version History

- **v1.0.0**: Initial release with Skill Creator and Command Creator
  - Comprehensive Skill development toolkit
  - Advanced slash command creation features
  - Built-in validation and best practices
  - Template libraries and examples