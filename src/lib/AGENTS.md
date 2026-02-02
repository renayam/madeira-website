# Database & Model Learnings

## Sequelize Patterns

- JSON array fields require getter/setter with `as unknown as` type casting to bypass type mismatches between DB string and app array
- Model.init() should accept Sequelize instance directly - never wrap in service classes that have lifecycle complexity
- `sync({ force: true })` is sufficient for test cleanup - no need for manual table dropping

## Error Debugging

- "Cannot delete property 'meta' of [object Array]" = MariaDB 3.x vs Sequelize 6.x incompatibility ( downgrade to mariadb@2.5.6 )
- Connection timeout errors often mean wrong credentials, not network issues (check dotenv loading first)

## FormData Multi-File Handling

- `formData.get("field")` returns single value (File or string or null)
- `formData.getAll("field")` returns array for multi-file uploads
- Always check each item: `for (const file of formData.getAll("otherImage")) { if (file instanceof File) { ... } }`

## Sequelize Data Retrieval

- Use `findAll({ raw: true })` for plain objects with all fields including id
- `raw: true` applies getters (like JSON array parsing) automatically
- For single model instances, prefer `model.get({ plain: true })` over `model.toJSON()`
- `toJSON()` may not include all fields in some Sequelize configurations

## ts-node and Path Aliases

- ts-node doesn't resolve TypeScript path aliases like `@/` by default
- Workaround: Use CommonJS scripts (.cjs) that require modules directly, or use `npx ts-node -r tsconfig-paths/register`
- Simpler approach: Write seed/migration scripts in .cjs format to avoid path resolution issues
