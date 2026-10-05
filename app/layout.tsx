import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/lib/store";
import { Analytics } from "@/components/analytics";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eco-clean-expert.vercel.app";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Eco Clean Expert — Nettoyage canapé, tapis, fauteuil à Abidjan",
    template: "%s | Eco Clean Expert",
  },
  description:
    "Eco Clean Expert : nettoyage canapé, fauteuil, tapis, moquette et véhicules à Abidjan. Intervention à domicile. À partir de 15 000 F CFA.",
  icons: { icon: "/images/logo.png", apple: "/images/logo.png" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CI",
    siteName: "Eco Clean Expert",
    title: "Eco Clean Expert — Nettoyage canapé, tapis, fauteuil à Abidjan",
    description:
      "Nettoyage canapé, fauteuil, tapis, moquette et véhicules à Abidjan. Intervention à domicile. À partir de 15 000 F CFA.",
    url: SITE_URL,
    images: ["/images/hero.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": SITE_URL,
  name: "Eco Clean Expert",
  image: `${SITE_URL}/images/hero.jpg`,
  url: SITE_URL,
  telephone: "+2250142089776",
  priceRange: "À partir de 15 000 F CFA",
  description:
    "Nettoyage professionnel de canapés, fauteuils, tapis, moquettes, véhicules, bureaux et après-chantier à Abidjan.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abidjan",
    addressCountry: "CI",
  },
  areaServed: "Abidjan, Côte d'Ivoire",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "08:00",
    closes: "20:00",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "JULMARKETING Corporation Sarl U",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <SiteProvider>{children}</SiteProvider>
        <Analytics />
      </body>
    </html>
  );
}
