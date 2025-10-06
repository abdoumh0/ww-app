import electron from "electron";
import { ChannelName, EventChannelName, InvokeFn, OnFn } from "./api-contract";

const ALLOWED_CHANNELS: ChannelName[] = ["purchase:create"];

const ALLOWED_EVENT_CHANNELS: EventChannelName[] = ["notification:new"];

const invoke: InvokeFn = (channel, data?) => {
  if (!ALLOWED_CHANNELS.includes(channel)) {
    return Promise.reject(new Error(`Channel "${channel} is not allowed"`));
  }
  return electron.ipcRenderer.invoke(channel, data);
};

const on: OnFn = (channel, callback) => {
  if (!ALLOWED_EVENT_CHANNELS.includes(channel)) {
    console.error(`Event channel "${channel}" is not allowed`);
    return () => {};
  }

  const subscription = (event: Electron.IpcRendererEvent, data: any) => {
    callback(data);
  };

  electron.ipcRenderer.on(channel, subscription);

  return () => {
    electron.ipcRenderer.removeListener(channel, subscription);
  };
};

electron.contextBridge.exposeInMainWorld("electronAPI", {
  invoke,
  on,
});
