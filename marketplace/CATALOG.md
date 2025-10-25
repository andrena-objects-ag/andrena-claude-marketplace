# Claude Marketplace Catalog

This is the complete catalog of available extensions in the Claude Marketplace.

## 📊 Statistics

- **Total Extensions**: 4
- **Agents**: 2
- **Plugins**: 4
- **Skills**: 6 (included in plugins)
- **Styles**: 0

---

## 🤖 Agents

### [Gemini Web Search Agent](../plugins/gemini-web-search-agent/)

**Description**: Use this agent for web searches and retrieving current information using the Gemini CLI

**Version**: 1.0.0
**Author**: Claude Marketplace Team
**License**: MIT
**Category**: Search & Research

**Tags**: `search` `web` `gemini` `information` `current` `research`

**Features**:
- Specialized web search using Gemini CLI
- Current information retrieval
- Documentation search
- Latest developments tracking
- Explicit web search instruction patterns

**Installation**:
```bash
/plugin marketplace add p-wegner/claude-marketplace
/plugin install gemini-web-search-agent@claude-marketplace
```

**Usage**:
The agent is automatically available after installation and can be used for any web search tasks requiring current information.

### [Parallel Worker Agent](../plugins/parallel-subagent-plugin/)

**Description**: Parallel execution specialist for background tasks that can run independently of the main conversation thread

**Version**: 1.0.0
**Author**: Claude Marketplace Team
**License**: MIT
**Category**: Productivity & Automation

**Tags**: `parallel` `background` `async` `subagent` `automation` `productivity`

**Features**:
- Background task execution without blocking main conversation
- Independent research and analysis capabilities
- File processing and code analysis in parallel
- Non-blocking test execution and validation
- Comprehensive results and error handling

**Installation**:
```bash
/plugin marketplace add p-wegner/claude-marketplace
/plugin install parallel-subagent@claude-marketplace
```

**Usage**:
The agent is automatically invoked when Claude identifies parallelizable tasks, or can be used explicitly:
- "Use the parallel-worker agent to research X while I work on Y"
- "Analyze this codebase for security issues while I implement the feature"
- Background research, file processing, testing, and documentation generation

---

## 🔌 Plugins

### [Skill & Command Creator](../plugins/skill-command-creator/)

**Description**: A comprehensive toolkit for creating Agent Skills and slash commands with templates, validation, and best practices guidance

**Version**: 1.0.0
**Author**: Claude Marketplace Team
**License**: MIT
**Category**: Productivity & Development

**Tags**: `skills` `commands` `creation` `templates` `productivity` `development` `automation`

**Features**:
- **Skill Creator**: Create comprehensive Agent Skills with proper structure, validation, and best practices
- **Command Creator**: Create custom slash commands with proper syntax, arguments, and advanced features
- **Template Library**: Access proven templates for different Skill and command types
- **Validation Tools**: Built-in validation for syntax, structure, and functionality
- **Best Practices**: Implement Claude's recommended development patterns
- **Documentation**: Comprehensive examples and troubleshooting guides

**Installation**:
```bash
/plugin marketplace add p-wegner/claude-marketplace
/plugin install skill-command-creator@claude-marketplace
```

**Usage**:
The plugin provides two Skills that activate automatically:
- **Skill Creator**: When you mention creating skills, extending Claude's capabilities, or organizing expertise
- **Command Creator**: When you mention creating slash commands, automating prompts, or organizing commands

**Included Skills**:
- Skill Creator (for creating Agent Skills)
- Command Creator (for creating slash commands)

### [SlideGen](../plugins/slidegen/)

**Description**: Complete presentation creation system with specialized agents, customizable templates, and AI-powered workflow automation. Supports Marp and Slidev with research-backed content generation and professional branding.

**Version**: 1.0.0
**Author**: Claude Marketplace Team
**License**: MIT
**Category**: Productivity & Presentations

**Tags**: `presentations` `marp` `slidev` `slides` `ai` `automation` `templates`

**Features**:
- **Multiple Specialized Agents**: Slide Architect, Web Researcher, Content Reviewer, Browser Reviewer, Format Agents
- **Skills Integration**: Presentation Creator, Slide Enhancer, Template Customizer, Research Presenter
- **Format Support**: Full support for both Marp and Slidev presentation formats
- **Template Library**: Customizable templates for business, educational, and technical presentations
- **Research Integration**: Automated content research and integration
- **Professional Branding**: Template customization and branding options

**Installation**:
```bash
/plugin marketplace add p-wegner/claude-marketplace
/plugin install slidegen@claude-marketplace
```

**Usage**:
The plugin provides specialized agents and skills for:
- Creating new presentations with `/new-presentation` command
- Setting up presentation agents with `/setup-agents` command
- Research-based content creation
- Professional template customization
- Multi-format output generation

**Included Components**:
- 6 specialized agents for different aspects of presentation creation
- 4 skills for presentation workflows
- 2 slash commands for project management
- Template libraries for various presentation types

### [Parallel Subagent](../plugins/parallel-subagent-plugin/)

**Description**: Parallel execution specialist for background tasks that can run independently of the main conversation thread

**Version**: 1.0.0
**Author**: Claude Marketplace Team
**License**: MIT
**Category**: Productivity & Automation

**Tags**: `parallel` `background` `async` `subagent` `automation` `productivity`

**Features**:
- **Parallel Worker Agent**: Specialized subagent for non-blocking background tasks
- **Independent Execution**: Tasks run separately from main conversation context
- **Research Capabilities**: Background research and analysis without interruption
- **File Processing**: Parallel file analysis, processing, and transformation
- **Code Analysis**: Security scanning, linting, and static analysis in background
- **Testing Automation**: Test suite execution and validation without blocking

**Installation**:
```bash
/plugin marketplace add p-wegner/claude-marketplace
/plugin install parallel-subagent@claude-marketplace
```

**Usage**:
The plugin provides a `parallel-worker` agent that can be:
- **Automatically invoked** when Claude identifies parallelizable tasks
- **Explicitly requested** using "Use the parallel-worker agent to..."
- **Used for** background research, file processing, code analysis, testing, and documentation

**Key Use Cases**:
- "Analyze this codebase for security issues while I work on the main feature"
- "Research API design patterns while I implement the endpoints"
- "Process log files for errors while I continue with development"
- "Run test suite while I review code changes"

---

---

## 🎯 Skills

*Skills are included in the [Skill & Command Creator plugin](../plugins/skill-command-creator/)*

### Available Skills:

#### From Skill & Command Creator Plugin:
- **Skill Creator**: Create comprehensive Agent Skills with proper structure and validation
- **Command Creator**: Create custom slash commands with advanced features and best practices

#### From SlideGen Plugin:
- **Presentation Creator**: Create complete presentations with AI assistance
- **Slide Enhancer**: Improve and enhance existing slides
- **Template Customizer**: Customize presentation templates and branding
- **Research Presenter**: Integrate research into presentations

These Skills are automatically available when you install their respective plugins.

---

## 🎨 Styles

*No styles available yet. Check back soon!*

---

## 📝 Categories

- **Search & Research**: Tools for finding and retrieving information
- **Productivity & Automation**: Tools for enhancing workflow and efficiency
- **Development**: Tools for software development tasks
- **Presentations**: Tools for creating and managing presentations
- **Communication**: Tools for messaging and collaboration
- **Data Analysis**: Tools for working with data and analytics
- **Creation Tools**: Tools for creating Skills, commands, and extensions

---

## 🏷️ Tags

- `search` - Search and information retrieval tools
- `web` - Web-related functionality
- `gemini` - Google Gemini integration
- `research` - Research and analysis tools
- `current` - Current information and real-time data
- `parallel` - Parallel execution and background processing
- `background` - Background task execution
- `async` - Asynchronous operations
- `subagent` - Specialized AI agents
- `skills` - Agent Skill creation and management
- `commands` - Slash command creation and automation
- `creation` - Tools for creating Skills and commands
- `templates` - Template libraries and patterns
- `productivity` - Workflow and efficiency tools
- `development` - Software development utilities
- `automation` - Automation and scripting tools
- `presentations` - Presentation creation and slide generation
- `marp` - Marp presentation format support
- `slidev` - Slidev presentation format support
- `ai` - AI-powered content generation and assistance

---

## 🚀 Getting Started

1. **Add the marketplace**:
   ```bash
   /plugin marketplace add p-wegner/claude-marketplace
   ```

2. **Browse available extensions**:
   ```bash
   /plugin
   ```

3. **Install an extension**:
   ```bash
   /plugin install extension-name@claude-marketplace
   ```

---

## 📬 Submitting Extensions

Want to add your extension to this marketplace? Please:

1. Follow the contribution guidelines in the main README
2. Ensure your extension meets the quality standards
3. Submit a pull request with your extension

We're looking for high-quality, well-documented extensions that enhance the Claude Code experience!

---

**Last Updated**: 2025-10-25
**Marketplace Version**: 1.0.2