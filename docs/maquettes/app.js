// Outils communs aux maquettes « Showroom Nocturne ».
const SITE = "../../apps/site/public";
const LOGO = `${SITE}/images/Forever-CarsLogo.svg`;

const fmtPrice = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtKm = (n) => `${new Intl.NumberFormat("fr-FR").format(n)} km`;
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const img = (url, w, h) => `${url}?w=${w}${h ? `&h=${h}&fit=crop` : ""}&auto=format&q=78`;
// Données Sanity à nettoyer : marque répétée (« VOLKSWAGEN VOLKSWAGEN »), ou titre complet
// d'annonce saisi dans le champ marque (« AUDI A1 … - Garantie 6 mois / … ») : on coupe au premier « - ».
const title = (v) => `${v.brand} ${v.model}`.split(/\s[-–]\s/)[0].replace(/^(\S+)\s+\1\s/i, "$1 ").trim();
/** Marque normalisée pour les filtres : premier mot, en capitales (« Audi », « AUDI A1 … » → « AUDI »). */
const brandOf = (v) => (v.brand.split(/\s+/)[0] || "").toUpperCase();

function header(current) {
  // « Accueil » retiré : le logo ramène déjà à l'accueil.
  const links = [
    ["stock.html", "Notre Stock"],
    ["vendu.html", "Vendu"],
    ["a-propos.html", "À Propos"],
  ];
  return `
  <header class="site-header">
    <div class="wrap">
      <a href="index.html" aria-label="ForeverCars, accueil"><img src="${LOGO}" alt="ForeverCars" style="height:52px;width:auto" /></a>
      <nav aria-label="Navigation principale">
        ${links.map(([href, label]) => `<a class="nav-link" href="${href}" ${label === current ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
      </nav>
      <a class="btn btn-primary btn-pill header-cta" href="contact.html">Nous contacter</a>
      <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
    </div>
  </header>
  <!-- Menu mobile HORS du header : un header translucide (backdrop-filter) enfermerait
       le panneau fixe dans sa hauteur. Même système que le site actuel. -->
  <div class="mobile-scrim" data-menu-close></div>
  <aside class="mobile-menu" id="mobile-menu" aria-label="Menu">
    <div class="mm-head"><span class="mm-title">Menu</span><button class="mm-close" data-menu-close aria-label="Fermer le menu">✕</button></div>
    <nav aria-label="Navigation mobile">
      ${[["index.html", "Accueil"], ...links].map(([href, label], k) => `<a href="${href}" style="--k:${k}" ${label === current ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
    </nav>
    <div class="mm-foot">
      <a class="btn btn-primary btn-pill" href="contact.html" style="justify-content:center;width:100%">Nous contacter</a>
      <p class="mm-tagline">« Acheter ou vendre autrement »</p>
    </div>
  </aside>`;
}

// Menu mobile : panneau qui glisse depuis la droite ; croix, fond ou Échap pour fermer.
function setMenu(open) {
  document.documentElement.classList.toggle("menu-open", open);
  document.documentElement.style.overflow = open ? "hidden" : "";
  const b = document.querySelector(".burger");
  if (b) (b.setAttribute("aria-expanded", open), b.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu"));
  if (open) document.querySelector(".mm-close")?.focus();
  else b?.focus();
}
document.addEventListener("click", (e) => {
  if (e.target.closest(".burger")) setMenu(!document.documentElement.classList.contains("menu-open"));
  else if (e.target.closest("[data-menu-close]")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.documentElement.classList.contains("menu-open")) setMenu(false);
});

function footer() {
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="cols">
        <div>
          <img src="${LOGO}" alt="ForeverCars" style="height:64px;width:auto" />
          <p class="muted" style="margin-top:18px;font-style:italic">« Acheter ou vendre autrement »</p>
        </div>
        <div><h4>Navigation</h4><ul><li><a href="index.html">Accueil</a></li><li><a href="stock.html">Notre Stock</a></li><li><a href="vendu.html">Vendu</a></li><li><a href="a-propos.html">À Propos</a></li></ul></div>
        <div><h4>Contact</h4><ul><li>Lot N23, 1695 rue de la Grand Cour</li><li>45760 Marigny-Les-Usages</li><li><a href="#">c.forevercars@gmail.com</a></li><li><a href="#">06.67.53.74.00</a></li></ul></div>
      </div>
      <div class="legal"><span>© 2026 ForeverCars. Tous droits réservés.</span><span>Tu t'occupes de rien, je m'occupe de tout.</span></div>
    </div>
  </footer>`;
}

function mockSwitch(current) {
  const pages = [["index.html", "Accueil"], ["stock.html", "Stock"], ["fiche.html", "Fiche"], ["vendu.html", "Vendu"], ["a-propos.html", "À propos"], ["contact.html", "Contact"], ["backoffice.html", "Back-office"], ["backoffice-vente.html", "Mise en vente"], ["backoffice-stats.html", "Stats"], ["backoffice-equipe.html", "Équipe"], ["backoffice-docs.html", "Docs"]];
  return `<nav class="mock-switch" aria-label="Maquettes"><a href="sommaire.html" style="color:var(--orange);font-weight:600">☰ Maquettes</a>${pages
    .map(([href, label]) => `<a href="${href}" ${label === current ? 'aria-current="page"' : ""}>${label}</a>`)
    .join("")}</nav>`;
}

function card(v, i, delay = 0) {
  const badge = v.status === "reserved" ? '<span class="tag tag-reserved">Réservé</span>' : v.isNew ? '<span class="tag tag-new">Nouveau</span>' : "";
  return `
  <article class="card reveal" style="--d:${delay}ms">
    <button class="media" data-open="${i}" aria-label="Aperçu ${title(v)}" style="border:0;padding:0;width:100%">${badge}<img loading="lazy" src="${img(v.images[0], 900, 675)}" alt="" /></button>
    <div class="body">
      <h3 class="model"><button data-open="${i}" style="all:unset;cursor:pointer">${title(v)}</button></h3>
      <p class="specs" style="margin:0"><span>${v.year}</span><span>${fmtKm(v.mileage)}</span><span>${cap(v.fuel)}</span></p>
      <div class="foot"><span class="price">${fmtPrice(v.price)}</span><a class="go" href="fiche.html?i=${i}">Voir la fiche →</a></div>
    </div>
  </article>`;
}

/** Apparitions au défilement + header translucide. */
function animate() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
    { rootMargin: "0px 0px -8% 0px" },
  );
  document.querySelectorAll(".reveal, .curtain").forEach((el) => io.observe(el));
  const h = document.querySelector(".site-header");
  // Sécurité : un saut brusque (touche Fin) peut « survoler » un élément sans le déclencher.
  const catchUp = () =>
    document.querySelectorAll(".reveal:not(.in), .curtain:not(.in)").forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight * 0.92) el.classList.add("in");
    });
  const onScroll = () => {
    if (h) h.classList.toggle("scrolled", scrollY > 24);
    catchUp();
  };
  if (!animate.bound) (addEventListener("scroll", onScroll, { passive: true }), (animate.bound = true));
  onScroll();
}

/** Barre latérale du back-office (commune au parc et à la mise en vente). */
function boSide(current) {
  const items = [["backoffice.html", "◧ Parc"], ["backoffice-vente.html", "＋ Mettre en vente"], ["backoffice-docs.html", "◫ Documents"], ["backoffice-stats.html", "◔ Statistiques"], ["backoffice-equipe.html", "◎ Équipe"]];
  return `
  <aside class="side">
    <img src="${LOGO}" alt="ForeverCars" style="height:56px;width:auto;align-self:start" />
    <nav aria-label="Back-office">${items.map(([href, label]) => `<a href="${href}" ${label.includes(current) ? 'aria-current="page"' : ""}>${label}</a>`).join("")}</nav>
    <div class="foot"><p style="font-style:italic;margin:0">« Acheter ou vendre autrement »</p><p style="margin:6px 0 0">Back-Office v0.2</p></div>
  </aside>`;
}
