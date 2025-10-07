import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import type {
  APIChannels,
  ChannelName,
  EventChannelName,
  EventChannels,
} from "./api-contract.js";
import { Purchase } from "./database.js";

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
