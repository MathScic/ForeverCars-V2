import { app, ipcMain, type IpcMainInvokeEvent } from "electron";
import { z } from "zod";
import { IPC_CHANNELS } from "../shared/api";
import { isAppUrl } from "./security";

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

export function registerIpc(): void {
  handle(IPC_CHANNELS.appVersion, z.undefined(), () => app.getVersion());
}
