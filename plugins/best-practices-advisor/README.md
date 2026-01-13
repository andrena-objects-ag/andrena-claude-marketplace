# Best Practices Advisor

> Automatically discover technologies, research version-specific best practices, and extend your project documentation with actionable guidelines.

## Overview

The Best Practices Advisor plugin helps maintain high-quality, version-aware best practices documentation in any project, regardless of technology stack. It automatically:

1. **Detects your tech stack** - Scans manifest files (package.json, pom.xml, *.csproj, etc.)
2. **Identifies versions** - Extracts version information to ensure applicability
3. **Researches best practices** - Searches official docs and authoritative sources
4. **Updates documentation** - Extends CLAUDE.md or .llm/ with version-specific guidelines

## Why This Matters

Best practices change significantly between versions:
- **NestJS 8.x → 10.x**: Different module configuration patterns
- **Spring Boot 2.x → 3.x**: Jakarta namespace migration, security changes
- **.NET Framework → .NET 8**: Async patterns, DI conventions evolved
- **React 16 → 18**: Hooks, concurrent features, best practices changed

Without version awareness, you might follow outdated or incompatible patterns. This plugin ensures recommendations apply to YOUR specific version.

## Installation

```bash
/plugin install best-practices-advisor@andrena-marketplace
```

## Usage

### Basic Usage

```
Use best-practices-finder to analyze this project and create best practices documentation
```

### After Version Upgrades

```
We upgraded from Spring Boot 2.7 to 3.1. Use best-practices-finder to update
our documentation with Spring Boot 3.x specific patterns.
```

### For New Projects

```
Use best-practices-finder to establish initial best practices documentation
for this new NestJS project.
```

## What Gets Documented

For each detected technology + version, the skill creates structured documentation:

### Technology Header
```markdown
## NestJS 10.x Best Practices
*Researched: 2024-01-13*
*Sources: https://docs.nestjs.com, https://github.com/nestjs/nest*
```

### Categorized Guidelines
- **Project Structure** - Folder organization, file naming conventions
- **Architecture Patterns** - Layering, separation of concerns, module design
- **Code Style** - Naming conventions, formatting standards
- **Error Handling** - Exception patterns, error responses
- **Testing** - Unit test structure, integration test patterns
- **Security** - Authentication patterns, input validation
- **Performance** - Caching strategies, optimization patterns
- **Configuration** - Environment variables, settings management

### Version-Specific Callouts
```markdown
⚠️ **Version Note**: This pattern requires NestJS >= 10.0
If using NestJS 9.x, use the legacy configuration approach instead.
```

## Supported Technologies

### Node.js Ecosystem
- NestJS, Express, Fastify
- React, Vue, Angular
- TypeScript, JavaScript
- Testing: Jest, Vitest, Mocha

### Java Ecosystem
- Spring Boot, Quarkus, Micronaut
- Hibernate, JPA
- Testing: JUnit, TestNG

### .NET Ecosystem
- ASP.NET Core
- Entity Framework Core
- Testing: xUnit, NUnit

### Python Ecosystem
- Django, Flask, FastAPI
- SQLAlchemy
- Testing: pytest, unittest

### Go Ecosystem
- Gin, Echo, Fiber
- GORM
- Testing: standard library, testify

### Ruby Ecosystem
- Rails, Sinatra
- ActiveRecord
- Testing: RSpec, Minitest

### PHP Ecosystem
- Laravel, Symfony
- Doctrine, Eloquent
- Testing: PHPUnit

And more - the skill adapts to whatever technologies it finds!

## Documentation Placement

The skill follows your project's documentation structure:

### If CLAUDE.md Exists
Adds/updates a "Technology Stack & Best Practices" section with references:
```markdown
## Technology Stack & Best Practices

This project uses:
- **NestJS 10.x** - See [NestJS Best Practices](./.llm/best-practices/nestjs-10.md)
- **TypeORM 0.3.x** - See [TypeORM Best Practices](./.llm/best-practices/typeorm-0.3.md)
```

### Creates .llm/best-practices/ Directory
One file per major technology:
- `.llm/best-practices/nestjs-10.md`
- `.llm/best-practices/typeorm-0.3.md`
- `.llm/best-practices/spring-boot-3.md`

### Adapts to Your Structure
If your project has a different documentation pattern, the skill will ask where to place findings.

## Integration with Other Tools

### Works With /learn Command
- **best-practices-finder**: General technology best practices
- **/learn**: Project-specific learnings from implementation

Both contribute to .llm/ documentation but serve complementary purposes.

### Works With /ralph-learn-loop
Can be invoked during autonomous loops to establish best practices before implementation begins.

## Version Handling

### Version Ranges
When dependencies use version ranges (^, ~, >=), the skill:
- **^10.2.0** (caret): Researches "10.x" best practices
- **~10.2.0** (tilde): Researches "10.2.x" specifically
- **>=10.0.0** (range): Uses highest stable version in range

### Update Workflow
When versions change, the skill:
1. Detects version upgrades
2. Identifies breaking changes
3. Updates documentation
4. Highlights: "Updated for v3.0 - Jakarta namespace migration"
5. Preserves old version notes if still relevant

## Research Methodology

### Source Prioritization
1. Official documentation for exact version
2. Official migration guides
3. Framework GitHub repo docs/
4. Official blog posts and tutorials
5. High-quality community examples (recent, well-maintained)

### Quality Filters
- ✅ Official sources and authoritative guides
- ✅ Recent content (checks publication dates)
- ✅ Version-specific guidance
- ❌ Outdated blog posts
- ❌ Practices for different major versions
- ❌ Unofficial or questionable sources

## Example Output

For a NestJS 10.x + TypeORM 0.3.x project:

**.llm/best-practices/nestjs-10.md**
```markdown
## NestJS 10.x Best Practices
*Researched: 2024-01-13*
*Sources: https://docs.nestjs.com/v10*

### Project Structure
- Use feature-based module organization
- Shared code in `src/common/`
- Each feature has its own module, controller, service, entities

### Dependency Injection
- Use constructor injection (preferred)
- Avoid `@Inject()` decorator when TypeScript types are sufficient
- Use `@Injectable()` on all services

### Error Handling
- Use built-in `HttpException` classes
- Implement global exception filters for consistent error responses
- Use custom exceptions extending `HttpException` for domain errors

### Testing
- Use `@nestjs/testing` Test module
- Mock dependencies in unit tests
- Use e2e tests for integration testing
- Aim for >80% coverage

⚠️ **Version Note**: NestJS 10 uses the newer configuration API.
If migrating from v9, update module configurations accordingly.
```

## Use Cases

### 1. Onboarding New Team Members
Provide clear, version-specific guidelines for the tech stack they'll be working with.

### 2. Starting New Projects
Establish best practices documentation from day one.

### 3. After Major Upgrades
Update practices when dependencies change major versions.

### 4. Code Review Standards
Document what reviewers should look for.

### 5. Inherited Legacy Codebases
Identify which practices apply to the current (possibly outdated) versions.

## Skills Included

### best-practices-finder
User-invocable skill that performs the full workflow:
- Technology discovery
- Version extraction
- Best practices research
- Documentation updates

See [skills/best-practices-finder/SKILL.md](./skills/best-practices-finder/SKILL.md) for detailed documentation.

## Version History

### v1.0.0 (2024-01-13)
- Initial release
- Multi-language support (Node.js, Java, .NET, Python, Go, Ruby, PHP)
- Version-aware research and documentation
- Automatic documentation structure detection
- Integration with CLAUDE.md and .llm/ patterns

## Contributing

Contributions welcome! To add support for new technologies or improve research methodology, see [CONTRIBUTING.md](../../CONTRIBUTING.md).

## License

MIT License - see [LICENSE](../../LICENSE) for details.

## Author

Peter Wegner (peter.wegner@andrena.de)
