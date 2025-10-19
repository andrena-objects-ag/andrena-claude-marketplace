# /setup-agents

Set up all MCP servers and tools required by the specialized presentation agents.

Install and configure all MCP servers and external tools needed by the specialized agents in this project based on $ARGUMENTS (if any specific configurations are provided).

1. **Playwright MCP** - For browser-reviewer agent visual testing
2. **Marp CLI** - For presentation export and rendering
3. **Node.js Dependencies** - For interactive elements and web functionality

## Required MCP Servers and Tools

### Browser Automation (browser-reviewer agent)
- **Playwright MCP**: Visual testing, screenshot capture, accessibility testing
- **Purpose**: Enables automated browser testing for layout validation

### Web Research (web-researcher agent)  
- **Web Search & Fetch**: Already available as built-in tools
- **Purpose**: Gather current information for presentation content

### Presentation Export (marp-formatter agent)
- **Marp CLI**: Convert markdown to HTML/PDF/PowerPoint
- **Purpose**: Export presentations in multiple formats

## Setup Process

### Step 1: Verify Prerequisites
```bash
# Check Node.js and npm versions (Node 16+ recommended)
node --version
npm --version

# Check current MCP servers
claude mcp list
```

### Step 2: Install Project Dependencies
```bash
# Install local Marp CLI and other dependencies
npm install

# Verify local Marp installation
npx marp --version
```

### Step 3: Install Global Tools (Optional)
```bash
# Install Marp CLI globally for convenience
npm install -g @marp-team/marp-cli

# Verify global installation
marp --version
```

### Step 4: Install Playwright MCP Server
```bash
# Option 1: ExecuteAutomation version (recommended - more features)
claude mcp add playwright -s user -- npx -y @executeautomation/playwright-mcp-server

# Option 2: Microsoft official version
# claude mcp add playwright-ms -s user -- npx @playwright/mcp@latest
```

### Step 5: Verify Complete Installation
```bash
# List all MCP servers
claude mcp list

# Test Marp CLI
marp --version

# Test Playwright MCP (ask Claude after setup)
# "Use playwright to open example.com and take a screenshot"
```

## Troubleshooting

### Common Issues

**Playwright MCP not working:**
```bash
# Reinstall with specific version
claude mcp remove playwright
claude mcp add playwright -s user -- npx -y @executeautomation/playwright-mcp-server@latest
```

**Marp CLI not found:**
```bash
# Install locally if global install fails
npm install @marp-team/marp-cli
npx marp --version
```

**Permission errors:**
```bash
# On Windows, run PowerShell as Administrator
# On macOS/Linux, may need sudo for global npm installs
sudo npm install -g @marp-team/marp-cli
```