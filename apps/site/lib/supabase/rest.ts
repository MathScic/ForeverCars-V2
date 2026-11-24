// Lecture publique de Supabase par le site : clé publiable, droits « site » (véhicules visibles et leurs photos).
// Mis en cache 60 s et étiqueté « vehicles » : une publication depuis l'app apparaît en moins d'une minute.
import { env } from "@/lib/env";

export async function rest<T>(path: string): Promise<T> {
  const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY },
    next: { revalidate: 60, tags: ["vehicles"] },
  });
  if (!res.ok) throw new Error(`Supabase a répondu ${res.status} : ${await res.text()}`);
  return (await res.json()) as T;
}
