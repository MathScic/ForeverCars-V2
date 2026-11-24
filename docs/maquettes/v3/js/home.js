// Accueil : cadre, piliers, carrousel des coups de cœur (4 par 4), étapes.
document.getElementById("header").outerHTML = header("Accueil");
document.getElementById("footer").outerHTML = footer();
document.getElementById("switch").outerHTML = mockSwitch("Accueil");
document.getElementById("hero-actions").innerHTML = `<a class="btn btn-primary" href="stock.html">Voir notre stock ${ico("arrow", "go")}</a><a class="btn btn-ghost" href="contact.html">Vendre mon véhicule</a>`;
document.getElementById("place").insertAdjacentHTML("afterbegin", ico("pin"));
document.getElementById("all-stock").innerHTML = `Voir tout le stock ${ico("arrow", "go")}`;
document.getElementById("founder-actions").innerHTML = `<a class="btn btn-primary" href="tel:0667537400">${ico("phone")}06 67 53 74 00</a><a class="btn btn-ghost" href="contact.html">${ico("mail")}Écrire un message</a>`;

const pillars = [
  ["wrench", "Expertise", "Des années d'expérience dans l'automobile pour vous garantir les meilleurs véhicules."],
  ["shield", "Transparence", "Historique complet, rapport d'inspection détaillé. Aucune mauvaise surprise."],
  ["handshake", "Accompagnement", "De la recherche à l'immatriculation, on s'occupe de tout pour vous."],
];
document.getElementById("pillars").innerHTML = pillars
  .map(([i, t, d], k) => `<article class="pillar soft reveal" style="--d:${k * 120}ms"><span class="icon-box">${ico(i)}</span><h3 class="h3">${t}</h3><p>${d}</p></article>`)
  .join("");

// Coups de cœur : ceux du stock + ceux mis en avant depuis l'app pendant la démo (live.js).
const featured = STOCK.map((v, i) => ({ v, i })).filter(({ v }) => v.isFeatured);
const car = document.getElementById("car");
car.querySelector("[data-car='prev']").innerHTML = ico("arrow");
car.querySelector("[data-car='next']").innerHTML = ico("arrow");
carousel(car, featured.map(({ v, i }) => vehicleCard(v, { i, reveal: false, fav: false })));

const steps = [
  ["car", "Vous vendez ?", "On s'occupe du reste, et vous avez l'esprit libéré."],
  ["clipboard", "Expertise", "Contrôle technique, historique, essai routier. Rien n'est laissé au hasard."],
  ["handshake", "Accompagnement", "Plus de soucis de vérification des paiements, Forever gère pour vous la transaction."],
  ["key", "Livraison", "Vous recevez votre véhicule clé en main, lustré et nettoyé."],
];
document.getElementById("steps").innerHTML = steps
  .map(([i, t, d], k) => `<li class="step reveal" style="--d:${k * 120}ms;--sd:${300 + k * 650}ms"><span class="step-icon">${ico(i)}</span><h3 class="h3">${t}</h3><p>${d}</p></li>`)
  .join("");
animate();
