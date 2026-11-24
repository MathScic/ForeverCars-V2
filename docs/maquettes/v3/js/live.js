// Démo « app → site » : les annonces publiées dans la maquette du back-office apparaissent sur le site
// (en vrai : l'app écrit dans Supabase, le site relit la base et se met à jour tout seul).
(function () {
  let added = [];
  try { added = JSON.parse(localStorage.getItem("fc-bo-v3") || "{}").added || []; } catch {}
  const live = added
    .filter((v) => v.status === "online" && v.images?.length)
    .map((v) => ({
      liveId: v.id, displayTitle: v.title, brand: v.brand || "", model: v.model || "", year: v.year, mileage: v.km, price: v.price,
      fuel: v.fuel || "", transmission: v.transmission || "", power: v.power || "", images: v.images, description: v.desc || "",
      features: v.equip || [], isFeatured: !!v.featured, isNewCard: true, status: "available", createdAt: v.createdAt,
    }));
  STOCK.unshift(...live);
})();
