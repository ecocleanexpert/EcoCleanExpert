import type { Metadata } from "next";
import { LegalRoute } from "@/components/legal-route";

export const metadata: Metadata = {
  title: "Mentions légales — Eco Clean Expert",
};

export default function MentionsLegalesPage() {
  return <LegalRoute type="mentions" />;
}
