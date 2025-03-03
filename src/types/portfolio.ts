import { DatabaseService } from "@/service/storage.server";
import { DataTypes, Model, ModelAttributes, InitOptions } from "sequelize";

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  mainImage: string;
  otherImage: string[] | string;
  altText: string;
}

export type PortfolioItemCreate = {
  title: string;
  description: string;
  mainImage: string | null;
  otherImage: string[];
  altText: string;
  mainImageFile?: File | null;
  otherImageFile?: File[] | null;
  deletedImages?: string[];
};

/**
 * Sequelize model representing a portfolio item in the database
 * @extends Model
 */
export class PortfolioItemModel extends Model<PortfolioItem> {
  declare id: number;
  declare title: string;
  declare description: string;
  declare mainImage: string;
  declare otherImage: string[] | string;
  declare altText: string;
  declare created_at: Date;
  declare updated_at: Date;

  /**
   * Initializes the PortfolioItem model with the database connection
   * @param {DatabaseService} db - Database service instance
   * @returns {Promise<typeof PortfolioItemModel>} Initialized model
   * @throws {Error} If initialization fails
   */
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
      otherImage: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "other_image",
        get() {
          const rawValue = this.getDataValue('otherImage');
          if (typeof rawValue === 'string') {
            return rawValue ? rawValue.split(',') : [];
          }
          return rawValue || [];
        },
        set(val: string[] | string) {
          if (Array.isArray(val)) {
            this.setDataValue('otherImage', val.join(','));
          } else {
            this.setDataValue('otherImage', val);
          }
        }
      },
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