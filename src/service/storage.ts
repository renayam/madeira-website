import { Sequelize } from "sequelize";

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: (process.env.DB_NAME as string) || "madeira_db",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
};

// Create Sequelize instance
const SequelizeInstance = new Sequelize(
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

export class DatabaseService {
  private static instance: Sequelize | null = null;
  private constructor() {}

  public static getInstance(): Sequelize {
    if (!DatabaseService.instance) {
      DatabaseService.instance = SequelizeInstance;
    }
    return DatabaseService.instance;
  }

  static async testConnection() {
    try {
      await SequelizeInstance.authenticate();
      return true;
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  }

  static async sync() {
    try {
      await SequelizeInstance.sync({
        alter: true,
        force: true,
      });
      return true;
    } catch (error) {
      console.error("Database synchronization failed:", error);
      throw error;
    }
  }
}
