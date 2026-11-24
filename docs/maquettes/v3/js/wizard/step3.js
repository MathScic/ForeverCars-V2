// Étape 3 — Prix & annonce : prix, données internes (gérant), équipements, description (IA), options.
const estMid = () => (W.siv?.est ? Math.round((W.siv.est[0] + W.siv.est[1]) / 2 / 100) * 100 : 0);
const margin = () => num(W.price) - num(W.buy) - num(W.repair);

RENDER[3] = () => `
  <div class="w-row">
    <div class="w-card soft">
      <label class="field"><span>Prix de vente affiché</span><span class="suffix big"><input id="price" inputmode="numeric" data-k="price" value="${fmtNum(num(W.price))}" placeholder="ex. ${fmtNum(estMid() || 25990)}" /><b>€</b></span></label>
      ${W.siv?.est ? `<div class="estimate"><span><small>Estimation marché (module à venir)</small><strong>${fmtPrice(W.siv.est[0])} – ${fmtPrice(W.siv.est[1])}</strong></span><button class="btn btn-ghost btn-sm" data-w="apply-est">Appliquer ${fmtPrice(estMid())}</button></div>` : `<p class="muted small" style="position:relative">L'estimation marché arrivera avec le module de cote (plus tard).</p>`}
    </div>
    ${BO.isAdmin() ? `
    <div class="w-card soft internal">
      <span class="internal-head">${ico("lock")}Données internes · jamais publiées</span>
      <div class="two"><label class="field"><span>Prix d'achat</span><span class="suffix"><input data-k="buy" inputmode="numeric" value="${fmtNum(num(W.buy))}" placeholder="ex. 21 500" /><b>€</b></span></label>
        <label class="field"><span>Remise en état</span><span class="suffix"><input data-k="repair" inputmode="numeric" value="${fmtNum(num(W.repair))}" placeholder="ex. 450" /><b>€</b></span></label></div>
      <div class="margin-line"><span>Marge prévisionnelle</span><strong id="margin">${marginLabel()}</strong></div>
    </div>` : `<div class="w-card soft internal locked">${ico("lock")}<span>Prix d'achat et marge : réservés au gérant. Votre profil Vendeur ne les voit pas.</span></div>`}
  </div>
  <div class="w-block"><span class="w-label" id="equip-l">Équipements</span>
    <div class="chips" role="group" aria-labelledby="equip-l">${EQUIP.map((e) => `<button type="button" class="pchip" data-equip="${e}" aria-pressed="${W.equip.includes(e)}">${W.equip.includes(e) ? ico("check") : ""}${e}</button>`).join("")}</div></div>
  <div class="w-block">
    <div class="desc-head"><label class="w-label" for="desc">Description de l'annonce</label>
      <button class="btn btn-ghost btn-sm" data-w="ai" ${W.aiLoading ? "disabled" : ""}>${ico("sparkles")}${W.aiLoading ? "Rédaction en cours…" : "Rédiger avec l'IA"}</button></div>
    <textarea id="desc" rows="8" data-k="desc" placeholder="Décrivez le véhicule, ou laissez l'IA rédiger à partir de la fiche…">${W.desc}</textarea>
    <small class="muted">L'IA part de la fiche et des équipements cochés ; vous relisez toujours avant de publier.</small>
  </div>
  <div class="options">${OPTIONS.map(([k, l, d]) => `
    <button type="button" class="option" data-opt="${k}" aria-pressed="${W[k]}"><span class="switch" aria-hidden="true"><i></i></span><span><strong>${l}</strong><small>${d}</small></span></button>`).join("")}</div>`;

function marginLabel() {
  if (!num(W.price) || !num(W.buy)) return "—";
  const m = margin();
  return `<span style="color:var(--${m < 1000 ? "danger" : "success"})">${fmtPrice(m)}</span> <small class="muted">(${Math.round((m / num(W.price)) * 100)} %)</small>`;
}

/** Texte proposé à partir de la fiche, tapé progressivement dans le champ. */
function writeWithAI() {
  if (W.aiLoading) return;
  const f = W.f, owners = { 1: "Première main", 2: "Deux propriétaires", "3+": "Trois propriétaires ou plus" }[W.owners];
  const equip = W.equip.length ? `Équipements : ${W.equip.join(", ")}.` : "Équipements : [À COMPLÉTER].";
  const text = `${f.brand} ${f.model} ${f.version} de ${f.year}, ${fmtKm(num(W.km))}. Motorisation ${f.fuel.toLowerCase()} de ${f.power}, boîte ${f.gearbox.replace(/^\w/, (c) => c.toLowerCase())}, teinte ${f.color}. ${owners}.\n\n${equip}\n\nVéhicule contrôlé et préparé par notre atelier, vendu avec une garantie de ${W.warranty}. Reprise de votre véhicule possible et financement sur demande. Venez l'essayer sur notre parc à Marigny-les-Usages.`;
  W.aiLoading = true;
  W.desc = "";
  renderStep();
  const area = document.getElementById("desc");
  let i = 0;
  const type = () => {
    i = Math.min(text.length, i + 6);
    W.desc = area.value = text.slice(0, i);
    area.scrollTop = area.scrollHeight;
    if (i < text.length) return requestAnimationFrame(type);
    W.aiLoading = false;
    renderStep();
  };
  setTimeout(type, 500);
}
