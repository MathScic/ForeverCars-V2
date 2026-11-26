import { describe, expect, it } from "vitest";
import { eachLimit } from "./eachLimit";

describe("eachLimit", () => {
  it("traite tout, jamais plus de `limit` à la fois, index gardés", async () => {
    let running = 0;
    let peak = 0;
    const seen: number[] = [];
    await eachLimit([10, 11, 12, 13, 14, 15, 16], 3, async (item, i) => {
      running += 1;
      peak = Math.max(peak, running);
      await new Promise((r) => setTimeout(r, 5));
      seen[i] = item;
      running -= 1;
    });
    expect(peak).toBe(3);
    expect(seen).toEqual([10, 11, 12, 13, 14, 15, 16]);
  });

  it("liste vide : rien à faire", async () => {
    await expect(eachLimit([], 3, async () => undefined)).resolves.toBeUndefined();
  });
});
