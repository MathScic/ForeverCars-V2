// Cadre du back-office (barre latérale, barre du haut, notifications) + petit état de démo partagé
// entre le parc et la mise en vente (rôle, connexion, véhicules publiés pendant la démo).
const BO = (() => {
  const KEY = "fc-bo-v3";
  const s = { role: "admin", online: true, added: [], log: [], backup: "15:58" };
  try { Object.assign(s, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };
  return { s, set: (p) => (Object.assign(s, p), save()), isAdmin: () => s.role === "admin" };
})();
const now = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const who = () => (BO.isAdmin() ? "Gérant" : "Vendeur");
function addLog(text, by = who()) {
  BO.set({ log: [{ time: now(), who: by, text }, ...BO.s.log].slice(0, 12) });
}

function boShell(current) {
  const nav = [["backoffice.html", "car", "Parc véhicules"], ["documents.html", "file", "Documents"], ["stats.html", "chart", "Statistiques"], ["equipe.html", "users", "Équipe & rôles"]];
  return `
  <div class="app">
    <aside class="side" id="side" aria-label="Back-office">
      <div class="side-top"><a href="backoffice.html" aria-label="Parc véhicules"><img src="${LOGO}" alt="ForeverCars" class="side-logo" /></a>
        <button class="icon-btn side-close" data-side aria-label="Fermer le menu">${ico("x")}</button></div>
      <a class="btn btn-primary side-cta" href="vente.html">${ico("plus")}Mettre en vente</a>
      <nav>${nav.map(([h, i, l]) => `<a href="${h}" ${l === current ? 'aria-current="page"' : ""} >${ico(i)}<span>${l}</span></a>`).join("")}</nav>
      <div class="side-foot">
        <div class="backup soft"><span class="backup-title">${ico("lock")}Sauvegarde chiffrée</span><span class="muted" id="backup-at">Dernière : aujourd'hui ${BO.s.backup}</span>
          <button class="btn btn-ghost btn-sm" data-backup>Sauvegarder</button></div>
        <div class="profile"><span class="avatar">CL</span><span><strong>Clément</strong><small id="role-name">${who()}</small></span><a class="icon-btn logout" href="connexion.html" aria-label="Se déconnecter" title="Se déconnecter">${ico("back")}</a></div>
        <div class="seg" role="group" aria-label="Voir l'application comme"><button data-role="admin" aria-pressed="${BO.isAdmin()}">Gérant</button><button data-role="seller" aria-pressed="${!BO.isAdmin()}">Vendeur</button></div>
      </div>
    </aside>
    <div class="side-scrim" data-side></div>
    <div class="main">
      <header class="topbar">
        <button class="icon-btn side-open" data-side aria-label="Ouvrir le menu">${ico("menu")}</button>
        <label class="search bo-search">${ico("search")}<input id="bo-q" type="search" placeholder="Rechercher un véhicule, une plaque…" aria-label="Rechercher dans le parc" /><kbd>Ctrl K</kbd></label>
        <button class="sync" id="sync" data-sync></button>
      </header>
      <div id="page"></div>
    </div>
  </div>
  <div class="toasts" role="status" aria-live="polite"></div>`;
}

function renderSync() {
  const el = document.getElementById("sync");
  const pending = BO.s.added.filter((v) => v.status === "pending").length;
  el.className = `sync ${BO.s.online ? "on" : "off"}`;
  el.innerHTML = BO.s.online ? `<i></i>En ligne · synchronisé` : `<i></i>Hors-ligne${pending ? ` · ${pending} en attente` : ""}`;
  el.title = "Démo : cliquer pour simuler une coupure d'internet";
}

function toast(msg) {
  const box = document.querySelector(".toasts");
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `${ico("check")}<span>${msg}</span>`;
  box.append(t);
  requestAnimationFrame(() => t.classList.add("in"));
  setTimeout(() => (t.classList.remove("in"), setTimeout(() => t.remove(), 400)), 3200);
}

/** Monte le cadre ; `onChange` est rappelé quand le rôle ou la connexion changent. */
function mountShell(current, onChange = () => {}) {
  document.getElementById("shell").outerHTML = boShell(current);
  renderSync();
  document.addEventListener("click", (e) => {
    const r = e.target.closest("[data-role]");
    if (r) {
      BO.set({ role: r.dataset.role });
      document.querySelectorAll("[data-role]").forEach((b) => b.setAttribute("aria-pressed", b === r));
      document.getElementById("role-name").textContent = who();
      toast(BO.isAdmin() ? "Profil Gérant : prix d'achat, marges et suppressions visibles." : "Profil Vendeur : les données internes sont masquées.");
      return onChange();
    }
    if (e.target.closest("[data-sync]")) {
      const online = !BO.s.online;
      const pending = BO.s.added.filter((v) => v.status === "pending");
      if (online && pending.length) BO.set({ added: BO.s.added.map((v) => (v.status === "pending" ? { ...v, status: "online" } : v)) }), addLog(`${pending.length} annonce(s) envoyée(s) au retour d'internet`, "Système");
      BO.set({ online });
      renderSync();
      toast(online ? (pending.length ? `Connexion rétablie : ${pending.length} annonce(s) maintenant en ligne.` : "Connexion rétablie.") : "Hors-ligne : vous continuez à travailler, tout est gardé sur ce PC.");
      return onChange();
    }
    if (e.target.closest("[data-backup]")) {
      BO.set({ backup: now() });
      document.getElementById("backup-at").textContent = `Dernière : aujourd'hui ${BO.s.backup}`;
      return toast(BO.s.online ? "Sauvegarde chiffrée effectuée." : "Copie locale faite ; l'envoi chiffré partira au retour d'internet.");
    }
    if (e.target.closest("[data-side]")) document.documentElement.classList.toggle("nav-open");
  });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") (e.preventDefault(), document.getElementById("bo-q").focus());
  });
}
