// Page fiche : ?i=<index du stock>, ou ?n=<annonce publiée depuis l'app pendant la démo>.
(function () {
  const q = new URLSearchParams(location.search);
  let i = q.get("n") ? STOCK.findIndex((v) => v.liveId === q.get("n")) : Number(q.get("i"));
  if (!(i >= 0 && STOCK[i])) i = STOCK.findIndex((v) => /M2/.test(v.model));
  const v = STOCK[i];
  document.title = `${title(v)} · ForeverCars (maquette v3)`;

  const n = v.images.length, extra = Math.max(0, n - 5);
  document.getElementById("mosaic").innerHTML =
    v.images.slice(0, 5).map((u, k) => `<button data-photo="${k}" aria-label="Photo ${k + 1} sur ${n}, en grand"><img src="${img(u, k ? 640 : 1400, k ? 480 : 1000)}" alt="" ${k ? 'loading="lazy"' : ""} /></button>`).join("");
  document.querySelector("#mosaic > button").insertAdjacentHTML("beforeend", `<span class="tag tag-soft mosaic-all">${ico("camera")}${n} photos</span>`);
  if (extra) document.querySelector("#mosaic > button:nth-child(5)").insertAdjacentHTML("beforeend", `<span class="mosaic-more caps">+ ${extra} photos</span>`);

  const specs = [["calendar", "Année", v.year], ["gauge", "Kilométrage", fmtKm(v.mileage)], ["fuel", "Énergie", cap(v.fuel)], ["gear", "Boîte", cap(v.transmission)], ["bolt", "Puissance", `${v.power} ch`], ["car", "Marque", brandOf(v) || "—"]];
  document.getElementById("main").innerHTML = `
    <div class="fiche-head reveal"><span class="vcard-badges" style="position:static">${badges(v)}</span><h1 class="model fiche-title">${title(v)}</h1>
      <p class="muted" style="margin:0">${[v.year, fmtKm(v.mileage), cap(v.fuel), cap(v.transmission)].join(" · ")}</p></div>
    <dl class="spec-grid fiche-specs reveal">${specs.map(([ic, l, val]) => `<div class="spec soft"><dt>${ico(ic)}${l}</dt><dd>${val}</dd></div>`).join("")}</dl>
    <section class="reveal"><h2 class="caps sheet-h">Description</h2><p class="desc">${(v.description || "").trim()}</p></section>
    <section class="reveal"><h2 class="caps sheet-h">Équipements</h2><div class="chips">${(v.features || []).map((f) => `<span class="chip">${f}</span>`).join("")}</div></section>`;
  document.getElementById("buy").innerHTML = `
    <span class="caps muted">Prix</span><span class="price">${fmtPrice(v.price)}</span>
    <a class="btn btn-primary" href="contact.html?vehicule=${encodeURIComponent(title(v))}">Je suis intéressé ${ico("arrow", "go")}</a>
    <a class="btn btn-ghost" href="tel:0667537400">${ico("phone")}06 67 53 74 00</a>
    <button class="btn btn-ghost" data-copy>${ico("copy")}<span>Copier le lien</span></button>
    <ul class="assure"><li>${ico("check")}Contrôlé par notre atelier : historique, contrôle technique, essai routier</li><li>${ico("check")}Carte grise et démarches administratives prises en charge</li><li>${ico("check")}Livraison possible dans tout le Loiret</li></ul>`;

  // « Vous aimerez aussi » : même marque d'abord, puis prix proches.
  const others = STOCK.map((x, k) => ({ x, k })).filter(({ k }) => k !== i)
    .sort((a, b) => (brandOf(b.x) === brandOf(v)) - (brandOf(a.x) === brandOf(v)) || Math.abs(a.x.price - v.price) - Math.abs(b.x.price - v.price)).slice(0, 4);
  document.getElementById("similar").innerHTML = others.map(({ x, k }, d) => vehicleCard(x, { i: k, delay: d * 80 })).join("");

  document.addEventListener("click", (e) => {
    const p = e.target.closest("#mosaic [data-photo]");
    if (p) return openLightbox(v.images, Number(p.dataset.photo), title(v));
    const c = e.target.closest("#buy [data-copy]");
    if (c) c.querySelector("span").textContent = "Lien copié";
  });
  animate();
})();
