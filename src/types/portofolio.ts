import { SequelizeInstance } from "@/service/storage";
import { DataTypes } from "sequelize";

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  mainImage: string;
  gallery: string[];
  altText: string;
}

const PortolioItemModel = SequelizeInstance.define("portfolio", {
  id: DataTypes.NUMBER,
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  mainImage: DataTypes.STRING,
  gallery: DataTypes.ARRAY(DataTypes.STRING),
  altText: DataTypes.STRING,
});
