import { describe, expect, it } from "vitest";
import { checkPhotoPath, MAX_BYTES } from "./paths";

const file = (size = 3_000_000) => () => ({ isFile: () => true, size });

describe("checkPhotoPath", () => {
  it("accepte une photo locale", () => {
    expect(checkPhotoPath("C:\\Photos\\Golf\\IMG_0001.JPG", file())).toBe("C:\\Photos\\Golf\\IMG_0001.JPG");
  });
  it("refuse un chemin vide ou relatif (fichier fabriqué dans la page)", () => {
    expect(() => checkPhotoPath("", file())).toThrow("Glissez les photos depuis l'Explorateur Windows");
    expect(() => checkPhotoPath("photos\\a.jpg", file())).toThrow("Glissez les photos depuis l'Explorateur Windows");
  });
  it("refuse un partage réseau (\\\\serveur\\…)", () => {
    expect(() => checkPhotoPath("\\\\nas\\photos\\a.jpg", file())).toThrow("Copiez d'abord les photos sur ce PC");
  });
  it("refuse ce qui n'est pas une photo", () => {
    expect(() => checkPhotoPath("C:\\Docs\\facture.pdf", file())).toThrow("facture.pdf : ce n'est pas une photo");
  });
  it("refuse un dossier et un fichier trop lourd", () => {
    expect(() => checkPhotoPath("C:\\x.jpg", () => ({ isFile: () => false, size: 0 }))).toThrow("x.jpg : ce n'est pas une photo");
    expect(() => checkPhotoPath("C:\\x.jpg", file(MAX_BYTES + 1))).toThrow("x.jpg : fichier trop lourd (40 Mo maximum)");
  });
});
