// Liste déroulante aux couleurs du site (remplace <select>, dont la liste ouverte prend le style du système).
// Clavier : ↑ ↓ Début Fin, Entrée ou Espace pour choisir, Échap pour fermer. Émet « dd-change » sur le document.
function dropdown(id, label, options, value = "") {
  const cur = options.find(([v]) => String(v) === String(value)) || options[0];
  return `<div class="dd" id="${id}" data-value="${cur[0]}">
    <button type="button" class="dd-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="${label} : ${cur[1]}"><span class="dd-val">${cur[1]}</span>${ico("chevron")}</button>
    <ul class="dd-list" role="listbox" tabindex="-1" aria-label="${label}">${options
      .map(([v, l], k) => `<li role="option" id="${id}-${k}" data-v="${v}" aria-selected="${v === cur[0]}"><span>${l}</span>${ico("check")}</li>`)
      .join("")}</ul></div>`;
}
const ddValue = (id) => document.getElementById(id)?.dataset.value ?? "";

(function () {
  const opts = (dd) => [...dd.querySelectorAll("[role=option]")];
  const active = (dd) => dd.querySelector(".active");
  function setActive(dd, li) {
    opts(dd).forEach((o) => o.classList.toggle("active", o === li));
    dd.querySelector(".dd-list").setAttribute("aria-activedescendant", li.id);
    li.scrollIntoView({ block: "nearest" });
  }
  function open(dd) {
    document.querySelectorAll(".dd.open").forEach((o) => o !== dd && close(o));
    dd.classList.add("open");
    dd.querySelector(".dd-btn").setAttribute("aria-expanded", "true");
    const list = dd.querySelector(".dd-list");
    setActive(dd, dd.querySelector("[aria-selected=true]") || opts(dd)[0]);
    list.focus({ preventScroll: true });
  }
  function close(dd, refocus) {
    dd.classList.remove("open");
    dd.querySelector(".dd-btn").setAttribute("aria-expanded", "false");
    if (refocus) dd.querySelector(".dd-btn").focus();
  }
  function choose(dd, li) {
    opts(dd).forEach((o) => o.setAttribute("aria-selected", o === li));
    dd.dataset.value = li.dataset.v;
    dd.querySelector(".dd-val").textContent = li.textContent;
    const btn = dd.querySelector(".dd-btn");
    btn.setAttribute("aria-label", `${dd.querySelector(".dd-list").getAttribute("aria-label")} : ${li.textContent}`);
    close(dd, true);
    document.dispatchEvent(new CustomEvent("dd-change", { detail: { id: dd.id, value: li.dataset.v } }));
  }
  window.ddSet = (id, v) => {
    const dd = document.getElementById(id), li = dd && opts(dd).find((o) => o.dataset.v === String(v));
    if (li) (opts(dd).forEach((o) => o.setAttribute("aria-selected", o === li)), (dd.dataset.value = li.dataset.v), (dd.querySelector(".dd-val").textContent = li.textContent));
  };
  document.addEventListener("click", (e) => {
    const dd = e.target.closest(".dd");
    document.querySelectorAll(".dd.open").forEach((o) => o !== dd && close(o));
    if (!dd) return;
    const li = e.target.closest("[role=option]");
    if (li) return choose(dd, li);
    if (e.target.closest(".dd-btn")) dd.classList.contains("open") ? close(dd) : open(dd);
  });
  document.addEventListener("keydown", (e) => {
    const dd = e.target.closest?.(".dd");
    if (!dd) return;
    const isOpen = dd.classList.contains("open"), all = opts(dd), i = all.indexOf(active(dd));
    if (!isOpen && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key) && e.target.matches(".dd-btn")) return e.preventDefault(), open(dd);
    if (!isOpen) return;
    const moves = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: all.length - 1 };
    if (e.key in moves) return e.preventDefault(), setActive(dd, all[Math.max(0, Math.min(all.length - 1, moves[e.key]))]);
    if (e.key === "Enter" || e.key === " ") return e.preventDefault(), choose(dd, active(dd));
    if (e.key === "Escape") return e.preventDefault(), close(dd, true);
    if (e.key === "Tab") close(dd);
  });
})();
