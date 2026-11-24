// Documents : les pièces de chaque véhicule (reçues ou manquantes) et les documents de vente générés pré-remplis.
(function () {
  const DOCS = [
    ["cg", "file", "Carte grise (certificat d'immatriculation)", "file"], ["ct", "clipboard", "Contrôle technique de moins de 6 mois", "file"],
    ["ng", "shield", "Certificat de situation administrative (non-gage)", "file"], ["fe", "wrench", "Factures d'entretien", "file"],
    ["bdc", "pencil", "Bon de commande", "gen"], ["ces", "handshake", "Déclaration de cession (Cerfa 15776)", "gen"], ["fac", "euro", "Facture de vente", "gen"],
  ];
  const fleet = FLEET.filter((v) => v.status !== "draft");
  const state = fleet.map((_, k) => Object.fromEntries(DOCS.map(([id, , , kind], j) => [id, kind === "file" ? (k + j) % 3 !== 0 : false])));
  let cur = 0;
  const done = (k) => DOCS.filter(([id]) => state[k][id]).length;
  const folder = (k) => `FC-2026-${String(fleet.length - k).padStart(4, "0")}`;

  function list() {
    const q = document.getElementById("dq").value.trim().toLowerCase();
    document.getElementById("dvs").innerHTML = fleet.map((v, k) => ({ v, k })).filter(({ v }) => !q || `${v.title} ${v.plate}`.toLowerCase().includes(q))
      .map(({ v, k }) => `<button class="dv" data-k="${k}" aria-current="${k === cur}"><img src="${img(v.photo, 120, 86)}" alt="" /><span style="min-width:0"><strong>${v.title}</strong><small>${folder(k)} · ${v.plate}</small></span><span class="count ${done(k) === DOCS.length ? "full" : ""}">${done(k)}/${DOCS.length}</span></button>`).join("");
  }
  function dossier() {
    const v = fleet[cur], d = done(cur);
    document.getElementById("dossier").innerHTML = `
      <div class="dossier-head"><div><span class="caps muted">Dossier ${folder(cur)}</span><h2 class="model" style="font-size:18px">${v.title}</h2><span class="muted" style="font-size:14px">${subOf(v)} · ${fmtPrice(v.price)}</span></div>
        <div class="progress"><b class="caps">${d}/${DOCS.length} pièces</b><span><i style="width:${(d / DOCS.length) * 100}%"></i></span></div></div>
      <div class="drows">${DOCS.map(([id, ic, name, kind]) => {
        const ok = state[cur][id], st = ok ? '<span class="st ok"><i></i>Reçu</span>' : kind === "gen" ? '<span class="st gen"><i></i>À générer</span>' : '<span class="st miss"><i></i>Manquant</span>';
        const act = kind === "gen" ? `<button class="btn ${ok ? "btn-ghost" : "btn-primary"} btn-sm" data-gen="${id}">${ok ? "Voir" : "Générer"}</button>`
          : `<label class="btn btn-ghost btn-sm">${ok ? "Remplacer" : "Ajouter"}<input type="file" class="sr" data-file="${id}" accept="image/*,application/pdf" /></label>`;
        return `<div class="drow"><span class="ic">${ico(ic)}</span><span>${name}</span>${st}${act}</div>`;
      }).join("")}</div>
      <div class="drop-docs" data-drop-docs>Glissez ici les scans ou photos des documents (carte grise, CT, factures…) : l'app les range toute seule.</div>`;
  }
  function paper(id) {
    const v = fleet[cur], date = new Date().toLocaleDateString("fr-FR"), b = '<span class="blank"></span>';
    const head = (t, sub) => `<div class="ph-head"><div><h3>${t}</h3><span>${sub}</span></div><b style="font:800 14px/1 var(--font-display);letter-spacing:.08em">FOREVER<span style="color:var(--orange)">CARS</span></b></div>`;
    const parts = `<div><b>Vendeur</b><br />ForeverCars, Lot N23, 1695 rue de la Grand Cour, 45760 Marigny-les-Usages, 06 67 53 74 00</div>
      <div><b>Acheteur</b><br />Nom, prénom : ${b}<br />Adresse : ${b}</div><div><b>Véhicule</b><br />${v.title}, ${v.year}${v.km ? `, ${fmtKm(v.km)}` : ""}<br />Immatriculation : ${v.plate} · N° VIN : ${b}</div>`;
    if (id === "ces") return head("Déclaration de cession", "modèle simplifié (le Cerfa 15776 officiel sera intégré)") + parts + `<p>Date et heure de la cession : ${date} à ${b}</p><p>Signatures : vendeur ${b} acheteur ${b}</p>`;
    if (id === "bdc") return head("Bon de commande", `N° BC-${folder(cur).slice(8)} · ${date}`) + parts + `<div><b>Prix de vente TTC</b> : ${fmtPrice(v.price)}<br />Acompte versé : ${b} · Reste à payer : ${b}</div>`;
    return head("Facture", `N° F-${folder(cur).slice(3)} · ${date}`) + parts + `<div style="display:flex;justify-content:space-between"><b>Total TTC</b><b>${fmtPrice(v.price)}</b></div><p>Mention TVA (régime de la marge, art. 297 A du CGI) : à valider avec le comptable.</p>`;
  }

  document.addEventListener("click", (e) => {
    const dv = e.target.closest(".dv"), gen = e.target.closest("[data-gen]");
    if (dv) return (cur = Number(dv.dataset.k)), list(), dossier();
    if (gen) {
      state[cur][gen.dataset.gen] = true;
      document.getElementById("paper").innerHTML = paper(gen.dataset.gen);
      document.getElementById("paper-wrap").hidden = false;
      return list(), dossier(), document.getElementById("paper-close").focus();
    }
    if (e.target.closest("#paper-close") || e.target.id === "paper-wrap") document.getElementById("paper-wrap").hidden = true;
  });
  document.addEventListener("change", (e) => e.target.dataset.file && ((state[cur][e.target.dataset.file] = true), list(), dossier(), toast("Document ajouté au dossier.")));
  document.addEventListener("dragover", (e) => e.target.closest?.("[data-drop-docs]") && (e.preventDefault(), e.target.closest("[data-drop-docs]").classList.add("over")));
  document.addEventListener("drop", (e) => {
    if (!e.target.closest?.("[data-drop-docs]")) return;
    e.preventDefault();
    DOCS.filter(([, , , k]) => k === "file").forEach(([id]) => (state[cur][id] = true));
    list(), dossier(), toast("Documents rangés : carte grise, CT, non-gage et factures reçus.");
  });
  document.getElementById("dq").addEventListener("input", list);
  list();
  dossier();
})();
