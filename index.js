const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

let win;

// Set up autoUpdater
autoUpdater.on("update-available", () => {
  dialog
    .showMessageBox(win, {
      type: "info",
      title: "Update Available",
      message: "A new version is available. Do you want to download it?",
      buttons: ["Yes", "No"],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox(win, {
      type: "info",
      title: "Update Ready",
      message: "Update downloaded. It will be installed on quit. Restart now?",
      buttons: ["Restart", "Later"],
    })
    .then((result) => {
      if (result.response === 0) {
        // Restart button
        autoUpdater.quitAndInstall();
      }
    });
});

autoUpdater.on("error", (error) => {
  dialog.showErrorBox(
    "Update Error",
    error == null ? "unknown" : (error.stack || error).toString()
  );
});

autoUpdater.on("checking-for-update", () => {
  console.log("Checking for updates...");
});

autoUpdater.on("update-not-available", () => {
  console.log("No updates available.");
});

// Create the main application window
function createWindow() {
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

  ipcMain.on("open-file-browser", () => {
    const fileBrowserWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    fileBrowserWindow.loadURL("http://manage.mentorpreptests.in/files");
  });
  win.on("closed", () => {
    win = null;
  });
  // Start checking for updates
  autoUpdater.checkForUpdatesAndNotify();
}

// Handle IPC events for popups and prompts
ipcMain.handle(
  "show-popup",
  async (event, title, message, type = "warning") => {
    const result = await dialog.showMessageBox({
      type: type,
      buttons: ["Cancel", "Continue"],
      title: title || "Confirm Action",
      message: message || "Are you sure you want to continue?",
    });
    return result.response === 1; // Returns true if "Continue", false if "Cancel"
  }
);

ipcMain.handle(
  "show-prompt",
  async (event, promptMessage = "Please enter something") => {
    return new Promise((resolve) => {
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

// App lifecycle events
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
