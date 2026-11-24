// Carte véhicule : LA MÊME sur le site (accueil, stock) et dans l'aperçu de la mise en vente.
// Maquette : « Nouveau » = arrivé depuis moins de 30 jours (les données de démo datent de novembre).
const TODAY = Date.parse("2026-11-24");
const isRecent = (v) => v.isNewCard ?? TODAY - Date.parse(v.createdAt) < 30 * 864e5;

function badges(v, fav = true) {
  const out = [];
  if (v.status === "reserved") out.push('<span class="tag tag-reserved">Réservé</span>');
  else if (isRecent(v)) out.push('<span class="tag tag-new">Nouveau</span>');
  if (fav && v.isFeatured) out.push(`<span class="tag tag-soft tag-fav">${ico("star")}Coup de cœur</span>`);
  return out.join("");
}

/**
 * @param v       véhicule (format Sanity) ; v.displayTitle remplace le titre calculé (aperçu).
 * @param opts.i  index dans STOCK → ouvre le panneau au clic ; null = carte inerte (aperçu).
 * @param opts.fav false = sans badge « Coup de cœur » (inutile dans le carrousel des coups de cœur).
 */
function vehicleCard(v, { i = null, delay = 0, reveal = true, fav = true } = {}) {
  const name = v.displayTitle || title(v);
  const open = i === null ? 'tabindex="-1"' : `data-open="${i}"`;
  const photo = v.images[0] ? `<img loading="lazy" src="${img(v.images[0], 800, 600)}" alt="" />` : "";
  return `
  <article class="vcard soft clip ${reveal ? "reveal" : ""}" style="--d:${delay}ms">
    <button class="vcard-media" ${open} aria-label="Aperçu : ${name}">${photo}
      <span class="vcard-badges">${badges(v, fav)}</span>
      <span class="tag tag-soft vcard-count">${ico("camera")}${v.images.length}</span>
    </button>
    <div class="vcard-body">
      <h3 class="model vcard-title"><button ${open}>${name}</button></h3>
      <ul class="vcard-specs" aria-label="Caractéristiques">
        <li>${ico("calendar")}${v.year}</li><li>${ico("gauge")}${fmtKm(v.mileage)}</li><li>${ico("fuel")}${cap(v.fuel)}</li><li>${ico("gear")}${cap(v.transmission)}</li>
      </ul>
      <div class="vcard-foot"><span class="price">${fmtPrice(v.price)}</span><a class="link" href="#" ${i === null ? 'tabindex="-1"' : ""}>Voir la fiche ${ico("arrow")}</a></div>
    </div>
  </article>`;
}
