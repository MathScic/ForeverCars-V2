// Données de démo de l'assistant : 3 plaques fictives reliées à de vrais véhicules du stock (photos réelles).
const SIV = {
  "GH-218-KT": { stock: 28, brand: "Peugeot", model: "3008", version: "GT 1.5 BlueHDi 130 EAT8", year: "2023", firstReg: "14/03/2023", fuel: "Diesel", gearbox: "Automatique EAT8", power: "130 ch", fiscal: "7 CV", color: "Gris Platinium", body: "SUV 5 portes", critair: "Crit'Air 2", est: [24900, 26800] },
  "EZ-904-RL": { stock: 1, brand: "Volkswagen", model: "Golf", version: "GTI TCR 2.0 TSI 290 DSG7", year: "2019", firstReg: "22/05/2019", fuel: "Essence", gearbox: "Automatique DSG7", power: "290 ch", fiscal: "17 CV", color: "Noir Intense", body: "Compacte 5 portes", critair: "Crit'Air 1", est: [27500, 30200] },
  "FM-377-PB": { stock: 8, brand: "Audi", model: "TT Coupé", version: "45 TFSI 245 Competition Plus", year: "2021", firstReg: "09/09/2021", fuel: "Essence", gearbox: "Automatique S tronic 7", power: "245 ch", fiscal: "14 CV", color: "Bleu Turbo", body: "Coupé 3 portes", critair: "Crit'Air 1", est: [33400, 36100] },
};

const FIELDS = [["brand", "Marque"], ["model", "Modèle"], ["version", "Version / finition"], ["year", "Année"], ["firstReg", "1re mise en circulation"], ["fuel", "Énergie"],
  ["gearbox", "Boîte de vitesses"], ["power", "Puissance"], ["fiscal", "Puissance fiscale"], ["color", "Couleur"], ["body", "Carrosserie"], ["critair", "Vignette Crit'Air"]];

const EQUIP = ["GPS intégré", "Caméra de recul", "Apple CarPlay / Android Auto", "Régulateur adaptatif", "Sièges chauffants", "Toit panoramique",
  "Jantes alliage", "Radars avant / arrière", "Climatisation automatique", "Accès mains libres"];

const OPTIONS = [
  ["featured", "Mettre en avant", "Badge « Coup de cœur » et place dans « Véhicules en vedette »"],
  ["lbc", "Préparer l'annonce Leboncoin", "Texte copié et photos exportées ; vous publiez vous-même"],
  ["lc", "Préparer l'annonce La Centrale", "Texte copié et photos exportées ; vous publiez vous-même"],
];

const STEPS = ["Identification", "Photos", "Prix & annonce", "Aperçu & publication"];

/** « gh218kt » → « GH-218-KT » pendant la frappe. */
const fmtPlate = (s) => {
  const c = s.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
  return [c.slice(0, 2), c.slice(2, 5), c.slice(5, 7)].filter(Boolean).join("-");
};
const num = (s) => Number(String(s).replace(/[^\d]/g, "")) || 0;
const fmtNum = (n) => (n ? new Intl.NumberFormat("fr-FR").format(n) : "");
const mo = (n) => `${n.toFixed(1).replace(".", ",")} Mo`;
