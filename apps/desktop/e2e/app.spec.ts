import { expect, test, type ElectronApplication, type Page } from "@playwright/test";
import { launchApp } from "./launch";

type AppWindow = { api: { app: { version(): Promise<string> } } };

let app: ElectronApplication;
let page: Page;

test.beforeEach(async () => {
  ({ app, page } = await launchApp());
});

test.afterEach(async () => {
  await app.close();
});

test("la fenêtre s'ouvre avec le bon titre et le renderer est isolé", async () => {
  await expect(page).toHaveTitle("ForeverCars Back-Office");
  // Preuve de l'isolation : aucun accès Node dans le renderer.
  expect(await page.evaluate(() => typeof (window as unknown as { require?: unknown }).require)).toBe("undefined");
  expect(await page.evaluate(() => typeof (window as unknown as { process?: unknown }).process)).toBe("undefined");
  // Le pont typé fonctionne et n'expose que les familles d'appels prévues (rien d'Electron ni de Node).
  expect(await page.evaluate(() => (window as unknown as AppWindow).api.app.version())).toBe("0.1.0");
  expect(Object.keys(await page.evaluate(() => (window as unknown as AppWindow).api))).toEqual(["app", "auth", "team", "vehicles", "photos", "activity", "documents"]);
});

test("le parc affiche les 5 véhicules de démo récents ; la vente de plus de 7 jours est dans Vendus", async () => {
  await expect(page.getByRole("heading", { name: "Le parc" })).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(5);
  await expect(page.getByText(/^FC-\d{4}-0001$/)).toBeVisible();
  await page.getByRole("link", { name: /dans la page Vendus/ }).click();
  await expect(page.getByRole("heading", { name: "Vendus" })).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Mercedes-Benz GLA");
});

test("le vendeur ne voit ni marge ni suppression", async () => {
  await page.getByRole("radio", { name: "Vendeur" }).click();
  await expect(page.getByText("Marge moyenne (admin)")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Supprimer/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Équipe" })).toHaveCount(0);
});

test("un fichier lâché hors de la zone de dépôt ne remplace pas l'application", async () => {
  await page.evaluate(() => {
    const data = new DataTransfer();
    data.items.add(new File(["x"], "photo.jpg", { type: "image/jpeg" }));
    document.body.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: data }));
  });
  await expect(page.getByRole("heading", { name: "Le parc" })).toBeVisible();
  expect(page.url()).toContain("index.html");
});

test("les boutons affichent la main au survol", async () => {
  const cursor = await page.getByRole("button", { name: "Mettre en vente" }).evaluate((el) => getComputedStyle(el).cursor);
  expect(cursor).toBe("pointer");
});
