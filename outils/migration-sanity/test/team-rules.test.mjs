import { describe, expect, it } from "vitest";
import { accessError, inviteError, roleError, temporaryPassword } from "../../../supabase/functions/team/rules.mjs";

const admin = { id: "a", role: "admin", disabled: false };
const admin2 = { id: "b", role: "admin", disabled: false };
const seller = { id: "s", role: "seller", disabled: false };

describe("temporaryPassword", () => {
  it("format lisible à dicter, sans caractères ambigus (0/O, 1/l/I)", () => {
    const p = temporaryPassword(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 255]));
    expect(p).toMatch(/^Fc-[A-Za-z2-9]{4}-[A-Za-z2-9]{4}-[A-Za-z2-9]{4}$/);
    expect(p).not.toMatch(/[01OlI]/);
  });
});

describe("inviteError", () => {
  it("accepte une invitation complète", () => expect(inviteError({ email: "jean@forevercars.fr", name: "Jean", role: "seller" })).toBeNull());
  it("refuse un e-mail invalide, un nom vide, un rôle inconnu", () => {
    expect(inviteError({ email: "jean", name: "Jean", role: "seller" })).toBe("Adresse e-mail invalide.");
    expect(inviteError({ email: "jean@x.fr", name: " ", role: "seller" })).toBe("Indiquez le prénom et le nom.");
    expect(inviteError({ email: "jean@x.fr", name: "Jean", role: "boss" })).toBe("Rôle inconnu.");
  });
});

describe("roleError", () => {
  it("on garde toujours au moins un admin actif", () => {
    expect(roleError([admin, seller], "a", "seller")).toBe("Il faut garder au moins un admin.");
    expect(roleError([admin, admin2, seller], "a", "seller")).toBeNull();
    expect(roleError([admin, seller], "s", "admin")).toBeNull();
  });
});

describe("accessError", () => {
  it("on ne retire ni son propre accès ni celui du dernier admin", () => {
    expect(accessError([admin, seller], "a", "a")).toBe("Vous ne pouvez pas retirer votre propre accès.");
    expect(accessError([admin, { ...admin2, disabled: true }, seller], "s", "a")).toBe("Il faut garder au moins un admin.");
    expect(accessError([admin, admin2], "a", "b")).toBeNull();
    expect(accessError([admin, seller], "a", "s")).toBeNull();
  });
});
