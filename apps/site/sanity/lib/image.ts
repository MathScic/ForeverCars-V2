import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "../client";
import type { SanityImage } from "@/lib/types/vehicle";

const builder = createImageUrlBuilder(client);

export function urlForImage(source: SanityImage | null | undefined) {
  if (!source?.asset) return null;
  if (!source.asset._ref && !source.asset._id) return null;
  return builder.image(source).auto("format").fit("max");
}
