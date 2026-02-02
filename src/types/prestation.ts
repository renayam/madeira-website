import { DataTypes, Model, Sequelize } from "sequelize";

export interface Prestation {
  id: number;
  name: string;
  bannerImage: string;
  otherImage: string[];
  description: string;
}

export interface PrestationCreate {
  name: string;
  bannerImage: string;
  otherImage: string[];
  description: string;
}

export interface PrestationFormState extends PrestationCreate {
  bannerImageFile: File | null;
  otherImageFiles: File[];
  deletedImages: string[];
}

export class PrestationModel extends Model<Prestation> {
  declare id: number;
  declare name: string;
  declare bannerImage: string;
  declare otherImage: string[];
  declare description: string;

  static initModel(sequelize: Sequelize) {
    PrestationModel.init(
      {
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
            const value = this.getDataValue("otherImage") as unknown as string;
            return value ? JSON.parse(value) : [];
          },
          set(value: string[]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.setDataValue("otherImage", JSON.stringify(value) as any);
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "prestations",
        modelName: "Prestation",
      },
    );
  }
}
