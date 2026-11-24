// Étape 2 — Photos : on dépose le dossier, tout est compressé et filigrané ; glisser pour réordonner.
RENDER[2] = () => {
  const n = W.photos.length;
  const tin = W.photos.reduce((t, p) => t + p.inMo, 0), tout = W.photos.reduce((t, p) => t + p.outKo, 0) / 1000;
  return `
  <div class="drop" data-drop>
    <span class="drop-icon">${ico("upload")}</span>
    <p class="drop-title">Glissez ici le dossier photos du véhicule</p>
    <p class="muted">Compression, redimensionnement et filigrane ForeverCars appliqués automatiquement sur ce PC.</p>
    <div class="drop-actions"><label class="btn btn-ghost">${ico("camera")}Choisir des photos<input type="file" accept="image/*" multiple data-files class="sr" /></label>
      ${n ? "" : `<button class="btn btn-primary" data-w="demo-photos">Importer les photos de démo</button>`}</div>
  </div>
  ${W.importing ? `<div class="w-note loading" role="status"><span class="spin"></span>Optimisation des photos… ${n} traitée${n > 1 ? "s" : ""}</div>` : ""}
  ${n && !W.importing ? `<div class="w-found" role="status">${ico("checkCircle")}${W.edit ? `${n} photos déjà en ligne` : `${n} photos · ${mo(tin)} → ${mo(tout)} · filigrane appliqué`} · couverture : photo 1</div>` : ""}
  ${n ? `<p class="muted small">Glissez une photo pour changer l'ordre. La première sert de couverture sur le site.</p>` : ""}
  <div class="photos">${W.photos.map((p, k) => `
    <figure class="ph ${p.fresh ? "fresh" : ""}" draggable="true" data-ph="${k}">
      <div class="ph-img"><img src="${img(p.src, 480, 360)}" alt="Photo ${k + 1}" /><span class="wm">FOREVERCARS</span>${k === 0 ? '<span class="tag tag-new">Couverture</span>' : ""}</div>
      <figcaption><span class="ph-name">${p.name}</span><small>${mo(p.inMo)} → ${p.outKo} Ko</small>
        <span class="ph-actions">${k ? `<button class="btn btn-ghost btn-xs" data-cover="${k}">En couverture</button>` : '<span class="muted small" style="flex:1">Couverture</span>'}<button class="icon-btn" data-rm="${k}" aria-label="Retirer la photo ${k + 1}">${ico("x")}</button></span></figcaption>
    </figure>`).join("")}</div>`;
};

/** Ajoute les photos une à une (comme le vrai traitement local) puis rafraîchit. */
function addPhotos(list) {
  if (W.importing || !list.length) return;
  W.importing = true;
  let i = 0;
  const tick = () => {
    if (i >= list.length) {
      W.importing = false;
      W.photos.forEach((p) => (p.fresh = false));
      renderStep();
      return toast(`${list.length} photos importées : ${mo(list.reduce((t, p) => t + p.inMo, 0))} réduits à ${mo(list.reduce((t, p) => t + p.outKo, 0) / 1000)}, filigrane appliqué.`);
    }
    W.photos.forEach((p) => (p.fresh = false));
    W.photos.push({ ...list[i++], fresh: true });
    renderStep();
    setTimeout(tick, 160);
  };
  tick();
}

function demoPhotos() {
  const imgs = STOCK[W.siv.stock].images;
  addPhotos(imgs.map((src, k) => ({ src, name: `IMG_${4810 + k * 3}.jpg`, inMo: 4.8 + ((k * 37) % 16) / 10, outKo: 360 + ((k * 53) % 90) })));
}

/** Vraies photos choisies sur le PC : aperçu local + petite vignette gardée pour le parc. */
async function filePhotos(files) {
  const list = [];
  for (const f of [...files].filter((f) => f.type.startsWith("image/"))) {
    const src = URL.createObjectURL(f);
    let thumb = "";
    try {
      const bmp = await createImageBitmap(f, { resizeWidth: 480, resizeQuality: "medium" });
      const c = Object.assign(document.createElement("canvas"), { width: bmp.width, height: bmp.height });
      c.getContext("2d").drawImage(bmp, 0, 0);
      thumb = c.toDataURL("image/jpeg", 0.72);
    } catch {}
    list.push({ src, thumb, name: f.name, inMo: f.size / 1e6, outKo: Math.max(120, Math.round((f.size / 1e3) * 0.08)) });
  }
  addPhotos(list);
}

function movePhoto(from, to) {
  const [p] = W.photos.splice(from, 1);
  W.photos.splice(to, 0, p);
  renderStep();
}
