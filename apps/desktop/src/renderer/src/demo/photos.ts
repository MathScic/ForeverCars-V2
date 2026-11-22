import bmwX1 from "../assets/bmw-x1.webp";
import mercedesGla from "../assets/mercedes-gla.webp";
import peugeot2008 from "../assets/peugeot-2008.webp";
import clio5 from "../assets/renault-clio-5.webp";
import toyotaChr from "../assets/toyota-chr.webp";
import golf8 from "../assets/vw-golf-8.webp";
import type { Photo } from "./types";

const photo = (id: string, url: string): Photo => ({ id, url, name: `${id}.webp` });

export const demoPhotos = {
  bmwX1: photo("bmw-x1", bmwX1),
  mercedesGla: photo("mercedes-gla", mercedesGla),
  peugeot2008: photo("peugeot-2008", peugeot2008),
  clio5: photo("renault-clio-5", clio5),
  toyotaChr: photo("toyota-chr", toyotaChr),
  golf8: photo("vw-golf-8", golf8),
};
