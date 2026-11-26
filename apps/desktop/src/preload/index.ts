// Preload : pont minimal et typé, AUCUNE logique métier ici.
import { contextBridge, ipcRenderer, webUtils } from "electron";
import { IPC_CHANNELS as C, type Api } from "../shared/api";

const api: Api = {
  app: {
    version: () => ipcRenderer.invoke(C.appVersion),
    mode: () => ipcRenderer.invoke(C.appMode),
    copy: (text) => ipcRenderer.invoke(C.appCopy, { text }),
  },
  auth: {
    session: () => ipcRenderer.invoke(C.authSession),
    signIn: (email, password) => ipcRenderer.invoke(C.authSignIn, { email, password }),
    signOut: () => ipcRenderer.invoke(C.authSignOut),
    changePassword: (password) => ipcRenderer.invoke(C.authChangePassword, { password }),
  },
  team: {
    list: () => ipcRenderer.invoke(C.teamList),
    invite: (email, name, role) => ipcRenderer.invoke(C.teamInvite, { email, name, role }),
    setRole: (id, role) => ipcRenderer.invoke(C.teamSetRole, { id, role }),
    resetPassword: (id) => ipcRenderer.invoke(C.teamResetPassword, { id }),
    setAccess: (id, enabled) => ipcRenderer.invoke(C.teamSetAccess, { id, enabled }),
  },
  vehicles: {
    list: () => ipcRenderer.invoke(C.vehiclesList),
    claim: (id) => ipcRenderer.invoke(C.vehiclesClaim, { id }),
    save: (vehicle) => ipcRenderer.invoke(C.vehiclesSave, vehicle),
    act: (id, act) => ipcRenderer.invoke(C.vehiclesAct, { id, act }),
  },
  photos: {
    // Le chemin du fichier lâché ou choisi ne passe jamais par la page : il va directement au process main.
    add: (vehicleId, file) => ipcRenderer.invoke(C.photosAdd, { vehicleId, path: webUtils.getPathForFile(file) }),
    order: (vehicleId, ids) => ipcRenderer.invoke(C.photosOrder, { vehicleId, ids }),
  },
  activity: {
    list: () => ipcRenderer.invoke(C.activityList),
  },
  documents: {
    add: (vehicleId, docId, file) => ipcRenderer.invoke(C.documentsAdd, { vehicleId, docId, path: webUtils.getPathForFile(file) }),
    remove: (vehicleId, docId) => ipcRenderer.invoke(C.documentsRemove, { vehicleId, docId }),
    open: (vehicleId, docId) => ipcRenderer.invoke(C.documentsOpen, { vehicleId, docId }),
  },
};

contextBridge.exposeInMainWorld("api", api);
