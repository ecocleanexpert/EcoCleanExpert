import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/lib/store";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Eco Clean Expert — Nettoyage canapé, tapis, fauteuil à Abidjan",
  description:
    "Eco Clean Expert : nettoyage canapé, fauteuil, tapis, moquette et véhicules à Abidjan. Intervention à domicile. À partir de 15 000 F CFA.",
  icons: { icon: "/images/logo.png", apple: "/images/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  );
}
