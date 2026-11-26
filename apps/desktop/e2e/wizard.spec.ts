import { expect, test, type ElectronApplication, type Page } from "@playwright/test";
import { dropFiles, launchApp } from "./launch";

let app: ElectronApplication;
let page: Page;

test.beforeEach(async () => {
  ({ app, page } = await launchApp());
  await page.getByRole("button", { name: "Mettre en vente" }).click();
  await expect(page.getByRole("heading", { name: "Mettre un véhicule en vente" })).toBeVisible();
});

test.afterEach(async () => {
  await app.close();
});

async function fillIdentificationFromPlate() {
  await expect(page.getByLabel("N° de dossier")).toHaveValue(/^FC-\d{4}-0007$/);
  await page.getByLabel("Plaque d'immatriculation").fill("gh 218kt");
  await page.getByRole("button", { name: "Rechercher" }).click();
  await expect(page.getByText("Fiche pré-remplie")).toBeVisible();
  await expect(page.getByLabel("Marque")).toHaveValue("Toyota");
  await expect(page.getByLabel("Plaque d'immatriculation")).toHaveValue("GH-218-KT");
  await page.getByLabel("Kilométrage").fill("42500");
  await page.getByRole("button", { name: "Suivant" }).click();
}

test("mise en vente complète : plaque, glisser-déposer, équipements, description, publication", async () => {
  await fillIdentificationFromPlate();

  await page.getByRole("button", { name: "Suivant" }).click();
  await expect(page.getByText("Ajoutez au moins une photo")).toBeVisible();
  await dropFiles(page, '[data-testid="photo-dropzone"]', ["toyota-chr.webp", "vw-golf-8.webp"]);
  await expect(page.getByRole("list", { name: "2 photos" })).toBeVisible();
  await page.getByRole("button", { name: "Mettre vw-golf-8.webp en couverture" }).click();
  await page.getByRole("button", { name: "Suivant" }).click();

  // Prix et estimation
  await expect(page.getByText(/Estimation marché/)).toBeVisible();
  await page.getByRole("button", { name: /^Appliquer/ }).click();
  await expect(page.getByLabel("Prix de vente affiché (€)")).not.toHaveValue("");
  await page.getByLabel("Prix d'achat (€)").fill("14200");

  // Un clic sur un équipement réécrit la description
  const description = page.getByLabel("Description de l'annonce");
  await expect(description).toHaveValue(/Toyota Yaris Hybride 116h Iconic de 2022/);
  await page.getByRole("button", { name: "Caméra de recul" }).click();
  await page.getByRole("button", { name: "GPS intégré" }).click();
  await expect(description).toHaveValue(/Équipements : Caméra de recul, GPS intégré\./);
  await page.getByRole("switch", { name: /Exporter vers Leboncoin/ }).click();
  await page.getByRole("button", { name: "Suivant" }).click();

  // Aperçu, fiche vitrine, publication
  await expect(page.getByText("Fiche vitrine · A4 pare-brise")).toBeVisible();
  await expect(page.getByText("couverture : vw-golf-8.webp")).toBeVisible();
  await expect(page.getByText("Export préparé : Leboncoin")).toBeVisible();
  await expect(page.getByAltText(/QR code vers https:\/\/forevercars\.fr\/stock\/toyota-yaris/)).toBeVisible();
  await page.getByRole("button", { name: "Publier l'annonce" }).click();

  await expect(page.getByRole("heading", { name: "Toyota Yaris est en ligne" })).toBeVisible();
  await page.getByRole("link", { name: "Retour au parc" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(6);
});

test("une retouche manuelle de la description arrête la génération automatique", async () => {
  await fillIdentificationFromPlate();
  await dropFiles(page, '[data-testid="photo-dropzone"]', ["toyota-chr.webp"]);
  await page.getByRole("button", { name: "Suivant" }).click();

  const description = page.getByLabel("Description de l'annonce");
  await description.fill("Texte écrit à la main par le vendeur, à ne pas écraser.");
  await page.getByRole("button", { name: "Jantes alliage" }).click();
  await expect(description).toHaveValue("Texte écrit à la main par le vendeur, à ne pas écraser.");
  await page.getByRole("button", { name: "Générer avec l'IA" }).click();
  await expect(description).toHaveValue(/Équipements : Jantes alliage\./);
});

test("la fiche vitrine s'imprime sur une seule page A4", async () => {
  await fillIdentificationFromPlate();
  await dropFiles(page, '[data-testid="photo-dropzone"]', ["toyota-chr.webp"]);
  await page.getByRole("button", { name: "Suivant" }).click();
  await page.getByRole("button", { name: /^Appliquer/ }).click();
  await page.getByRole("button", { name: "Suivant" }).click();
  await expect(page.getByText("Fiche vitrine · A4 pare-brise")).toBeVisible();

  const pdf = await app.evaluate(async ({ BrowserWindow }) => {
    const buffer = await BrowserWindow.getAllWindows()[0]!.webContents.printToPDF({ pageSize: "A4", printBackground: true });
    return buffer.toString("latin1");
  });
  expect(pdf.startsWith("%PDF")).toBe(true);
  expect(pdf.match(/\/Type\s*\/Page[^s]/g)).toHaveLength(1);
});
