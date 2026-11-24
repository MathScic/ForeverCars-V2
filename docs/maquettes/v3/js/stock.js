// Page stock : filtres combinables (listes aux couleurs du site), tri, affichage par paquets de 12.
(function () {
  const PAGE = 12;
  let shown = PAGE;
  const brands = [...new Set(STOCK.map(brandOf).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr"));
  const FILTERS = [
    ["brand", "Marque", [["", "Toutes les marques"], ...brands.map((b) => [b, b])]],
    ["fuel", "Énergie", [["", "Toutes énergies"], ["essence", "Essence"], ["diesel", "Diesel"], ["hybride", "Hybride"]]],
    ["gear", "Boîte", [["", "Toutes boîtes"], ["automatique", "Automatique"], ["manuelle", "Manuelle"]]],
    ["price", "Prix", [["", "Prix max."], ...[10000, 15000, 20000, 30000, 40000].map((n) => [String(n), `Jusqu'à ${fmtPrice(n)}`])]],
    ["km", "Kilométrage", [["", "Km max."], ...[50000, 100000, 150000].map((n) => [String(n), `Moins de ${fmtKm(n)}`])]],
  ];
  const SORTS = [["recent", "Plus récents"], ["price-asc", "Prix croissant"], ["price-desc", "Prix décroissant"], ["km-asc", "Kilométrage croissant"]];
  document.getElementById("filters").innerHTML =
    `<label class="search">${ico("search")}<input id="q" type="search" placeholder="Rechercher une marque, un modèle…" aria-label="Rechercher" /></label>` +
    FILTERS.map(([id, label, opts]) => dropdown(id, label, opts)).join("") +
    `<button class="reset caps" id="reset" hidden>Réinitialiser</button>`;
  document.getElementById("sort-slot").innerHTML = dropdown("sort", "Trier", SORTS);

  const val = (id) => ddValue(id);
  function list() {
    const q = document.getElementById("q").value.trim().toLowerCase();
    const out = STOCK.map((v, i) => ({ v, i })).filter(({ v }) =>
      (!q || title(v).toLowerCase().includes(q)) && (!val("brand") || brandOf(v) === val("brand")) && (!val("fuel") || v.fuel === val("fuel")) &&
      (!val("gear") || v.transmission === val("gear")) && (!val("price") || v.price <= +val("price")) && (!val("km") || v.mileage <= +val("km")));
    const by = { recent: (a, b) => b.v.createdAt.localeCompare(a.v.createdAt), "price-asc": (a, b) => a.v.price - b.v.price, "price-desc": (a, b) => b.v.price - a.v.price, "km-asc": (a, b) => a.v.mileage - b.v.mileage };
    return out.sort(by[val("sort")]);
  }

  function render(keep) {
    const all = list();
    const from = keep ? document.querySelectorAll("#grid .vcard").length : 0;
    const grid = document.getElementById("grid");
    const html = all.slice(from, shown).map(({ v, i }, k) => vehicleCard(v, { i, delay: (k % 3) * 90 })).join("");
    if (keep) grid.insertAdjacentHTML("beforeend", html);
    else grid.innerHTML = html || `<div class="empty soft">${ico("search")}<p style="margin:0">Aucun véhicule ne correspond à ces critères.</p><button class="btn btn-ghost btn-sm" data-reset>Réinitialiser les filtres</button></div>`;
    document.getElementById("count").textContent = `${all.length} véhicule${all.length > 1 ? "s" : ""} disponible${all.length > 1 ? "s" : ""}`;
    const more = document.getElementById("more");
    more.hidden = all.length <= shown;
    more.innerHTML = `<span>Vous avez vu ${Math.min(shown, all.length)} véhicules sur ${all.length}</span><span class="more-bar"><span style="width:${(Math.min(shown, all.length) / all.length) * 100}%"></span></span><button class="btn btn-ghost" id="load">Afficher plus de véhicules</button>`;
    document.getElementById("reset").hidden = !(FILTERS.some(([id]) => val(id)) || document.getElementById("q").value);
    FILTERS.forEach(([id]) => document.getElementById(id).classList.toggle("on", !!val(id)));
    animate();
  }

  const reset = () => {
    document.getElementById("q").value = "";
    FILTERS.forEach(([id]) => ddSet(id, ""));
    (shown = PAGE), render(false);
  };
  document.getElementById("q").addEventListener("input", () => ((shown = PAGE), render(false)));
  document.addEventListener("dd-change", () => ((shown = PAGE), render(false)));
  document.addEventListener("click", (e) => {
    if (e.target.closest("#reset, [data-reset]")) reset();
    if (e.target.closest("#load")) (shown += PAGE), render(true);
  });
  render(false);
  // Arrivée depuis l'app (« Voir l'annonce sur le site ») : on ouvre directement l'annonce.
  const n = new URLSearchParams(location.search).get("annonce");
  const k = n ? STOCK.findIndex((v) => v.liveId === n) : -1;
  if (k >= 0) setTimeout(() => openPanel(k), 400);
})();
