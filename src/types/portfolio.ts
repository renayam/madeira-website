import { DataTypes, Model, Sequelize } from "sequelize";

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  mainImage: string;
  otherImage: string[];
  altText: string;
}

export class PortfolioItemModel extends Model<PortfolioItem> {
  declare id: number;
  declare title: string;
  declare description: string;
  declare mainImage: string;
  declare otherImage: string[];
  declare altText: string;

  static initModel(sequelize: Sequelize) {
    PortfolioItemModel.init(
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
            const value = this.getDataValue("otherImage") as unknown as string;
            return value ? JSON.parse(value) : [];
          },
          set(value: string[]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.setDataValue("otherImage", JSON.stringify(value) as any);
          },
        },
        altText: {
          type: DataTypes.STRING,
          allowNull: true,
          field: "alt_text",
        },
      },
      {
        sequelize,
        tableName: "portfolio_items",
        modelName: "PortfolioItem",
      },
    );
  }
}
