# Template Customization CSS Reference

This guide provides comprehensive CSS reference for customizing slidegen templates with your brand identity and specific requirements.

## CSS Structure Overview

### Template Organization
```
slidegen/
├── templates/
│   ├── basic-presentation.md
│   ├── tech-talk.md
│   └── corporate.md
├── themes/
│   ├── basic-theme.css
│   ├── tech-theme.css
│   └── corporate-theme.css
└── assets/
    ├── fonts/
    ├── images/
    └── icons/
```

### CSS Custom Properties (Variables)
Modern templates use CSS custom properties for easy customization:

```css
:root {
  /* Brand Colors */
  --brand-primary: #2563eb;
  --brand-secondary: #64748b;
  --brand-accent: #f59e0b;
  --brand-success: #10b981;
  --brand-warning: #f59e0b;
  --brand-error: #ef4444;

  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-secondary: 'Georgia', serif;
  --font-mono: 'Fira Code', monospace;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

## Color Customization

### Primary Color Scheme
```css
:root {
  /* Define your brand colors */
  --brand-primary: #3b82f6;        /* Main brand color */
  --brand-primary-light: #60a5fa;  /* Lighter variant */
  --brand-primary-dark: #1d4ed8;   /* Darker variant */

  /* Secondary colors */
  --brand-secondary: #64748b;
  --brand-secondary-light: #94a3b8;
  --brand-secondary-dark: #475569;

  /* Accent colors */
  --brand-accent: #f59e0b;
  --brand-accent-light: #fbbf24;
  --brand-accent-dark: #d97706;
}

/* Apply colors throughout template */
section {
  --primary-color: var(--brand-primary);
  --accent-color: var(--brand-accent);
  --text-color: var(--brand-secondary-dark);
  --background-color: #ffffff;
}

h1, h2, h3 {
  color: var(--brand-primary);
}

.accent {
  color: var(--brand-accent);
  background-color: var(--brand-accent-light);
}
```

### Theme Variations

#### Light Theme
```css
.theme-light {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  --border-color: #e2e8f0;
}
```

#### Dark Theme (for Tech Template)
```css
.theme-dark {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --border-color: #475569;
}
```

#### Corporate Theme
```css
.theme-corporate {
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #374151;
  --text-tertiary: #6b7280;
  --border-color: #e5e7eb;

  /* Corporate accent colors */
  --color-blue: #2563eb;
  --color-green: #059669;
  --color-gold: #d97706;
  --color-red: #dc2626;
}
```

## Typography Customization

### Font Integration
```css
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&display=swap');

/* Define font families */
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Space Grotesk', sans-serif;
  --font-mono: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
  --font-body: var(--font-primary);
  --font-heading: var(--font-display);
}

/* Apply font families */
body {
  font-family: var(--font-body);
  font-size: 18px;
  line-height: 1.6;
  color: var(--text-primary);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 0.5em;
}

code, pre {
  font-family: var(--font-mono);
  font-size: 0.9em;
}
```

### Typography Scale
```css
/* Responsive typography scale */
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
}

/* Heading sizes */
h1 { font-size: var(--text-4xl); font-weight: 700; }
h2 { font-size: var(--text-3xl); font-weight: 600; }
h3 { font-size: var(--text-2xl); font-weight: 600; }
h4 { font-size: var(--text-xl); font-weight: 600; }
h5 { font-size: var(--text-lg); font-weight: 500; }
h6 { font-size: var(--text-base); font-weight: 500; }
```

## Layout Customization

### Grid System
```css
/* 12-column grid system */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.grid {
  display: grid;
  gap: var(--spacing-md);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-cols-12 { grid-template-columns: repeat(12, 1fr); }

/* Responsive grid */
@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}
```

### Flexbox Utilities
```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }

.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }

.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }

.gap-xs { gap: var(--spacing-xs); }
.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
.gap-lg { gap: var(--spacing-lg); }
.gap-xl { gap: var(--spacing-xl); }
```

## Component Customization

### Button Styles
```css
/* Base button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Button variants */
.btn-primary {
  background-color: var(--brand-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--brand-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: var(--brand-secondary);
  color: white;
}

.btn-outline {
  background-color: transparent;
  border: 2px solid var(--brand-primary);
  color: var(--brand-primary);
}

.btn-outline:hover {
  background-color: var(--brand-primary);
  color: white;
}

/* Button sizes */
.btn-sm { padding: var(--spacing-xs) var(--spacing-md); font-size: var(--text-sm); }
.btn-lg { padding: var(--spacing-md) var(--spacing-xl); font-size: var(--text-lg); }
```

### Card Components
```css
.card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.card-content {
  color: var(--text-secondary);
}

/* Card variants */
.card-elevated {
  box-shadow: var(--shadow-lg);
  border: none;
}

.card-featured {
  border: 2px solid var(--brand-accent);
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
}
```

### Metric Cards (for Corporate Template)
```css
.metric-card {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark));
  color: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-md);
}

.metric-value {
  font-size: var(--text-4xl);
  font-weight: 700;
  line-height: 1;
  margin-bottom: var(--spacing-sm);
}

.metric-label {
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
}

.metric-change {
  font-size: var(--text-sm);
  margin-top: var(--spacing-sm);
}

.metric-change.positive {
  color: #10b981;
}

.metric-change.negative {
  color: #ef4444;
}
```

### Alert/Notification Components
```css
.alert {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 4px solid;
  margin: var(--spacing-md) 0;
}

.alert-info {
  background-color: #eff6ff;
  border-left-color: var(--brand-primary);
  color: #1e40af;
}

.alert-success {
  background-color: #f0fdf4;
  border-left-color: var(--brand-success);
  color: #166534;
}

.alert-warning {
  background-color: #fffbeb;
  border-left-color: var(--brand-warning);
  color: #92400e;
}

.alert-error {
  background-color: #fef2f2;
  border-left-color: var(--brand-error);
  color: #991b1b;
}
```

## Brand Integration

### Logo Placement
```css
/* Header logo */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--spacing-lg);
}

.logo {
  height: 40px;
  width: auto;
  max-width: 200px;
}

.logo-header {
  grid-column: 1 / 2;
}

/* Footer logo */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-top: 1px solid var(--border-color);
  margin-top: var(--spacing-xl);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.logo-footer {
  height: 24px;
  opacity: 0.8;
}
```

### Brand Patterns and Textures
```css
/* Subtle brand pattern background */
.brand-pattern {
  background-color: var(--bg-primary);
  background-image:
    radial-gradient(circle at 20% 50%, var(--brand-primary) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, var(--brand-accent) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, var(--brand-secondary) 0%, transparent 50%);
  background-size: 100% 100%, 100% 100%, 100% 100%;
  background-position: 0% 0%, 0% 0%, 0% 0%;
  opacity: 0.03;
}

/* Brand gradient background */
.brand-gradient {
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%);
  color: white;
}

/* Brand accent border */
.brand-accent-border {
  border-left: 4px solid var(--brand-accent);
  padding-left: var(--spacing-md);
}
```

## Code and Technical Content

### Code Styling
```css
/* Inline code */
code {
  background-color: var(--bg-tertiary);
  color: var(--brand-primary);
  padding: 0.125rem 0.25rem;
  border-radius: var(--radius-sm);
  font-size: 0.875em;
  font-family: var(--font-mono);
}

/* Code blocks */
pre {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Syntax highlighting (simplified) */
.code-highlight .keyword { color: #d73a49; font-weight: 500; }
.code-highlight .string { color: #032f62; }
.code-highlight .comment { color: #6a737d; font-style: italic; }
.code-highlight .function { color: #6f42c1; }
.code-highlight .number { color: #005cc5; }
```

### Technical Diagrams
```css
/* Diagram container */
.diagram {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
  text-align: center;
}

.diagram-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

/* Flowchart styling */
.flowchart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.flowchart-node {
  background-color: var(--bg-primary);
  border: 2px solid var(--brand-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 500;
  color: var(--brand-primary);
}

.flowchart-arrow {
  color: var(--brand-secondary);
  font-size: var(--text-lg);
}
```

## Animation and Transitions

### Slide Transitions
```css
/* Smooth transitions for interactive elements */
.transition-all {
  transition: all 0.2s ease;
}

.transition-colors {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.transition-transform {
  transition: transform 0.2s ease;
}

/* Hover effects */
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}
```

### Progress Indicators
```css
/* Progress bar */
.progress {
  width: 100%;
  height: 8px;
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--brand-primary), var(--brand-accent));
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

/* Step indicators */
.steps {
  display: flex;
  justify-content: space-between;
  margin: var(--spacing-lg) 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.step-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.step.active .step-indicator {
  background-color: var(--brand-primary);
  border-color: var(--brand-primary);
  color: white;
}

.step.completed .step-indicator {
  background-color: var(--brand-success);
  border-color: var(--brand-success);
  color: white;
}
```

## Responsive Design

### Mobile Optimization
```css
/* Mobile-first responsive design */
@media (max-width: 768px) {
  section {
    padding: var(--spacing-md);
    font-size: var(--text-base);
  }

  h1 { font-size: var(--text-2xl); }
  h2 { font-size: var(--text-xl); }
  h3 { font-size: var(--text-lg); }

  .grid-cols-2 { grid-template-columns: 1fr; }
  .grid-cols-3 { grid-template-columns: 1fr; }
  .grid-cols-4 { grid-template-columns: 1fr; }

  .card {
    padding: var(--spacing-md);
  }

  .metric-card {
    padding: var(--spacing-md);
  }

  .metric-value {
    font-size: var(--text-2xl);
  }
}

/* Tablet optimization */
@media (min-width: 769px) and (max-width: 1024px) {
  .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
}
```

## Print Optimization

### Print Styles
```css
@media print {
  /* Ensure high contrast for printing */
  body {
    color: #000;
    background: #fff;
  }

  /* Hide navigation and interactive elements */
  .no-print {
    display: none !important;
  }

  /* Ensure page breaks don't split content */
  .page-break {
    page-break-before: always;
  }

  .avoid-page-break {
    page-break-inside: avoid;
  }

  /* Optimize colors for print */
  .card {
    border: 1px solid #000;
    background: #fff;
  }

  /* Ensure text readability */
  h1, h2, h3, h4, h5, h6 {
    color: #000;
    page-break-after: avoid;
  }
}
```

This CSS reference provides comprehensive styling options for customizing slidegen templates to match your brand identity and specific presentation requirements. Use these examples as a starting point for creating your own custom template variations.