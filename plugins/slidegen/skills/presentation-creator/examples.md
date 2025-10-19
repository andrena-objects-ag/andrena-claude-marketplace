# Presentation Creator Examples

This file provides detailed examples of using the Presentation Creator skill for various scenarios.

## Example Requests and Expected Outputs

### 1. Basic Business Presentation

**Request**: "Create a presentation about remote work productivity"

**Expected Output**:
- Template: Basic presentation
- Length: 8-10 slides
- Content: Introduction, challenges, solutions, benefits, conclusion
- Format: Marp markdown with speaker notes

**Sample Workflow**:
1. Analyze topic and select basic template
2. Use slide-architect to plan structure
3. Generate content on remote work trends
4. Format with marp-formatter
5. Review with content-reviewer
6. Deliver presentation.md file

### 2. Technical Deep Dive

**Request**: "Create a tech presentation about microservices architecture for developers with 15 slides"

**Expected Output**:
- Template: Tech talk
- Length: 15 slides
- Content: Technical concepts, code examples, architecture diagrams, best practices
- Features: Code highlighting, dark theme, performance metrics
- Format: Marp with technical styling

**Sample Workflow**:
1. Select tech-talk template for developer audience
2. Use slide-architect to structure technical content
3. Include code examples and architectural patterns
4. Format with marp-formatter for tech presentation
5. Review technical accuracy with content-reviewer
6. Optimize for technical audience comprehension

### 3. Data-Driven Corporate Presentation

**Request**: "Create a corporate presentation about Q3 financial performance for executives with web research"

**Expected Output**:
- Template: Corporate
- Length: 12 slides
- Content: Financial metrics, market analysis, strategic recommendations
- Features: Business metrics cards, professional styling, current market data
- Research: Recent financial reports and industry benchmarks

**Sample Workflow**:
1. Select corporate template for executive audience
2. Use web-researcher to gather current financial data
3. Use slide-architect to structure business narrative
4. Integrate research findings with presentation content
5. Format with corporate styling
6. Review for business impact and clarity

### 4. Interactive Educational Presentation

**Request**: "Create a presentation about machine learning basics with interactive elements for students"

**Expected Output**:
- Template: Basic presentation adapted for education
- Length: 10-12 slides
- Content: ML concepts, examples, interactive learning elements
- Features: Poll questions, quiz elements, discussion prompts
- Format: Marp with educational enhancements

**Sample Workflow**:
1. Select basic template adapted for education
2. Use slide-architect to plan learning progression
3. Design interactive elements for engagement
4. Format with educational styling
5. Review for learning effectiveness
6. Include facilitation notes in speaker notes

### 5. Research-Backed Industry Analysis

**Request**: "Create a tech presentation about AI trends 2024 with web research for IT managers"

**Expected Output**:
- Template: Tech talk
- Length: 15 slides
- Content: Current AI trends, market data, implementation strategies
- Research: Recent industry reports, expert insights, case studies
- Features: Authoritative sources, data visualizations, strategic recommendations

**Sample Workflow**:
1. Select tech-talk template for IT management audience
2. Use web-researcher to gather current AI trend data
3. Find expert opinions and industry reports
4. Use slide-architect to structure analysis framework
5. Integrate research with strategic insights
6. Format with technical professionalism
7. Include comprehensive source citations

## Advanced Usage Patterns

### Multi-Audience Presentations

**Request**: "Create a presentation about cloud migration for both technical teams and business stakeholders"

**Approach**:
- Create two versions: technical and business-focused
- Use appropriate templates for each audience
- Maintain consistent core messaging
- Adjust depth and terminology per audience

### Brand-Aligned Presentations

**Request**: "Create a corporate presentation about product launch using our brand colors and logos"

**Approach**:
- Start with corporate template
- Customize styling to match brand guidelines
- Incorporate brand assets and messaging
- Ensure consistent visual identity throughout

### Time-Constrained Creation

**Request**: "Create a quick 5-slide presentation about team updates for our weekly meeting"

**Approach**:
- Use streamlined workflow
- Focus on essential content only
- Optimize for quick delivery and comprehension
- Include discussion prompts for meeting engagement

## Output Examples

### Generated File Structure
```
output/
├── team-productivity-presentation.md    # Main presentation file
├── team-productivity-presentation.html  # HTML version (optional)
├── team-productivity-presentation.pdf   # PDF version (optional)
└── sources/                             # Research sources (if applicable)
    ├── industry-reports.md
    └── citations.md
```

### Sample Presentation Snippet
```markdown
---
marp: true
title: Remote Work Productivity Strategies
author: Your Name
date: 2024-07-31
theme: default
paginate: true
---

# Remote Work Productivity

## Strategies for Distributed Team Success

### Presented by: Your Name
### Date: July 2024

---

## Key Challenges

### Common Remote Work Obstacles

- **Communication Gaps** - Delayed information flow
- **Collaboration Barriers** - Reduced spontaneous interaction
- **Productivity Measurement** - Difficulty tracking output
- **Team Cohesion** - Maintaining culture remotely

<div class="emphasis">

**Solution**: Strategic use of collaboration tools and clear processes

</div>
```

## Troubleshooting Examples

### When Presentations Need Refinement

**Issue**: "The presentation feels too technical for our sales team"

**Solution**:
- Re-run with basic template instead of tech template
- Simplify technical terminology
- Add more business-focused examples
- Emphasize benefits over features

**Issue**: "We need more current market data"

**Solution**:
- Enable web research feature
- Specify recent timeframes for research
- Request specific industry benchmarks
- Include source citations for credibility

### Custom Request Handling

**Special Request**: "Create a presentation that works both as slides and as a document"

**Approach**:
- Use detailed speaker notes as document content
- Ensure visual elements work in both formats
- Include comprehensive appendix for reference
- Optimize export settings for both slide and document formats

## Best Practices for Users

### Effective Requests
1. **Be specific about audience**: helps select appropriate template
2. **Mention key requirements**: research, interactivity, specific topics
3. **Provide context**: business setting, technical level, time constraints
4. **Specify outcomes**: what should audience do/know after presentation

### Review Process
1. **Check template appropriateness** for your audience
2. **Verify content coverage** matches your requirements
3. **Test interactive elements** if included
4. **Review speaker notes** for preparation guidance
5. **Export to desired format** for final delivery

These examples demonstrate the flexibility and power of the Presentation Creator skill across various use cases and requirements.