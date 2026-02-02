# Database & Model Learnings

## Sequelize Patterns

- JSON array fields require getter/setter with `as unknown as` type casting to bypass type mismatches between DB string and app array
- Model.init() should accept Sequelize instance directly - never wrap in service classes that add lifecycle complexity
- `sync({ force: true })` is sufficient for test cleanup - no need for manual table dropping

## Error Debugging

- "Cannot delete property 'meta' of [object Array]" = MariaDB 3.x vs Sequelize 6.x incompatibility ( downgrade to mariadb@2.5.6 )
- Connection timeout errors often mean wrong credentials, not network issues (check dotenv loading first)
