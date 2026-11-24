// État de l'assistant + cadre (en-tête, étapes, pied). Les étapes (step1…4.js) fournissent leur contenu.
const W = {
  step: 1, mode: "plate", edit: null, siv: null, plate: "", looking: false, looked: false, f: {}, km: "", owners: "1", warranty: "12 mois",
  photos: [], importing: false, price: "", buy: "", repair: "", equip: [], desc: "", aiLoading: false,
  featured: false, lbc: false, lc: false, publishing: false, pSteps: [], done: null,
};
const RENDER = {}; // RENDER[n] = () => html de l'étape n (rempli par step1.js … step4.js)

/** Ce qui manque pour passer à l'étape suivante ("" = rien ne manque). */
function missing(step = W.step) {
  if (step === 1) {
    if (W.mode === "manual") return ["brand", "model", "year"].some((k) => !(W.f[k] || "").trim()) ? "Marque, modèle et année" : !num(W.km) ? "Indiquez le kilométrage" : "";
    return !W.looked ? (W.mode === "cg" ? "Ajoutez la carte grise" : "Recherchez une plaque") : !num(W.km) ? "Indiquez le kilométrage" : "";
  }
  if (step === 2) return W.importing ? "Import en cours…" : !W.photos.length ? "Ajoutez les photos" : "";
  if (step === 3) return !num(W.price) ? "Indiquez le prix de vente" : !W.desc.trim() ? "Ajoutez une description" : "";
  return "";
}
const reachable = (n) => n <= 1 || [...Array(n - 1)].every((_, k) => !missing(k + 1));
const vTitle = () => `${W.f.brand || ""} ${W.f.model || ""}`.trim();

function chrome() {
  const s = W.done ? "" : vTitle() ? `${vTitle()}${W.plate ? ` · ${W.plate}` : ""} · étape ${W.step} sur 4` : `Étape ${W.step} sur 4`;
  document.getElementById("w-sub").textContent = s;
  document.getElementById("w-steps").innerHTML = STEPS.map((l, k) => {
    const n = k + 1, ok = n < W.step && !missing(n);
    return `<li><button data-go="${n}" ${n === W.step ? 'aria-current="step"' : ""} ${reachable(n) ? "" : "disabled"} class="${ok ? "ok" : ""}"><span class="n">${ok ? ico("check") : n}</span><span>${l}</span></button></li>`;
  }).join("");
  const miss = missing();
  document.getElementById("w-foot").innerHTML = W.done ? "" : `
    <div>${W.step > 1 ? `<button class="btn btn-ghost" data-w="prev">${ico("back")}Précédent</button>` : ""}</div>
    <div class="w-next"><span class="muted">${W.step < 4 ? miss || "Entrée pour continuer" : ""}</span>${W.step < 4 ? `<button class="btn btn-primary" data-w="next" ${miss ? "disabled" : ""}>Suivant ${ico("arrow", "go")}</button>` : ""}</div>`;
  document.getElementById("w-head").hidden = document.getElementById("w-steps").hidden = !!W.done;
}

function renderStep(focus) {
  const panel = document.getElementById("w-panel"), key = W.done ? "done" : W.step;
  panel.className = `w-panel soft ${W.done ? "success-panel" : ""} ${key !== renderStep.last ? "enter" : ""}`; // animation seulement au changement d'étape
  renderStep.last = key;
  panel.innerHTML = W.done ? RENDER.success() : RENDER[W.step]();
  chrome();
  if (focus) panel.querySelector(focus)?.focus();
}

function go(n) {
  if (n === W.step || !reachable(n)) return;
  W.step = n;
  renderStep({ 1: W.mode === "plate" ? "#plate" : "#km", 3: "#price" }[n]);
  scrollTo({ top: 0, behavior: "smooth" });
}

/** Le véhicule tel qu'il partira dans le parc ET sur le site (démo : relu par live.js côté site). */
function asFleet(status) {
  const cover = W.photos[0], gear = (W.f.gearbox || "").toLowerCase();
  return {
    id: `n${Date.now()}`, title: `${vTitle()} ${W.f.version || ""}`.trim(), year: W.f.year, km: num(W.km), price: num(W.price), photo: cover?.thumb || cover?.src || "", photos: W.photos.length,
    status, featured: W.featured, buy: num(W.buy), repair: num(W.repair), plate: W.plate, createdAt: new Date().toISOString(),
    brand: W.f.brand, model: W.f.model, images: W.photos.map((p) => p.thumb || p.src), fuel: (W.f.fuel || "").toLowerCase(),
    transmission: gear.startsWith("auto") ? "automatique" : gear ? "manuelle" : "", power: num(W.f.power), desc: W.desc, equip: W.equip,
  };
}

function saveDraft() {
  if (!vTitle()) return toast("Identifiez d'abord le véhicule pour créer la fiche.");
  const v = asFleet("draft");
  BO.set({ added: [v, ...BO.s.added] });
  addLog(`Brouillon enregistré : ${v.title}`);
  location.href = "backoffice.html";
}
