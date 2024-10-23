const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

let win;

autoUpdater.checkForUpdatesAndNotify();

// Optional: Handle events for update events
autoUpdater.on("update-available", () => {
  alert(
    "Update Available - Installing updates, once completed the app will restart."
  );
});

autoUpdater.on("update-downloaded", () => {
  console.log("Update downloaded; will install now");
  autoUpdater.quitAndInstall();
});

function createWindow() {
  // Function to create new windows with the same properties
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    return {
      action: "allow",
      overrideBrowserWindowOptions: {
        width: 720,
        height: 900,
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
      },
    };
  });

  win.loadFile("index.html");

  win.on("closed", () => {
    win = null;
  });
}

// Listen for the show-popup event
ipcMain.handle(
  "show-popup",
  async (event, title, message, type = "warning") => {
    const result = await dialog.showMessageBox({
      type: type,
      buttons: ["Cancel", "Continue"],
      title: title || "Confirm Action",
      message: message || "Are you sure you want to continue?",
    });

    return result.response === 1; // returns true if "Continue", false if "Cancel"
  }
);

ipcMain.handle(
  "show-prompt",
  async (event, promptMessage = "Please enter something") => {
    return new Promise((resolve, reject) => {
      const promptWindow = new BrowserWindow({
        width: 500,
        height: 500,
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
        modal: true,
        parent: BrowserWindow.getFocusedWindow(),
      });

      promptWindow.loadFile(path.join(__dirname, "pages/prompt.html"));

      promptWindow.webContents.on("did-finish-load", () => {
        promptWindow.webContents.send("prompt-data", promptMessage);
      });

      ipcMain.once("input-received", (event, input) => {
        resolve(input);
      });

      promptWindow.on("closed", () => {
        resolve(null); // Handle window close without input
      });
    });
  }
);

ipcMain.on("show-alert", (event, title, message, type = "info") => {
  dialog.showMessageBox({
    type: type,
    title: title || "App",
    message: message,
    buttons: ["OK"],
  });
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
