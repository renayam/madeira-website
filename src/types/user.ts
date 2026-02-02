import { DataTypes, Model, Sequelize } from "sequelize";
import bcrypt from "bcryptjs";

export type UserRole = "admin" | "editor";

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: UserRole;
}

export interface UserCreationAttributes {
  username: string;
  password?: string;
  passwordHash?: string;
  role?: UserRole;
}

export class UserModel extends Model<User> implements User {
  declare id: number;
  declare username: string;
  declare passwordHash: string;
  declare role: UserRole;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static initModel(sequelize: Sequelize) {
    UserModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        passwordHash: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "password_hash",
        },
        role: {
          type: DataTypes.ENUM("admin", "editor"),
          allowNull: false,
          defaultValue: "editor",
        },
      },
      {
        sequelize,
        tableName: "users",
        modelName: "User",
      },
    );
  }
}
