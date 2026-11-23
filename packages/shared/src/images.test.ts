import { describe, expect, it } from "vitest";
import { keepCoverBlurOnly } from "./images";

const photo = (key: string) => ({
  _key: key,
  asset: { _id: `image-${key}`, url: `https://cdn/${key}.jpg`, metadata: { dimensions: { width: 1600, height: 1067 }, lqip: `data:${key}` } },
});

describe("keepCoverBlurOnly", () => {
  it("garde l'aperçu flou de la 1re photo et le retire des suivantes", () => {
    const [v] = keepCoverBlurOnly([{ images: [photo("a"), photo("b"), photo("c")] }]);
    expect(v.images.map((img) => img.asset.metadata.lqip)).toEqual(["data:a", undefined, undefined]);
  });

  it("ne touche à rien d'autre (clé, adresse, dimensions, autres champs)", () => {
    const [v] = keepCoverBlurOnly([{ brand: "AUDI", images: [photo("a"), photo("b")] }]);
    expect(v.brand).toBe("AUDI");
    expect(v.images[1]).toEqual({ _key: "b", asset: { _id: "image-b", url: "https://cdn/b.jpg", metadata: { dimensions: { width: 1600, height: 1067 } } } });
  });

  it("accepte les véhicules sans photo ou aux photos incomplètes", () => {
    const out = keepCoverBlurOnly([{ images: undefined }, { images: null }, { images: [photo("a"), { _key: "x" }, null] }]);
    expect(out[0].images).toBeUndefined();
    expect(out[1].images).toBeNull();
    expect(out[2].images?.[1]).toEqual({ _key: "x" });
    expect(out[2].images?.[2]).toBeNull();
  });

  it("ne modifie pas les données reçues", () => {
    const input = [{ images: [photo("a"), photo("b")] }];
    keepCoverBlurOnly(input);
    expect(input[0].images[1].asset.metadata.lqip).toBe("data:b");
  });
});
