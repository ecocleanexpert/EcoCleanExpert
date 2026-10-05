import type { Metadata } from "next";
import { LegalRoute } from "@/components/legal-route";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Eco Clean Expert",
};

export default function PolitiqueConfidentialitePage() {
  return <LegalRoute type="privacy" />;
}
