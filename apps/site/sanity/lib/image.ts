import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../env";
import type { SanityImage } from "@/lib/types/vehicle";

// projectId + dataset suffisent pour construire les URL : importer le client Sanity
// ici l'envoyait au navigateur (~30 Ko de JavaScript sur chaque page).
const builder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: SanityImage | null | undefined) {
  if (!source?.asset) return null;
  if (!source.asset._ref && !source.asset._id) return null;
  return builder.image(source).auto("format").fit("max");
}
