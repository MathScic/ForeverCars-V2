// Écran final : annonce en ligne (ou en attente de connexion) et suites possibles en un clic.
RENDER.success = () => {
  const { status, v } = W.done, online = status === "online";
  return `
  <div class="success">
    <span class="success-icon ${online ? "" : "wait"}">${ico(online ? "check" : "clock")}</span>
    <h1>${W.edit ? "Annonce mise à jour" : online ? "Annonce en ligne" : "Annonce prête, en attente de connexion"}</h1>
    <p class="muted">${online ? "Elle est visible sur forevercars.fr et apparaît dans votre parc. La fiche vitrine est prête à imprimer." : "Tout est enregistré sur ce PC. Elle partira toute seule sur le site dès le retour d'internet."}</p>
    <div class="success-v soft"><img src="${img(v.photo, 240, 160)}" alt="" /><span><strong>${v.title}</strong><small>${subOf(v)} · ${v.plate}</small></span><span class="price">${fmtPrice(v.price)}</span></div>
    <div class="success-actions">
      <button class="btn btn-ghost" data-w="print">${ico("printer")}Imprimer la fiche vitrine</button>
      <a class="btn btn-ghost" href="${online && !W.edit ? `stock.html?annonce=${v.id}` : "stock.html"}">${ico("globe")}Voir l'annonce sur le site</a>
      <a class="btn btn-primary" href="vente.html">${ico("plus")}Mettre un autre véhicule en vente</a>
      <a class="btn btn-ghost" href="backoffice.html">${ico("car")}Retour au parc</a>
    </div>
  </div>`;
};
