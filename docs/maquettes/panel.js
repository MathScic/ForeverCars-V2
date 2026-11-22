// Panneau latéral véhicule (comme le site actuel, en style Nocturne).
// Ouverture au clic sur tout élément [data-open="<index>"] ; la page /fiche reste pour les liens partagés.
(function () {
  let current = null;
  let photo = 0;
  let opener = null;
  let swiped = false; // un glissement ne doit pas ouvrir l'agrandissement

  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="scrim" hidden></div>
     <aside class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" hidden></aside>
     <div class="lightbox" role="dialog" aria-modal="true" aria-label="Photo en grand"><button class="icon-btn" data-lb-close style="position:absolute;top:20px;right:20px" aria-label="Fermer">✕</button><img alt="" /></div>`,
  );
  const scrim = document.querySelector(".scrim");
  const sheet = document.querySelector(".sheet");
  const lightbox = document.querySelector(".lightbox");

  function render(v, i) {
    const specs = [["Année", v.year], ["Kilométrage", fmtKm(v.mileage)], ["Carburant", cap(v.fuel)], ["Boîte", cap(v.transmission)], ["Puissance", `${v.power} ch`]];
    const badge = v.status === "reserved" ? '<span class="tag tag-reserved">Réservé</span>' : v.isNew ? '<span class="tag tag-new">Nouveau</span>' : "";
    sheet.innerHTML = `
      <div class="sheet-bar"><h2 class="model" id="sheet-title" style="font-size:14px">${title(v)}</h2><button class="icon-btn" data-close aria-label="Fermer">✕</button></div>
      <div class="stage" data-zoom><button class="icon-btn nav-prev" data-prev aria-label="Photo précédente">←</button><button class="icon-btn nav-next" data-next aria-label="Photo suivante">→</button>
        <div class="dots">${v.images.map((_, k) => `<button data-dot="${k}" aria-label="Photo ${k + 1}"></button>`).join("")}</div></div>
      <div class="sheet-body">
        <div style="--k:0;display:flex;justify-content:space-between;align-items:end;gap:16px"><div style="display:grid;gap:12px">${badge ? `<div>${badge}</div>` : ""}<span class="price" style="font-size:40px">${fmtPrice(v.price)}</span></div>
          <a class="link-arrow" href="fiche.html?i=${i}">Voir la fiche →</a></div>
        <dl style="--k:1;margin:0;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line)">${specs
          .map(([l, val]) => `<div style="padding:16px 0;border-bottom:1px solid var(--line)"><dt class="eyebrow plain" style="font-size:9px">${l}</dt><dd style="margin:10px 0 0;font:600 17px/1 var(--font-display);font-stretch:112%">${val}</dd></div>`)
          .join("")}</dl>
        <div style="--k:2;display:grid;gap:10px"><a class="btn btn-primary" href="#" style="justify-content:space-between">Je suis intéressé <span class="arrow">→</span></a>
          <button class="btn btn-ghost" style="background:none;justify-content:space-between" data-copy>Copier le lien de cette annonce <span>⧉</span></button></div>
        <div style="--k:3"><span class="eyebrow">Description</span><p style="margin:16px 0 0;white-space:pre-line;line-height:1.75">${(v.description || "").trim()}</p></div>
        <div style="--k:4"><span class="eyebrow">Équipements</span><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px">${(v.features || [])
          .map((f) => `<span style="padding:9px 13px;border:1px solid var(--line-strong);border-radius:2px;font-size:13px;color:var(--silver)">${f}</span>`)
          .join("")}</div></div>
      </div>`;
  }

  function show(k) {
    const v = current.v;
    photo = (k + v.images.length) % v.images.length;
    const stage = sheet.querySelector(".stage");
    const old = stage.querySelector("img");
    stage.insertAdjacentHTML("afterbegin", `<img src="${img(v.images[photo], 1400)}" alt="${title(v)}, photo ${photo + 1}" />`);
    if (old) (old.classList.add("leaving"), setTimeout(() => old.remove(), 500));
    sheet.querySelectorAll("[data-dot]").forEach((d, j) => d.setAttribute("aria-current", j === photo));
  }

  window.openPanel = function (i, from) {
    opener = from || document.activeElement;
    current = { v: STOCK[i], i };
    render(current.v, i);
    scrim.hidden = sheet.hidden = false;
    document.documentElement.style.overflow = "hidden";
    show(0);
    requestAnimationFrame(() => requestAnimationFrame(() => (scrim.classList.add("open"), sheet.classList.add("open"))));
    document.querySelector(".marquee")?.classList.add("paused");
    sheet.querySelector("[data-close]").focus({ preventScroll: true });
  };

  function close() {
    scrim.classList.remove("open");
    sheet.classList.remove("open");
    document.documentElement.style.overflow = "";
    document.querySelector(".marquee")?.classList.remove("paused");
    setTimeout(() => (scrim.hidden = sheet.hidden = true), 700);
    opener?.focus?.({ preventScroll: true });
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open]");
    if (t) return e.preventDefault(), openPanel(Number(t.dataset.open), t);
    if (e.target.closest("[data-close]") || e.target === scrim) return close();
    if (e.target.closest("[data-prev]")) return show(photo - 1);
    if (e.target.closest("[data-next]")) return show(photo + 1);
    const dot = e.target.closest("[data-dot]");
    if (dot) return show(Number(dot.dataset.dot));
    if (e.target.closest("[data-copy]")) return (e.target.closest("[data-copy]").firstChild.textContent = "Lien copié ! ");
    if (e.target.closest("[data-zoom]") && swiped) return void (swiped = false);
    if (e.target.closest("[data-zoom]")) return lightbox.querySelector("img").setAttribute("src", img(current.v.images[photo], 2400)), lightbox.classList.add("open");
    if (e.target.closest("[data-lb-close]") || e.target === lightbox) lightbox.classList.remove("open");
  });

  document.addEventListener("keydown", (e) => {
    if (!current || sheet.hidden) return;
    if (e.key === "Escape") return lightbox.classList.contains("open") ? lightbox.classList.remove("open") : close();
    if (e.key === "ArrowLeft") show(photo - 1);
    if (e.key === "ArrowRight") show(photo + 1);
  });

  // Glisser au doigt sur la photo
  let startX = null;
  sheet.addEventListener("pointerdown", (e) => e.target.closest(".stage") && (startX = e.clientX));
  sheet.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) (swiped = true, show(photo + (dx < 0 ? 1 : -1)));
  });
})();
