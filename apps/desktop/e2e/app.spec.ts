import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { _electron as electron, expect, test, type ElectronApplication, type Page } from "@playwright/test";

type AppWindow = { api: { app: { version(): Promise<string> } } };

let app: ElectronApplication;
let page: Page;

test.beforeEach(async () => {
  // Le terminal de VS Code définit ELECTRON_RUN_AS_NODE=1, qui empêche Electron de démarrer.
  const env = { ...process.env };
  delete env.ELECTRON_RUN_AS_NODE;
  app = await electron.launch({
    // Lance le dossier de l'app (package.json → out/main/index.js) pour avoir sa vraie version.
    args: [join(__dirname, "..")],
    env: { ...env, FOREVERCARS_USER_DATA: mkdtempSync(join(tmpdir(), "fc-e2e-")) } as Record<string, string>,
  });
  page = await app.firstWindow();
  await page.waitForLoadState("domcontentloaded");
});

test.afterEach(async () => {
  await app.close();
});

test("la fenêtre s'ouvre avec le bon titre et le renderer est isolé", async () => {
  await expect(page).toHaveTitle("ForeverCars Back-Office");
  // Preuve de l'isolation : aucun accès Node dans le renderer.
  expect(await page.evaluate(() => typeof (window as unknown as { require?: unknown }).require)).toBe("undefined");
  expect(await page.evaluate(() => typeof (window as unknown as { process?: unknown }).process)).toBe("undefined");
  // Le pont typé fonctionne et ne renvoie que la version.
  expect(await page.evaluate(() => (window as unknown as AppWindow).api.app.version())).toBe("0.1.0");
  expect(Object.keys(await page.evaluate(() => (window as unknown as AppWindow).api))).toEqual(["app"]);
});

test("le parc affiche les 6 véhicules de démo", async () => {
  await expect(page.getByRole("heading", { name: "Le parc" })).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(6);
});

test("le vendeur ne voit ni marge ni suppression", async () => {
  await page.getByRole("radio", { name: "Vendeur" }).click();
  await expect(page.getByText("Marge moyenne (admin)")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Supprimer/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Équipe" })).toHaveCount(0);
});

test("mise en vente complète d'un véhicule", async () => {
  await page.getByRole("button", { name: "Mettre en vente" }).click();

  await page.getByLabel("Plaque d'immatriculation").fill("ab 123cd");
  await page.getByLabel("Marque").fill("Audi");
  await page.getByLabel("Modèle").fill("A3");
  await page.getByLabel("Kilométrage").fill("52000");
  await page.getByLabel("Puissance (ch)").fill("150");
  await page.getByRole("button", { name: "Continuer" }).click();
  await expect(page.getByLabel("Plaque d'immatriculation")).toHaveCount(0);

  await page.getByRole("button", { name: "Continuer" }).click();
  await expect(page.getByText("Ajoutez au moins une photo")).toBeVisible();
  await page.locator('input[type="file"][accept="image/*"]').setInputFiles(join(__dirname, "../src/renderer/src/assets/vw-golf-8.webp"));
  await expect(page.getByText("Couverture")).toBeVisible();
  await page.getByRole("button", { name: "Continuer" }).click();

  await page.getByLabel("Prix de vente (€)").fill("18990");
  await page.getByLabel("Description").fill("Très belle Audi A3, entretien à jour, deux clés.");
  await page.getByRole("button", { name: "Continuer" }).click();

  await expect(page.getByText("Aperçu sur forevercars.fr")).toBeVisible();
  await expect(page.getByText("AB-123-CD")).toBeVisible();
  await page.getByRole("button", { name: "Publier sur le site" }).click();

  await expect(page.getByRole("heading", { name: "Audi A3 est en ligne" })).toBeVisible();
  await page.getByRole("link", { name: "Retour au parc" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(7);
  await expect(page.getByText("Mis en ligne : Audi A3")).toBeVisible();
});
