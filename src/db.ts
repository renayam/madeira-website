import { Sequelize } from "sequelize";
import { PortfolioItemModel } from "@/types/portfolio";
import { PrestationModel } from "@/types/prestation";

const config = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  database: process.env.DB_NAME || "madeira_db",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
};

export const sequelize = new Sequelize({
  ...config,
  dialect: "mariadb",
  timezone: "+01:00",
  logging: false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  define: { timestamps: true, underscored: true },
});

PortfolioItemModel.initModel(sequelize);
PrestationModel.initModel(sequelize);

export const PortfolioItem = PortfolioItemModel;
export const Prestation = PrestationModel;

export async function connect(): Promise<void> {
  await sequelize.authenticate();
}

export async function sync(): Promise<void> {
  await sequelize.sync({ alter: true });
}

export async function close(): Promise<void> {
  await sequelize.close();
}
