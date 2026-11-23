import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import Header from "@/components/layout/Header";
import MobileHeader from "@/components/layout/MobileHeader";
import Footer from "@/components/layout/Footer";

// Polices de la charte, partagées avec le back-office (packages/design/fonts) : versions allégées
// aux seules graisses / largeurs utilisées (81 Ko au lieu de 138). Aucune requête vers Google.
const inter = localFont({
  src: "../../../packages/design/fonts/inter-latin-var.woff2",
  variable: "--font-inter",
  weight: "400 700",
  display: "swap",
});

// Titres « Showroom Nocturne » : Archivo variable avec l'axe de largeur (font-stretch 100 à 125 %).
const archivo = localFont({
  src: "../../../packages/design/fonts/archivo-latin-var.woff2",
  variable: "--font-archivo",
  weight: "300 700",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "100% 125%" }],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://forevercars.fr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ForeverCars | Achat & Revente de Véhicules dans le Loiret (45)",
    template: "%s | ForeverCars",
  },
  description:
    "ForeverCars, agence d'achat et revente de véhicules dans le Loiret (45). Recherche sur mesure, expertise complète, démarches administratives. Tu t'occupes de rien, je m'occupe de tout.",
  keywords: [
    "achat véhicule Loiret",
    "vente voiture Orléans",
    "voiture occasion 45",
    "agence automobile Loiret",
    "ForeverCars",
    "achat voiture Marigny-les-Usages",
    "véhicule occasion Orléans",
    "reprise automobile 45",
  ],
  authors: [{ name: "ForeverCars" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: BASE_URL,
    siteName: "ForeverCars",
    title: "ForeverCars | Achat & Revente de Véhicules dans le Loiret (45)",
    description:
      "Agence d'achat et revente de véhicules dans le Loiret. Recherche sur mesure, expertise complète, démarches administratives.",
    images: [
      {
        url: "/images/Forever-CarsLogo.svg",
        width: 800,
        height: 600,
        alt: "ForeverCars - Achat & Revente de Véhicules",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ForeverCars | Achat & Revente de Véhicules",
    description:
      "Agence d'achat et revente de véhicules dans le Loiret (45). Tu t'occupes de rien, je m'occupe de tout.",
    images: ["/images/Forever-CarsLogo.svg"],
  },
  icons: {
    icon: "/images/Logo.svg",
    shortcut: "/images/Logo.svg",
    apple: "/images/Logo.svg",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${archivo.variable} font-sans min-h-screen flex flex-col bg-carbon text-ivory`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              name: "ForeverCars",
              description:
                "Agence d'achat et revente de véhicules dans le Loiret (45)",
              url: BASE_URL,
              logo: `${BASE_URL}/images/Forever-CarsLogo.svg`,
              telephone: "+33667537400",
              email: "c.forevercars@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Lot N23, 1695 rue de la Grand Cour",
                addressLocality: "Marigny-les-Usages",
                postalCode: "45760",
                addressCountry: "FR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 47.935,
                longitude: 1.98,
              },
              areaServed: {
                "@type": "AdministrativeArea",
                name: "Loiret (45)",
              },
              slogan: "Tu t'occupes de rien, je m'occupe de tout",
            }),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Header />
          <MobileHeader />
          <main className="flex-grow pt-[68px] lg:pt-[84px]">{children}</main>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
