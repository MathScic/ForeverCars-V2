import "./globals.css";
import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Header from "@/components/layout/Header";
import MobileHeader from "@/components/layout/MobileHeader";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
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
      <head>
        {/* Preload hero video for faster first frame */}
        <link rel="preload" as="video" href="/videos/hero-videos.mp4" type="video/mp4" />
      </head>
      <body
        className={`${inter.variable} ${orbitron.variable} font-inter min-h-screen flex flex-col bg-brand-black text-brand-white`}
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
          <main className="flex-grow pt-16 lg:pt-20">{children}</main>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
