# Skill & Command Creator Examples

This document provides comprehensive examples of using the Skill & Command Creator plugin to build various types of Skills and commands.

## Skill Creation Examples

### Example 1: PDF Processing Skill

**User Request**: "I need a Skill for extracting text from PDF files, filling forms, and merging documents"

**Generated Skill Structure**:
```
pdf-processor/
├── SKILL.md
├── reference.md
├── examples.md
└── scripts/
    ├── extract_text.py
    ├── fill_form.py
    └── merge_pdfs.py
```

**SKILL.md Content**:
```yaml
---
name: PDF Processor
description: Extract text, fill forms, and merge PDF documents. Use when working with PDF files, form filling, or document manipulation.
allowed-tools: Read, Write, Edit, Bash
---

# PDF Processor

Comprehensive PDF processing toolkit for text extraction, form filling, and document manipulation.

## When This Skill Activates
- Working with PDF files or documents
- Need to extract text or data from PDFs
- Form filling and document automation
- PDF merging or manipulation tasks

## Instructions

### Text Extraction
1. Use appropriate PDF processing tools
2. Extract text content while preserving structure
3. Handle multi-page documents
4. Process tables and formatted content

### Form Filling
1. Identify form fields in PDF documents
2. Fill fields with provided data
3. Validate form completion
4. Save filled documents

### Document Merging
1. Combine multiple PDF files
2. Maintain page order and formatting
3. Handle different page sizes
4. Optimize file size

## Requirements
- PDF processing libraries (pypdf, pdfplumber)
- File access permissions
- Sufficient memory for large documents

For detailed API usage, see [reference.md](reference.md).
For practical examples, see [examples.md](examples.md).
```

### Example 2: Code Review Skill

**User Request**: "Create a Skill for reviewing Python code for security vulnerabilities and performance issues"

**Generated Skill Structure**:
```
python-security-reviewer/
├── SKILL.md
├── SECURITY_CHECKLIST.md
├── PERFORMANCE_PATTERNS.md
└── scripts/
    ├── security_scan.py
    └── performance_check.py
```

**SKILL.md Key Sections**:
```yaml
---
name: Python Security Reviewer
description: Review Python code for security vulnerabilities, performance issues, and best practices. Use when analyzing Python code, reviewing pull requests, or conducting security audits.
allowed-tools: Read, Grep, Glob
---

# Python Security Reviewer

Specialized security and performance analysis for Python codebases.

## Review Framework

### Security Analysis
- Input validation and sanitization
- SQL injection and XSS prevention
- Authentication and authorization
- Cryptographic implementation
- Dependency vulnerability checking

### Performance Analysis
- Algorithm complexity assessment
- Memory usage optimization
- Database query efficiency
- Async/await usage patterns
- Resource management

## Process
1. Scan codebase with security scripts
2. Identify potential vulnerabilities
3. Analyze performance bottlenecks
4. Generate remediation recommendations
5. Provide best practice guidance
```

### Example 3: Data Analysis Skill

**User Request**: "I want a Skill for analyzing sales data from CSV files and creating reports"

**Generated Skill Features**:
- CSV data import and validation
- Statistical analysis functions
- Chart generation templates
- Report formatting
- Data cleaning utilities

## Command Creation Examples

### Example 1: Git Workflow Command

**User Request**: "Create a command to automate my git workflow with branch creation and commit"

**Generated Command** (`~/.claude/commands/git-workflow.md`):
```markdown
---
description: Complete git workflow from branch creation to commit
argument-hint: [branch-name] [commit-message]
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git checkout:*)
---

# Git Workflow

Branch: $1
Commit Message: $2

## Current Status
!`git status`
!`git branch --show-current`

## Workflow Steps

### 1. Create/Checkout Branch
```bash
git checkout -b $1
```

### 2. Stage Changes
```bash
git add .
```

### 3. Create Commit
```bash
git commit -m "$2"
```

### 4. Verification
!`git log --oneline -3`
!`git status`

## Result
Branch `$1` created and ready for push with commit message: "$2"
```

### Example 2: Code Testing Command

**User Request**: "I need a command to run tests and generate coverage reports"

**Generated Command** (`.claude/commands/test-coverage.md`):
```markdown
---
description: Run tests and generate coverage reports
argument-hint: [test-suite] [output-format]
allowed-tools: Bash(python*), Bash(npm*), Bash(coverage*), Read
---

# Test Coverage Analysis

Test Suite: $1
Output Format: $2

## Environment Check
!`python --version`
!`npm --version`

## Test Execution

### Run Tests
```bash
# Python tests
python -m pytest $1 --cov=. --cov-report=$2

# Node.js tests
npm test -- --coverage --coverageReporters=$2
```

### Coverage Report
!`coverage report`  # Python
!`cat coverage/lcov.info/index.html`  # Node.js

## Analysis
- Test execution results
- Coverage percentage analysis
- Uncovered code identification
- Recommendations for improvement
```

### Example 3: Documentation Generation Command

**User Request**: "Create a command to generate API documentation from source code"

**Generated Command**:
```markdown
---
description: Generate API documentation from source code
argument-hint: [source-path] [output-format]
allowed-tools: Read, Glob, Write, Bash(sphinx*), Bash(jsdoc*)
---

# API Documentation Generator

Source Path: $1
Output Format: $2

## Source Analysis
!`find $1 -name "*.py" -o -name "*.js" -o -name "*.ts" | head -10`

## Documentation Generation

### Python (Sphinx)
```bash
sphinx-apidoc -o docs/ $1
sphinx-build -b $2 docs/ docs/_build/
```

### JavaScript (JSDoc)
```bash
jsdoc $1/**/*.js -d docs/ -t $2
```

## Output
- Generated documentation files
- API reference completeness
- Usage examples inclusion
- Formatting validation
```

### Example 4: Database Migration Command

**User Request**: "I need a command to handle database migrations safely"

**Generated Command**:
```markdown
---
description: Safe database migration with backup and rollback
argument-hint: [migration-file] [environment]
allowed-tools: Bash(php*), Bash(node*), Bash(mysql*), Bash(psql*)
---

# Database Migration

Migration: $1
Environment: $2

## Pre-Migration Checks
!`php artisan migrate:status`  # Laravel
!`npm run migrate:status`      # Node.js

## Backup Creation
```bash
# Create backup before migration
mysqldump -u user -p database_$2 > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Migration Execution
```bash
php artisan migrate --path=$1 --force
# or
npm run migrate -- $1
```

## Post-Migration Verification
!`php artisan migrate:status`
!`php artisan db:show`

## Rollback Plan
If migration fails:
1. Stop application
2. Restore from backup
3. Verify data integrity
4. Report issues
```

## Advanced Examples

### Multi-File Skill with Templates

**User Request**: "Create a comprehensive email template management Skill"

**Generated Structure**:
```
email-template-manager/
├── SKILL.md
├── templates/
│   ├── welcome.html
│   ├── newsletter.html
│   └── notification.html
├── scripts/
│   ├── validate_template.py
│   └── send_email.py
└── examples/
    └── usage_examples.md
```

### Interactive Command with User Input

**User Request**: "Create an interactive command for project setup"

**Generated Command**:
```markdown
---
description: Interactive project setup wizard
argument-hint: [project-type] [project-name]
allowed-tools: Bash(mkdir*), Bash(npm*), Bash(git*), Write, Edit
---

# Project Setup Wizard

Project Type: $1
Project Name: $2

## Setup Confirmation
Creating $1 project named: $2

Continue? (Check git status for current directory)

!`pwd`
!`git status`

## Initialization Steps

### 1. Create Project Structure
```bash
mkdir -p $2/{src,tests,docs,config}
```

### 2. Initialize Package Manager
```bash
cd $2
npm init -y  # or appropriate package manager
```

### 3. Setup Git Repository
```bash
git init
echo "node_modules/" > .gitignore
echo "dist/" >> .gitignore
```

### 4. Install Dependencies
[Project-specific dependency installation]

### 5. Create Initial Files
[Generate boilerplate files based on project type]

## Next Steps
1. Review generated project structure
2. Customize configuration files
3. Add initial code
4. Create first commit
```

## Tips for Effective Usage

### For Skill Creation
1. **Be Specific**: Clearly describe what the Skill should do and when it should activate
2. **Consider Complexity**: Determine if you need supporting files, scripts, or templates
3. **Think About Users**: Who will use this Skill and what are their typical workflows?

### For Command Creation
1. **Define Arguments**: What information does the command need from users?
2. **Consider Integration**: Will the command need bash commands or file references?
3. **Plan Organization**: Should commands be grouped in subdirectories?

### Testing and Validation
1. **Start Simple**: Create basic versions first, then add complexity
2. **Test Thoroughly**: Try different argument combinations and edge cases
3. **Get Feedback**: Have others test your Skills and commands

These examples demonstrate the versatility and power of the Skill & Command Creator plugin for automating and streamlining your Claude Code workflows.