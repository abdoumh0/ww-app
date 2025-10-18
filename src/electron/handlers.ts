import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import type {
  APIChannels,
  ChannelName,
  EventChannelName,
  EventChannels,
} from "./api-contract.js";
import { Item, ItemModel, Purchase } from "./database.js";
import { Op } from "sequelize";

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
      const items = JSON.stringify(data);
      const total = data.reduce((init, item) => {
        return init + item.qty * item.attributes.price;
      }, 0);
      const purchase = (await Purchase.create({ items, total })).dataValues;
      return purchase;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  "purchase:get": async (event, data) => {
    const history = (
      await Purchase.findAll({
        offset: data.skip,
        limit: data.get,
      })
    ).map((purchase) => purchase.dataValues);
    return history;
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

      return item.dataValues;
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
          limit: data.perPage,
          offset: data.skip,
        })
      ).map((v) => v.dataValues);

      return items;
    } catch (error) {
      console.error("Failed to list items:", error);
      throw error;
    }
  },

  "item:get_by_code": async (event, data) => {
    try {
      const item = (await Item.findOne({ where: { code: data.code } }))
        ?.dataValues;

      if (!item) {
        return null;
      }

      return item;
    } catch (error) {
      console.error("Failed to get item:", error);
      throw error;
    }
  },

  "item:update": async (event, data) => {
    try {
      const item = await Item.findByPk(data.id);

      if (!item) {
        throw new Error("Item not found");
      }

      if (data.code !== undefined) item.set("code", data.code);
      if (data.name !== undefined) item.set("name", data.name);
      if (data.price !== undefined) item.set("price", data.price);
      if (data.imagePath !== undefined) item.set("imagePath", data.imagePath);
      if (data.type !== undefined) item.set("type", data.type);
      if (data.variant !== undefined) item.set("variant", data.variant);

      await item.save();

      return item.dataValues;
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

  "item:get_by_name": async (event, data) => {
    const items = (
      await Item.findAll({
        where: {
          name: { [Op.substring]: data.name },
        },
      })
    ).map((res) => res.dataValues);
    return items;
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
