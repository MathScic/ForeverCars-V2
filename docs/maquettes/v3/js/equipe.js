// Équipe & rôles (gérant uniquement) : membres, invitation, droits, postes connectés. Maquette : rien n'est envoyé.
(function () {
  const page = document.getElementById("page");
  const ROLES = [["admin", "Gérant"], ["seller", "Vendeur"]];
  const members = [
    { name: "Clément Scicluna", mail: "c.forevercars@gmail.com", role: "admin", status: "En ligne · PC du garage", cls: "on", me: true },
    { name: "Vendeur (démo)", mail: "vendeur.demo@exemple.fr", role: "seller", status: "Vu il y a 2 h", cls: "" },
  ];
  const rights = [
    ["Voir le parc et les fiches", 1, 1], ["Mettre en vente, modifier une annonce", 1, 1], ["Publier, marquer vendu ou réservé", 1, 1],
    ["Préparer Leboncoin / La Centrale", 1, 1], ["Voir les prix d'achat et les marges", 1, 0], ["Supprimer un véhicule", 1, 0],
    ["Statistiques de marge", 1, 0], ["Gérer l'équipe et les rôles", 1, 0],
  ];
  const devices = [["PC du garage · Windows", "Clément · actif maintenant"], ["Portable · Windows", "Vendeur (démo) · il y a 2 h"]];
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  function render() {
    if (!BO.isAdmin()) {
      page.innerHTML = `<div class="page"><div class="page-title"><div><h1>Équipe & rôles</h1><p>Qui a accès à l'application.</p></div></div>
        <div class="team-card soft"><p class="locked" style="display:flex;gap:12px;align-items:center;margin:0">${ico("lock")}Réservé au gérant : votre profil Vendeur ne peut pas gérer l'équipe.</p></div></div>`;
      return;
    }
    page.innerHTML = `<div class="page">
      <div class="page-title"><div><h1>Équipe & rôles</h1><p>Chaque personne se connecte avec son propre compte. Seul le gérant voit cette page.</p></div></div>
      <div class="team">
        <section class="team-card soft" aria-labelledby="t-m"><h2 id="t-m">Membres</h2>
          <div>${members.map((m, k) => `<div class="member"><span class="avatar" aria-hidden="true">${initials(m.name)}</span><span style="min-width:0"><strong>${m.name}${m.me ? ' <span class="muted" style="font-weight:400">(vous)</span>' : ""}</strong><small>${m.mail}</small></span>
            <span class="presence ${m.cls}"><i></i>${m.status}</span>${m.me ? '<span class="muted" style="font-size:13px;text-align:right">Gérant</span>' : dropdown(`role-${k}`, `Rôle de ${m.name}`, ROLES, m.role)}</div>`).join("")}</div>
          <form class="invite" id="invite"><label class="field"><span>Inviter par e-mail</span><input type="email" id="inv-mail" required placeholder="prenom@exemple.fr" /></label>
            ${dropdown("inv-role", "Rôle de la personne invitée", ROLES, "seller")}<button class="btn btn-primary btn-sm" type="submit">Inviter</button></form>
          <p class="note">La personne reçoit un e-mail pour créer son mot de passe, puis installe l'application sur son PC.</p>
        </section>
        <div class="team-col">
          <section class="team-card soft" aria-labelledby="t-d"><h2 id="t-d">Ce que chaque rôle peut faire</h2>
            <table class="rights"><thead><tr><th>Action</th><th>Gérant</th><th>Vendeur</th></tr></thead><tbody>${rights.map(([l, a, s]) => `<tr><td>${l}</td><td>${a ? ico("check") : '<span class="no">—</span>'}</td><td>${s ? ico("check") : '<span class="no" aria-label="non">—</span>'}</td></tr>`).join("")}</tbody></table>
            <p class="note">Ces droits sont vérifiés par la base de données elle-même : impossible de les contourner depuis un poste.</p></section>
          <section class="team-card soft" aria-labelledby="t-p"><h2 id="t-p">Postes connectés</h2>
            <div>${devices.map(([d, w]) => `<div class="device"><span><strong>${d}</strong><small>${w}</small></span><button class="btn btn-ghost btn-sm" data-logout>Déconnecter</button></div>`).join("")}</div></section>
        </div>
      </div></div>`;
  }

  page.addEventListener("submit", (e) => {
    e.preventDefault();
    const mail = document.getElementById("inv-mail").value.trim();
    if (!/^\S+@\S+\.\S+$/.test(mail)) return toast("Indiquez une adresse e-mail complète.");
    members.push({ name: mail.split("@")[0], mail, role: ddValue("inv-role"), status: "Invitation envoyée", cls: "wait" });
    render();
    toast(`Invitation envoyée à ${mail}.`);
  });
  document.addEventListener("dd-change", (e) => {
    const k = Number(e.detail.id.replace("role-", ""));
    if (e.detail.id.startsWith("role-")) (members[k].role = e.detail.value), toast(`${members[k].name} est maintenant ${e.detail.value === "admin" ? "gérant" : "vendeur"}.`);
  });
  page.addEventListener("click", (e) => e.target.closest("[data-logout]") && (e.target.closest(".device").remove(), toast("Poste déconnecté : il devra se reconnecter.")));
  window.renderTeam = render;
  render();
})();
