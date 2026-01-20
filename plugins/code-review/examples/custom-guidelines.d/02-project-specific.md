# Project-Specific Standards

## Naming Conventions

This project uses specific naming patterns that should be followed:

- **Services**: Prefix with `I` for interfaces (e.g., `IAuthService`)
- **Constants**: Use UPPER_SNAKE_CASE for exported constants
- **Private members**: Prefix with `_` for private class members
- **Event handlers**: Prefix with `handle` (e.g., `handleSubmit`, `handleClick`)

## File Organization

- **Feature modules**: Group related files in feature folders
- **Barrel exports**: Use `index.ts` to re-export public APIs
- **Test files**: Co-locate with source using `.test.ts` suffix

## Forbidden Patterns

- Do not use `localStorage` directly - use the `storage` service
- Do not import from `src/index.ts` - use explicit imports
- Do not use `console.log` in production code - use the `logger` service
