import { revalidateTag } from "next/cache";
import { env } from "@/lib/env";

// Mise à jour immédiate du site (plus besoin de F5) : la base appelle cette adresse dès qu'un véhicule
// ou une photo change (trigger + pg_net). La clé vient de Vault ; le site ne la connaît pas :
// il la fait vérifier par Supabase (fonction revalidate_key_ok). Sans clé valide : rien n'est vidé.
async function keyIsValid(key: string): Promise<boolean> {
  const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/revalidate_key_ok`, {
    method: "POST",
    headers: { apikey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ k: key }),
    cache: "no-store",
  });
  return res.ok && (await res.json()) === true;
}

export async function POST(request: Request) {
  const key = request.headers.get("x-revalidate-key") ?? "";
  if (key.length < 32 || !(await keyIsValid(key))) return Response.json({ ok: false }, { status: 401 });
  // Expiration immédiate : la prochaine visite reçoit déjà le stock à jour (pas une version d'avance).
  revalidateTag("vehicles", { expire: 0 });
  return Response.json({ ok: true });
}
