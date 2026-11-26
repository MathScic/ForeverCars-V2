import { app, clipboard, ipcMain, type IpcMainInvokeEvent } from "electron";
import { z } from "zod";
import { IPC_CHANNELS } from "../shared/api";
import {
  copySchema, credentialsSchema, docAddSchema, docSchema, idSchema, passwordSchema, photoAddSchema, photoOrderSchema, teamAccessSchema, teamInviteSchema, teamRoleSchema,
  vehicleActSchema, vehicleSchema,
} from "../shared/schemas";
import { listActivity } from "./activity";
import { changePassword, sessionProfile, signIn, signOut } from "./auth";
import { DEMO } from "./config";
import { addDocument, openDocument, removeDocument } from "./documents/service";
import type { DocId } from "../shared/documents";
import { actOnVehicle, claimVehicle, listVehicles, saveVehicle } from "./data/vehicles";
import { addPhoto, orderPhotos } from "./photos/service";
import { isAppUrl } from "./security";
import { inviteMember, listTeam, resetMemberPassword, setMemberAccess, setMemberRole } from "./team";

type Channel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];

/**
 * Enregistre un canal de la liste blanche : vérifie l'origine de l'appel
 * puis valide le payload avec Zod avant d'exécuter le handler.
 */
function handle<S extends z.ZodType>(
  channel: Channel,
  schema: S,
  fn: (payload: z.infer<S>) => unknown,
): void {
  ipcMain.handle(channel, (event: IpcMainInvokeEvent, raw: unknown) => {
    const origin = event.senderFrame?.url ?? "";
    if (!isAppUrl(origin)) throw new Error(`Appel IPC refusé depuis ${origin}`);
    return fn(schema.parse(raw));
  });
}

const none = z.undefined();

export function registerIpc(): void {
  handle(IPC_CHANNELS.appVersion, none, () => app.getVersion());
  handle(IPC_CHANNELS.appMode, none, () => (DEMO ? "demo" : "live"));
  // Le presse-papiers du navigateur intégré est bloqué (toutes les autorisations sont refusées) : on passe par Windows.
  handle(IPC_CHANNELS.appCopy, copySchema, ({ text }) => clipboard.writeText(text));
  handle(IPC_CHANNELS.authSession, none, () => sessionProfile());
  handle(IPC_CHANNELS.authSignIn, credentialsSchema, ({ email, password }) => signIn(email, password));
  handle(IPC_CHANNELS.authSignOut, none, () => signOut());
  handle(IPC_CHANNELS.authChangePassword, passwordSchema, ({ password }) => changePassword(password));
  handle(IPC_CHANNELS.teamList, none, () => listTeam());
  handle(IPC_CHANNELS.teamInvite, teamInviteSchema, ({ email, name, role }) => inviteMember(email, name, role));
  handle(IPC_CHANNELS.teamSetRole, teamRoleSchema, ({ id, role }) => setMemberRole(id, role));
  handle(IPC_CHANNELS.teamResetPassword, idSchema, ({ id }) => resetMemberPassword(id));
  handle(IPC_CHANNELS.teamSetAccess, teamAccessSchema, ({ id, enabled }) => setMemberAccess(id, enabled));
  handle(IPC_CHANNELS.vehiclesList, none, () => listVehicles());
  handle(IPC_CHANNELS.vehiclesClaim, idSchema, ({ id }) => claimVehicle(id));
  handle(IPC_CHANNELS.vehiclesSave, vehicleSchema, (vehicle) => saveVehicle(vehicle));
  handle(IPC_CHANNELS.vehiclesAct, vehicleActSchema, ({ id, act }) => actOnVehicle(id, act));
  handle(IPC_CHANNELS.photosAdd, photoAddSchema, ({ vehicleId, path }) => addPhoto(vehicleId, path));
  handle(IPC_CHANNELS.photosOrder, photoOrderSchema, ({ vehicleId, ids }) => orderPhotos(vehicleId, ids));
  handle(IPC_CHANNELS.activityList, none, () => listActivity());
  handle(IPC_CHANNELS.documentsAdd, docAddSchema, ({ vehicleId, docId, path }) => addDocument(vehicleId, docId as DocId, path));
  handle(IPC_CHANNELS.documentsRemove, docSchema, ({ vehicleId, docId }) => removeDocument(vehicleId, docId as DocId));
  handle(IPC_CHANNELS.documentsOpen, docSchema, ({ vehicleId, docId }) => openDocument(vehicleId, docId as DocId));
}
