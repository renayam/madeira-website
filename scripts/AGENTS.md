# Scripts & Dev Tools Learnings

## TypeScript Dependencies

- bcryptjs requires `@types/bcryptjs` for TypeScript type definitions
- Install with: `npm install --save-dev @types/bcryptjs`

## Password Hash Generation

- Generate bcrypt hashes programmatically, not via CLI escaping
- Create a temporary .js file with the password, run with node
- Example: `node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('password', 10));"`
- For complex passwords with special chars, write to file and run: `node script.js`

## Seed Script Patterns

- Seed scripts should handle both pre-hashed passwords and plaintext
- Check for `*_HASH` env var first, then fall back to `*_PASSWORD` with bcrypt.hash()
- Always sync models with `sequelize.sync({ alter: true })` before seeding
