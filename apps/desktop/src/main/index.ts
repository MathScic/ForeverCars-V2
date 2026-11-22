import { join } from "node:path";
import { app, BrowserWindow } from "electron";
import { registerIpc } from "./ipc";
import { denyAllPermissions, hardenWebContents } from "./security";

// Tests e2e : dossier de données isolé, pour ne pas toucher aux données de l'utilisateur.
if (process.env.FOREVERCARS_USER_DATA) app.setPath("userData", process.env.FOREVERCARS_USER_DATA);

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1100,
    minHeight: 700,
    show: false,
    title: "ForeverCars Back-Office",
    backgroundColor: "#0A0A0A",
    autoHideMenuBar: true,
    icon: join(__dirname, "../../resources/icon.png"),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true,
    },
  });

  hardenWebContents(win.webContents);
  win.once("ready-to-show", () => win.show());

  const devUrl = process.env.ELECTRON_RENDERER_URL;
  if (!app.isPackaged && devUrl) void win.loadURL(devUrl);
  else void win.loadFile(join(__dirname, "../renderer/index.html"));
}

void app.whenReady().then(() => {
  denyAllPermissions();
  registerIpc();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
