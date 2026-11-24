// Étape 1 — Identification : 3 façons de remplir la fiche. Par la plaque (service payant, à choisir),
// par la carte grise (photo lue automatiquement), ou à la main. Il ne reste ensuite que le kilométrage.
const MODES = [["plate", "Par la plaque", "Fiche officielle (service payant à choisir)"], ["cg", "Carte grise", "Photo ou scan, lu automatiquement"], ["manual", "À la main", "Sans service extérieur"]];
const chipGroup = (key, values) =>
  values.map((v) => `<button type="button" class="pchip" data-pick="${key}" data-v="${v}" aria-pressed="${W[key] === v}">${v}</button>`).join("");

RENDER[1] = () => `
  <div class="modes" role="group" aria-label="Comment remplir la fiche ?">${MODES.map(([m, l, d]) => `<button type="button" class="mode" data-mode="${m}" aria-pressed="${W.mode === m}"><strong>${l}</strong><small>${d}</small></button>`).join("")}</div>
  ${W.mode === "plate" ? plateBox() : W.mode === "cg" ? cgBox() : ""}
  ${W.looking ? `<div class="w-note loading" role="status"><span class="spin"></span>${W.mode === "cg" ? "Lecture de la carte grise…" : "Interrogation du fichier des immatriculations…"}</div>` : ""}
  ${!W.looked && !W.looking && W.mode !== "manual" ? `<p class="w-note">${W.mode === "cg" ? "La photo de la carte grise suffit : les champs du véhicule sont lus et remplis. Le nom et l'adresse du propriétaire ne sont pas conservés." : "Saisissez la plaque : marque, modèle, finition, motorisation, couleur et Crit'Air se remplissent tout seuls. Il ne reste qu'à indiquer le kilométrage."}</p>` : ""}
  ${W.looked || W.mode === "manual" ? found() : ""}`;

const plateBox = () => `
  <div class="w-block">
    <label class="w-label" for="plate">Immatriculation</label>
    <div class="plate-row"><div class="plate"><span class="plate-eu" aria-hidden="true"><i>★</i>F</span><input id="plate" value="${W.plate}" placeholder="AB-123-CD" autocomplete="off" spellcheck="false" maxlength="9" /></div>
      <button class="btn btn-primary btn-lg" data-w="lookup">${ico("search")}Rechercher la fiche</button></div>
    <div class="demo-plates"><span class="muted">Plaques de démo :</span>${Object.entries(SIV).map(([p, d]) => `<button class="pchip mono" data-plate="${p}">${p} · ${d.brand} ${d.model}</button>`).join("")}</div>
  </div>`;

const cgBox = () => `
  <div class="drop" data-drop-cg>
    <span class="drop-icon">${ico("file")}</span><p class="drop-title">Glissez ici la photo ou le scan de la carte grise</p>
    <p class="muted">Une photo au téléphone suffit, même de travers.</p>
    <div class="drop-actions"><label class="btn btn-ghost">${ico("camera")}Choisir le fichier<input type="file" accept="image/*,application/pdf" data-cg class="sr" /></label><button class="btn btn-primary" data-w="cg-demo">Carte grise de démo</button></div>
  </div>`;

function found() {
  const head = W.edit ? "Fiche du véhicule (modifiable)" : W.mode === "manual" ? "" : W.mode === "cg" ? "Carte grise lue : 12 champs remplis automatiquement (à vérifier)" : "Fiche trouvée : 12 champs remplis automatiquement (modifiables)";
  return `
  ${head ? `<div class="w-found" role="status">${ico("checkCircle")}${head}</div>` : `<p class="w-note">Remplissez la fiche : marque, modèle et année suffisent pour continuer, le reste peut attendre.</p>`}
  <div class="fields">${W.mode === "manual" ? `<label class="field"><span>Immatriculation</span><input data-k="plate" value="${W.plate}" placeholder="AB-123-CD" /></label>` : ""}${FIELDS.map(([k, l], n) => `<label class="field" style="--n:${n}"><span>${l}${W.mode === "manual" && ["brand", "model", "year"].includes(k) ? " <em>obligatoire</em>" : ""}</span><input data-f="${k}" value="${W.f[k] ?? ""}" /></label>`).join("")}</div>
  <h2 class="w-h2">Informations du garage</h2>
  <div class="garage">
    <label class="field km"><span>Kilométrage <em>obligatoire</em></span><span class="suffix"><input id="km" inputmode="numeric" data-k="km" value="${fmtNum(num(W.km))}" placeholder="ex. 56 000" /><b>km</b></span></label>
    <div class="chip-field" role="group" aria-label="Nombre de propriétaires"><span>Propriétaires</span><div>${chipGroup("owners", ["1", "2", "3+"])}</div></div>
    <div class="chip-field" role="group" aria-label="Garantie"><span>Garantie</span><div>${chipGroup("warranty", ["3 mois", "6 mois", "12 mois", "24 mois"])}</div></div>
  </div>`;
}

/** Remplit la fiche depuis une source (plaque ou carte grise) après un petit temps de lecture. */
function fill(data, plate) {
  Object.assign(W, { looking: true, looked: false, photos: [], equip: [], desc: "", price: "", buy: "", repair: "", km: "" });
  renderStep();
  setTimeout(() => {
    W.f = Object.fromEntries(FIELDS.map(([k]) => [k, data[k]]));
    Object.assign(W, { looking: false, looked: true, siv: data, plate });
    renderStep("#km");
  }, W.mode === "cg" ? 1300 : 900);
}
function lookup(plate) {
  const p = fmtPlate(plate || W.plate);
  W.plate = p;
  if (!SIV[p]) return renderStep("#plate"), toast("Plaque inconnue dans la démo : essayez une des plaques proposées.");
  fill(SIV[p], p);
}
const readCard = () => fill(SIV["EZ-904-RL"], "EZ-904-RL"); // démo : n'importe quelle image donne la même carte grise
function setMode(m) {
  Object.assign(W, { mode: m, looked: false, looking: false, f: {}, siv: m === "manual" ? { stock: 12, est: null } : null });
  renderStep(m === "plate" ? "#plate" : m === "manual" ? "[data-f=brand]" : null);
}
