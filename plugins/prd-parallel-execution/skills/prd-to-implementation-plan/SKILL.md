---
name: prd-to-implementation-plan
description: Convert Product Requirements Documents (PRDs) into contract-first, parallel implementation plans. Use when you have a PRD file and need to break down the work into optimized development streams that prioritize API contracts, environment setup, and parallel execution for maximum speed.
allowed-tools: Read, Write, Edit, Grep, Glob
---

# PRD to Implementation Plan (Contract-First Parallel)

## Overview
Transforms PRD documents into highly efficient implementation plans that use a contract-first approach to enable maximum parallel development. Reduces total development time by 40-60% through strategic task organization that prioritizes API contracts, environment setup, and independent parallel streams.

## Core Principles

### 1. Contract-First Development
- **API contracts before implementation**: OpenAPI 3.0 specs as single source of truth
- **Mock services**: Enable frontend/backend parallel development
- **Schema-driven development**: Data contracts for all interfaces
- **Contract testing**: Automated validation against specifications

### 2. Parallel Environment Setup
- **Docker Compose orchestration**: All supporting services ready from day 1
- **Infrastructure as code**: Database, auth, messaging, storage services
- **Development automation**: Scripts for setup, testing, deployment
- **Environment parity**: Local, staging, production environments consistent

### 3. Early E2E Testing
- **Requirements-based testing**: Tests derived directly from PRD requirements
- **API contract testing**: Validation against OpenAPI specifications
- **Parallel test development**: Test framework built alongside features
- **Continuous integration**: Automated testing from the beginning

## Instructions

### 1. Analyze the PRD for Contracts
- Read the PRD file (typically .md format)
- Identify all API endpoints and data flows required
- Extract authentication and authorization requirements
- Map data models and schema requirements
- Identify external service integrations and dependencies

### 2. Design Phase 1: Parallel Foundation (Day 1-2)
Organize into 3 parallel streams with zero dependencies:

**Stream A: API Contract & Mocking**
- OpenAPI 3.0 specification covering all PRD requirements
- API mocking service (Prism, MSW, custom)
- Authentication/authorization flow definitions
- Contract testing framework setup

**Stream B: Environment & Infrastructure**
- Docker Compose with all services (db, auth, messaging, cache)
- Database schema and migrations
- Development scripts and automation
- Monitoring and logging infrastructure

**Stream C: Project Scaffolding**
- Frontend and backend project structure
- CI/CD pipeline configuration
- Code quality and security tools
- Package management and dependencies

### 3. Design Phase 2: Parallel Implementation (Day 2-5)
Organize streams that depend on Phase 1 contracts:

**Stream D: Backend Implementation**
- API endpoints following OpenAPI spec exactly
- Authentication middleware
- Business logic implementation
- Database repositories and models

**Stream E: Frontend Implementation**
- UI components for all API endpoints
- Authentication UI and state management
- Integration with mock API service
- Form validation and error handling

**Stream F: Testing Framework**
- E2E test scenarios from PRD requirements
- API contract testing
- Performance and security testing
- Visual regression testing

### 4. Generate Implementation Plan
Use this structure:

```markdown
# Implementation Plan: [Project Name]

## Overview
[1-2 sentence summary]

## Phase 1: Contract & Environment Setup (Parallel - Day 1-2)

### Stream A: API Contract Design
**Dependencies:** None
**Tasks:**
- [ ] Create OpenAPI 3.0 specification (Priority: Critical)
- [ ] Set up API mocking service (Priority: High)
- [ ] Define authentication flows (Priority: Critical)

### Stream B: Development Environment
**Dependencies:** None
**Tasks:**
- [ ] Create docker-compose.yml with all services (Priority: Critical)
- [ ] Configure database schema (Priority: High)
- [ ] Set up auth service (Priority: High)

### Stream C: Project Scaffolding
**Dependencies:** None
**Tasks:**
- [ ] Initialize frontend and backend projects (Priority: High)
- [ ] Set up CI/CD pipeline (Priority: Medium)

## Phase 2: Parallel Implementation (Day 2-5)

### Stream D: Backend Implementation
**Dependencies:** API Contract, Environment Setup
**Tasks:**
- [ ] Implement REST APIs matching OpenAPI spec (Priority: Critical)
- [ ] Add authentication middleware (Priority: Critical)

### Stream E: Frontend Implementation
**Dependencies:** API Contract, Mock API
**Tasks:**
- [ ] Build UI components for all endpoints (Priority: High)
- [ ] Connect to mock API service (Priority: Critical)

### Stream F: E2E Testing
**Dependencies:** API Contract, Environment Setup
**Tasks:**
- [ ] Create test framework (Priority: High)
- [ ] Write E2E tests for PRD requirements (Priority: High)

## Integration Points
1. **Contract Validation**: After Phase 1 - APIs match spec, mock works
2. **Full Integration**: After Phase 2 - Frontend connects to real backend
3. **Production Ready**: After final integration and testing

## Success Criteria
- [ ] API contracts fully implemented and tested
- [ ] Frontend and backend developed independently
- [ ] E2E tests cover all PRD requirements
- [ ] Environment setup enables parallel development
```

### 5. Optimization Guidelines
- **Contract as Single Source**: OpenAPI spec drives all development
- **Mock-First Development**: Frontend never blocked by backend
- **Environment Parity**: Same setup across development, staging, production
- **Testing from Day 1**: E2E tests written alongside features
- **Clear Integration Points**: Defined validation milestones
- **Independent Streams**: Maximum parallelism with minimal dependencies

## Examples

### Example 1: Web Application PRD
**Input**: PRD describing a project management tool with users, projects, tasks, and reporting
**Output**: 4 parallel streams (Database, Backend APIs, Frontend Components, Authentication) with 2 integration points

### Example 2: Mobile App PRD
**Input**: PRD for social media app with posting, profiles, and messaging
**Output**: 3 streams (Core Features, User Management, Real-time Features) with API integration milestone

### Example 3: API Service PRD
**Input**: PRD for data processing API with multiple endpoints
**Output**: 3 streams (Core API, Authentication, Monitoring) with deployment integration

## Requirements
- PRD file

## Troubleshooting

### PRD Analysis Issues
- **Missing Details**: Ask user for clarification on unclear requirements
- **Too Broad**: Break large features into smaller, implementable chunks
- **Dependencies Unclear**: Make reasonable assumptions and state them explicitly

### Parallelization Challenges
- **Too Many Streams**: Limit to 3-5 maximum streams for manageability
- **Circular Dependencies**: Reorganize tasks to break dependency cycles
- **Unclear Integration Points**: Create explicit testing and merge milestones

## Supporting Files
See [examples.md](examples.md) for detailed PRD transformations and [templates.md](templates.md) for reusable plan structures.