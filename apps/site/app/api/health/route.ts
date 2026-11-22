import { healthStatus } from "@forevercars/shared";

// Sonde de santé : renvoie uniquement { ok: true } (aucune variable d'environnement ni version).
export function GET() {
  return Response.json(healthStatus());
}
