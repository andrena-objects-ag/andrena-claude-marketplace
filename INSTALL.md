# Installation & Usage Guide

> Complete guide to installing and using plugins from the Claude Marketplace

## 🚀 Quick Start

### 1. Add the Marketplace

```bash
/plugin marketplace add andrena-objects-ag/andrena-claude-marketplace
```

### 2. Browse Available Plugins

```bash
/plugin list
```

### 3. Install Your Desired Plugin

```bash
/plugin install plugin-name@andrena-marketplace
```

## 📦 Available Plugins

### 🔍 Gemini Web Search Agent
**Best for**: Research, finding current information, documentation lookup

```bash
/plugin install gemini-web-search-agent@andrena-marketplace
```

**Features**:
- Specialized web search using Gemini CLI
- Current information retrieval
- Documentation and research support

**Usage**: Simply ask for web searches or current information
```
Search for the latest React best practices
Find current documentation on Claude Code
Research recent AI developments
```

### 🛠️ Skill & Command Creator
**Best for**: Creating custom Skills and slash commands, extending Claude's capabilities

```bash
/plugin install skill-command-creator@andrena-marketplace
```

**Features**:
- **Skill Creator**: Build Agent Skills with proper structure and validation
- **Command Creator**: Create custom slash commands with arguments and advanced features

**Usage**: The Skills activate automatically when you mention creating skills or commands
```
I need to create a Skill for analyzing Excel data
Create a slash command for my git workflow
I want to organize my expertise into reusable skills
```

### 📊 SlideGen
**Best for**: Creating professional presentations, educational content, training materials

```bash
/plugin install slidegen@andrena-marketplace
```

**Features**:
- Multiple specialized AI agents
- Support for Marp and Slidev formats
- Template customization and branding
- Research-backed content generation

**Usage**: Use the included commands and skills
```
/new-presentation "My Presentation Title" marp
/setup-agents
Create a professional presentation about AI trends
```

## 🎯 Recommended Installation Order

### For New Users
1. **Skill & Command Creator** - Learn how Claude Code extensions work
2. **Gemini Web Search Agent** - Add research capabilities
3. **SlideGen** - Add presentation creation (if needed)

### For Researchers
1. **Gemini Web Search Agent** - Essential research tool
2. **Skill & Command Creator** - Create research-specific skills
3. **SlideGen** - Create research presentations

### For Content Creators
1. **SlideGen** - Primary presentation tool
2. **Gemini Web Search Agent** - Research for content
3. **Skill & Command Creator** - Create content-specific skills

### For Power Users
Install all three plugins for a comprehensive toolkit.

## 🔧 Detailed Setup

### Prerequisites

- Claude Code installed and running
- Internet connection for marketplace access
- For Gemini Web Search Agent: Gemini CLI configured
- For SlideGen: Marp CLI or Slidev (for output generation)

### Step-by-Step Installation

1. **Open Claude Code**
2. **Add Marketplace**:
   ```bash
   /plugin marketplace add andrena-objects-ag/andrena-claude-marketplace
   ```
3. **Verify Installation**:
   ```bash
   /plugin marketplace list
   ```
4. **Browse Plugins**:
   ```bash
   /plugin list
   ```
5. **Install Plugin**:
   ```bash
   /plugin install plugin-name@andrena-marketplace
   ```
6. **Verify Plugin**:
   ```bash
   /help  # See new commands and skills
   ```

## 💡 Usage Tips

### After Installation

#### Gemini Web Search Agent
- Automatically available for web search tasks
- No additional setup required if Gemini CLI is configured
- Use natural language for search requests

#### Skill & Command Creator
- Skills activate automatically based on context
- Mention "create skill" or "create command" to activate
- Follow the guided creation process

#### SlideGen
- Use `/new-presentation` to start projects
- Use `/setup-agents` to initialize specialized agents
- Agents will guide you through the creation process

### Getting Help

Each plugin includes comprehensive documentation:

```bash
# Check available commands and skills
/help

# Get plugin-specific help
# (varies by plugin)
```

### Troubleshooting

#### Plugin Installation Issues
- Verify marketplace is added: `/plugin marketplace list`
- Check internet connection
- Restart Claude Code and try again

#### Plugin Not Working
- Check plugin is enabled: `/plugin list`
- Review plugin documentation
- Use `/help` to verify commands/skills are available

#### Gemini Web Search Issues
- Verify Gemini CLI installation: `gemini --version`
- Check API key configuration
- Test with simple search first

#### SlideGen Issues
- Verify Marp/Slidev installation
- Check template file permissions
- Start with simple presentation

## 📚 Advanced Usage

### Combining Plugins

The plugins work well together:

1. **Research → Create → Present**:
   - Use Gemini Web Search Agent for research
   - Use Skill & Command Creator to make custom research tools
   - Use SlideGen to create presentations of findings

2. **Custom Workflows**:
   - Create custom skills for your specific domain
   - Build commands for repetitive tasks
   - Use presentations to share knowledge

### Plugin Configuration

Most plugins work out-of-the-box, but some offer customization:

#### Gemini Web Search Agent
- Configure search preferences in Gemini CLI
- Custom search operators and filters

#### Skill & Command Creator
- Custom templates and examples
- Personal vs project skill organization

#### SlideGen
- Custom templates and branding
- Format-specific configurations
- Agent workflow customization

## 🔄 Updates and Maintenance

### Checking for Updates

```bash
/plugin marketplace update andrena-marketplace
```

### Updating Plugins

```bash
/plugin update plugin-name
```

### Removing Plugins

```bash
/plugin uninstall plugin-name
```

## 🤝 Getting Support

- **Issues**: [GitHub Issues](https://github.com/andrena-objects-ag/andrena-claude-marketplace/issues)
- **Documentation**: See individual plugin README files
- **Community**: Check repository discussions

## 📄 License Information

- Marketplace: MIT License
- Individual plugins may have specific licenses
- Check each plugin's documentation for details

---

**Last Updated**: 2025-10-19
**Claude Marketplace Version**: 1.0.1

> 💡 **Pro Tip**: Start with the Skill & Command Creator to understand how extensions work, then add other plugins based on your specific needs!