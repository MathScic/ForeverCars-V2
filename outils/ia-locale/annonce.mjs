// Rédaction d'une annonce de véhicule par Claude.
// Même logique que la future Edge Function Supabase : la clé API reste côté serveur, jamais dans l'app.
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

/** Fiche reçue de l'app (ou de la maquette). Validée avant tout appel. */
export const Vehicule = z.object({
  brand: z.string().trim().min(1).max(60),
  model: z.string().trim().min(1).max(120),
  version: z.string().trim().max(120).default(""),
  year: z.number().int().min(1950).max(2100),
  mileage: z.number().int().min(0).max(2_000_000),
  fuel: z.enum(["essence", "diesel", "hybride", "electrique"]),
  gearbox: z.enum(["manuelle", "automatique"]),
  power: z.number().int().min(0).max(2000),
  color: z.string().trim().max(60).default(""),
  owners: z.number().int().min(1).max(20).default(1),
  warranty: z.number().int().min(0).max(120).default(0),
  equipment: z.array(z.string().trim().min(1).max(80)).max(40).default([]),
});

const SYSTEM = `Tu rédiges les annonces de ForeverCars, garage d'achat et revente de véhicules d'occasion à Marigny-les-Usages (Loiret).

Ton : celui du site, direct et chaleureux, au vouvoiement, phrases courtes, vocabulaire simple et concret. Pas de superlatifs creux, pas d'emoji, pas de markdown, pas de titre.

Règles :
- N'utilise QUE les informations de la fiche fournie. N'invente ni historique, ni entretien, ni option, ni état.
- 70 à 120 mots, en 2 ou 3 paragraphes séparés par une ligne vide.
- 1er paragraphe : le véhicule (marque, modèle, version, année, kilométrage, motorisation, boîte, couleur si connue, « première main » si un seul propriétaire).
- 2e paragraphe : les équipements fournis, présentés pour ce qu'ils apportent au quotidien, sans en ajouter.
- Termine par une phrase sur ce que propose ForeverCars : véhicule contrôlé et préparé par l'atelier, la garantie si elle est indiquée, reprise et financement possibles sur demande, invitation à venir l'essayer.
- Réponds uniquement avec le texte de l'annonce.`;

// Créé au premier appel : le serveur démarre même sans clé et renvoie une erreur claire.
let client;
const getClient = () => (client ??= new Anthropic()); // ANTHROPIC_API_KEY, ou un profil `ant auth login`

/** Rédige l'annonce. Lève une erreur lisible si Claude refuse ou si la réponse est vide. */
export async function rediger(vehicule) {
  const fiche = Vehicule.parse(vehicule);
  const response = await getClient().beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 4000,
    // Tâche courte et bien cadrée : effort bas = réponse rapide et peu coûteuse.
    output_config: { effort: "low" },
    system: SYSTEM,
    messages: [{ role: "user", content: `Fiche du véhicule (JSON) :\n${JSON.stringify(fiche, null, 2)}` }],
    // Repli automatique sur un autre modèle si un filtre de sécurité refuse par erreur.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });

  if (response.stop_reason === "refusal") throw new Error("La génération a été refusée. Rédigez l'annonce à la main.");
  const texte = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
  if (!texte) throw new Error("Réponse vide de l'IA.");
  return { texte, modele: response.model, usage: response.usage };
}
