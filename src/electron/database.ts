import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { app } from "electron";
import path from "path";
import fs from "fs";
import log from "electron-log";

let sequelize: Sequelize | null = null;

export interface PurchaseAttributes {
  id?: number;
  name: string;
  items: string;
}

export type PurchaseModel = ModelStatic<Model<PurchaseAttributes>>;

export let Purchase: PurchaseModel;

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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      items: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  ) as PurchaseModel;

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
