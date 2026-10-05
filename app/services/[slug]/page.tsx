import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEFAULT_CONTENT } from "@/lib/defaultContent";
import { getSiteContent } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugs";
import { waLink } from "@/lib/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eco-clean-expert.vercel.app";

type Params = { slug: string };

function findService(slug: string, services: typeof DEFAULT_CONTENT.services) {
  return services.find((s) => slugify(s.title) === slug);
}

export function generateStaticParams() {
  return DEFAULT_CONTENT.services
    .filter((s) => s.active)
    .map((s) => ({ slug: slugify(s.title) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const content = await getSiteContent();
  const service = findService(params.slug, content.services);
  if (!service) return { title: "Service — Eco Clean Expert" };
  const title = `Nettoyage ${service.title} à Abidjan — Eco Clean Expert`;
  const description = `${service.desc} ${service.price}. Intervention à domicile à Abidjan.`;
  return {
    title,
    description,
    alternates: { canonical: `/services/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/services/${params.slug}`,
      images: service.image ? [`/${service.image.replace(/^\//, "")}`] : undefined,
    },
  };
}

export default async function ServicePage({ params }: { params: Params }) {
  const content = await getSiteContent();
  const service = findService(params.slug, content.services);
  if (!service || !service.active) notFound();

  const img = service.image?.replace(/^\//, "") || "images/hero.jpg";
  const wa = waLink(`Bonjour, je souhaite un devis pour : ${service.title}.`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Nettoyage ${service.title}`,
    description: service.desc,
    provider: {
      "@type": "LocalBusiness",
      name: "Eco Clean Expert",
      telephone: content.contact?.phone || "+225 01 42 08 97 76",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Abidjan",
        addressCountry: "CI",
      },
    },
    areaServed: "Abidjan, Côte d'Ivoire",
    offers: { "@type": "Offer", description: service.price },
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-8 lg:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-slate-500 hover:text-slate-800">
          ← Retour au site
        </Link>
        <div className="mt-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="rounded-3xl overflow-hidden ring-1 ring-slate-900/5 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/${img}`} alt={`${service.title} — nettoyage professionnel Abidjan`} className="w-full h-auto object-cover aspect-[4/3]" />
          </div>
          <div>
            <div className="text-[12px] font-bold tracking-[0.18em] text-[#1E9BE0] uppercase">Nos services</div>
            <h1 className="mt-3 text-[32px] sm:text-[42px] font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.08]">
              Nettoyage {service.title} à Abidjan
            </h1>
            <p className="mt-4 text-[16px] text-slate-600 leading-relaxed">{service.desc}</p>
            <div className="mt-5 inline-flex items-center gap-2 bg-[#0A2A6B]/5 text-[#0A2A6B] font-semibold text-[14px] rounded-xl px-4 py-2.5">
              {service.price}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#5CC63D] hover:bg-[#4ab332] text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
              >
                Devis WhatsApp
              </a>
              <Link
                href="/#devis"
                className="inline-flex items-center gap-2 bg-[#0A2A6B] hover:bg-[#071B4C] text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
              >
                Formulaire de devis
              </Link>
            </div>
            <ul className="mt-8 space-y-2 text-[14px] text-slate-600">
              <li>✓ Intervention à domicile ou dans vos locaux, à Abidjan</li>
              <li>✓ Matériel professionnel (injection-extraction)</li>
              <li>✓ Devis gratuit et sans engagement</li>
            </ul>
          </div>
        </div>
        <div className="mt-14">
          <h2 className="text-[20px] font-bold text-slate-900">Autres services</h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {content.services
              .filter((s) => s.active && s.id !== service.id)
              .map((s) => (
                <Link
                  key={s.id}
                  href={`/services/${slugify(s.title)}`}
                  className="text-[13.5px] font-medium text-slate-700 bg-white ring-1 ring-slate-900/5 hover:ring-[#1E9BE0]/30 hover:text-[#1E9BE0] rounded-full px-4 py-2 transition-colors"
                >
                  {s.title}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
