import { expect, test, type ElectronApplication, type Page } from "@playwright/test";
import { launchApp } from "./launch";

let app: ElectronApplication;
let page: Page;

test.beforeEach(async () => {
  ({ app, page } = await launchApp());
  await expect(page.getByRole("heading", { name: "Le parc" })).toBeVisible();
});

test.afterEach(async () => {
  await app.close();
});

test("supprimer depuis le parc : confirmation, « Annuler » ne supprime rien", async () => {
  await page.getByRole("button", { name: "Supprimer Renault Clio 5" }).click();
  const dialog = page.getByRole("dialog", { name: "Supprimer Renault Clio 5 ?" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Annuler" })).toBeFocused();
  await dialog.getByRole("button", { name: "Annuler" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(5);

  await page.getByRole("button", { name: "Supprimer Renault Clio 5" }).click();
  await page.getByRole("button", { name: "Supprimer définitivement" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(4);
  await expect(page.locator("tbody").getByText("Renault Clio 5")).toHaveCount(0);
  await expect(page.getByText("Supprimé : Renault Clio 5")).toBeVisible(); // noté au journal
});

test("depuis la fiche : retirer du site garde le véhicule en brouillon", async () => {
  await page.getByRole("button", { name: "Modifier Peugeot 2008" }).click();
  await page.getByRole("button", { name: "Retirer du site" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Retirer du site" }).click();
  await expect(page.getByRole("heading", { name: "Le parc" })).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("Peugeot 2008 est retiré du site");
  await expect(page.locator("tbody tr", { hasText: "Peugeot 2008" })).toContainText("Brouillon");
});

test("depuis la fiche : supprimer (admin) le retire du parc", async () => {
  await page.getByRole("button", { name: "Modifier Peugeot 2008" }).click();
  await page.getByRole("button", { name: "Supprimer", exact: true }).click();
  await page.getByRole("button", { name: "Supprimer définitivement" }).click();
  await expect(page.getByRole("heading", { name: "Le parc" })).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(4);
});
