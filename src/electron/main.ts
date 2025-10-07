import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { registerHandlers } from "./handlers.js";
import { closeDatabase, initDatabase, syncDatabase } from "./database.js";
import log from "electron-log";

log.transports.file.level = "info";
log.transports.console.level = "debug";

app.on("ready", async () => {
  try {
    initDatabase();
    await syncDatabase();
    log.info("Database ready");
  } catch (error) {
    log.error("Failed to initialize database:", error);
    app.quit();
    return;
  }

  registerHandlers();

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
});

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

app.on("before-quit", async () => {
  log.info("Closing database...");
  await closeDatabase();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
