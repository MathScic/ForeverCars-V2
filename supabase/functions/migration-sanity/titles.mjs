// Nettoyage des titres saisis dans Sanity : capitales, marque répétée, titre complet saisi dans « marque »,
// mentions après « - » (« Garantie 6 mois »…). Donne marque / modèle / version séparés.
const BRANDS = {
  AUDI: "Audi", BMW: "BMW", VOLKSWAGEN: "Volkswagen", VOLLKSWAGEN: "Volkswagen", VW: "Volkswagen", SEAT: "Seat", CUPRA: "Cupra", PORSCHE: "Porsche",
  PEUGEOT: "Peugeot", MERCEDES: "Mercedes-Benz", "MERCEDES-BENZ": "Mercedes-Benz", RENAULT: "Renault", TOYOTA: "Toyota",
  HYUNDAI: "Hyundai", CITROEN: "Citroën", "CITROËN": "Citroën", FORD: "Ford", KIA: "Kia", NISSAN: "Nissan", DACIA: "Dacia",
  OPEL: "Opel", SKODA: "Skoda", MINI: "Mini", FIAT: "Fiat", VOLVO: "Volvo", JEEP: "Jeep", TESLA: "Tesla", MAZDA: "Mazda",
  HONDA: "Honda", DS: "DS", LEXUS: "Lexus", SUZUKI: "Suzuki", SMART: "Smart", MASERATI: "Maserati", JAGUAR: "Jaguar",
  ALPINE: "Alpine", ABARTH: "Abarth",
};
// Modèles saisis sans leur marque
const MODEL_BRAND = { "C-HR": "Toyota", CHR: "Toyota", YARIS: "Toyota", AYGO: "Toyota", GOLF: "Volkswagen", POLO: "Volkswagen", CLIO: "Renault", CAPTUR: "Renault" };
const TWO_WORDS = { "LAND ROVER": "Land Rover", "ALFA ROMEO": "Alfa Romeo", "ASTON MARTIN": "Aston Martin" };
// Mots qui font partie du nom du modèle (« A3 Sportback », « A4 Avant »…)
const MODEL_TAIL = new Set(["SPORTBACK", "AVANT", "TOURING", "BREAK", "SW", "COUPE", "COUPÉ", "CABRIOLET", "CABRIO", "ROADSTER", "ALLROAD", "VARIANT", "CROSSBACK", "ESTATE", "SPORTSWAGEN", "GRANDTOUR"]);
const SPECIAL = { BLUEHDI: "BlueHDi", XDRIVE: "xDrive", DCI: "dCi", TCE: "TCe", "S-LINE": "S line", "S-TRONIC": "S tronic", TRONIC: "tronic", "VVT-I": "VVT-i", "AMG-LINE": "AMG Line", PURETECH: "PureTech", COUPE: "Coupé", "E-CVT": "e-CVT", "C-HR": "C-HR" };
const SIGLES = /^(BMW|TDI|TFSI|TSI|DSG\d?|GTI|GTD|GTE|AMG|PDK|HDI|GT|RS\d?|SUV|FAP|BVA\d?|BVM\d?|DKG\d?|TCR|GDI|EAT\d?|EDC\d?|CVT|TD|BMV|CV|V\d+|M|S|R|X\d|Q\d|A\d|TT|SQ\d|LED|GPS|EV|PHEV|HEV|DS\d?)$/;

/** Un mot en casse normale, sigles et codes moteur gardés (« 218D » → « 218d », « 184CH » → « 184 ch »). */
export function word(w) {
  const u = w.toUpperCase();
  if (SPECIAL[u]) return SPECIAL[u];
  if (/^\d+CH$/.test(u)) return `${u.slice(0, -2)} ch`;
  if (/^I\d+$/.test(u)) return `i${u.slice(1)}`;
  if (/^[A-Z]?\d{2,3}[DIEH]$/.test(u)) return u.slice(0, -1) + u.slice(-1).toLowerCase();
  if (/\d/.test(w) || SIGLES.test(u)) return w;
  return w.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join("-");
}

/** Marque, modèle et version depuis les champs « marque » et « modèle » de Sanity. */
export function splitTitle(brandRaw = "", modelRaw = "") {
  const b = String(brandRaw).trim(), m = String(modelRaw).trim();
  const both = `${b} ${m}`;
  const warranty = Number((both.match(/garantie\s*(\d+)\s*mois/i) || [])[1]) || null;
  let raw = b.split(/\s+/).length > 1 && m && b.toUpperCase().includes(m.toUpperCase()) ? b : both;
  raw = raw.split(/\s[-–]\s|\s\|\s?|\s\/\s(?=garantie)/i)[0].replace(/\|/g, " ").trim();
  let tokens = raw.split(/\s+/).filter(Boolean);
  let brand = TWO_WORDS[`${tokens[0]} ${tokens[1]}`.toUpperCase()] || null;
  if (brand) tokens = tokens.slice(2);
  else if (BRANDS[(tokens[0] || "").toUpperCase()]) (brand = BRANDS[tokens[0].toUpperCase()]), (tokens = tokens.slice(1));
  while (tokens.length && brand && BRANDS[tokens[0].toUpperCase()] === brand) tokens.shift(); // marque répétée
  if (!brand && MODEL_BRAND[(tokens[0] || "").toUpperCase()]) brand = MODEL_BRAND[tokens[0].toUpperCase()];
  const known = !!brand;
  if (!brand) brand = word(tokens.shift() || "?");
  let model = [];
  const t0 = (tokens[0] || "").toUpperCase();
  if (/^S[EÉ]RIES?$/.test(t0) && tokens[1]) (model = ["Série", tokens[1]]), (tokens = tokens.slice(2));
  else if (/^CLASSE?$/.test(t0) && tokens[1]) (model = ["Classe", tokens[1].toUpperCase()]), (tokens = tokens.slice(2));
  else if (/^[A-Z]$/.test(t0) && /^\d+$/.test(tokens[1] || "")) (model = [`${t0.toLowerCase()}-${tokens[1]}`]), (tokens = tokens.slice(2)); // « E 208 » → « e-208 »
  else if (tokens.length) {
    model = [word(tokens.shift())];
    if (tokens[0] && MODEL_TAIL.has(tokens[0].toUpperCase())) model.push(word(tokens.shift()));
  }
  return { brand, model: model.join(" "), version: tokens.map(word).join(" "), warranty, known };
}
