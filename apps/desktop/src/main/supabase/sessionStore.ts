// Stockage de la session Supabase : en mémoire uniquement. Rien n'est écrit sur le disque, donc
// on se reconnecte à chaque ouverture de l'app (demandé pour la sécurité du poste du garage).
import { rmSync } from "node:fs";
import { join } from "node:path";
import { app } from "electron";

const memory = new Map<string, string>();
let cleaned = false;

/** Ancienne version : la session était gardée chiffrée sur le disque. On efface ce fichier s'il existe. */
function removeOldSessionFile(): void {
  if (cleaned) return;
  cleaned = true;
  rmSync(join(app.getPath("userData"), "session.bin"), { force: true });
}

export const sessionStore = {
  getItem(key: string): string | null {
    removeOldSessionFile();
    return memory.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    memory.set(key, value);
  },
  removeItem(key: string): void {
    memory.delete(key);
  },
};
