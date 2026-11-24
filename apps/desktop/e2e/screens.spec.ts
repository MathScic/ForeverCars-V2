import { expect, test, type ElectronApplication, type Page } from "@playwright/test";
import { launchApp } from "./launch";

let app: ElectronApplication;
let page: Page;

test.beforeEach(async () => {
  ({ app, page } = await launchApp());
});

test.afterEach(async () => {
  await app.close();
});

test("réserver depuis le parc met à jour le badge et le compteur, puis remise en ligne", async () => {
  const row = page.locator("tbody tr", { hasText: "Peugeot 2008" });
  await row.getByRole("button", { name: "Réserver Peugeot 2008" }).click();
  await expect(row.getByText("Réservé", { exact: true })).toBeVisible();
  await expect(page.locator("dl div", { hasText: "Réservés" }).locator("dd")).toHaveText("1");
  await row.getByRole("button", { name: "Remettre Peugeot 2008 en ligne" }).click();
  await expect(row.getByText("En ligne", { exact: true })).toBeVisible();
});

test("documents : générer une pièce fait avancer le dossier", async () => {
  await page.getByRole("link", { name: "Documents" }).click();
  await expect(page.getByRole("heading", { name: "Dossiers administratifs" })).toBeVisible();
  await expect(page.getByText("0/7 pièces")).toBeVisible();
  await page.locator("li", { hasText: "Bon de commande" }).getByRole("button", { name: "Générer" }).click();
  await expect(page.getByText("1/7 pièces")).toBeVisible();
  await expect(page.locator("li", { hasText: "Bon de commande" }).getByText("Généré")).toBeVisible();
});

test("statistiques : la marge n'apparaît que pour l'admin", async () => {
  await page.getByRole("link", { name: "Statistiques" }).click();
  await expect(page.getByRole("heading", { name: "Les chiffres du garage" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Marge" })).toBeVisible();
  await page.getByRole("radio", { name: "Vendeur" }).click();
  await expect(page.getByRole("heading", { name: "Marge" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Équipe" })).toHaveCount(0);
});
