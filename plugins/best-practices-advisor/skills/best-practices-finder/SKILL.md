---
name: best-practices-finder
description: Automatically discover technologies and versions used in any project, research current best practices for those specific versions, and update local documentation with findings. Works across all tech stacks (Node.js, .NET, Java, Python, etc.). Use when setting up a new project or ensuring existing code follows current conventions.
user-invocable: true
allowed-tools: [Read, Glob, Grep, WebSearch, WebFetch, Edit, Write]
model: sonnet
---

# Best Practices Finder

Discovers the technologies and versions used in your project, researches version-specific best practices from authoritative sources, and extends your local documentation with actionable guidelines.

## What This Skill Does

1. **Auto-detects technologies** - Scans package.json, pom.xml, *.csproj, requirements.txt, go.mod, etc. to identify your tech stack
2. **Extracts version information** - Determines which versions are in use (critical for best practice applicability)
3. **Researches best practices** - Searches official documentation, GitHub repos, and trusted sources for current patterns
4. **Validates version compatibility** - Ensures recommendations apply to YOUR version (e.g., Spring Boot 2.x vs 3.x have different patterns)
5. **Updates local documentation** - Extends CLAUDE.md or .llm/ docs with version-aware guidelines

## Why Version Matters

Best practices change significantly between versions:
- **NestJS 8.x → 10.x**: Changed module configuration patterns
- **Spring Boot 2.x → 3.x**: Jakarta namespace migration, different security patterns
- **.NET Framework → .NET 6+**: async/await patterns, dependency injection changes
- **React 16 → 18**: Concurrent features, hooks best practices evolved

This skill ensures you get practices that APPLY to your specific version.

## When to Use This Skill

- **Starting a new project** - Establish best practices documentation from day one
- **Onboarding new team members** - Provide clear, version-specific guidelines
- **After dependency upgrades** - Update practices when major versions change
- **Code review preparation** - Document standards reviewers should check
- **Inherited legacy codebases** - Identify which practices apply to older versions

## How It Works

### Phase 1: Technology Discovery

Scans common manifest files to identify tech stack:

**Node.js/JavaScript/TypeScript**
- `package.json` - npm/yarn/pnpm dependencies
- `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` - locked versions

**Java**
- `pom.xml` - Maven dependencies
- `build.gradle`, `build.gradle.kts` - Gradle dependencies
- Framework detection: Spring Boot, Quarkus, Micronaut

**.NET**
- `*.csproj`, `*.fsproj` - Project files with package references
- `packages.config` - Legacy NuGet packages
- Framework detection: ASP.NET Core, Entity Framework

**Python**
- `requirements.txt`, `Pipfile`, `pyproject.toml` - pip/pipenv/poetry
- Framework detection: Django, Flask, FastAPI

**Go**
- `go.mod` - Go modules
- Framework detection: Gin, Echo, Fiber

**Ruby**
- `Gemfile`, `Gemfile.lock` - Bundler dependencies
- Framework detection: Rails, Sinatra

**PHP**
- `composer.json` - Composer dependencies
- Framework detection: Laravel, Symfony

### Phase 2: Version Extraction

For each detected technology:
- Extracts major.minor.patch version
- Identifies if pinned or range (^, ~, >=)
- Determines "effective version" for best practice research

### Phase 3: Best Practices Research

For each technology + version combination:

1. **Search official documentation**
   - Framework/library official docs
   - Migration guides
   - API references

2. **Check authoritative sources**
   - Official GitHub repositories (CONTRIBUTING.md, docs/)
   - Framework-specific style guides
   - Official blog posts about version changes

3. **Review community consensus**
   - Highly-starred GitHub examples
   - Stack Overflow accepted answers (filtered by date)
   - Conference talks and official tutorials

4. **Extract actionable patterns**
   - File/folder structure conventions
   - Naming conventions
   - Error handling patterns
   - Testing approaches
   - Configuration best practices
   - Security considerations

### Phase 4: Documentation Update

Determines where to document findings:
- Checks if CLAUDE.md exists
- Checks for .llm/ directory
- Asks user where to place findings if structure unclear
- Creates sections for each technology:
  ```
  ## NestJS 10.x Best Practices

  ### Project Structure
  - Feature-based module organization
  - Shared modules in src/common

  ### Dependency Injection
  - Use constructor injection
  - Avoid @Inject() decorator when possible

  ### Error Handling
  - Use built-in HttpException classes
  - Implement global exception filters
  ```

## Example Workflows

### Example 1: NestJS Project

**Discovery:**
```json
// package.json
{
  "dependencies": {
    "@nestjs/core": "^10.2.0",
    "@nestjs/common": "^10.2.0",
    "@nestjs/typeorm": "^10.0.1",
    "typeorm": "^0.3.17"
  }
}
```

**Research finds:**
- NestJS 10.x: Module configuration patterns, dependency injection best practices
- TypeORM 0.3.x: Entity definition patterns, migration strategies

**Documentation created:**
`.llm/nestjs-best-practices.md` with:
- Feature module organization (NestJS 10 pattern)
- DTOs and validation pipes usage
- TypeORM 0.3 entity patterns (DataSource vs Connection)
- Testing strategies for controllers and services

### Example 2: Spring Boot + Java Project

**Discovery:**
```xml
<!-- pom.xml -->
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.1.5</version>
</parent>
```

**Research finds:**
- Spring Boot 3.x: Jakarta namespace migration complete
- Java 17+: Record classes for DTOs
- Spring Security 6.x: Lambda DSL configuration

**Documentation created:**
`.llm/spring-boot-best-practices.md` with:
- Package structure (controller/service/repository layers)
- Use of Records for DTOs (Java 17+ feature)
- Jakarta imports (not javax)
- Security configuration with Lambda DSL
- Testing with @SpringBootTest

### Example 3: .NET 8 Web API

**Discovery:**
```xml
<!-- MyProject.csproj -->
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
  <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
</Project>
```

**Research finds:**
- .NET 8: Minimal APIs vs Controllers
- EF Core 8: New features and patterns
- C# 12: Primary constructors

**Documentation created:**
`.llm/dotnet-best-practices.md` with:
- Minimal API patterns vs traditional controllers
- Dependency injection registration patterns
- EF Core 8 DbContext configuration
- Using primary constructors for DI

## Version-Aware Research

The skill specifically looks for version-appropriate guidance:

**Search query patterns:**
- "[Technology] [MajorVersion] best practices 2024"
- "[Technology] [Version] migration guide"
- "[Technology] [Version] official documentation"
- "[Technology] [Version] project structure"

**Source prioritization:**
1. Official docs for exact version
2. Official migration guides
3. Framework GitHub repo docs/
4. Official tutorials/blogs
5. High-quality community examples (recent, well-maintained)

**Filters out:**
- Practices for different major versions
- Deprecated patterns
- Outdated blog posts (checks publication date)
- Unofficial or questionable sources

## Structured Output

Documentation includes:

### Technology Header
```markdown
## [Technology] [Version] Best Practices
*Researched: [Date]*
*Sources: [Links to authoritative docs]*
```

### Categorized Practices
- **Project Structure** - Folder organization, file naming
- **Architecture Patterns** - Layering, separation of concerns
- **Code Style** - Naming conventions, formatting
- **Error Handling** - Exception patterns, error responses
- **Testing** - Unit test structure, integration test patterns
- **Security** - Auth patterns, input validation
- **Performance** - Caching strategies, optimization patterns
- **Configuration** - Environment variables, settings files

### Version-Specific Callouts
```markdown
⚠️ **Version Note**: This pattern requires [Technology] >= [Version]
If using [OlderVersion], use [AlternativePattern] instead.
```

## Documentation Placement

Follows project structure:
- If CLAUDE.md exists: Adds/updates best practices section with references
- Creates `.llm/best-practices/` directory for detailed guidelines
- One file per major technology: `nestjs-10.md`, `spring-boot-3.md`
- Links from CLAUDE.md to detailed files

Example CLAUDE.md section:
```markdown
## Technology Stack & Best Practices

This project uses:
- **NestJS 10.x** - See [NestJS Best Practices](./.llm/best-practices/nestjs-10.md)
- **TypeORM 0.3.x** - See [TypeORM Best Practices](./.llm/best-practices/typeorm-0.3.md)

Best practices are version-specific. Update documentation when upgrading dependencies.
```

## Handling Version Ranges

When dependencies use ranges (^, ~):

**^10.2.0** (caret)
- Researches for "10.x" best practices
- Notes: "Applies to all 10.x versions"

**~10.2.0** (tilde)
- Researches for "10.2.x" specifically
- Notes: "Specific to 10.2.x patch versions"

**>=10.0.0** (range)
- Uses highest known stable version in range
- Warns: "Version range detected, practices based on [Version]"

## Update Workflow

When versions change:
1. Detects version upgrades in manifests
2. Identifies breaking changes
3. Updates best practices documentation
4. Highlights what changed: "Updated for [NewVersion] - [Changes]"
5. Preserves old version notes if still relevant

## Integration with /learn Command

Can work together:
- **best-practices-finder**: General technology best practices
- **/learn**: Project-specific learnings from implementation

Both contribute to .llm/ documentation but serve different purposes.

## Example Invocation

```
Use best-practices-finder to analyze this project's tech stack and create
version-specific best practices documentation.
```

Or more specific:
```
We just upgraded from NestJS 9 to NestJS 10. Use best-practices-finder to
update our documentation with NestJS 10 specific patterns and note breaking changes.
```

## References

For implementation details see:
- [reference.md](./reference.md) - Detailed research methodology
- [examples.md](./examples.md) - Real-world examples across tech stacks
- [version-detection.md](./version-detection.md) - Version extraction algorithms
