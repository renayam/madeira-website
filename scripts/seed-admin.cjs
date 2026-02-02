require("dotenv/config");
const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

const config = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_NAME || "madeira_db",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
};

const sequelize = new Sequelize({
  ...config,
  dialect: "mariadb",
  timezone: "+01:00",
  logging: false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  define: { timestamps: true, underscored: true },
});

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password_hash",
    },
    role: {
      type: DataTypes.ENUM("admin", "editor"),
      allowNull: false,
      defaultValue: "editor",
    },
  },
  {
    tableName: "users",
    modelName: "User",
  },
);

async function seedAdmin() {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("Database connected.");

    console.log("Syncing database models...");
    await sequelize.sync({ alter: true });
    console.log("Database synced.");

    const existingAdmin = await User.findOne({
      where: { username: ADMIN_USERNAME },
    });

    if (existingAdmin) {
      console.log(
        `Admin user '${ADMIN_USERNAME}' already exists. Skipping creation.`,
      );
      return;
    }

    let passwordHash;

    if (ADMIN_PASSWORD_HASH) {
      console.log("Using ADMIN_PASSWORD_HASH from environment.");
      passwordHash = ADMIN_PASSWORD_HASH;
    } else if (ADMIN_PASSWORD) {
      console.log("Hashing ADMIN_PASSWORD from environment...");
      passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    } else {
      throw new Error(
        "Either ADMIN_PASSWORD or ADMIN_PASSWORD_HASH must be set in environment variables.",
      );
    }

    const admin = await User.create({
      username: ADMIN_USERNAME,
      passwordHash,
      role: "admin",
    });

    console.log(
      `Admin user '${ADMIN_USERNAME}' created successfully with ID: ${admin.id}`,
    );
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seedAdmin();
