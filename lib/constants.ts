export const WA_NUMBER = "2250142089776";
export const waLink = (msg = "Bonjour Eco Clean Expert, je souhaite un devis pour un nettoyage.") =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

export const STORAGE_KEY = "ece_content_v1";
export const MEDIA_KEY = "ece_media_v1";
export const REQUESTS_KEY = "ece_requests_v1";
