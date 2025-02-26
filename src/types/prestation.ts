import { DatabaseService } from "../service/storage";
import { DataTypes, Model, ModelAttributes, InitOptions } from "sequelize";

export type Prestation = {
  id: number;
  name: string;
  bannerImage: string;
  otherImage: string;
  description: string;
};

export class PrestationModel extends Model<Prestation> {
  declare id: number;
  declare name: string;
  declare bannerImage: string;
  declare otherImage: string;
  declare description: string;
  declare created_at: Date;
  declare updated_at: Date;

  static initialize() {
    const sequelize = DatabaseService.getInstance();

    const modelAttributes: ModelAttributes<PrestationModel, Prestation> = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bannerImage: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "banner_image",
      },
      otherImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    };

    const options: InitOptions<PrestationModel> = {
      sequelize,
      modelName: "Prestation",
      tableName: "prestations",
      underscored: true,
    };

    return this.init(modelAttributes, options);
  }
}

PrestationModel.initialize();
PrestationModel.sync();
