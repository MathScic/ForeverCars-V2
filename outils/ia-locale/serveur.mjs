// Serveur LOCAL de test : POST http://127.0.0.1:8787/annonce  { vehicule }  →  { texte }
// Écoute uniquement sur cette machine. À remplacer par une Edge Function Supabase en production.
import { createServer } from "node:http";
import Anthropic from "@anthropic-ai/sdk";
import { ZodError } from "zod";
import { rediger } from "./annonce.mjs";

const PORT = 8787;
// Origines autorisées : les maquettes ouvertes depuis le disque (« null ») et localhost.
const isAllowed = (origin) => !origin || origin === "null" || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
let busy = false;

function send(res, status, body, origin) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": origin ?? "null",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 20_000) reject(new Error("Requête trop volumineuse")), req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch {
        reject(new Error("JSON invalide"));
      }
    });
  });
}

const server = createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (!isAllowed(origin)) return send(res, 403, { erreur: "Origine non autorisée" }, "null");
  if (req.method === "OPTIONS") return send(res, 204, {}, origin);
  if (req.method === "GET" && req.url === "/sante") return send(res, 200, { ok: true }, origin);
  if (req.method !== "POST" || req.url !== "/annonce") return send(res, 404, { erreur: "Introuvable" }, origin);
  if (busy) return send(res, 429, { erreur: "Une rédaction est déjà en cours" }, origin);
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return send(res, 401, { erreur: "Aucune clé API : relancez Lancer-IA-test.cmd et collez votre clé." }, origin);
  }

  busy = true;
  const debut = Date.now();
  try {
    const { vehicule } = await readJson(req);
    const { texte, modele, usage } = await rediger(vehicule);
    console.log(`✓ Annonce rédigée par ${modele} en ${((Date.now() - debut) / 1000).toFixed(1)} s (${usage.input_tokens} → ${usage.output_tokens} jetons)`);
    send(res, 200, { texte, modele }, origin);
  } catch (error) {
    let status = 500;
    let message = "Erreur inattendue";
    if (error instanceof ZodError) (status = 400), (message = "Fiche incomplète : marque, modèle, année, kilométrage et puissance sont nécessaires.");
    else if (error instanceof Anthropic.AuthenticationError) (status = 401), (message = "Clé API invalide ou absente.");
    else if (error instanceof Anthropic.RateLimitError) (status = 429), (message = "Trop de demandes, réessayez dans un instant.");
    else if (error instanceof Anthropic.APIError) (status = 502), (message = `Erreur du service IA (${error.status}).`);
    else if (error instanceof Anthropic.AnthropicError) (status = 401), (message = "Aucune clé API : relancez Lancer-IA-test.cmd et collez votre clé.");
    else if (error instanceof Error) message = error.message;
    console.error(`✗ ${message}`);
    send(res, status, { erreur: message }, origin);
  } finally {
    busy = false;
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Serveur IA de test prêt sur http://127.0.0.1:${PORT}`);
  console.log("Laissez cette fenêtre ouverte, puis utilisez « Générer avec l'IA » dans la maquette du back-office.");
});
