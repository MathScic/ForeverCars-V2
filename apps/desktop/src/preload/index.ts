// Preload : pont minimal et typé, AUCUNE logique métier ici.
import { contextBridge, ipcRenderer } from "electron";
import { IPC_CHANNELS, type Api } from "../shared/api";

const api: Api = {
  app: {
    version: () => ipcRenderer.invoke(IPC_CHANNELS.appVersion),
  },
};

contextBridge.exposeInMainWorld("api", api);
