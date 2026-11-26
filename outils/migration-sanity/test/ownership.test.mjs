import { describe, expect, it } from "vitest";
import { isAppOwned, sanityScope } from "../../../supabase/functions/migration-sanity/ownership.mjs";

const sanity = (slug) => ({ slug, file_number: `FC-1-${slug}`, created_by: null, updated_by: null });
const existing = [
  sanity("golf"), // venu de Sanity, jamais touché dans l'app
  sanity("clio-vendue"), // venu de Sanity, retiré de Sanity depuis
  { ...sanity("208"), updated_by: "u1" }, // venu de Sanity, modifié dans l'app
  { ...sanity("x1-app"), created_by: "u1", updated_by: "u1" }, // créé dans l'app
];
const rows = [{ slug: "golf", price: 1 }, { slug: "208", price: 2 }, { slug: "nouveau", price: 3 }];

describe("isAppOwned", () => {
  it("vrai dès qu'un compte de l'équipe a créé ou modifié le véhicule", () => {
    expect(existing.map(isAppOwned)).toEqual([false, false, true, true]);
  });
});

describe("sanityScope", () => {
  const scope = sanityScope(existing, rows);

  it("n'écrit plus les fiches touchées dans l'app", () => {
    expect(scope.rows.map((r) => r.slug)).toEqual(["golf", "nouveau"]);
  });

  it("masque seulement les fiches Sanity retirées de Sanity, jamais celles de l'app", () => {
    expect(scope.gone).toEqual(["clio-vendue"]);
  });

  it("liste les fiches de l'app (leurs photos ne sont plus touchées)", () => {
    expect([...scope.owned].sort()).toEqual(["208", "x1-app"]);
  });
});
