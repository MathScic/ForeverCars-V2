// Parc de démo : le vrai stock du site (photos réelles) ; statuts, plaques, coûts et journal FICTIFS.
const PLATE_LETTERS = "ABCDEFGHJKLMNPQRSTVWXYZ";
const fakePlate = (i) => `${PLATE_LETTERS[(i * 7) % 23]}${PLATE_LETTERS[(i * 3 + 5) % 23]}-${String(100 + ((i * 137) % 899)).padStart(3, "0")}-${PLATE_LETTERS[(i * 11 + 2) % 23]}${PLATE_LETTERS[(i * 5 + 9) % 23]}`;

const FLEET = [
  ...STOCK.map((v, i) => ({
    id: `s${i}`, title: title(v), year: v.year, km: v.mileage, price: v.price, photo: v.images[0], photos: v.images.length,
    status: v.status === "reserved" ? "reserved" : i === 5 || i === 22 ? "draft" : "online",
    featured: v.isFeatured, buy: Math.round((v.price * 0.83) / 100) * 100, repair: [350, 450, 650, 900][i % 4], plate: fakePlate(i), createdAt: v.createdAt,
  })),
  ...SOLD.slice(0, 6).map((v, i) => ({
    id: `v${i}`, title: title(v), year: v.year, km: null, price: v.price, photo: v.image, photos: 8, status: "sold",
    featured: false, buy: Math.round((v.price * 0.85) / 100) * 100, repair: 500, plate: fakePlate(60 + i), createdAt: v.createdAt, soldDate: v.soldDate,
  })),
];

const STATUS = {
  online: "En ligne",
  draft: "Brouillon",
  reserved: "Réservé",
  pending: "En attente de connexion",
  sold: "Vendu",
};

const LOG_DEMO = [
  { time: "15:58", who: "Système", text: "Sauvegarde chiffrée effectuée (44 véhicules, 352 photos)" },
  { time: "15:41", who: "Vendeur", text: "Prix modifié : Seat Leon 2.0 TDI 150 Xcellence DSG7, 19 490 € → 18 990 €" },
  { time: "14:12", who: "Gérant", text: "Annonce publiée : Porsche Panamera S E-Hybride 416" },
  { time: "11:05", who: "Gérant", text: "Vente enregistrée : BMW Serie 3 320 D 190 Luxury" },
];

const marginOf = (v) => v.price - v.buy - v.repair;
const subOf = (v) => [v.year, v.km != null ? fmtKm(v.km) : null, `${v.photos} photos`].filter(Boolean).join(" · ");
const statusPill = (s) => `<span class="status ${s}"><i></i>${STATUS[s]}</span>`;
