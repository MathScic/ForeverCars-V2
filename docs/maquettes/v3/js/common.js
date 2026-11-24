// Outils communs des maquettes v3 (site + back-office).
const SITE = "../../../apps/site/public";
const LOGO = `${SITE}/images/Forever-CarsLogo.svg`;
const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
document.documentElement.dataset.edges = "fade"; // bords « fondu » retenus le 24/11/2026

const fmtPrice = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const fmtKm = (n) => `${new Intl.NumberFormat("fr-FR").format(n)} km`;
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
// Photos Sanity redimensionnées par le CDN ; les photos importées en local (data:/blob:) passent telles quelles.
const img = (url, w, h) => (/^(data|blob):/.test(url) ? url : `${url}?w=${w}${h ? `&h=${h}&fit=crop` : ""}&auto=format&q=78`);

// Les titres Sanity sont saisis en capitales : on les remet en casse normale, sigles gardés.
const SIGLES = /^(BMW|TDI|TFSI|TSI|DSG\d?|GTI|GTD|AMG|PDK|HDI|GT|RS\d?|SUV|FAP|BVA\d?|BVM\d?|DKG\d?|TCR|GDI|EAT\d|BMV|V\d|M|S|E\d+|X\d|Q\d|A\d|TT)$/;
const SPECIAL = { BLUEHDI: "BlueHDi", XDRIVE: "xDrive", DCI: "dCi", TCE: "TCe", "S-LINE": "S line", "S-TRONIC": "S tronic", TRONIC: "tronic", "VVT-I": "VVT-i" };
const word = (w) => SPECIAL[w.toUpperCase()] || (/\d/.test(w) || SIGLES.test(w.toUpperCase()) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
const nice = (s) => s.split(/\s+/).map((w) => (SPECIAL[w.toUpperCase()] ? SPECIAL[w.toUpperCase()] : w.split("-").map(word).join("-"))).join(" ");
// Données à nettoyer : marque répétée, titre complet saisi dans « marque », mentions après « - ».
function title(v) {
  if (v.displayTitle) return v.displayTitle;
  const b = v.brand.trim();
  const m = b.split(/\s+/).length > 1 && b.toUpperCase().includes(v.model.trim().toUpperCase()) ? "" : v.model.trim();
  return nice(`${b} ${m}`.split(/\s[-–]\s/)[0].replace(/^(\S+)\s+\1\s/i, "$1 ").trim());
}
const brandOf = (v) => nice((v.brand.split(/\s+/)[0] || "").toUpperCase());

const NAV = [["stock.html", "Notre stock"], ["vendu.html", "Vendu"], ["a-propos.html", "À propos"]];
function header(current) {
  return `
  <header class="site-header">
    <div class="wrap">
      <a class="home" href="index.html" aria-label="ForeverCars, accueil"><img src="${LOGO}" alt="ForeverCars" class="logo" /></a>
      <nav aria-label="Navigation principale">${NAV.map(([h, l]) => `<a class="nav-link" href="${h}" ${l === current ? 'aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
      <a class="btn btn-primary btn-sm btn-pill header-cta" href="contact.html">Nous contacter</a>
      <button class="burger icon-btn" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-menu">${ico("menu")}</button>
    </div>
  </header>
  <div class="mobile-scrim" data-menu-close></div>
  <aside class="mobile-menu" id="mobile-menu" aria-label="Menu">
    <div class="mm-head"><img src="${LOGO}" alt="" style="height:40px;width:auto" /><button class="icon-btn" data-menu-close aria-label="Fermer le menu">${ico("x")}</button></div>
    <nav aria-label="Navigation mobile">${[["index.html", "Accueil"], ...NAV, ["contact.html", "Contact"]].map(([h, l], k) => `<a href="${h}" style="--k:${k}" ${l === current ? 'aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
    <a class="btn btn-primary" href="tel:0667537400">${ico("phone")}06 67 53 74 00</a>
  </aside>`;
}

function setMenu(open) {
  document.documentElement.classList.toggle("menu-open", open);
  document.documentElement.style.overflow = open ? "hidden" : "";
  const b = document.querySelector(".burger");
  b?.setAttribute("aria-expanded", open);
  (open ? document.querySelector(".mobile-menu .icon-btn") : b)?.focus();
}
document.addEventListener("click", (e) => {
  if (e.target.closest(".burger")) setMenu(!document.documentElement.classList.contains("menu-open"));
  else if (e.target.closest("[data-menu-close]")) setMenu(false);
});
document.addEventListener("keydown", (e) => e.key === "Escape" && document.documentElement.classList.contains("menu-open") && setMenu(false));

function footer() {
  const social = [["instagram", "Instagram"], ["facebook", "Facebook"], ["music", "TikTok"]];
  return `
  <footer class="site-footer">
    <div class="wrap cols">
      <div><img src="${LOGO}" alt="ForeverCars" style="height:58px;width:auto" /><p class="muted" style="font-style:italic;margin:16px 0 0">« Acheter ou vendre autrement »</p>
        <div class="social">${social.map(([i, l]) => `<a href="#" aria-label="${l}">${ico(i)}</a>`).join("")}</div></div>
      <div><h2 class="foot-title caps">Navigation</h2><ul><li><a href="index.html">Accueil</a></li>${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join("")}<li><a href="contact.html">Contact</a></li></ul></div>
      <div><h2 class="foot-title caps">Contact</h2><ul class="contact-list">
        <li>${ico("pin")}<span>Lot N23, 1695 rue de la Grand Cour<br />45760 Marigny-les-Usages</span></li>
        <li>${ico("mail")}<a href="#">c.forevercars@gmail.com</a></li><li>${ico("phone")}<a href="tel:0667537400">06 67 53 74 00</a></li></ul></div>
    </div>
    <div class="wrap legal"><span>© 2026 ForeverCars. Tous droits réservés.</span><span>Tu t'occupes de rien, je m'occupe de tout.</span></div>
  </footer>`;
}

/** Barre flottante des maquettes : pages du site OU de l'app, et choix des bords (fondu / trait). */
const SITE_PAGES = [["index.html", "Accueil"], ["stock.html", "Stock"], ["fiche.html", "Fiche"], ["vendu.html", "Vendu"], ["a-propos.html", "À propos"], ["contact.html", "Contact"]];
const BO_PAGES = [["connexion.html", "Connexion"], ["backoffice.html", "Parc"], ["vente.html", "Mise en vente"], ["documents.html", "Documents"], ["stats.html", "Stats"], ["equipe.html", "Équipe"]];
function mockSwitch(current) {
  const bo = BO_PAGES.some(([, l]) => l === current);
  const pages = bo ? BO_PAGES : SITE_PAGES;
  return `<nav class="mock-switch" aria-label="Maquettes"><a href="sommaire.html" class="ms-home">Sommaire</a><span class="ms-sep"></span>${pages.map(([h, l]) => `<a href="${h}" ${l === current ? 'aria-current="page"' : ""}>${l}</a>`).join("")}
    <a class="ms-jump" href="${bo ? "index.html" : "backoffice.html"}">${bo ? "Voir le site" : "Voir l'app"}</a></nav>`;
}

/** Apparitions au défilement + menu transparent tant que la bannière est visible. */
function animate() {
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal:not(.in), .focus:not(.in), .steps:not(.in), .wipe:not(.in)").forEach((el) => io.observe(el));
  const h = document.querySelector(".site-header"), hero = document.querySelector(".hero");
  const onScroll = () => h?.classList.toggle("scrolled", hero ? hero.getBoundingClientRect().bottom <= h.offsetHeight + 1 : scrollY > 8);
  if (!animate.bound) (addEventListener("scroll", onScroll, { passive: true }), (animate.bound = true));
  onScroll();
}
