// Étape 4 — Aperçu (carte IDENTIQUE au site), fiche vitrine A4, liste « prêt à publier », publication.
const QR = '<svg viewBox="0 0 21 21" role="img" aria-label="QR code vers l\'annonce"><rect width="21" height="21" fill="#fff"/><path fill="#111" d="M0 0h7v7H0zM14 0h7v7h-7zM0 14h7v7H0z"/><path fill="#fff" d="M1 1h5v5H1zM15 1h5v5h-5zM1 15h5v5H1z"/><path fill="#111" d="M2 2h3v3H2zM16 2h3v3h-3zM2 16h3v3H2zM8 1h1v2H8zM10 0h2v1h-2zM9 4h2v2H9zM12 3h1v3h-1zM8 8h2v1H8zM11 8h3v1h-3zM0 9h2v1H0zM3 8h2v2H3zM16 8h2v1h-2zM19 9h2v2h-2zM9 10h1v3H9zM12 11h2v2h-2zM15 11h1v2h-1zM17 12h3v1h-3zM8 14h3v1H8zM12 15h2v3h-2zM15 15h2v1h-2zM18 15h1v3h-1zM9 17h2v2H9zM15 18h2v3h-2zM19 19h2v2h-2zM8 20h3v1H8z"/></svg>';
const PSTATE = { todo: ["à venir", "muted"], doing: ["en cours…", "accent"], done: ["fait", "ok"], wait: ["en attente", "accent"] };

function preview() {
  return { displayTitle: `${W.f.brand} ${W.f.model} ${W.f.version}`, images: W.photos.map((p) => p.thumb || p.src), year: W.f.year, mileage: num(W.km),
    fuel: (W.f.fuel || "").toLowerCase(), transmission: (W.f.gearbox || "").split(" ")[0].toLowerCase(), price: num(W.price), isFeatured: W.featured, isNewCard: true, status: "available" };
}

RENDER[4] = () => {
  const specs = [["Année", W.f.year], ["Km", fmtNum(num(W.km))], ["Énergie", W.f.fuel], ["Boîte", (W.f.gearbox || "—").split(" ")[0]], ["Puissance", W.f.power], ["Garantie", W.warranty]];
  const words = W.desc.split(/\s+/).filter(Boolean).length;
  const check = [`${W.photos.length} photos, couverture choisie`, `Prix affiché : ${fmtPrice(num(W.price))}`, `Description : ${words} mots`, `${W.equip.length} équipement${W.equip.length > 1 ? "s" : ""} renseigné${W.equip.length > 1 ? "s" : ""}`,
    W.featured ? "Mis en avant sur l'accueil" : "Sans mise en avant", ...(W.lbc || W.lc ? [`Annonce préparée pour ${[W.lbc && "Leboncoin", W.lc && "La Centrale"].filter(Boolean).join(" et ")}`] : [])];
  return `
  <div class="final">
    <section class="final-col"><h2 class="w-label">Aperçu sur forevercars.fr</h2><div class="preview-card">${vehicleCard(preview(), { reveal: false })}</div><p class="muted small">C'est la carte exacte du site, avec vos photos.</p></section>
    <section class="final-col"><h2 class="w-label">Fiche vitrine · A4 pare-brise</h2>
      <div class="a4"><div class="a4-top"><b>FOREVERCARS</b><span>${W.plate}</span></div><strong class="a4-title">${W.f.brand} ${W.f.model}</strong><span class="a4-sub">${W.f.version}</span>
        <span class="a4-price">${fmtPrice(num(W.price))}</span><div class="a4-specs">${specs.map(([k, v]) => `<span><b>${k}</b> ${v}</span>`).join("")}</div>
        <div class="a4-equip">${W.equip.slice(0, 5).map((e) => `<span>+ ${e}</span>`).join("")}</div><div class="a4-qr">${QR}<span>Scannez pour voir toutes les photos et réserver un essai</span></div></div>
      <button class="btn btn-ghost" data-w="print">${ico("printer")}Imprimer la fiche</button></section>
    <section class="ready soft"><h2>Prêt à publier</h2><ul>${check.map((c) => `<li>${ico("check")}${c}</li>`).join("")}</ul>
      <button class="btn btn-primary btn-lg" data-w="publish" ${W.publishing ? "disabled" : ""}>${ico("send")}${W.publishing ? "Publication…" : W.edit ? "Mettre à jour l'annonce" : BO.s.online ? "Publier sur forevercars.fr" : "Publier (hors-ligne)"}</button>
      ${W.pSteps.length ? `<ol class="psteps">${W.pSteps.map((p) => `<li class="${p.st}"><span>${p.label}</span><b>${PSTATE[p.st][0]}</b></li>`).join("")}</ol>` : `<p class="muted small" style="margin:0">${BO.s.online ? "Environ 5 secondes. Rien ne part tant que vous n'avez pas cliqué." : "Hors-ligne : l'annonce est gardée sur ce PC et partira toute seule au retour d'internet."}</p>`}
    </section>
  </div>`;
};

function publish() {
  if (W.publishing) return;
  const labels = ["Enregistrement sur ce PC", ...(W.edit ? [] : [`Envoi de ${W.photos.length} photos optimisées`]), "Mise à jour de la base en ligne", "Actualisation de forevercars.fr",
    ...(W.lbc || W.lc ? ["Préparation des annonces (texte + photos)"] : []), "Sauvegarde chiffrée"];
  W.publishing = true;
  W.pSteps = labels.map((label) => ({ label, st: "todo" }));
  const run = (i) => {
    if (i >= labels.length) return finish("online");
    if (!BO.s.online && i > 0) return W.pSteps.slice(i).forEach((p) => (p.st = "wait")), renderStep(), setTimeout(() => finish("pending"), 900);
    W.pSteps[i].st = "doing";
    renderStep();
    setTimeout(() => ((W.pSteps[i].st = "done"), run(i + 1)), 650);
  };
  run(0);
}

function finish(status) {
  const v = asFleet(status);
  if (!W.edit) BO.set({ added: [v, ...BO.s.added] });
  addLog(W.edit ? `Annonce modifiée : ${v.title}` : status === "online" ? `Annonce publiée : ${v.title}` : `Annonce en attente de connexion : ${v.title}`);
  Object.assign(W, { publishing: false, done: { status, v } });
  renderStep();
  scrollTo({ top: 0, behavior: "smooth" });
}
