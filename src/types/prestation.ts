import { DatabaseService } from "../service/storage";
import { DataTypes, Model } from "sequelize";

export type Prestation = {
  id: number;
  name: string;
  bannerImage: string;
  // otherImage: string[];
  description: string;
};

export class PrestationModel extends Model<Prestation> {
  declare id: number;
  declare name: string;
  declare bannerImage: string;
  // declare otherImage: string[];
  declare description: string;
  declare created_at: Date;
  declare updated_at: Date;

  static initialize() {
    const sequelize = DatabaseService.getInstance();
    return this.init(
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
          type: DataTypes.STRING,
          field: "banner_image",
          allowNull: false,
        },
        // otherImage: {
        //   type: DataTypes.STRING, // Store as a JSON string
        //   field: "other_image",
        //   allowNull: true,
        // },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Prestation",
        tableName: "prestations",
        underscored: true,
      },
    );
  }

  // Helper method to add images
  // addOtherImage(image: string) {
  //   const currentImages = this.otherImage || [];
  //   this.otherImage = [...currentImages, image];
  // }

  // Helper method to remove images
  // removeOtherImage(image: string) {
  //   this.otherImage = (this.otherImage || []).filter((img) => img !== image);
  // }
}

// Initialize the model
PrestationModel.initialize();
PrestationModel.sync();
