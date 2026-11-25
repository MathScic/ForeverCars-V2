import { z } from "zod";

// Réglages du site. Sanity n'en fait plus partie : les données viennent de Supabase,
// et le Studio (/studio) a ses propres valeurs par défaut (sanity/env.ts).
const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
