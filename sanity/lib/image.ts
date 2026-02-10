import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "../client";
import type { SanityImage } from "@/lib/types/vehicle";

const builder = createImageUrlBuilder(client);

export function urlForImage(source: SanityImage) {
  return builder.image(source).auto("format").fit("max");
}
