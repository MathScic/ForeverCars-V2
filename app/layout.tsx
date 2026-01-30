import "./globals.css";
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

export const metadata = {
  title: "ForeverCars | Achat & Revente de Véhicules",
  description:
    "ForeverCars - Agence d'achat et revente de véhicules dans le Loiret (45). Tu t'occupes de rien, je m'occupe de tout.",
  icons: {
    icon: "/images/Forever-CarsLogo.svg",
    shortcut: "/images/Forever-CarsLogo.svg",
    apple: "/images/Forever-CarsLogo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${orbitron.variable} font-inter min-h-screen flex flex-col bg-brand-black text-brand-white`}
      >
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
