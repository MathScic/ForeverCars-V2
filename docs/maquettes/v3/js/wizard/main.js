// Branchements de l'assistant : clics, saisie, clavier (Entrée = continuer), glisser-déposer des photos.
mountShell("Mettre en vente", () => renderStep());
document.getElementById("page").innerHTML = `
  <div class="page wizard">
    <div class="w-top" id="w-head"><div class="w-title"><a class="icon-btn" href="backoffice.html" aria-label="Retour au parc">${ico("back")}</a>
      <div><h1>Nouveau véhicule</h1><span class="muted" id="w-sub"></span></div></div>
      <button class="btn btn-ghost" data-w="draft">${ico("save")}Enregistrer en brouillon</button></div>
    <ol class="w-steps" id="w-steps" aria-label="Étapes"></ol>
    <div class="w-panel soft" id="w-panel"></div>
    <div class="w-foot" id="w-foot"></div>
  </div>`;

const ACTIONS = {
  lookup: () => lookup(document.getElementById("plate").value),
  "demo-photos": demoPhotos,
  "cg-demo": readCard,
  "apply-est": () => ((W.price = String(estMid())), renderStep("#desc")),
  ai: writeWithAI,
  print: () => toast("Fiche vitrine A4 envoyée à l'imprimante."),
  publish,
  prev: () => go(W.step - 1),
  next: () => !missing() && go(W.step + 1),
  draft: saveDraft,
};

document.addEventListener("click", (e) => {
  const t = (sel) => e.target.closest(sel);
  if (t("[data-w]")) return ACTIONS[t("[data-w]").dataset.w]?.();
  if (t("[data-plate]")) return lookup(t("[data-plate]").dataset.plate);
  if (t("[data-mode]")) return setMode(t("[data-mode]").dataset.mode);
  if (t("[data-go]")) return go(Number(t("[data-go]").dataset.go));
  if (t("[data-cover]")) return movePhoto(Number(t("[data-cover]").dataset.cover), 0);
  if (t("[data-rm]")) return W.photos.splice(Number(t("[data-rm]").dataset.rm), 1), renderStep();
  const pick = t("[data-pick]");
  if (pick) {
    W[pick.dataset.pick] = pick.dataset.v;
    return pick.parentElement.querySelectorAll("[data-pick]").forEach((b) => b.setAttribute("aria-pressed", b === pick));
  }
  const eq = t("[data-equip]");
  if (eq) {
    const on = !W.equip.includes(eq.dataset.equip);
    W.equip = on ? [...W.equip, eq.dataset.equip] : W.equip.filter((x) => x !== eq.dataset.equip);
    return eq.setAttribute("aria-pressed", on), (eq.innerHTML = `${on ? ico("check") : ""}${eq.dataset.equip}`);
  }
  const opt = t("[data-opt]");
  if (opt) return (W[opt.dataset.opt] = !W[opt.dataset.opt]), opt.setAttribute("aria-pressed", W[opt.dataset.opt]);
});

document.addEventListener("input", (e) => {
  const el = e.target;
  if (el.id === "plate") return (el.value = fmtPlate(el.value));
  if (el.dataset.k === "plate") el.value = fmtPlate(el.value);
  if (el.dataset.f) W.f[el.dataset.f] = el.value;
  if (el.dataset.k) W[el.dataset.k] = el.value;
  const m = document.getElementById("margin");
  if (m) m.innerHTML = marginLabel();
  chrome();
});
// Montants : « 25990 » devient « 25 990 » en quittant le champ.
document.addEventListener("focusout", (e) => ["km", "price", "buy", "repair"].includes(e.target.dataset?.k) && num(e.target.value) && (e.target.value = fmtNum(num(e.target.value))));
document.addEventListener("change", (e) => (e.target.matches("[data-files]") && filePhotos(e.target.files), e.target.matches("[data-cg]") && readCard()));

document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" || e.target.tagName === "TEXTAREA" && !e.ctrlKey) return;
  if (e.target.id === "plate") return e.preventDefault(), ACTIONS.lookup();
  if (e.target.tagName === "INPUT" || e.ctrlKey) e.preventDefault(), ACTIONS.next();
});

// Glisser-déposer : un dossier de photos sur la zone, ou une photo sur une autre pour réordonner.
let dragFrom = null;
document.addEventListener("dragstart", (e) => (dragFrom = e.target.closest?.("[data-ph]") ? Number(e.target.closest("[data-ph]").dataset.ph) : null));
document.addEventListener("dragover", (e) => {
  if (e.target.closest("[data-drop], [data-drop-cg], [data-ph]")) e.preventDefault(), e.target.closest("[data-drop], [data-drop-cg]")?.classList.add("over");
});
document.addEventListener("dragleave", (e) => e.target.closest?.("[data-drop], [data-drop-cg]")?.classList.remove("over"));
document.addEventListener("drop", (e) => {
  const ph = e.target.closest("[data-ph]"), zone = e.target.closest("[data-drop]"), cg = e.target.closest("[data-drop-cg]");
  if (cg) return e.preventDefault(), cg.classList.remove("over"), readCard();
  if (!ph && !zone) return;
  e.preventDefault();
  zone?.classList.remove("over");
  if (ph && dragFrom !== null) return movePhoto(dragFrom, Number(ph.dataset.ph)), (dragFrom = null);
  if (e.dataTransfer.files.length) filePhotos(e.dataTransfer.files);
});

renderStep();
