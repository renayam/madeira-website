import { DatabaseService } from "../service/storage";
import { DataTypes, Model, ModelAttributes, InitOptions } from "sequelize";

export type Prestation = {
  id: number;
  name: string;
  bannerImage: string;
  otherImage: string;
  description: string;
};

export type PrestationCreate = Omit<Prestation, "id">;

export class PrestationModel extends Model<Prestation> {
  declare id: number;
  declare name: string;
  declare bannerImage: string;
  declare otherImage: string;
  declare description: string;
  declare created_at: Date;
  declare updated_at: Date;

  static async initialize(db: DatabaseService) {
    const sequelize = db.connection;

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
        type: DataTypes.TEXT,
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
    try {
      await sequelize.authenticate();

      const model = this.init(modelAttributes, options);

      await model.sync();

      return model;
    } catch (error) {
      throw error;
    }
  }
}

// PrestationModel.initialize();
// PrestationModel.sync();
