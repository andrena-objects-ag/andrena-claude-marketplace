# TypeScript Security Guidelines

## Additional Checks for TypeScript

When reviewing TypeScript code, also check for:

### Type Safety
- **any types**: Flag usage of `any` - suggest proper types or `unknown`
- **type assertions**: Look for unsafe `as` casts - use type guards instead
- **non-null assertions**: Flag `!` operator - prefer proper null checks
- **optional chaining**: Ensure `?.` is used where appropriate instead of verbose checks

### React-Specific (if applicable)
- **useEffect dependencies**: Ensure all dependencies are listed or eslint-disable is justified
- **missing keys**: Verify list items have proper `key` props
- **prop drilling**: Suggest context or state management for deeply passed props
- **useState initializers**: For expensive computations, use lazy initializers

### API Design
- **interface vs type**: Prefer `interface` for object shapes that can be extended
- **export types**: Ensure types are exported if used in public APIs
- **generics**: Check for overly complex generic constraints
