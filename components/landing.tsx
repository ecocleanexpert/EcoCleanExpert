"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { Header, MobileBar, Footer } from "@/components/chrome";
import { Hero } from "@/components/hero";
import type { QuoteRequest } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";

const Services = dynamic(() => import("@/components/sections-a").then((m) => m.Services));
const BeforeAfter = dynamic(() => import("@/components/sections-a").then((m) => m.BeforeAfter));
const HowItWorks = dynamic(() => import("@/components/sections-a").then((m) => m.HowItWorks));
const WhyUs = dynamic(() => import("@/components/sections-a").then((m) => m.WhyUs));
const ParentCompanySection = dynamic(() => import("@/components/sections-a").then((m) => m.ParentCompanySection));
const StatsSection = dynamic(() => import("@/components/sections-b").then((m) => m.StatsSection));
const FAQSection = dynamic(() => import("@/components/sections-b").then((m) => m.FAQSection));
const ContactFormSection = dynamic(() => import("@/components/contact").then((m) => m.ContactFormSection));
const Pricing = dynamic(() => import("@/components/sections-c").then((m) => m.Pricing));
const Testimonials = dynamic(() => import("@/components/sections-c").then((m) => m.Testimonials));
const Zones = dynamic(() => import("@/components/sections-c").then((m) => m.Zones));
const FinalCTA = dynamic(() => import("@/components/sections-c").then((m) => m.FinalCTA));

function LazySection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    if (typeof IntersectionObserver === "undefined") { setShow(true); return; }
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 1.6) { setShow(true); return; }
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setShow(true); io.disconnect(); } },
      { rootMargin: "60% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);
  return <div ref={ref} className="min-h-[420px]">{show ? children : null}</div>;
}

export function Landing({ content, onAdmin, onNewRequest, onNavigate }: { content: SiteContent; onAdmin: () => void; onNewRequest: (r: QuoteRequest) => void; onNavigate: (t?: string) => void }) {
  return (
    <div className="bg-white pb-20 lg:pb-0">
      <a href="#contenu" className="skip-link">Aller au contenu</a>
      <Header content={content} onAdmin={onAdmin} />
      <main id="contenu" tabIndex={-1}>
        <Hero content={content} />
        <LazySection><Services content={content} /></LazySection>
        <LazySection><BeforeAfter content={content} /></LazySection>
        <LazySection><HowItWorks content={content} /></LazySection>
        <LazySection><WhyUs content={content} /></LazySection>
        <LazySection><ParentCompanySection content={content} /></LazySection>
        <LazySection><StatsSection content={content} /></LazySection>
        <LazySection><Pricing content={content} /></LazySection>
        <LazySection><Testimonials content={content} /></LazySection>
        <LazySection><Zones content={content} /></LazySection>
        <LazySection><ContactFormSection content={content} onNewRequest={onNewRequest} /></LazySection>
        <LazySection><FAQSection content={content} /></LazySection>
        <LazySection><FinalCTA content={content} /></LazySection>
      </main>
      <Footer content={content} onAdmin={onAdmin} onNavigate={onNavigate} />
      <MobileBar content={content} />
    </div>
  );
}
