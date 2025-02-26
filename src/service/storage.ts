import { Sequelize } from "sequelize";

// Database configuration
const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_NAME || "madeira_db",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
};

// Create Sequelize instance
export const sequelize = new Sequelize(
  DB_CONFIG.database,
  DB_CONFIG.username,
  DB_CONFIG.password,
  {
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    dialect: "mariadb",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  },
);

// Test connection
export async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log("MariaDB connection has been established successfully.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
}

// Sync models (optional, use with caution in production)
export async function syncDatabase() {
  try {
    // Uncomment and customize as needed
    // await sequelize.sync({ alter: true });
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
}
