// « Modifier » dans le parc : l'assistant s'ouvre déjà rempli, directement sur « Prix & annonce ».
(function () {
  const id = new URLSearchParams(location.search).get("edit");
  const k = id?.startsWith("s") ? Number(id.slice(1)) : -1, v = STOCK[k];
  if (!v) return;
  const brand = brandOf(v), name = title(v);
  Object.assign(W, {
    edit: id, mode: "plate", looked: true, plate: fakePlate(k), siv: { stock: k, est: null }, km: String(v.mileage), price: String(v.price),
    desc: (v.description || "").trim(), featured: v.isFeatured, step: 3,
    f: { brand, model: name.slice(brand.length).trim(), version: "", year: String(v.year), firstReg: "", fuel: cap(v.fuel), gearbox: cap(v.transmission), power: `${v.power} ch`, fiscal: "", color: "", body: "", critair: "" },
    photos: v.images.map((src, j) => ({ src, name: `photo-${j + 1}.webp`, inMo: 0.4, outKo: 400 })),
  });
  document.querySelector(".w-title h1").textContent = "Modifier l'annonce";
  renderStep("#price");
})();
