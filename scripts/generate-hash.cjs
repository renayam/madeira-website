const bcrypt = require("bcryptjs");
const password = process.env.ADMIN_PASSWORD || process.argv[2];

if (!password) {
  console.log(
    "Usage: ADMIN_PASSWORD=yourpassword node scripts/generate-hash.cjs",
  );
  console.log("  or: node scripts/generate-hash.cjs yourpassword");
  process.exit(1);
}

console.log(bcrypt.hashSync(password, 10));
