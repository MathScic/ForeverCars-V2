import { describe, expect, it } from "vitest";
import { checkDocumentPath, DOC_MAX_BYTES } from "./paths";

const file = (size = 500_000) => () => ({ isFile: () => true, size });

describe("checkDocumentPath", () => {
  it("accepte un PDF ou un scan local, et donne son type", () => {
    expect(checkDocumentPath("C:\\Dossiers\\carte-grise.PDF", file())).toEqual({ path: "C:\\Dossiers\\carte-grise.PDF", ext: ".pdf", mime: "application/pdf" });
    expect(checkDocumentPath("C:\\Scans\\ct.jpg", file()).mime).toBe("image/jpeg");
  });
  it("refuse un chemin vide, relatif ou réseau", () => {
    expect(() => checkDocumentPath("", file())).toThrow("Choisissez le fichier sur ce PC");
    expect(() => checkDocumentPath("\\\\nas\\cg.pdf", file())).toThrow("Copiez d'abord le fichier sur ce PC");
  });
  it("refuse ce qui n'est ni un PDF ni une image, et les fichiers trop lourds", () => {
    expect(() => checkDocumentPath("C:\\x\\contrat.docx", file())).toThrow("contrat.docx : format non accepté (PDF, JPEG, PNG, WebP ou HEIC).");
    expect(() => checkDocumentPath("C:\\x\\cg.pdf", file(DOC_MAX_BYTES + 1))).toThrow("cg.pdf : fichier trop lourd (20 Mo maximum).");
  });
});
