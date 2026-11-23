# Polices de la charte ForeverCars

| Fichier | Police | Licence | Axes conservés |
| --- | --- | --- | --- |
| `archivo-latin-var.woff2` | Archivo (The Archivo Project Authors) | SIL Open Font License 1.1 | wght 300–700, wdth 100–125 % |
| `inter-latin-var.woff2` | Inter (The Inter Project Authors) | SIL Open Font License 1.1 | wght 400–700 |

Texte de la licence : https://openfontlicense.org

Fichiers dérivés des polices variables Google Fonts (sous-ensemble « latin », mêmes caractères),
réduits avec fontTools aux graisses et largeurs utilisées par le site :

```sh
python -m fontTools.varLib.instancer archivo.woff2 wght=300:700 wdth=100:125 -o archivo.ttf
python -m fontTools.subset archivo.ttf --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" \
  --layout-features="ccmp,kern,liga,locl,mark,mkmk,rvrn,tnum" --name-IDs='*' --name-languages='*' --flavor=woff2 --output-file=archivo-latin-var.woff2
# Inter : même commande avec wght=400:700 et --layout-features="calt,ccmp,kern,locl,mark,mkmk,tnum"
```

Le site les charge avec `next/font/local` (apps/site/app/layout.tsx) ; le back-office les chargera
en local lui aussi (il doit fonctionner hors ligne).
