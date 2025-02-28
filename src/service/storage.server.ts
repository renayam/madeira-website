import { PortfolioItemModel } from "../types/portfolio";
import { PrestationModel } from "../types/prestation";
import { Sequelize, QueryTypes } from "sequelize";

const DB_CONFIG = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    database: process.env.DB_NAME || "madeira_db",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "admin",
};

export class DatabaseService {
    private static _instance: DatabaseService;
    connection: Sequelize;

    constructor() {
        this.connection = new Sequelize({
            database: DB_CONFIG.database,
            username: DB_CONFIG.username,
            password: DB_CONFIG.password,
            host: DB_CONFIG.host,
            port: DB_CONFIG.port,
            dialect: "mariadb",
            timezone: "+01:00",
            // logging: process.env.NODE_ENV === "development" ? console.log : false,
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
        });
        this.connection.authenticate();
        PortfolioItemModel.initialize(this);
        PrestationModel.initialize(this);
    }

    static getInstance(): DatabaseService {
        if (!DatabaseService._instance) {
            DatabaseService._instance = new DatabaseService();
        }
        return DatabaseService._instance;
    }

    public async getAllTables(): Promise<unknown[]> {
        const tables = await this.connection.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()",
            {
                type: QueryTypes.SELECT,
            },
        );
        return tables;
    }

    public async reset(): Promise<boolean> {
        try {
            await this.connection.sync({ force: true });
            console.log("Database reset completed");
            return true;
        } catch (error) {
            console.error("Database reset failed:", error);
            throw error;
        }
    }
} 