import { describe, expect, it } from "vitest";
import type { Vehicle } from "../../../../shared/model";
import { ARCHIVE_AFTER_DAYS, isArchivedSale, splitParc } from "./archive";

const NOW = Date.parse("2026-11-26T12:00:00Z");
const day = (n: number) => new Date(NOW - n * 86_400_000).toISOString();
const v = (id: string, status: Vehicle["status"], soldAt?: string) => ({ id, status, soldAt }) as Vehicle;

describe("isArchivedSale", () => {
  it(`une vente de plus de ${ARCHIVE_AFTER_DAYS} jours quitte le parc`, () => {
    expect(isArchivedSale(v("a", "sold", day(8)), NOW)).toBe(true);
    expect(isArchivedSale(v("b", "sold", day(6)), NOW)).toBe(false);
  });
  it("seuls les véhicules vendus partent, jamais le stock", () => {
    expect(isArchivedSale(v("c", "online"), NOW)).toBe(false);
    expect(isArchivedSale(v("d", "reserved", day(40)), NOW)).toBe(false);
  });
  it("vendu sans date de vente : il reste au parc (à compléter)", () => {
    expect(isArchivedSale(v("e", "sold"), NOW)).toBe(false);
  });
});

describe("splitParc", () => {
  it("sépare le parc des ventes archivées, les plus récentes en premier", () => {
    const { parc, archived } = splitParc([v("1", "online"), v("2", "sold", day(30)), v("3", "sold", day(2)), v("4", "sold", day(10))], NOW);
    expect(parc.map((x) => x.id)).toEqual(["1", "3"]);
    expect(archived.map((x) => x.id)).toEqual(["4", "2"]);
  });
});
