// Statistiques calculées sur les vraies ventes (SOLD) et le vrai stock (STOCK) ; marges : données de démo du parc.
(function () {
  const DAY = 864e5, NOW = new Date("2026-11-24T12:00:00");
  const sold = SOLD.filter((v) => v.soldDate);
  const page = document.getElementById("page");
  let months = 12;

  function kpis() {
    const from = months ? new Date(NOW.getFullYear(), NOW.getMonth() - (months - 1), 1) : new Date(0);
    const inP = sold.filter((v) => new Date(v.soldDate) >= from);
    const ca = inP.reduce((s, v) => s + (v.price || 0), 0);
    const delays = inP.map((v) => (Date.parse(v.soldDate) - Date.parse(v.createdAt)) / DAY).filter((d) => d >= 0);
    const delay = delays.length ? Math.round(delays.reduce((a, b) => a + b, 0) / delays.length) : 0;
    const items = [["checkCircle", "Ventes", inP.length, "véhicules vendus sur la période"], ["euro", "Chiffre d'affaires", fmtPrice(ca), "somme des prix de vente"],
      ["clock", "Délai moyen de vente", `${delay} j`, "de la mise en ligne à la vente"], ["car", "En stock", STOCK.length, `valeur ${fmtPrice(STOCK.reduce((s, v) => s + v.price, 0))}`]];
    return { inP, html: `<div class="kpis k4">${items.map(([i, l, v, s]) => `<div class="kpi soft"><span class="kpi-head">${ico(i)}${l}</span><strong>${v}</strong><small>${s}</small></div>`).join("")}</div>` };
  }

  function monthly() {
    const ms = Array.from({ length: 12 }, (_, k) => new Date(NOW.getFullYear(), NOW.getMonth() - 11 + k, 1));
    const key = (d) => `${d.getFullYear()}-${d.getMonth()}`;
    const rows = ms.map((m) => { const s = sold.filter((v) => key(new Date(v.soldDate)) === key(m)); return { m, n: s.length, ca: s.reduce((t, v) => t + v.price, 0) }; });
    const max = Math.max(...rows.map((r) => r.n), 1), peak = rows.findIndex((r) => r.n === max);
    const name = (m, opt) => m.toLocaleDateString("fr-FR", opt);
    const cols = rows.map((r, k) => `<div class="col" tabindex="0" aria-label="${name(r.m, { month: "long", year: "numeric" })} : ${r.n} vente${r.n > 1 ? "s" : ""}, ${fmtPrice(r.ca)}">
      <span class="bar" style="height:${(r.n / max) * 100}%;--d:${k * 50}ms"></span>${k === peak || k === 11 ? `<span class="bar-label" style="bottom:calc(${(r.n / max) * 100}% + 6px)">${r.n}</span>` : ""}
      <span class="tip"><b>${name(r.m, { month: "long", year: "numeric" })}</b><br />${r.n} vente${r.n > 1 ? "s" : ""} · ${fmtPrice(r.ca)}</span></div>`).join("");
    const table = `<details class="table-view"><summary>${ico("list")}Voir les chiffres</summary><table><thead><tr><th>Mois</th><th>Ventes</th><th>Chiffre d'affaires</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${name(r.m, { month: "long", year: "numeric" })}</td><td>${r.n}</td><td>${fmtPrice(r.ca)}</td></tr>`).join("")}</tbody></table></details>`;
    return `<section class="chart soft reveal" aria-labelledby="t-mois"><div class="chart-head"><h2 id="t-mois">Ventes par mois</h2><span>12 derniers mois · survolez une barre</span></div>
      <div class="bars">${cols}</div><div class="xlabels" aria-hidden="true">${rows.map((r) => `<span>${name(r.m, { month: "short" }).replace(".", "")}</span>`).join("")}</div>${table}</section>`;
  }

  const hbars = (list, max, watch = () => false) => `<div class="hbars">${list.map(([l, n], k) => `<div class="hrow"><span>${l}${watch(k) && n ? ` <span class="watch">${ico("clock")}à surveiller</span>` : ""}</span><div class="track"><div class="fill" style="width:${(n / max) * 100}%;--d:${k * 80}ms"></div></div><b>${n}</b></div>`).join("")}</div>`;

  function ages() {
    const a = STOCK.map((v) => (NOW - Date.parse(v.createdAt)) / DAY);
    const b = [["0 – 30 j", (d) => d <= 30], ["31 – 60 j", (d) => d > 30 && d <= 60], ["61 – 90 j", (d) => d > 60 && d <= 90], ["+ 90 j", (d) => d > 90]].map(([l, f]) => [l, a.filter(f).length]);
    return `<section class="chart soft reveal" aria-labelledby="t-age"><div class="chart-head"><h2 id="t-age">Ancienneté du stock</h2><span>${STOCK.length} véhicules en ligne</span></div>
      ${hbars(b, Math.max(...b.map((x) => x[1]), 1), (k) => k >= 2)}<p class="note">Au-delà de 60 jours, l'app propose une baisse de prix sur la fiche.</p></section>`;
  }

  function brands(inP) {
    const c = {};
    inP.forEach((v) => (c[brandOf(v)] = (c[brandOf(v)] || 0) + 1));
    const top = Object.entries(c).sort((x, y) => y[1] - x[1]).slice(0, 6);
    return `<section class="chart soft reveal" aria-labelledby="t-marques"><div class="chart-head"><h2 id="t-marques">Marques les plus vendues</h2><span>sur la période</span></div>
      ${top.length ? hbars(top, top[0][1]) : '<p class="note">Aucune vente sur la période.</p>'}</section>`;
  }

  function margin() {
    if (!BO.isAdmin()) return `<section class="chart soft reveal"><h2>Marge</h2><p class="locked">${ico("lock")}Réservé au gérant : votre profil Vendeur ne voit ni les prix d'achat ni les marges.</p></section>`;
    const live = FLEET.filter((v) => ["online", "reserved"].includes(v.status)), m = live.reduce((t, v) => t + marginOf(v), 0);
    const rate = Math.round((m / live.reduce((t, v) => t + v.price, 0)) * 100);
    return `<section class="chart soft reveal" aria-labelledby="t-marge"><div class="chart-head"><h2 id="t-marge">Marge prévue sur le parc</h2><span>${ico("lock")} gérant uniquement</span></div>
      <span class="big">${fmtPrice(m)}</span><div class="figures"><div><span>Taux moyen</span><strong>${rate} %</strong></div><div><span>Véhicules</span><strong>${live.length}</strong></div><div><span>Marge moyenne</span><strong>${fmtPrice(Math.round(m / live.length))}</strong></div></div>
      <p class="note">Calculée avec les prix d'achat et les frais saisis dans l'app (données de démonstration).</p></section>`;
  }

  function render() {
    const k = kpis();
    page.innerHTML = `<div class="page stats-page">
      <div class="page-title"><div><h1>Statistiques</h1><p>Les chiffres du garage, à jour à chaque vente.</p></div>
        <div class="seg" role="group" aria-label="Période">${[[1, "Ce mois"], [3, "3 mois"], [12, "12 mois"], [0, "Tout"]].map(([p, l]) => `<button data-p="${p}" aria-pressed="${p === months}">${l}</button>`).join("")}</div></div>
      ${k.html}<div class="charts">${monthly()}<div style="display:grid;gap:16px">${ages()}${brands(k.inP)}</div>${margin()}</div></div>`;
    animate();
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.2 });
    page.querySelectorAll(".chart").forEach((c) => io.observe(c));
  }
  page.addEventListener("click", (e) => { const b = e.target.closest("[data-p]"); if (b) (months = Number(b.dataset.p)), render(); });
  window.renderStats = render;
  render();
})();
