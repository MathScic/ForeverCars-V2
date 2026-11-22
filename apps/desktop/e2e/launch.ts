import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { _electron as electron, type ElectronApplication, type Page } from "@playwright/test";

/** Lance l'app construite dans un dossier de données neuf (n'écrase pas celles de l'utilisateur). */
export async function launchApp(): Promise<{ app: ElectronApplication; page: Page }> {
  // Le terminal de VS Code définit ELECTRON_RUN_AS_NODE=1, qui empêche Electron de démarrer.
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE;
  const app = await electron.launch({
    // Lance le dossier de l'app (package.json → out/main/index.js) pour avoir sa vraie version.
    args: [join(__dirname, "..")],
    env: { ...env, FOREVERCARS_USER_DATA: mkdtempSync(join(tmpdir(), "fc-e2e-")) } as Record<string, string>,
  });
  const page = await app.firstWindow();
  await page.waitForLoadState("domcontentloaded");
  return { app, page };
}

export const asset = (name: string) => join(__dirname, "../src/renderer/src/assets", name);

/** Simule le dépôt de fichiers (glisser-déposer depuis l'Explorateur) sur un élément. */
export async function dropFiles(page: Page, selector: string, names: string[]): Promise<void> {
  const files = await Promise.all(
    names.map(async (name) => ({ name, bytes: [...(await import("node:fs")).readFileSync(asset(name))] })),
  );
  await page.evaluate(
    ({ selector, files }) => {
      const data = new DataTransfer();
      for (const f of files) data.items.add(new File([new Uint8Array(f.bytes)], f.name, { type: "image/webp" }));
      const target = document.querySelector(selector)!;
      for (const type of ["dragenter", "dragover", "drop"]) {
        target.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: data }));
      }
    },
    { selector, files },
  );
}
