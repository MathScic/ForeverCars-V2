import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { session, shell, type WebContents } from "electron";

// Seuls ces domaines peuvent être ouverts dans le navigateur par défaut.
const EXTERNAL_HOSTS = new Set(["forevercars.fr", "www.forevercars.fr"]);

// Page de l'app une fois construite. Seul CE fichier est autorisé, pas tout file://
// (sinon une image lâchée dans la fenêtre remplacerait l'application).
const RENDERER_FILE = pathToFileURL(join(__dirname, "../renderer/index.html")).href;

// Windows ignore la casse des chemins : « file:///c:/… » et « file:///C:/… » désignent le même fichier.
const sameCase = (url: string) => (process.platform === "win32" ? url.toLowerCase() : url);

/** L'URL appartient-elle à l'application (serveur de dev ou page construite) ? */
export function isAppUrl(url: string): boolean {
  const devUrl = process.env.ELECTRON_RENDERER_URL;
  if (devUrl && url.startsWith(devUrl)) return true;
  const page = sameCase(url);
  const file = sameCase(RENDERER_FILE);
  return page === file || page.startsWith(`${file}#`);
}

function openExternalIfAllowed(url: string): void {
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol === "https:" && EXTERNAL_HOSTS.has(hostname)) void shell.openExternal(url);
  } catch {
    // URL invalide : ignorée
  }
}

/** Bloque navigation, nouvelles fenêtres et demandes de permission (caméra, micro…). */
export function hardenWebContents(contents: WebContents): void {
  contents.setWindowOpenHandler(({ url }) => {
    openExternalIfAllowed(url);
    return { action: "deny" };
  });
  contents.on("will-navigate", (event, url) => {
    if (isAppUrl(url)) return;
    event.preventDefault();
    openExternalIfAllowed(url);
  });
}

export function denyAllPermissions(): void {
  session.defaultSession.setPermissionRequestHandler((_wc, _perm, callback) => callback(false));
}
