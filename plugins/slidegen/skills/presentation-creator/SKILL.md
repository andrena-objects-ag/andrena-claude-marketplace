---
name: Presentation Creator
description: Create complete presentations from topic to finished slides using slidegen's specialized agents. Supports both Marp and Slidev with template selection, web research, and interactive elements. Use when you need to create presentations, slides, or visual content.
allowed-tools: Read, Write, Edit, Glob, Grep, WebSearch, WebFetch
---

# Presentation Creator

Create professional presentations from scratch using slidegen's complete workflow system. This skill coordinates specialized agents to transform your ideas into polished slide decks.

## Quick Start

**Basic usage**: "Create a presentation about [topic]"

**Advanced usage**: "Create a tech presentation about [topic] for [audience] with [slidecount] slides, including web research and interactive elements"

## Supported Presentation Types

### Template Options
- **Basic**: Clean, professional presentations for general purposes
- **Tech**: Technical presentations with code highlighting and dark themes
- **Corporate**: Executive presentations with business metrics and formal styling

### Output Formats
- **Marp**: Markdown presentations with PDF, HTML, PowerPoint export
- **Slidev**: Vue-based presentations with interactive components

## Workflow Process

### 1. Requirements Analysis
I'll analyze your request to determine:
- Topic and scope
- Target audience
- Appropriate template type
- Presentation length
- Special features needed

### 2. Content Strategy
Based on your requirements, I'll:
- **Use slide-architect** to design presentation structure and flow
- **Select appropriate template** from basic/tech/corporate options
- **Plan content sections** and slide sequencing
- **Determine interactive elements** if requested

### 3. Research Enhancement (Optional)
If web research is enabled:
- **Use web-researcher** to gather current, authoritative information
- **Find supporting statistics** and expert insights
- **Collect relevant examples** and case studies
- **Provide source citations** for credibility

### 4. Content Creation
I'll coordinate with specialized agents:
- **slide-architect**: Structure and content organization
- **[format]-formatter**: Template-specific formatting (Marp or Slidev)
- **content-reviewer**: Quality assurance and optimization

### 5. Output Generation
Final presentation delivered in:
- **Primary format**: Ready-to-use slide file
- **Export options**: PDF, HTML, PowerPoint (Marp) or SPA, PDF (Slidev)
- **Speaker notes**: Preparation guidance included
- **Source documentation**: Research citations if applicable

## Usage Examples

### Simple Presentations
```
Create a presentation about team productivity
```
*Creates a basic template presentation with standard structure*

### Technical Presentations
```
Create a tech presentation about API security for developers with 12 slides
```
*Uses tech-talk template with code examples and dark theme*

### Business Presentations
```
Create a corporate presentation about Q3 results for executives with web research
```
*Uses corporate template with business metrics and current market data*

### Interactive Presentations
```
Create a presentation about machine learning with interactive elements for students
```
*Adds polls, quizzes, and interactive components to appropriate template*

### Research-Backed Presentations
```
Create a tech presentation about cloud computing trends with web research for IT managers
```
*Includes current industry data, expert insights, and authoritative sources*

## Template Features

### Basic Template
- Clean, professional design
- Flexible structure for any topic
- Speaker notes templates
- Print-optimized styling
- Cross-platform compatibility

### Tech Talk Template
- Dark theme with syntax highlighting
- Code block styling
- Performance metrics sections
- Demo integration areas
- Technical audience focus

### Corporate Template
- Executive-level styling
- Business metrics cards
- ROI and financial focus
- Professional color schemes
- Strategic frameworks

## Special Features

### Web Research Integration
When research is enabled, presentations include:
- **Current statistics** from authoritative sources
- **Industry trends** and market data
- **Expert quotes** and insights
- **Case studies** and real examples
- **Proper citations** for credibility

### Interactive Elements
Available for enhanced engagement:
- **Poll questions** for audience interaction
- **Quiz elements** for knowledge checking
- **Animation prompts** for dynamic content
- **Discussion prompts** for engagement
- **Call-to-action slides** for next steps

### Multi-Format Support
Choose your preferred presentation system:
- **Marp**: Traditional markdown presentations
- **Slidev**: Modern Vue-based presentations
- **Automatic selection**: Based on content type and audience

## Best Practices

### Content Guidelines
- **One main idea per slide** for clarity
- **Visual hierarchy** with consistent styling
- **Audience-appropriate** complexity and terminology
- **Compelling examples** and stories
- **Clear call-to-actions** and next steps

### Design Principles
- **Consistent branding** throughout presentation
- **Professional typography** and spacing
- **High contrast** for readability
- **Balanced text-to-visual** ratio
- **Mobile-responsive** design elements

### Delivery Optimization
- **Speaker notes** for preparation guidance
- **Timing estimates** for each section
- **Question prompts** for audience engagement
- **Backup slides** for detailed information
- **Export optimization** for different formats

## File Organization

Generated presentations follow this structure:
```
output/
├── your-presentation.md      # Main presentation file
├── your-presentation.html    # HTML export (Marp)
├── your-presentation.pdf     # PDF export
└── assets/                   # Images and media
    └── generated/            # Auto-generated assets
```

## Integration with slidegen Agents

This skill coordinates seamlessly with slidegen's specialized agents:

- **slide-architect**: Presentation structure and narrative design
- **web-researcher**: Current information and authoritative sources
- **marp-formatter/slidev-formatter**: Format-specific optimization
- **content-reviewer**: Quality assurance and enhancement
- **browser-reviewer**: Final browser-based review process

## Getting Started

1. **State your topic**: "Create a presentation about [subject]"
2. **Specify audience** (optional): "for [audience type]"
3. **Choose features** (optional): "with web research", "with interactive elements"
4. **Set parameters** (optional): slide count, template type, output format
5. **Review and refine**: I'll present the draft for your feedback

The skill handles all the complex coordination between agents, template selection, and formatting automatically - you just provide the topic and requirements.

## Advanced Options

### Custom Workflows
For specialized needs, I can:
- **Modify agent sequences** for different presentation types
- **Adjust research depth** based on audience sophistication
- **Customize styling** for brand compliance
- **Integrate external data** sources and APIs
- **Generate multiple versions** for different audiences

### Template Customization
While the skill uses standard templates, I can:
- **Adjust color schemes** for brand alignment
- **Modify layouts** for specific content needs
- **Add custom components** for unique requirements
- **Optimize for delivery format** (in-person vs virtual)
- **Create template variations** for different contexts

This skill transforms the complex slidegen workflow into a simple, intuitive presentation creation experience that delivers professional results every time.