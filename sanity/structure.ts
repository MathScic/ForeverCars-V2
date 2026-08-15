import { ArchiveIcon, CheckmarkCircleIcon, ClockIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

/**
 * Sous-catégories du Studio, nichées sous "Véhicules" :
 * les véhicules sont regroupés par statut (Disponible / Réservé / Vendu),
 * chaque groupe trié de l'ajout le plus récent au plus ancien.
 */
const statusGroups = [
  { id: "vehicles-available", title: "Disponible", status: "available", icon: CheckmarkCircleIcon },
  { id: "vehicles-reserved", title: "Réservé", status: "reserved", icon: ClockIcon },
  { id: "vehicles-sold", title: "Vendu", status: "sold", icon: ArchiveIcon },
] as const;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("ForeverCars")
    .items([
      S.listItem()
        .id("vehicles")
        .title("Véhicules")
        .child(
          S.list()
            .id("vehicles-by-status")
            .title("Véhicules")
            .items(
              statusGroups.map(({ id, title, status, icon }) =>
                S.listItem()
                  .id(id)
                  .title(title)
                  .icon(icon)
                  .child(
                    S.documentList()
                      .id(id)
                      .title(title)
                      .schemaType("vehicle")
                      .filter('_type == "vehicle" && status == $status')
                      .params({ status })
                      .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                  )
              )
            )
        ),
    ]);
