// Pièces du dossier d'un véhicule, dans l'espace PRIVÉ « vehicle-documents » (jamais visible du site).
// Une pièce par type : en remplacer une efface l'ancien fichier. Ouvrir = copie temporaire sur ce PC.
import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { app, shell } from "electron";
import { DOC_EXTENSIONS, DOC_TYPE_BY_ID, type DocId } from "../../shared/documents";
import type { Vehicle } from "../../shared/model";
import { logActivity } from "../activity";
import { getVehicle } from "../data/vehicles";
import { friendly } from "../errors";
import { db } from "../supabase/client";
import { checkDocumentPath } from "./paths";

const BUCKET = "vehicle-documents";

async function currentPath(vehicleId: string, docId: DocId): Promise<string | null> {
  const { data, error } = await db().from("vehicle_documents").select("storage_path")
    .eq("vehicle_id", vehicleId).eq("doc_type", DOC_TYPE_BY_ID[docId]).maybeSingle();
  if (error) throw friendly(error, "Dossier illisible");
  return data?.storage_path ?? null;
}

export async function addDocument(vehicleId: string, docId: DocId, rawPath: string): Promise<Vehicle> {
  const file = checkDocumentPath(rawPath);
  const previous = await currentPath(vehicleId, docId);
  const storagePath = `${vehicleId}/${DOC_TYPE_BY_ID[docId]}-${randomUUID()}${file.ext}`;
  const { error } = await db().storage.from(BUCKET).upload(storagePath, await readFile(file.path), { contentType: file.mime });
  if (error) throw friendly(error, "Pièce non envoyée");
  const row = { vehicle_id: vehicleId, doc_type: DOC_TYPE_BY_ID[docId], storage_path: storagePath };
  const { error: e2 } = await db().from("vehicle_documents").upsert(row, { onConflict: "vehicle_id,doc_type" });
  if (e2) {
    await db().storage.from(BUCKET).remove([storagePath]);
    throw friendly(e2, "Pièce non enregistrée");
  }
  if (previous) await db().storage.from(BUCKET).remove([previous]); // l'ancienne version est remplacée
  const vehicle = await getVehicle(vehicleId);
  await logActivity("document", vehicleId, `Dossier ${vehicle.brand} ${vehicle.model} : pièce ajoutée`);
  return vehicle;
}

export async function removeDocument(vehicleId: string, docId: DocId): Promise<Vehicle> {
  const path = await currentPath(vehicleId, docId);
  if (path) {
    const { error } = await db().from("vehicle_documents").delete().eq("vehicle_id", vehicleId).eq("doc_type", DOC_TYPE_BY_ID[docId]);
    if (error) throw friendly(error, "Pièce non retirée");
    await db().storage.from(BUCKET).remove([path]);
  }
  return getVehicle(vehicleId);
}

/** Copie la pièce dans un dossier temporaire de ce PC et l'ouvre avec l'application habituelle (lecteur PDF, photos). */
export async function openDocument(vehicleId: string, docId: DocId): Promise<void> {
  const path = await currentPath(vehicleId, docId);
  if (!path) throw new Error("Cette pièce n'est pas encore dans le dossier.");
  const ext = extname(path).toLowerCase();
  if (!DOC_EXTENSIONS[ext]) throw new Error("Format de fichier inattendu : ouverture refusée.");
  const { data, error } = await db().storage.from(BUCKET).download(path);
  if (error || !data) throw friendly(error, "Pièce introuvable");
  const dir = join(app.getPath("temp"), "ForeverCars-dossiers");
  mkdirSync(dir, { recursive: true });
  const local = join(dir, `${DOC_TYPE_BY_ID[docId]}-${vehicleId.slice(0, 8)}${ext}`);
  writeFileSync(local, Buffer.from(await data.arrayBuffer()));
  const failure = await shell.openPath(local);
  if (failure) throw new Error(`Impossible d'ouvrir la pièce : ${failure}`);
}
