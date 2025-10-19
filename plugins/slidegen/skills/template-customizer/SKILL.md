---
name: Template Customizer
description: Customize and modify slide templates for specific branding, themes, or requirements. Transform standard templates into branded, tailored presentation systems. Use when you need customized presentation templates that reflect your organization's identity or specific presentation needs.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Template Customizer

Transform standard slidegen templates into powerful, branded presentation systems that perfectly match your organization's identity and specific requirements.

## Quick Start

**Basic customization**: "Customize the basic template with our brand colors and logo"

**Advanced customization**: "Create a custom template variant for our product launches with interactive elements"

## Customization Capabilities

### Brand Identity Integration
- **Color scheme adaptation**: Apply your brand colors throughout templates
- **Typography customization**: Implement your brand fonts and text styling
- **Logo integration**: Add your company logo to headers, footers, and title slides
- **Visual identity**: Ensure templates reflect your brand's visual personality

### Layout and Structure Modifications
- **Slide layout redesign**: Modify slide structures for specific content types
- **Component creation**: Build custom components for recurring content patterns
- **Grid system adaptation**: Adjust layout grids for your content needs
- **Responsive design**: Ensure templates work across different screen sizes

### Interactive Feature Enhancement
- **Element interaction**: Add clickable elements, hover states, and transitions
- **Navigation customization**: Create custom navigation patterns and menus
- **Animation integration**: Implement brand-appropriate animations and effects
- **Multimedia support**: Enhance templates for video, audio, and interactive content

### Specialized Template Variants
- **Role-based templates**: Create templates for specific roles (sales, technical, executive)
- **Event-specific designs**: Develop templates for conferences, webinars, training
- **Product launches**: Build templates tailored for product announcement presentations
- **Reporting formats**: Create templates for financial reports, status updates, analytics

## Customization Process

### 1. Brand Analysis
I'll analyze your brand requirements:
- **Color palette extraction**: Identify primary, secondary, and accent colors
- **Typography selection**: Determine font families and sizing hierarchies
- **Logo and asset integration**: Plan logo placement and brand asset usage
- **Brand personality assessment**: Understand your brand's visual character

### 2. Template Selection and Planning
Choose the appropriate base template:
- **Basic template**: For general business presentations and broad customization
- **Tech template**: For technical content with dark themes and code styling
- **Corporate template**: For executive presentations with formal styling

### 3. Customization Implementation
I'll systematically customize the chosen template:

#### Visual Styling
- **Color scheme application**: Integrate brand colors throughout the template
- **Typography implementation**: Apply brand fonts with proper hierarchy
- **Layout modifications**: Adjust slide layouts for your content needs
- **Visual component creation**: Build reusable styled components

#### Functional Enhancements
- **Interactive elements**: Add brand-appropriate interactive features
- **Navigation improvements**: Create intuitive slide navigation
- **Content blocks**: Design custom content blocks for specific information types
- **Export optimization**: Ensure templates export well to all formats

#### Brand Integration
- **Logo placement**: Strategically place logos in headers, footers, and title slides
- **Brand messaging**: Incorporate brand voice and messaging patterns
- **Visual consistency**: Ensure all elements align with brand guidelines
- **Asset integration**: Incorporate brand-specific imagery and icons

### 4. Testing and Validation
I'll validate the customized template:
- **Cross-platform testing**: Ensure template works across different systems
- **Export verification**: Test PDF, HTML, and PowerPoint export quality
- **Content compatibility**: Verify template handles various content types
- **Brand compliance**: Confirm alignment with brand guidelines

### 5. Documentation and Delivery
Receive comprehensive template package:
- **Customized template files**: Ready-to-use template in chosen format
- **Usage guidelines**: Instructions for using the customized template
- **Brand style guide**: Documentation of applied brand elements
- **Component library**: Reusable components for consistent styling

## Template Customization Options

### Color Scheme Customization
```css
/* Example: Brand Color Integration */
:root {
  --brand-primary: #2563eb;      /* Your primary brand color */
  --brand-secondary: #64748b;    /* Your secondary brand color */
  --brand-accent: #f59e0b;       /* Your accent color */
  --brand-dark: #1e293b;         /* Dark variant for text */
  --brand-light: #f8fafc;        /* Light variant for backgrounds */
}

/* Applied to slide elements */
h1 { color: var(--brand-primary); }
.highlight { background: var(--brand-accent); }
```

### Typography Customization
```css
/* Example: Brand Typography */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --font-primary: 'Inter', sans-serif;
  --font-secondary: 'Georgia', serif;
  --font-mono: 'Fira Code', monospace;
}

body { font-family: var(--font-primary); }
h1, h2, h3 { font-family: var(--font-primary); font-weight: 600; }
code { font-family: var(--font-mono); }
```

### Layout Customization
```markdown
<!-- Example: Custom Slide Layout -->
---
marp: true
class: custom-layout
---

<!-- Custom layout with brand elements -->
<div class="brand-header">
  ![Company Logo](assets/logo.png)
</div>

# Custom Title Layout

<div class="content-area">
  Your content here with custom styling
</div>

<div class="brand-footer">
  Company Name | Presentation Title
</div>
```

## Specialized Template Variants

### Sales Presentation Template
**Purpose**: Tailored for sales meetings and client presentations

**Features**:
- **Brand-consistent styling** throughout all slides
- **Value proposition emphasis** with custom call-to-action components
- **Testimonial integration** blocks for social proof
- **Competitive comparison** layouts
- **Pricing and proposal** custom sections

**Custom Elements**:
```markdown
<div class="value-proposition">
  <h3>🎯 Key Benefits</h3>
  <ul>
    <li><strong>ROI:</strong> 250% within first year</li>
    <li><strong>Time Savings:</strong> 40 hours per month</li>
    <li><strong>Risk Reduction:</strong> 80% fewer errors</li>
  </ul>
</div>
```

### Technical Documentation Template
**Purpose**: Designed for technical presentations and developer audiences

**Features**:
- **Enhanced code styling** with syntax highlighting
- **Architecture diagram** placeholders and styling
- **API documentation** layouts
- **Performance metrics** visualization
- **Demo integration** sections

**Custom Components**:
```markdown
<div class="code-demo">
  ```typescript
  // Your brand-styled code example
  const result = await api.process(data);
  ```
</div>

<div class="architecture-diagram">
  <!-- Styled architecture diagram placeholder -->
</div>
```

### Executive Dashboard Template
**Purpose**: Optimized for executive reporting and strategic presentations

**Features**:
- **KPI dashboard** layouts with metrics visualization
- **Executive summary** styling
- **Strategic roadmap** templates
- **Financial reporting** components
- **Decision support** layouts

**Custom Elements**:
```markdown
<div class="executive-summary">
  <h2>🎯 Key Takeaways</h2>
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-value">$2.5M</div>
      <div class="kpi-label">Revenue Impact</div>
    </div>
  </div>
</div>
```

### Training and Education Template
**Purpose**: Created for training sessions and educational content

**Features**:
- **Learning objective** sections
- **Interactive exercise** placeholders
- **Knowledge check** components
- **Module progression** indicators
- **Resource and reference** sections

**Custom Components**:
```markdown
<div class="learning-objectives">
  <h3>🎯 What You'll Learn</h3>
  <ul>
    <li>Understand core concepts and principles</li>
    <li>Apply skills in practical scenarios</li>
    <li>Implement best practices in your work</li>
  </ul>
</div>

<div class="knowledge-check">
  <h3>✅ Quick Check</h3>
  <!-- Interactive knowledge check placeholder -->
</div>
```

## Brand Implementation Examples

### Corporate Brand Integration
**Scenario**: Fortune 500 company needs enterprise-wide template standardization

**Customization Approach**:
1. **Brand audit**: Extract official colors, fonts, and logo usage guidelines
2. **Template adaptation**: Modify corporate template for different business units
3. **Component library**: Create reusable components for consistent messaging
4. **Rollout strategy**: Develop implementation guides for different teams

**Result**: 15 customized template variants maintaining brand consistency while serving diverse business needs

### Startup Brand Building
**Scenario**: Early-stage startup establishing visual identity

**Customization Approach**:
1. **Brand personality analysis**: Understand modern, innovative brand character
2. **Template selection**: Start with basic template, add startup-appropriate features
3. **Dynamic elements**: Add animated logos and modern transitions
4. **Growth planning**: Design templates that scale with company growth

**Result**: Flexible template system supporting pitch decks, investor updates, and team presentations

### Educational Institution Branding
**Scenario**: University creating templates for academic and administrative use

**Customization Approach**:
1. **Brand guidelines**: Incorporate university colors and typography
2. **Template variants**: Create templates for lectures, research presentations, administrative reports
3. **Accessibility compliance**: Ensure templates meet educational accessibility standards
4. **Multi-department support**: Design flexible system for different academic departments

**Result**: Comprehensive template ecosystem serving diverse academic needs while maintaining institutional identity

## Advanced Customization Features

### Dynamic Content Integration
- **Data-driven templates**: Templates that pull real-time data from APIs
- **Conditional formatting**: Templates that adapt based on content type
- **Multi-language support**: Templates designed for international presentations
- **Version control**: Template variations for different presentation versions

### Interactive Element Enhancement
- **Navigation customization**: Custom slide navigation and menu systems
- **Audience interaction**: Polls, quizzes, and interactive components
- **Multimedia integration**: Enhanced video and audio support
- **Progressive disclosure**: Interactive content reveals and storytelling

### Export and Distribution Optimization
- **Format-specific optimization**: Perfect styling for PDF, HTML, PowerPoint
- **Email integration**: Templates optimized for email presentations
- **Web embedding**: Templates designed for website integration
- **Print optimization**: High-quality output for printed materials

## Quality Assurance and Testing

### Cross-Platform Compatibility
- **Browser testing**: Chrome, Firefox, Safari, Edge compatibility
- **Operating system support**: Windows, Mac, Linux compatibility
- **Device responsiveness**: Desktop, tablet, mobile optimization
- **Export quality**: Consistent output across all export formats

### Brand Compliance Validation
- **Color accuracy**: Precise color reproduction across platforms
- **Typography consistency**: Font rendering and fallback management
- **Logo quality**: High-resolution logo display and scaling
- **Visual hierarchy**: Consistent information prioritization

### Performance Optimization
- **File size efficiency**: Optimized images and assets
- **Loading performance**: Fast template loading and rendering
- **Memory usage**: Efficient resource utilization
- **Animation smoothness**: Fluid transitions and interactions

## Getting Started

### For Best Customization Results
1. **Provide brand assets**: Logos, color codes, font specifications
2. **Specify use cases**: What types of presentations will use this template
3. **Identify constraints**: Technical limitations or requirements
4. **Set success criteria**: How you'll measure customization success

### Customization Request Examples
- "Create a sales template using our blue and gold brand colors with our logo in the header"
- "Customize the tech template for our developer conference with dark theme and our brand fonts"
- "Build an executive dashboard template with KPI visualization and our corporate styling"
- "Design a training template with interactive elements and our university branding"

The Template Customizer skill transforms standard slidegen templates into powerful, branded presentation systems that enhance your organization's communication effectiveness while maintaining perfect brand consistency.