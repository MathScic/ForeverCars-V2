import { expect, it } from "vitest";
import { healthStatus } from "./health";

it("ne renvoie que { ok: true }", () => {
  expect(healthStatus()).toStrictEqual({ ok: true });
});
