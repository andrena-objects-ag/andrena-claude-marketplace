---
name: plan-validator
description: Validates markdown implementation plans against best practices. Use when creating, reviewing, or challenging plan files. Ensures plans have proper structure, checklists, constraints, and validation criteria.
allowed-tools: Read, Grep, Glob
---

# Plan Validator Skill

Expert validation system for markdown-based implementation plans. This skill ensures plans are structured for adversarial validation and have complete, verifiable checkpoints.

## Validation Framework

Every plan must satisfy these dimensions:

### 1. Structure Validation

**Required Sections:**
- [ ] Metadata (created date, status, challenger info)
- [ ] Overview with scope and success criteria
- [ ] Goals with measurable success criteria
- [ ] Constraints (Must Haves, Must Nots, Trade-offs)
- [ ] Tasks with checkboxes and validation methods
- [ ] Risk Register
- [ ] Definition of Done
- [ ] Challenger Log section

### 2. Checklist Quality Validation

Each checklist item must have:

**Task IDs:** Format like `[T-1.0]`, `[T-1.1]`, `[G-1]`, etc.
- Pattern: `[LETTER-NUMBER(.NUMBER)?]`
- G = Goals, M = Must constraints, T = Tasks

**Metadata after checkbox:**
```
- [ ] [T-1.1] Description │ Constraint: [MUST-X] │ Validation: [method]
```

**Evidence Requirements:**
- Each item specifies what evidence proves completion
- Validation method is concrete and testable
- Not vague like "test it works" but "run test suite X and verify Y"

### 3. Constraint Completeness

**Must Haves Cover:**
- [ ] Security requirements
- [ ] Performance requirements
- [ ] Data protection/privacy
- [ ] Error handling
- [ ] Compatibility

**Must Nots Specify:**
- [ ] Security boundaries
- [ ] Features explicitly out of scope
- [ ] Technologies/patterns to avoid

### 4. Validation Method Quality

Good validation methods:
- "Run `npm test` and verify all tests pass"
- "Manual test: input X produces output Y"
- "Security scan: no critical vulnerabilities"
- "Performance test: response time < 100ms at 1000 RPS"

Bad validation methods:
- "It works"
- "Tested locally"
- "Seems fine"

### 5. Risk Register Quality

Each risk must have:
- [ ] Clear description
- [ ] Probability assessment
- [ ] Impact assessment
- [ ] Specific mitigation strategy
- [ ] Status tracking

### 6. Challenge Readiness

Plan must be challengable:
- [ ] Every claim is verifiable
- [ ] Every task has success criteria
- [ ] Assumptions are explicit
- [ ] Dependencies are tracked
- [ ] Completion is clearly defined

## Validation Process

When validating a plan:

1. **Read the plan file** using Read tool
2. **Check structure completeness** - all required sections present
3. **Validate checklist format** - proper IDs, metadata, evidence requirements
4. **Assess constraint coverage** - security, performance, etc.
5. **Review validation methods** - are they concrete and testable?
6. **Check risk register** - are risks identified with mitigations?
7. **Verify challenge readiness** - can an agent effectively challenge this?

## Validation Output Format

```
PLAN VALIDATION REPORT: [plan file name]

STRUCTURE: [PASS/FAIL]
- [Required sections present or missing]

CHECKLIST QUALITY: [PASS/FAIL]
- [Issues with checkbox format, IDs, or metadata]

CONSTRAINT COVERAGE: [PASS/FAIL]
- [Missing constraint categories]

VALIDATION METHODS: [PASS/FAIL]
- [Vague or incomplete validation methods]

CHALLENGE READINESS: [PASS/FAIL]
- [Aspects that can't be effectively challenged]

OVERALL: [PASS/FAIL]

REQUIRED FIXES:
- [ ] [Specific fix needed]

RECOMMENDATIONS:
- [ ] [Suggested improvement]

VALIDATOR CONFIDENCE: [HIGH/MEDIUM/LOW]
```

## Common Issues to Flag

### Structure Issues
- Missing required sections
- Inconsistent formatting
- No Definition of Done

### Checklist Issues
- Missing task IDs
- No validation metadata
- Vague completion criteria
- No evidence requirements

### Constraint Issues
- No security constraints
- No performance requirements
- Missing "must not" boundaries
- No trade-off documentation

### Risk Issues
- Empty risk register
- Risks without mitigations
- No probability/impact assessment

## Usage Notes

This skill works with the adversarial-challenger agent. When the challenger evaluates a plan, it uses this validation framework to ensure the plan itself is well-structured before challenging the work within it.

The skill only uses Read, Grep, and Glob tools to analyze plan files without making modifications.
