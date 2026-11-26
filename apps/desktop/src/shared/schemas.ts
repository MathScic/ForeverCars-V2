// Validation des messages reçus par le process main (tout ce qui vient du renderer est vérifié).
import { z } from "zod";
import { DOC_IDS } from "./documents";

const money = z.number().min(0).max(10_000_000);
const text = (max: number) => z.string().max(max);

export const credentialsSchema = z.object({ email: z.email().max(200), password: z.string().min(1).max(200) });
export const idSchema = z.object({ id: z.guid() });
export const copySchema = z.object({ text: z.string().min(1).max(500) });
export const passwordSchema = z.object({ password: z.string().min(10).max(200) });

const role = z.enum(["admin", "seller"]);
export const teamInviteSchema = z.object({ email: z.email().max(200), name: z.string().trim().min(1).max(80), role });
export const teamRoleSchema = z.object({ id: z.guid(), role });
export const teamAccessSchema = z.object({ id: z.guid(), enabled: z.boolean() });

/** Champs d'une fiche que l'app peut écrire (le statut, lui, ne change que par vehicleActSchema). */
export const vehicleSchema = z.object({
  id: z.guid(),
  fileNumber: text(40),
  slug: text(200),
  plate: text(20),
  brand: z.string().trim().min(1).max(60),
  model: z.string().trim().min(1).max(80),
  version: text(120),
  year: z.number().int().min(1950).max(2100),
  fuel: z.enum(["essence", "diesel", "hybride", "electrique"]),
  gearbox: z.enum(["manuelle", "automatique"]),
  body: z.enum(["berline", "suv", "coupe", "break", "citadine", "utilitaire", "cabriolet", "monospace"]).nullable().optional(),
  powerHp: z.number().int().min(0).max(2000),
  mileage: z.number().int().min(0).max(2_000_000),
  color: text(60),
  owners: z.number().int().min(0).max(20),
  warrantyMonths: z.number().int().min(0).max(120),
  price: money,
  description: text(10_000),
  descriptionIsAuto: z.boolean(),
  equipment: z.array(text(120)).max(200),
  isFeatured: z.boolean(),
  purchasePrice: money.optional(),
  repairCost: money.optional(),
  publishedAt: z.string().nullable().optional(),
  revision: z.number().int().min(0).optional(),
});
export type VehicleInput = z.infer<typeof vehicleSchema>;

export const vehicleActSchema = z.object({
  id: z.guid(),
  act: z.enum(["publish", "markSold", "toggleReserved", "toggleFeatured", "unpublish", "remove"]),
});

export const photoAddSchema = z.object({ vehicleId: z.guid(), path: z.string().min(1).max(1000) });
export const photoOrderSchema = z.object({ vehicleId: z.guid(), ids: z.array(z.guid()).max(200) });

export const docSchema = z.object({ vehicleId: z.guid(), docId: z.enum(DOC_IDS as [string, ...string[]]) });
export const docAddSchema = docSchema.extend({ path: z.string().min(1).max(1000) });
