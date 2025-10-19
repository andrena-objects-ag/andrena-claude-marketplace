# Presentation Creator Workflow Guide

This guide explains the internal workflow that the Presentation Creator skill uses to coordinate slidegen's specialized agents.

## Workflow Overview

The Presentation Creator skill orchestrates a multi-agent process that transforms your presentation requirements into a polished slide deck. Here's how it works:

## Phase 1: Requirements Analysis

### Input Processing
When you make a request, I analyze:
- **Topic**: Core subject matter
- **Audience**: Target demographic and expertise level
- **Template Type**: basic, tech, or corporate (inferred or specified)
- **Length**: Slide count requirements
- **Special Features**: Web research, interactive elements, specific formats
- **Output Format**: Marp or Slidev preference

### Decision Matrix
```
Audience + Topic → Template Selection
- General + Business → Basic Template
- Technical + Developers → Tech Template
- Executive + Business Metrics → Corporate Template
```

### Feature Planning
- **Web Research**: Current data needed? → Enable web-researcher
- **Interactive Elements**: Engagement required? → Add interactive components
- **Code Examples**: Technical content? → Use syntax highlighting
- **Business Metrics**: Executive audience? → Include KPI displays

## Phase 2: Agent Coordination

### 2.1 Slide Architect (Structure Planning)
**Trigger**: Always activated first

**Process**:
1. Analyzes topic complexity and audience needs
2. Designs presentation narrative flow
3. Creates detailed slide-by-slide outline
4. Determines content types for each slide
5. Plans visual elements and media needs

**Output**: Comprehensive presentation structure with content specifications

### 2.2 Web Researcher (Information Gathering)
**Trigger**: Enabled by "web research" parameter or when current data is beneficial

**Process**:
1. Develops targeted search strategy based on topic
2. Gathers authoritative sources and current data
3. Evaluates source credibility and relevance
4. Synthesizes findings for slide integration
5. Prepares citations and source documentation

**Output**: Research findings organized by presentation sections

### 2.3 Content Generation (Template Application)
**Trigger**: After structure and research phases

**Process**:
1. **For Marp presentations**:
   - Uses marp-formatter agent
   - Applies template-specific styling
   - Ensures proper Marp syntax
   - Optimizes for PDF/HTML/PowerPoint export

2. **For Slidev presentations**:
   - Uses slidev-formatter agent
   - Applies Vue.js-based formatting
   - Includes interactive components
   - Optimizes for SPA/PDF export

**Output**: Formatted presentation in chosen format

### 2.4 Content Reviewer (Quality Assurance)
**Trigger**: Final phase before delivery

**Process**:
1. Reviews content clarity and consistency
2. Checks template compliance and styling
3. Validates logical flow and transitions
4. Ensures audience appropriateness
5. Provides improvement recommendations

**Output**: Refined, publication-ready presentation

## Phase 3: Output Generation

### File Creation
```
output/
├── [presentation-name].md          # Main presentation file
├── [presentation-name].html        # HTML export (Marp)
├── [presentation-name].pdf         # PDF export
└── assets/                         # Supporting files
    ├── images/                     # Generated or sourced images
    └── research/                   # Research sources (if applicable)
```

### Quality Checks
- **Syntax validation**: Proper Marp/Slidev formatting
- **Template consistency**: Uniform styling throughout
- **Content completeness**: All outlined sections included
- **Export readiness**: Files optimized for target formats

## Agent Communication Flow

### Sequential Processing
```
User Request → Requirements Analysis → slide-architect → [web-researcher] → formatter → content-reviewer → Final Output
```

### Information Flow
1. **slide-architect** receives: topic, audience, template preferences
2. **web-researcher** receives: research topics from slide-architect outline
3. **formatter** receives: structure + research + template specifications
4. **content-reviewer** receives: formatted presentation + original requirements

### Feedback Loops
- **Content Review → Formatting Adjustments**: If reviewer identifies formatting issues
- **Research Integration → Structure Refinement**: If research reveals better content organization
- **Template Validation → Agent Retraining**: For consistent template application

## Template-Specific Workflows

### Basic Template Workflow
1. **Structure**: Standard presentation flow (intro → problem → solution → benefits → conclusion)
2. **Styling**: Clean, professional design with broad appeal
3. **Content**: Accessible language, general examples
4. **Features**: Speaker notes, basic transitions, print optimization

### Tech Talk Template Workflow
1. **Structure**: Technical deep-dive flow (concept → implementation → examples → demo → Q&A)
2. **Styling**: Dark theme, code highlighting, technical typography
3. **Content**: Technical depth, code examples, performance metrics
4. **Features**: Syntax highlighting, demo sections, technical references

### Corporate Template Workflow
1. **Structure**: Business presentation flow (context → analysis → recommendation → ROI → next steps)
2. **Styling**: Executive design, business color schemes, corporate typography
3. **Content**: Business metrics, financial data, strategic frameworks
4. **Features**: Metrics cards, executive summaries, business impact focus

## Error Handling and Recovery

### Common Issues and Solutions

**Template Mismatch**:
- Detection: Content style doesn't match selected template
- Solution: Re-run with appropriate template or adjust content styling

**Research Integration Problems**:
- Detection: Research findings don't align with presentation structure
- Solution: Refine research queries or adjust structure to accommodate findings

**Format Conversion Issues**:
- Detection: Markdown syntax errors or export failures
- Solution: Validate syntax and retry export with error correction

**Content Quality Concerns**:
- Detection: Reviewer identifies clarity or consistency issues
- Solution: Iterative refinement based on reviewer feedback

### Quality Assurance Checkpoints
1. **Pre-generation**: Template selection and requirements validation
2. **Mid-generation**: Agent coordination and data flow verification
3. **Post-generation**: Output formatting and export testing
4. **Final review**: Content quality and user requirement fulfillment

## Performance Optimization

### Agent Efficiency
- **Parallel Processing**: Research and structure planning when possible
- **Caching**: Template styles and common content patterns
- **Progressive Loading**: Large presentations generated in sections

### Resource Management
- **Memory Optimization**: Efficient handling of large research datasets
- **File Organization**: Automatic cleanup of temporary files
- **Export Optimization**: Efficient rendering of final presentations

## Extensibility and Customization

### Template Expansion
- **New Templates**: Can be added to the system with agent training
- **Custom Styles**: Brand-specific modifications maintained
- **Format Support**: Additional export formats can be integrated

### Agent Enhancement
- **Specialized Agents**: New agents can be added for specific content types
- **Skill Integration**: Additional skills can coordinate with presentation workflow
- **Tool Access**: Agents can be granted additional tool permissions as needed

This workflow ensures consistent, high-quality presentation creation while maintaining flexibility for different requirements and use cases.