// Carrousel des coups de cœur : avance 4 par 4 (2 ou 1 selon la largeur), en boucle, défilement auto,
// flèches, glisser au doigt (la carte suit le doigt). Pause au survol, au clavier ou panneau ouvert.
function carousel(root, cards) {
  const n = cards.length, view = root.querySelector(".car-view"), track = root.querySelector(".car-track");
  track.innerHTML = [0, 1, 2].map(() => cards.map((c) => `<div class="car-slide">${c}</div>`).join("")).join("");
  const slides = [...track.children];
  let index = n, drag = null, timer = null, moved = false;
  const per = () => Number(getComputedStyle(root).getPropertyValue("--per")) || 4;
  const step = () => slides[1].offsetLeft - slides[0].offsetLeft;
  const place = (anim, dx = 0) => {
    track.style.transition = anim ? "transform 950ms var(--ease)" : "none";
    track.style.transform = `translateX(${-index * step() + dx}px)`;
  };
  function sync() {
    const p = per();
    slides.forEach((s, k) => {
      const on = k >= index && k < index + p;
      s.inert = !on;
      s.setAttribute("aria-hidden", !on);
    });
    root.querySelectorAll(".car-dots i").forEach((d, k) => d.classList.toggle("on", (k - (index % n) + n) % n < p));
  }
  function go(dir) {
    index += dir * per();
    place(true);
    sync();
  }
  // Après l'animation, on revient sans bruit sur la copie du milieu : la boucle est infinie.
  track.addEventListener("transitionend", (e) => {
    if (e.target !== track) return; // les animations des cartes remontent aussi jusqu'ici
    if (index >= 2 * n || index < n) (index = ((index % n) + n) % n + n), place(false), sync();
  });
  root.querySelector(".car-dots").innerHTML = cards.map(() => "<i></i>").join("");
  root.querySelector("[data-car='prev']").onclick = () => go(-1);
  root.querySelector("[data-car='next']").onclick = () => go(1);

  view.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, id: e.pointerId };
    moved = false;
  });
  view.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!moved && Math.abs(dx) < 10) return; // petite marge avant de décider qu'on glisse
    if (!moved) (moved = true), view.setPointerCapture(drag.id);
    place(false, dx);
  });
  const end = (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    drag = null;
    if (!moved) return;
    Math.abs(dx) > 60 ? go(dx < 0 ? 1 : -1) : place(true);
  };
  view.addEventListener("pointerup", end);
  view.addEventListener("pointercancel", end);
  // Un glissement ne doit pas ouvrir la fiche au relâchement.
  view.addEventListener("click", (e) => moved && (e.stopPropagation(), e.preventDefault(), (moved = false)), true);

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const paused = () => root.matches(":hover, :focus-within") || document.querySelector(".sheet.open") || document.hidden;
  if (!reduced) timer = setInterval(() => !paused() && go(1), 6000);
  addEventListener("resize", () => (place(false), sync()));
  place(false);
  sync();
  return { go, stop: () => clearInterval(timer) };
}
