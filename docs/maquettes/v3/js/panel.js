// Panneau véhicule : s'ouvre sur tout élément [data-open="<index STOCK>"]. La page fiche reste pour les liens partagés.
// Galerie propre : grande photo, flèches, compteur et fine barre de progression ; clic = plein écran (lightbox.js).
(function () {
  let cur = null, photo = 0, opener = null, startX = null, swiped = false;
  document.body.insertAdjacentHTML("beforeend", `<div class="scrim" hidden></div><aside class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" hidden></aside>`);
  const scrim = document.querySelector(".scrim"), sheet = document.querySelector(".sheet");

  function render(v, i) {
    const specs = [["calendar", "Année", v.year], ["gauge", "Kilométrage", fmtKm(v.mileage)], ["fuel", "Énergie", cap(v.fuel)], ["gear", "Boîte", cap(v.transmission)], ["bolt", "Puissance", `${v.power} ch`], ["car", "Marque", brandOf(v) || "—"]];
    const link = v.liveId ? `fiche.html?n=${v.liveId}` : `fiche.html?i=${i}`;
    sheet.innerHTML = `
      <div class="sheet-bar"><h2 class="model" id="sheet-title">${title(v)}</h2><button class="icon-btn" data-close aria-label="Fermer">${ico("x")}</button></div>
      <div class="sheet-scroll">
        <div class="stage" data-zoom role="group" aria-roledescription="galerie" aria-label="Photos du véhicule">
          <button class="icon-btn prev" data-step="-1" aria-label="Photo précédente">${ico("arrow")}</button><button class="icon-btn next" data-step="1" aria-label="Photo suivante">${ico("arrow")}</button>
          <span class="tag tag-soft counter" aria-live="polite"></span><div class="stage-bar">${v.images.map(() => "<i></i>").join("")}</div></div>
        <div class="sheet-body">
          <div class="sheet-price" style="--k:0"><div style="display:grid;gap:12px"><span class="vcard-badges" style="position:static">${badges(v)}</span><span class="price">${fmtPrice(v.price)}</span></div><a class="link" href="${link}">Voir la fiche complète ${ico("arrow")}</a></div>
          <dl class="spec-grid" style="--k:1">${specs.map(([ic, l, val]) => `<div class="spec soft"><dt>${ico(ic)}${l}</dt><dd>${val}</dd></div>`).join("")}</dl>
          <div class="sheet-cta" style="--k:2"><a class="btn btn-primary" href="contact.html?vehicule=${encodeURIComponent(title(v))}">Je suis intéressé ${ico("arrow", "go")}</a><a class="btn btn-ghost" href="tel:0667537400" aria-label="Appeler">${ico("phone")}</a><button class="btn btn-ghost" data-copy aria-label="Copier le lien de l'annonce">${ico("copy")}</button></div>
          <div style="--k:3"><h3 class="caps sheet-h">Description</h3><p class="desc">${(v.description || "").trim()}</p><button class="link" data-more style="background:none;border:0;padding:12px 0 0;color:var(--orange)">Lire la suite</button></div>
          <div style="--k:4"><h3 class="caps sheet-h">Équipements</h3><div class="chips">${(v.features || []).map((f) => `<span class="chip">${f}</span>`).join("")}</div></div>
        </div>
      </div>`;
  }

  function show(k) {
    const v = cur.v;
    photo = (k + v.images.length) % v.images.length;
    const stage = sheet.querySelector(".stage"), old = stage.querySelector("img");
    stage.insertAdjacentHTML("afterbegin", `<img src="${img(v.images[photo], 1280)}" alt="${title(v)}, photo ${photo + 1}" />`);
    if (old) (old.classList.add("leaving"), setTimeout(() => old.remove(), 500));
    stage.querySelector(".counter").textContent = `${photo + 1} / ${v.images.length}`;
    stage.querySelectorAll(".stage-bar i").forEach((b, j) => b.classList.toggle("on", j === photo));
  }

  window.openPanel = function (i, from) {
    opener = from || document.activeElement;
    cur = { v: STOCK[i], i };
    render(cur.v, i);
    scrim.hidden = sheet.hidden = false;
    document.documentElement.style.overflow = "hidden";
    show(0);
    requestAnimationFrame(() => requestAnimationFrame(() => (scrim.classList.add("open"), sheet.classList.add("open"))));
    sheet.querySelector("[data-close]").focus({ preventScroll: true });
  };

  function close() {
    scrim.classList.remove("open");
    sheet.classList.remove("open");
    document.documentElement.style.overflow = "";
    setTimeout(() => (scrim.hidden = sheet.hidden = true), 700);
    opener?.focus?.({ preventScroll: true });
    cur = null;
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open]");
    if (t) return e.preventDefault(), openPanel(Number(t.dataset.open), t);
    if (!cur) return;
    if (e.target.closest("[data-close]") || e.target === scrim) return close();
    const s = e.target.closest("[data-step]");
    if (s) return show(photo + Number(s.dataset.step));
    if (e.target.closest("[data-more]")) return sheet.querySelector(".desc").classList.add("full"), e.target.closest("[data-more]").remove();
    if (e.target.closest("[data-copy]")) return (e.target.closest("[data-copy]").innerHTML = ico("check"));
    if (e.target.closest("[data-zoom]")) return swiped ? (swiped = false) : openLightbox(cur.v.images, photo, title(cur.v));
  });
  document.addEventListener("keydown", (e) => {
    if (!cur || document.querySelector(".lightbox.open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(photo - 1);
    if (e.key === "ArrowRight") show(photo + 1);
  });
  // Glisser au doigt sur la photo
  sheet.addEventListener("pointerdown", (e) => e.target.closest(".stage") && (startX = e.clientX));
  sheet.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) (swiped = true, show(photo + (dx < 0 ? 1 : -1)));
  });
})();
