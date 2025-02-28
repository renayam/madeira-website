import { DatabaseService } from "@/service/storage.server";
import { DataTypes, Model, ModelAttributes, InitOptions } from "sequelize";

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  mainImage: string;
  // gallery: string[];
  altText: string;
}

export type PortfolioItemCreate = Omit<PortfolioItem, "id">;

export class PortfolioItemModel extends Model<PortfolioItem> {
  declare id: number;
  declare title: string;
  declare description: string;
  declare mainImage: string;
  // declare gallery: string[];
  declare altText: string;
  declare created_at: Date;
  declare updated_at: Date;

  static async initialize(db: DatabaseService) {
    const sequelize = db.connection;

    const modelAttributes: ModelAttributes<PortfolioItemModel, PortfolioItem> =
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      mainImage: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "main_image",
      },
      // gallery: {
      //   type: DataTypes.ARRAY(DataTypes.STRING),
      //   allowNull: true,
      // },
      altText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "alt_text",
      },
    };

    const options: InitOptions<PortfolioItemModel> = {
      sequelize,
      modelName: "PortfolioItem",
      tableName: "portfolio_items",
      underscored: true,
    };

    try {
      await sequelize.authenticate();

      const model = this.init(modelAttributes, options);

      await model.sync({ alter: true });

      return model;
    } catch (error) {
      throw error;
    }
  }
}