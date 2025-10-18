import { Sequelize, DataTypes, Model, type ModelStatic } from "sequelize";
import { app } from "electron";
import path from "path";
import fs from "fs";
import log from "electron-log";

let sequelize: Sequelize | null = null;

export interface PurchaseAttributes {
  id?: number;
  items: string;
  total: number;
  createdAt?: Date;
}

export interface ItemAttributes {
  id?: number;
  code: string;
  name: string;
  price: number;
  variant?: string;
  type?: string;
  imagePath?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PurchaseModel = ModelStatic<Model<PurchaseAttributes>>;
export type ItemModel = ModelStatic<Model<ItemAttributes>>;

export let Purchase: PurchaseModel;
export let Item: ItemModel;

function getDatabasePath(): string {
  const isDev = !app.isPackaged;

  if (isDev) {
    const dbPath = path.join(process.cwd(), "dev.db");
    log.info("Dev database path:", dbPath);
    return dbPath;
  } else {
    const userDataPath = app.getPath("userData");
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    const dbPath = path.join(userDataPath, "app.db");
    log.info("Prod database path:", dbPath);
    return dbPath;
  }
}

export function initDatabase(): Sequelize {
  const dbPath = getDatabasePath();

  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: dbPath,
    logging: false,
  });

  Purchase = sequelize.define(
    "purchase",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      items: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      total: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  ) as PurchaseModel;

  Item = sequelize.define(
    "item",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      imagePath: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      variant: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: true }
  );

  // Define relationships
  //   User.hasMany(Note, { foreignKey: "userId", as: "notes" });
  //   Note.belongsTo(User, { foreignKey: "userId", as: "user" });

  log.info("Database initialized");

  return sequelize;
}

export async function syncDatabase(): Promise<void> {
  if (!sequelize) {
    throw new Error("Database not initialized");
  }

  try {
    // Create tables if they don't exist
    // alter: true will update existing tables to match models
    // force: true will drop and recreate tables (careful - deletes data!)
    await sequelize.sync({ alter: true });
    log.info("Database synced");
  } catch (error) {
    log.info("Database sync failed:", error);
    throw error;
  }
}

export function getDatabase(): Sequelize {
  if (!sequelize) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return sequelize;
}

export async function closeDatabase(): Promise<void> {
  if (sequelize) {
    await sequelize.close();
    sequelize = null;
    log.info("Database disconnected");
  }
}
