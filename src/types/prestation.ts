import { DatabaseService } from "@/service/storage.server";
import { DataTypes, Model, ModelAttributes, InitOptions } from "sequelize";

export interface Prestation {
  id?: number;
  name: string;
  bannerImage: string;
  otherImage: string[] | string;
  description: string;
}

export interface PrestationCreate {
  name: string;
  bannerImage: string;
  otherImage: string[];
  description: string;
  bannerImageFile?: File | null;
  otherImageFile?: File[] | null;
}

export class PrestationModel extends Model<Prestation> {
  declare id: number;
  declare name: string;
  declare bannerImage: string;
  declare otherImage: string[] | string;
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

      await model.sync({ alter: true });

      return model;
    } catch (error) {
      throw error;
    }
  }
}