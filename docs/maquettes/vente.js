// Maquette : assistant de mise en vente du back-office (4 étapes), entièrement simulé.
document.getElementById("side").outerHTML = boSide("Mettre en vente");
document.getElementById("switch").outerHTML = mockSwitch("Mise en vente");

const STEPS = ["Identification", "Photos", "Prix & annonce", "Aperçu & publication"];
const EQUIPMENT = ["GPS intégré", "Caméra de recul", "Apple CarPlay / Android Auto", "Régulateur adaptatif", "Sièges chauffants", "Toit panoramique", "Jantes alliage", "Radars avant / arrière", "Climatisation automatique", "Accès mains libres"];
const YEAR = new Date().getFullYear();
const find = (re) => STOCK.find((v) => re.test(v.model)) ?? STOCK[0];
// Registre de démonstration (le vrai module SIV viendra plus tard)
const REGISTRY = {
  "GH-218-KT": { car: find(/GTI TCR/), color: "Noir Intense" },
  "FK-731-RB": { car: find(/TT 45/), color: "Bleu Turbo" },
};

const v = { fileNumber: `FC-${YEAR}-0045`, plate: "", brand: "", model: "", version: "", color: "", year: YEAR, mileage: 0, fuel: "essence", gearbox: "manuelle", power: 0, owners: 1, warranty: 12, photos: [], price: 0, purchase: "", repair: "", equipment: [], description: "", autoDesc: true, featured: false, lbc: false, lacentrale: false };
let step = 0;

// Mode modification : ?edit=<index> ouvre un véhicule EXISTANT, fiche déjà remplie.
const editIdx = new URLSearchParams(location.search).get("edit");
const editing = editIdx !== null && STOCK[Number(editIdx)];
if (editing) {
  const c = editing;
  Object.assign(v, {
    fileNumber: `FC-${YEAR}-${String(44 - Number(editIdx)).padStart(4, "0")}`,
    brand: cap(brandOf(c).toLowerCase()), model: title(c).split(" ").slice(1).join(" "),
    year: c.year, mileage: c.mileage, fuel: c.fuel, gearbox: c.transmission, power: c.power, price: c.price,
    photos: c.images.map((u, k) => ({ name: `photo-${k + 1}.jpg`, url: img(u, 900) })),
    equipment: [...(c.features || [])], description: (c.description || "").trim(), autoDesc: false, featured: !!c.isFeatured,
  });
}
const app = document.getElementById("app");
const $ = (sel) => app.querySelector(sel);

// ── Calculs (mêmes règles que l'ébauche desktop) ─────────────
function estimate() {
  if (!v.brand || !v.model || v.power <= 0) return null;
  const age = Math.max(0, YEAR - v.year);
  const premium = /audi|bmw|mercedes|porsche|volvo|lexus/i.test(v.brand) ? 1.3 : 1;
  const hybrid = /hybride|electrique/.test(v.fuel) ? 1.08 : 1;
  const km = Math.min(1.1, Math.max(0.7, 1 - ((v.mileage - Math.max(1, age) * 15000) / 10000) * 0.02));
  const val = (13000 + v.power * 120) * premium * hybrid * Math.pow(0.88, age) * km;
  const r = (n) => Math.round(n / 100) * 100;
  return { low: r(val * 0.965), high: r(val * 1.035), mid: r(val) };
}
const margin = () => v.price - (Number(v.purchase) || 0) - (Number(v.repair) || 0);
function describe() {
  const head = [v.brand, v.model, v.version].filter(Boolean).join(" ");
  let s = `${head} de ${v.year}, ${fmtKm(v.mileage)}. Motorisation ${v.fuel} de ${v.power} ch, boîte ${v.gearbox}${v.color ? `, teinte ${v.color}` : ""}.`;
  if (v.owners === 1) s += " Première main.";
  if (v.equipment.length) s += `\n\nÉquipements : ${v.equipment.join(", ")}.`;
  return `${s}\n\nVéhicule contrôlé et préparé par notre atelier${v.warranty ? `, vendu avec une garantie de ${v.warranty} mois` : ""}. Reprise de votre véhicule possible et financement sur demande. Venez l'essayer sur notre parc.`;
}

// ── IA réelle via le serveur local (Lancer-IA-test.cmd) ─────
// La clé API reste dans le serveur : la page n'envoie que la fiche du véhicule.
const IA_URL = "http://127.0.0.1:8787";
let iaOnline = false;
let iaTimer = null;
let iaCtrl = null;
let iaState = "local"; // local | attente | redaction | ia | erreur
let iaMessage = "";

fetch(`${IA_URL}/sante`, { signal: AbortSignal.timeout(1200) })
  .then((r) => (iaOnline = r.ok))
  .catch(() => (iaOnline = false))
  .finally(() => step === 2 && refreshPricing());

function iaStatus() {
  if (!iaOnline) return "Modèle local (le serveur IA n'est pas lancé : double-cliquez « Lancer-IA-test.cmd » pour tester la vraie IA).";
  return {
    local: "IA prête : cochez des équipements ou cliquez sur « Générer avec l'IA ».",
    attente: "Mise à jour par l'IA dans un instant…",
    redaction: "✦ L'IA rédige l'annonce…",
    ia: "✦ Rédigée par l'IA (Claude). Elle se réécrit quand vous cochez des équipements, tant que vous ne la modifiez pas à la main.",
    erreur: `IA indisponible : ${iaMessage} Le modèle local a pris le relais.`,
  }[iaState];
}

async function iaGenerate() {
  if (!iaOnline) return;
  iaCtrl?.abort();
  iaCtrl = new AbortController();
  iaState = "redaction";
  refreshPricing();
  const fiche = { brand: v.brand, model: v.model, version: v.version, year: v.year, mileage: v.mileage, fuel: v.fuel, gearbox: v.gearbox, power: v.power, color: v.color, owners: v.owners, warranty: v.warranty, equipment: v.equipment };
  try {
    const res = await fetch(`${IA_URL}/annonce`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vehicule: fiche }), signal: iaCtrl.signal });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erreur || `erreur ${res.status}`);
    if (!v.autoDesc) return; // retouchée à la main pendant la rédaction : on n'écrase pas
    v.description = data.texte;
    iaState = "ia";
  } catch (error) {
    if (error.name === "AbortError") return;
    iaState = "erreur";
    iaMessage = error.message;
  }
  if (step === 2) refreshPricing(true);
}

/** Après un changement de la fiche : réécriture par l'IA 1,2 s après le dernier clic. */
function iaSchedule() {
  if (!iaOnline || !v.autoDesc) return;
  clearTimeout(iaTimer);
  iaState = "attente";
  iaTimer = setTimeout(iaGenerate, 1200);
}

// ── Gabarits ─────────────────────────────────────────────────
const field = (label, name, attrs = "", type = "input") =>
  `<label class="field"><span>${label}</span>${type === "input" ? `<input name="${name}" value="${v[name] || ""}" ${attrs} />` : type}<span class="err" data-err="${name}"></span></label>`;
const select = (name, opts) => `<select name="${name}">${opts.map(([val, lab]) => `<option value="${val}" ${String(v[name]) === String(val) ? "selected" : ""}>${lab}</option>`).join("")}</select>`;
const sw = (key, title, sub) => `<button class="switch" role="switch" data-sw="${key}" aria-checked="${v[key]}"><span class="knob"></span><span><strong style="display:block;font-size:14px">${title}</strong><span class="hint">${sub}</span></span></button>`;

const views = [
  () => `
    <div class="g2">
      ${field("N° de dossier", "fileNumber", 'style="font-family:ui-monospace,monospace"')}
      <div class="lookup"><label class="field"><span>Pré-remplir avec la plaque (facultatif)</span><input name="plate" value="${v.plate}" placeholder="GH-218-KT" style="font-family:ui-monospace,monospace" /></label>
        <button class="btn btn-ghost" data-lookup style="background:none">Rechercher</button>
        <span class="hint" id="lookup-msg" style="grid-column:1/-1">Démo : essayez GH-218-KT ou FK-731-RB</span></div>
    </div>
    <div class="g3">
      ${field("Marque", "brand", 'placeholder="Volkswagen"')}${field("Modèle", "model", 'placeholder="Golf GTI"')}${field("Version / finition", "version")}
      ${field("Couleur", "color")}${field("Année", "year", 'type="number"')}${field("Kilométrage", "mileage", 'type="number" min="0"')}
      ${field("Énergie", "fuel", "", select("fuel", [["essence", "Essence"], ["diesel", "Diesel"], ["hybride", "Hybride"], ["electrique", "Électrique"]]))}
      ${field("Boîte", "gearbox", "", select("gearbox", [["manuelle", "Manuelle"], ["automatique", "Automatique"]]))}
      ${field("Puissance (ch)", "power", 'type="number" min="0"')}
      ${field("Propriétaires", "owners", "", select("owners", [[1, "Première main"], [2, "2 mains"], [3, "3 mains"]]))}
      ${field("Garantie", "warranty", "", select("warranty", [[0, "Sans garantie"], [6, "6 mois"], [12, "12 mois"], [24, "24 mois"]]))}
    </div>`,
  () => `
    <div class="drop" id="drop">
      <p class="h3" style="margin:0">Glissez les photos ou un dossier entier ici</p>
      <p class="hint">Triées par nom · la première devient la couverture · réordonnez en les faisant glisser</p>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:20px;flex-wrap:wrap">
        <label class="btn btn-primary" style="cursor:pointer">Choisir des photos<input type="file" accept="image/*" multiple hidden data-files /></label>
        <label class="btn btn-ghost" style="cursor:pointer">Choisir un dossier<input type="file" multiple webkitdirectory hidden data-files /></label>
        <button class="btn btn-ghost" data-qr style="background:none">📱 Depuis le téléphone</button>
      </div>
    </div>
    <span class="err" data-err="photos"></span>
    <ul class="thumbs" id="thumbs" style="margin:0;padding:0"></ul>`,
  () => `
    <div class="g2" style="align-items:start">
      <div style="display:grid;gap:16px">${field("Prix de vente affiché (€)", "price", 'type="number" min="0" style="font:600 26px/1 var(--font-display);font-stretch:112%"')}<div class="estimate" id="estimate"></div></div>
      <div class="internal"><span class="eyebrow">Données internes — jamais publiées</span>
        <div class="g2">${field("Prix d'achat (€)", "purchase", 'type="number" min="0" placeholder="ex. 24200"')}${field("Remise en état (€)", "repair", 'type="number" min="0" placeholder="ex. 450"')}</div>
        <div style="display:flex;justify-content:space-between;align-items:end;border-top:1px solid var(--line);padding-top:16px"><span class="muted">Marge prévisionnelle</span><strong id="margin" style="font:600 28px/1 var(--font-display);font-stretch:125%"></strong></div></div>
    </div>
    <div><span class="eyebrow">Équipements — un clic, la description se met à jour</span>
      <div class="chips" style="margin-top:16px">${[...EQUIPMENT, ...v.equipment.filter((e) => !EQUIPMENT.includes(e))].map((e) => `<button data-eq="${e}" aria-pressed="${v.equipment.includes(e)}">${e}</button>`).join("")}</div></div>
    <div><div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:10px"><span class="eyebrow">Description de l'annonce</span><button class="btn btn-ghost" data-gen style="background:none;--h:44px">✦ Générer avec l'IA</button></div>
      <label class="field"><textarea name="description" rows="8"></textarea><span class="err" data-err="description"></span></label><span class="hint" id="desc-mode"></span></div>
    <div class="g3">${sw("featured", "Mettre en avant", "Coup de cœur en page d'accueil")}${sw("lbc", "Exporter vers Leboncoin", "Texte + photos prêts à publier")}${sw("lacentrale", "Exporter vers La Centrale", "Texte + photos prêts à publier")}</div>`,
  () => {
    const cover = v.photos[0]?.url;
    const checks = [[v.photos.length > 0, `${v.photos.length} photo(s), couverture : ${v.photos[0]?.name ?? "aucune"}`], [v.price > 0, `Prix affiché : ${fmtPrice(v.price)}`], [v.description.split(/\s+/).length >= 20, `Description : ${v.description.split(/\s+/).filter(Boolean).length} mots`], [v.equipment.length > 0, `${v.equipment.length} équipement(s)`], [true, v.featured ? "Mis en avant (coup de cœur)" : "Sans mise en avant"]];
    return `
    <div class="preview">
      <div style="display:grid;gap:24px">
        <div><span class="eyebrow">Aperçu sur forevercars.fr</span>
          <article class="card" style="max-width:380px;margin-top:16px"><div class="media">${cover ? `<img src="${cover}" alt="" />` : ""}<span class="tag tag-new">Nouveau</span></div>
            <div class="body"><h3 class="model">${v.brand} ${v.model}</h3><p class="specs" style="margin:0"><span>${v.year}</span><span>${fmtKm(v.mileage)}</span><span>${cap(v.fuel)}</span></p><div class="foot"><span class="price">${fmtPrice(v.price)}</span><span class="go">Voir la fiche →</span></div></div></article></div>
        <div class="panel" style="padding:24px"><span class="eyebrow">Prêt à publier</span><ul class="check" style="padding:0;margin:14px 0 20px">${checks.map(([ok, t]) => `<li class="${ok ? "" : "ko"}">${t}</li>`).join("")}</ul>
          <button class="btn btn-primary" data-publish style="width:100%;justify-content:space-between;border:0">${editing ? "Mettre à jour l'annonce" : "Publier l'annonce"} <span class="arrow">→</span></button></div>
      </div>
      <div><span class="eyebrow">Fiche vitrine · A4 pare-brise</span>
        <div class="sheet-a4" style="margin-top:16px"><div class="band"><img src="${LOGO}" alt="ForeverCars" style="height:30px" /><span style="color:#9a9aa2;font-family:ui-monospace,monospace;font-size:9px">${v.fileNumber}</span></div>
          <div class="in"><strong style="font:600 20px/1.1 var(--font-display);font-stretch:125%;text-transform:uppercase">${v.brand} ${v.model}</strong><span style="color:#666">${v.version}</span>
            <strong style="font:650 34px/1 var(--font-display);font-stretch:112%">${fmtPrice(v.price)}</strong>
            <span><b>Année</b> ${v.year} · <b>Km</b> ${fmtKm(v.mileage)} · <b>Boîte</b> ${cap(v.gearbox)}</span>
            <span style="display:grid;gap:2px">${v.equipment.slice(0, 7).map((e) => `<span><b style="color:#ff8c42">+</b> ${e}</span>`).join("")}</span></div>
          <div style="display:flex;gap:10px;align-items:center;padding:14px 22px;border-top:1px solid #eee"><div class="qr" style="width:64px;height:64px;padding:0;margin:0" data-qrmini></div><span style="font-size:9px">Scannez pour voir toutes les photos et réserver un essai</span></div></div>
        <button class="btn btn-ghost" onclick="window.print()" style="background:none;width:100%;justify-content:center;margin-top:12px">Imprimer la fiche</button></div>
    </div>`;
  },
];

// ── QR décoratif (le vrai QR sera généré par l'app) ─────────
function drawQr(el) {
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const finder = (r, c) => [[0, 0], [0, 14], [14, 0]].some(([y, x]) => r >= y && r < y + 7 && c >= x && c < x + 7 && (r === y || r === y + 6 || c === x || c === x + 6 || (r > y + 1 && r < y + 5 && c > x + 1 && c < x + 5)));
  const inFinder = (r, c) => [[0, 0], [0, 14], [14, 0]].some(([y, x]) => r >= y && r < y + 7 && c >= x && c < x + 7);
  el.innerHTML = Array.from({ length: 441 }, (_, k) => { const r = Math.floor(k / 21), c = k % 21; const on = inFinder(r, c) ? finder(r, c) : rnd() > 0.52; return `<i style="background:${on ? "#0a0a0b" : "#fff"}"></i>`; }).join("");
}

// ── Rendu et interactions ────────────────────────────────────
function render() {
  app.innerHTML = `
    <span class="eyebrow">Dossier ${v.fileNumber}</span>
    <h1 class="h2" style="margin-top:16px">${editing ? `Modifier : ${v.brand} ${v.model}` : "Mettre un véhicule en vente"}</h1>
    <p class="muted" style="margin:10px 0 0">Brouillon enregistré à chaque étape : rien ne se perd si vous fermez l'application.</p>
    <div class="stepper">${STEPS.map((s, k) => `<button ${k < step ? "" : "disabled"} data-goto="${k}" class="${k < step ? "done" : k === step ? "now" : ""}"><span class="bar"></span><span class="lbl">0${k + 1} · ${s}</span></button>`).join("")}</div>
    <section class="panel"><div class="step on">${views[step]()}</div></section>
    <div class="footer-bar"><button class="btn btn-ghost" data-back style="background:none">← ${step === 0 ? "Retour au parc" : "Précédent"}</button>${step < 3 ? '<button class="btn btn-primary" data-next style="border:0">Suivant <span class="arrow">→</span></button>' : ""}</div>`;
  if (step === 1) drawThumbs();
  if (step === 2) (v.autoDesc && !v.description ? descriptionChanged() : refreshPricing());
  app.querySelectorAll("[data-qrmini]").forEach(drawQr);
  scrollTo({ top: 0 });
}

function refreshPricing() {
  if (step !== 2 || !$("#estimate")) return; // l'IA peut répondre après un changement d'étape
  const e = estimate();
  $("#estimate").innerHTML = e
    ? `<span class="eyebrow" style="color:var(--orange)">Estimation marché (simulation)</span><strong style="font:600 20px/1 var(--font-display);font-stretch:112%">${fmtPrice(e.low)} – ${fmtPrice(e.high)}</strong><button class="btn btn-ghost" data-apply style="background:none;--h:42px;justify-self:start">Appliquer ${fmtPrice(e.mid)}</button>`
    : '<span class="hint">Complétez marque, modèle et puissance pour estimer.</span>';
  const m = margin();
  $("#margin").textContent = fmtPrice(m);
  $("#margin").style.color = m < 0 ? "var(--danger)" : "var(--success)";
  const area = $('textarea[name="description"]');
  if (area.value !== v.description) area.value = v.description;
  area.setAttribute("aria-busy", iaState === "redaction");
  $("#desc-mode").textContent = v.autoDesc ? iaStatus() : "Modifiée à la main : elle n'est plus réécrite. « Générer avec l'IA » pour repartir de la fiche.";
}

/** La fiche a changé : brouillon local immédiat, puis réécriture par l'IA si elle est disponible. */
function descriptionChanged() {
  if (!v.autoDesc) return;
  v.description = describe();
  iaSchedule();
  refreshPricing();
}

function drawThumbs() {
  $("#thumbs").innerHTML = v.photos.map((p, k) => `<li draggable="true" data-k="${k}" class="${k === 0 ? "cover" : ""}"><img src="${p.url}" alt="${p.name}" />${k === 0 ? '<span class="tag tag-new">Couverture</span>' : ""}<button class="x" data-rm="${k}" aria-label="Retirer ${p.name}">✕</button></li>`).join("");
}
const addFiles = (files) => {
  [...files].filter((f) => f.type.startsWith("image/")).sort((a, b) => a.name.localeCompare(b.name, "fr", { numeric: true }))
    .forEach((f) => v.photos.push({ name: f.name, url: URL.createObjectURL(f) }));
  drawThumbs();
};

function validate() {
  const e = {};
  if (step === 0) { if (!v.brand) e.brand = "La marque est obligatoire"; if (!v.model) e.model = "Le modèle est obligatoire"; if (!(v.power > 0)) e.power = "Indiquez la puissance"; }
  if (step === 1 && !v.photos.length) e.photos = "Ajoutez au moins une photo";
  if (step === 2) { if (!(v.price > 0)) e.price = "Indiquez un prix de vente"; if (v.description.trim().length < 20) e.description = "20 caractères minimum"; }
  app.querySelectorAll("[data-err]").forEach((el) => (el.textContent = e[el.dataset.err] ?? ""));
  return !Object.keys(e).length;
}

app.addEventListener("input", (e) => {
  const { name, value, type } = e.target;
  if (!name) return;
  v[name] = type === "number" || ["owners", "warranty"].includes(name) ? Number(value) : value;
  if (name === "description") v.autoDesc = false;
  if (step === 2) refreshPricing();
  if (step === 0 && ["brand", "model", "version", "year", "mileage", "power", "color", "owners", "warranty", "fuel", "gearbox"].includes(name) && v.autoDesc) v.description = "";
});
app.addEventListener("change", (e) => e.target.matches("[data-files]") && addFiles(e.target.files));

app.addEventListener("click", (e) => {
  const t = e.target.closest("button, [data-goto]"); if (!t) return;
  if (t.matches("[data-next]") && validate()) (clearTimeout(iaTimer), step++, render());
  if (t.matches("[data-back]")) step === 0 ? (location.href = "backoffice.html") : (step--, render());
  if (t.matches("[data-goto]") && !t.disabled) (step = Number(t.dataset.goto), render());
  if (t.matches("[data-lookup]")) {
    const hit = REGISTRY[v.plate.trim().toUpperCase()];
    const msg = $("#lookup-msg");
    if (!hit) return (msg.textContent = "Plaque inconnue : complétez la fiche à la main.", (msg.style.color = "var(--orange)"));
    const c = hit.car;
    Object.assign(v, { plate: v.plate.toUpperCase(), brand: cap(c.brand.toLowerCase()), model: c.model, year: c.year, mileage: c.mileage, fuel: c.fuel, gearbox: c.transmission, power: c.power, color: hit.color });
    render(); $("#lookup-msg").textContent = "Fiche pré-remplie : vérifiez les champs."; $("#lookup-msg").style.color = "var(--success)";
  }
  if (t.matches("[data-rm]")) (v.photos.splice(Number(t.dataset.rm), 1), drawThumbs());
  if (t.matches("[data-qr]")) (drawQr(document.getElementById("qr")), document.getElementById("qr-modal").classList.add("on"));
  if (t.matches("[data-apply]")) ((v.price = estimate().mid), ($('input[name="price"]').value = v.price), refreshPricing());
  if (t.matches("[data-eq]")) { const k = t.dataset.eq; v.equipment = v.equipment.includes(k) ? v.equipment.filter((x) => x !== k) : [...v.equipment, k]; t.setAttribute("aria-pressed", v.equipment.includes(k)); descriptionChanged(); }
  if (t.matches("[data-gen]")) { v.autoDesc = true; v.description = describe(); clearTimeout(iaTimer); iaOnline ? iaGenerate() : refreshPricing(); }
  if (t.matches("[data-sw]")) ((v[t.dataset.sw] = !v[t.dataset.sw]), t.setAttribute("aria-checked", v[t.dataset.sw]));
  if (t.matches("[data-publish]")) {
    if (!editing) try { localStorage.setItem("maquette-vente", JSON.stringify({ ...v, photos: [], cover: STOCK.find((s) => s.model === v.model)?.images[0] ?? null, at: Date.now() })); } catch {}
    app.innerHTML = `<div class="success"><span style="font-size:56px;color:var(--success)">✓</span><h1 class="h2">${v.brand} ${v.model} ${editing ? "est à jour" : "est en ligne"}</h1><p class="muted">Simulation : dans la version finale, l'annonce apparaît sur forevercars.fr en moins d'une minute.</p><a class="btn btn-primary" href="backoffice.html">Retour au parc <span class="arrow">→</span></a></div>`;
  }
});

// Glisser-déposer : fichiers sur la zone, réordonnancement des miniatures
let dragK = null;
app.addEventListener("dragstart", (e) => { const li = e.target.closest("[data-k]"); if (li) dragK = Number(li.dataset.k); });
app.addEventListener("dragover", (e) => {
  e.preventDefault();
  $("#drop")?.classList.toggle("over", dragK === null && !!e.target.closest("#drop, #thumbs"));
  app.querySelectorAll("[data-k]").forEach((li) => li.classList.toggle("target", dragK !== null && li === e.target.closest("[data-k]")));
});
app.addEventListener("drop", (e) => {
  e.preventDefault();
  $("#drop")?.classList.remove("over");
  const li = e.target.closest("[data-k]");
  if (dragK !== null && li) { const [p] = v.photos.splice(dragK, 1); v.photos.splice(Number(li.dataset.k), 0, p); drawThumbs(); }
  else if (dragK === null && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  dragK = null;
});
addEventListener("dragover", (e) => e.preventDefault());
addEventListener("drop", (e) => e.preventDefault());

// QR code : simulation de réception des photos du téléphone
const modal = document.getElementById("qr-modal");
document.getElementById("qr-close").onclick = () => modal.classList.remove("on");
// Simulation : chaque photo prise sur le téléphone arrive dans le dossier, sans limite.
// Le réservoir réutilise toutes les photos du stock pour la démonstration.
const POOL = STOCK.flatMap((car) => car.images);
let received = 0;
const receive = (n) => {
  for (let k = 0; k < n; k++) {
    received += 1;
    v.photos.push({ name: `telephone-${String(received).padStart(2, "0")}.jpg`, url: img(POOL[(received - 1) % POOL.length], 900) });
  }
  document.getElementById("qr-count").textContent = received;
  drawThumbs();
};
document.getElementById("qr-one").onclick = () => receive(1);
document.getElementById("qr-burst").onclick = () => receive(6);
document.getElementById("qr-done").onclick = () => modal.classList.remove("on");
render();
