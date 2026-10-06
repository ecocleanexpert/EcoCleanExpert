import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Eco Clean Expert — Nettoyage professionnel Abidjan",
    short_name: "Eco Clean Expert",
    description: "Nettoyage express de canapés, tapis, moquettes, véhicules et fin de chantier à Abidjan.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#0A2A6B",
    lang: "fr",
    icons: [
      { src: "/images/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { src: "/images/icon-512.png?v=2", sizes: "512x512", type: "image/png" },
      { src: "/images/icon-maskable.png?v=2", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
