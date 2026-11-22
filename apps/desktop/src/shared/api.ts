// Contrat entre le renderer (window.api) et le preload. Aucune dépendance Electron ici.
export interface Api {
  app: {
    /** Version de l'application (package.json). */
    version(): Promise<string>;
  };
}

/** Liste blanche des canaux IPC. Tout autre canal est refusé. */
export const IPC_CHANNELS = {
  appVersion: "app:version",
} as const;
