import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { notifyAllWindows, registerHandlers } from "./handlers.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});

registerHandlers();

// const notificationInterval = setInterval(() => {
//   console.log("broadcasting a notification");
//   notifyAllWindows("notification:new", {
//     message: "Hello, World!",
//     title: "New Notification",
//     type: "TEST",
//   });
//   console.log("done");
// }, 500);

// app.on("before-quit", () => {
//   if (notificationInterval) {
//     clearInterval(notificationInterval);
//   }
// });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
