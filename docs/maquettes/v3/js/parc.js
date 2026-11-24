// Écran « Parc véhicules » : indicateurs, filtres, vignettes ou liste, actions rapides, journal.
(function () {
  let fleet = [...BO.s.added.map((v) => ({ ...v, fresh: true })), ...FLEET];
  let filter = "all", view = "grid";
  let page;
  const FILTERS = [["all", "Tous"], ["online", "En ligne"], ["draft", "Brouillons"], ["reserved", "Réservés"], ["pending", "En attente"], ["sold", "Vendus"]];

  function kpis() {
    const n = (s) => fleet.filter((v) => v.status === s).length;
    const live = fleet.filter((v) => ["online", "reserved"].includes(v.status));
    const value = live.reduce((t, v) => t + v.price, 0);
    const marge = live.reduce((t, v) => t + marginOf(v), 0);
    const items = [["globe", "En ligne", n("online"), "visibles sur forevercars.fr"], ["pencil", "Brouillons", n("draft"), "à terminer"], ["clock", "En attente de connexion", n("pending"), "partiront au retour d'internet"],
      ["checkCircle", "Vendus", n("sold"), "dernières ventes"], ["euro", "Valeur du parc", fmtPrice(value), BO.isAdmin() ? `marge prévue ${fmtPrice(marge)}` : "prix affichés"]];
    return `<div class="kpis">${items.map(([i, l, v, s], k) => `<div class="kpi soft reveal" style="--d:${k * 60}ms"><span class="kpi-head">${ico(i)}${l}</span><strong>${v}</strong><small>${s}</small></div>`).join("")}</div>`;
  }

  function action(v) {
    if (v.status === "draft") return `<button class="btn btn-primary btn-sm" data-act="publish" data-id="${v.id}">Publier</button>`;
    if (v.status === "pending") return `<span class="when">${ico("clock")}&nbsp;Part au retour d'internet</span>`;
    if (v.status === "sold") return `<span class="when">Vendu le ${new Date(v.soldDate || Date.now()).toLocaleDateString("fr-FR")}</span>`;
    return `<button class="btn btn-ghost btn-sm" data-act="sell" data-id="${v.id}">Marquer vendu</button>`;
  }
  const tools = (v) =>
    `<button class="icon-btn" data-act="edit" data-id="${v.id}" aria-label="Modifier ${v.title}" title="Modifier">${ico("pencil")}</button>` +
    (BO.isAdmin() ? `<button class="icon-btn" data-act="del" data-id="${v.id}" aria-label="Supprimer ${v.title}" title="Supprimer (gérant)">${ico("trash")}</button>` : "");
  const star = (v) => (v.status === "sold" ? "" : `<button class="star" data-act="star" data-id="${v.id}" aria-pressed="${!!v.featured}" aria-label="${v.featured ? "Retirer de l'accueil" : "Mettre en avant sur l'accueil"}">${ico("star")}</button>`);
  const price = (v) => `<span class="price">${fmtPrice(v.price)}</span>${BO.isAdmin() ? `<span class="margin ${marginOf(v) < 1000 ? "low" : ""}">marge ${fmtPrice(marginOf(v))}</span>` : ""}`;

  const card = (v) => `
    <article class="pcard soft clip ${v.status === "sold" ? "is-sold" : ""} ${v.fresh ? "is-new" : ""}">
      <div class="pcard-media"><img loading="lazy" src="${img(v.photo, 520, 325)}" alt="" />${statusPill(v.status)}${star(v)}</div>
      <div class="pcard-body"><h3>${v.title}</h3><p class="sub">${subOf(v)} · ${v.plate}</p><div class="pcard-price">${price(v)}</div>
        <div class="pcard-actions">${action(v)}${tools(v)}</div></div>
    </article>`;
  const row = (v) => `
    <div class="prow"><img loading="lazy" src="${img(v.photo, 160, 110)}" alt="" /><div style="min-width:0"><strong>${v.title}</strong><span class="sub">${subOf(v)} · ${v.plate}</span></div>
      <div>${price(v)}</div>${statusPill(v.status)}<div class="acts">${star(v)}${action(v)}${tools(v)}</div></div>`;

  function journal() {
    const log = [...BO.s.log, ...LOG_DEMO].slice(0, 9);
    return `<aside class="journal soft" aria-label="Journal d'activité"><h2>Journal d'activité</h2><p>Qui a fait quoi, et quand. Rien ne se perd.</p>${log
      .map((l, k) => `<div class="jrow ${k < BO.s.log.length ? "fresh" : ""}"><time>${l.time}</time><span><b>${l.who}</b>${l.text}</span></div>`).join("")}</aside>`;
  }

  function render() {
    const q = (document.getElementById("bo-q")?.value || "").trim().toLowerCase();
    const list = fleet.filter((v) => (filter === "all" || v.status === filter) && (!q || `${v.title} ${v.plate}`.toLowerCase().includes(q)));
    const count = (f) => (f === "all" ? fleet.length : fleet.filter((v) => v.status === f).length);
    page.innerHTML = `<div class="page">
      <div class="page-title"><div><h1>Parc véhicules</h1><p>${fleet.length} véhicules · données de démonstration</p></div><a class="btn btn-primary" href="vente.html">${ico("plus")}Mettre un véhicule en vente</a></div>
      ${kpis()}
      <div class="parc-layout"><section aria-label="Véhicules">
        <div class="toolbar"><div class="filter-chips" role="group" aria-label="Filtrer par statut">${FILTERS.filter(([f]) => f === "all" || f === filter || count(f)).map(([f, l]) => `<button class="fchip" data-filter="${f}" aria-pressed="${f === filter}">${l}<span>${count(f)}</span></button>`).join("")}</div>
          <div class="seg" role="group" aria-label="Affichage"><button data-view="grid" aria-pressed="${view === "grid"}">${ico("grid")}Vignettes</button><button data-view="list" aria-pressed="${view === "list"}">${ico("list")}Liste</button></div></div>
        ${list.length ? (view === "grid" ? `<div class="pgrid">${list.map(card).join("")}</div>` : `<div class="plist soft">${list.map(row).join("")}</div>`) : `<p class="empty-parc">Aucun véhicule ici pour le moment.</p>`}
      </section>${journal()}</div></div>`;
    animate();
  }

  function act(kind, id) {
    const v = fleet.find((x) => x.id === id);
    if (kind === "star") return (v.featured = !v.featured), toast(v.featured ? `${v.title} apparaît dans « Véhicules en vedette ».` : `${v.title} retiré de l'accueil.`), render();
    if (kind === "publish") return (v.status = BO.s.online ? "online" : "pending"), addLog(`Annonce publiée : ${v.title}`), toast(BO.s.online ? `${v.title} est en ligne.` : "Hors-ligne : publication dès le retour d'internet."), render();
    if (kind === "sell") return (v.status = "sold"), (v.soldDate = Date.now()), addLog(`Vente enregistrée : ${v.title}`), toast("Vendu ! L'annonce passe dans « Vendu » sur le site."), render();
    if (kind === "del") return (fleet = fleet.filter((x) => x !== v)), addLog(`Véhicule supprimé : ${v.title}`), toast(`${v.title} supprimé (récupérable dans les sauvegardes).`), render();
    if (kind === "edit") return (location.href = `vente.html?edit=${id}`);
  }

  // Retour d'internet : ce qui attendait part en ligne (le cadre met déjà à jour les véhicules publiés pendant la démo).
  mountShell("Parc véhicules", () => (BO.s.online && fleet.forEach((v) => v.status === "pending" && (v.status = "online")), render()));
  page = document.getElementById("page");
  page.addEventListener("click", (e) => {
    const f = e.target.closest("[data-filter]"), vw = e.target.closest("[data-view]"), a = e.target.closest("[data-act]");
    if (f) return (filter = f.dataset.filter), render();
    if (vw) return (view = vw.dataset.view), render();
    if (a) act(a.dataset.act, a.dataset.id);
  });
  document.getElementById("bo-q").addEventListener("input", render);
  render();
  BO.set({ added: BO.s.added.map(({ fresh, ...v }) => v) });
})();
