# SlideGen - AI-Powered Presentation System

> Complete presentation creation system with specialized agents, customizable templates, and AI-powered workflow automation

## Overview

SlideGen is a comprehensive presentation creation system that uses specialized AI agents to help you create professional presentations. Supports both Marp and Slidev formats with research-backed content generation and customizable branding.

## Installation

```bash
/plugin marketplace add p-wegner/claude-marketplace
/plugin install slidegen@claude-marketplace
```

## Quick Start

1. **Create a new presentation**:
   ```
   /new-presentation "My Presentation Title" marp
   ```

2. **Setup the presentation agents**:
   ```
   /setup-agents
   ```

3. **Initialize a git repository for your workshop**:
   ```
   /init-workshop-repo "my-workshop-name" "Workshop description" private
   ```

4. **Start creating content** - the agents will guide you through:
   - Research and content gathering
   - Slide architecture and design
   - Content review and enhancement
   - Format-specific styling

## Components

### 🔍 Specialized Agents

- **Slide Architect**: Structures presentation flow and design
- **Web Researcher**: Gathers current information and data
- **Content Reviewer**: Enhances and polishes presentation content
- **Browser Reviewer**: Reviews web-based content and sources
- **Format Agents**: Specialized formatters for Marp and Slidev

### 🎯 Skills

- **Presentation Creator**: Core presentation creation workflow
- **Slide Enhancer**: Improves existing slides and content
- **Template Customizer**: Customizes templates and branding
- **Research Presenter**: Integrates research into presentations

### ⚡ Commands

- **/new-presentation**: Create a new presentation project
- **/setup-agents**: Initialize presentation agents for your project
- **/init-workshop-repo**: Initialize git repository and push to GitHub for workshop materials

## Features

- **Multi-Format Support**: Marp and Slidev compatibility
- **AI-Powered Research**: Automated content research and gathering
- **Professional Templates**: Customizable templates and branding
- **Collaborative Workflow**: Multiple specialized agents working together
- **Content Enhancement**: AI-powered content improvement and review
- **Research Integration**: Seamlessly integrate web research into presentations

## Use Cases

- **Business Presentations**: Professional slides for meetings and pitches
- **Educational Content**: Teaching materials and educational presentations
- **Technical Documentation**: Software documentation and tutorials
- **Research Presentations**: Academic and research-focused presentations
- **Training Materials**: Employee training and onboarding presentations

## Requirements

- Claude Code with plugin support
- Marp CLI or Slidev (for output generation)
- Internet access (for research features)

## Template Support

SlideGen includes customizable templates for:
- Business presentations
- Educational content
- Technical documentation
- Research presentations
- Training materials

## License

MIT License - see marketplace license for details.

## Version

**Version**: 1.0.2
**Last Updated**: 2025-11-10

## Getting Help

For detailed documentation on each component, see the individual agent and skill documentation files within the plugin directory.