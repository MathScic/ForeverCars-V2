// Photos en plein écran (panneau et page fiche) : flèches, compteur, glisser, Échap. Aucune barre de miniatures.
(function () {
  let list = [], k = 0, name = "", opener = null, startX = null;
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="lightbox" role="dialog" aria-modal="true" aria-label="Photos en plein écran">
      <button class="icon-btn lb-close" data-lb="close" aria-label="Fermer">${ico("x")}</button>
      <button class="icon-btn lb-prev" data-lb="-1" aria-label="Photo précédente">${ico("arrow")}</button>
      <figure class="lb-stage"><img alt="" /><figcaption class="caps lb-count" aria-live="polite"></figcaption></figure>
      <button class="icon-btn lb-next" data-lb="1" aria-label="Photo suivante">${ico("arrow")}</button>
    </div>`,
  );
  const box = document.querySelector(".lightbox"), pic = box.querySelector("img");
  function show(i) {
    k = (i + list.length) % list.length;
    pic.classList.remove("in");
    pic.src = img(list[k], 2000);
    pic.alt = `${name}, photo ${k + 1}`;
    requestAnimationFrame(() => pic.classList.add("in"));
    box.querySelector(".lb-count").textContent = `${k + 1} / ${list.length}`;
  }
  window.openLightbox = (images, start = 0, label = "") => {
    (list = images), (name = label), (opener = document.activeElement);
    show(start);
    box.classList.add("open");
    box.querySelector(".lb-close").focus();
  };
  const close = () => (box.classList.remove("open"), opener?.focus?.());
  box.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lb]");
    if (b) return b.dataset.lb === "close" ? close() : show(k + Number(b.dataset.lb));
    if (e.target === box) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(k - 1);
    if (e.key === "ArrowRight") show(k + 1);
  });
  box.addEventListener("pointerdown", (e) => (startX = e.clientX));
  box.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(k + (dx < 0 ? 1 : -1));
  });
})();
