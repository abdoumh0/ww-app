import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import type {
  APIChannels,
  ChannelName,
  EventChannelName,
  EventChannels,
} from "./api-contract.js";
import { Item, ItemModel, Purchase } from "./database.js";

type Handler<K extends ChannelName> = (
  event: IpcMainInvokeEvent,
  data: APIChannels[K]["input"]
) => Promise<APIChannels[K]["output"]> | APIChannels[K]["output"];

function sendToRenderer<K extends EventChannelName>(
  window: BrowserWindow,
  channel: K,
  data: EventChannels[K]
) {
  window.webContents.send(channel, data);
}

const handlers: {
  [K in ChannelName]: Handler<K>;
} = {
  "purchase:create": async (event, data) => {
    try {
      const p = await Purchase.create({
        name: data.name,
        items: data.items.join(", "),
      });
      console.log("commited:", p);
      return { ...data, success: true };
    } catch (error) {
      return { ...data, success: true };
    }
  },
  "item:create": async (event, data) => {
    try {
      const item = await Item.create({
        code: data.code,
        name: data.name,
        price: data.price,
        imagePath: data.imagePath || undefined,
        type: data.type || undefined,
        variant: data.variant || undefined,
      });

      const itemData = item.dataValues;

      return {
        id: itemData.id!.toString(),
        code: itemData.code,
        name: itemData.name,
        price: itemData.price,
        imagePath: itemData.imagePath || undefined,
        type: itemData.type || undefined,
        variant: itemData.variant || undefined,
        createdAt: itemData.createdAt!.toISOString(),
      };
    } catch (error) {
      console.error("Failed to create item:", error);
      throw error;
    }
  },

  "item:list": async (event, data) => {
    try {
      const items = (
        await Item.findAll({
          order: [["createdAt", "DESC"]],
        })
      ).map((v) => v.dataValues);

      return items.map((item) => ({
        id: item.id!.toString(),
        code: item.code,
        name: item.name,
        price: item.price,
        imagePath: item.imagePath || undefined,
        type: item.type || undefined,
        variant: item.variant || undefined,
      }));
    } catch (error) {
      console.error("Failed to list items:", error);
      throw error;
    }
  },

  "item:get": async (event, data) => {
    try {
      const item = (await Item.findByPk(parseInt(data.id), { raw: true }))
        ?.dataValues;

      if (!item) {
        return null;
      }

      return {
        id: item.id!.toString(),
        code: item.code,
        name: item.name,
        price: item.price,
        imagePath: item.imagePath || undefined,
        type: item.type || undefined,
        variant: item.variant || undefined,
      };
    } catch (error) {
      console.error("❌ Failed to get item:", error);
      throw error;
    }
  },

  "item:update": async (event, data) => {
    try {
      const item = await Item.findByPk(parseInt(data.id));

      if (!item) {
        throw new Error("Item not found");
      }

      // Update only provided fields
      if (data.code !== undefined) item.set("code", data.code);
      if (data.name !== undefined) item.set("name", data.name);
      if (data.price !== undefined) item.set("price", data.price);
      if (data.imagePath !== undefined) item.set("imagePath", data.imagePath);
      if (data.type !== undefined) item.set("type", data.type);
      if (data.variant !== undefined) item.set("variant", data.variant);

      await item.save();

      const itemData = item.dataValues;

      return {
        id: itemData.id!.toString(),
        code: itemData.code,
        name: itemData.name,
        price: itemData.price,
        imagePath: itemData.imagePath || undefined,
        type: itemData.type || undefined,
        variant: itemData.variant || undefined,
        updatedAt: itemData.updatedAt!.toISOString(),
      };
    } catch (error) {
      console.error("Failed to update item:", error);
      throw error;
    }
  },

  "item:delete": async (event, data) => {
    try {
      const deletedCount = await Item.destroy({
        where: { id: parseInt(data.id) },
      });

      return { success: deletedCount > 0 };
    } catch (error) {
      console.error("Failed to delete item:", error);
      throw error;
    }
  },
};

export function registerHandlers() {
  Object.entries(handlers).forEach(([channel, handler]) => {
    ipcMain.handle(channel, handler as any);
  });
}

export function notifyAllWindows<K extends EventChannelName>(
  channel: K,
  data: EventChannels[K]
) {
  BrowserWindow.getAllWindows().forEach((win) => {
    sendToRenderer(win, channel, data);
  });
}
