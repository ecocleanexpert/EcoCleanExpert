"use client";

import { Header, MobileBar, Footer } from "@/components/chrome";
import { Hero } from "@/components/hero";
import { Services, BeforeAfter, HowItWorks, WhyUs, ParentCompanySection } from "@/components/sections-a";
import { StatsSection, FAQSection } from "@/components/sections-b";
import { ContactFormSection } from "@/components/contact";
import { Pricing, Testimonials, Zones, FinalCTA } from "@/components/sections-c";
import type { QuoteRequest } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";

export function Landing({ content, onAdmin, onNewRequest, onNavigate }: { content: SiteContent; onAdmin: () => void; onNewRequest: (r: QuoteRequest) => void; onNavigate: (t?: string) => void }) {
  return (
    <div className="bg-white pb-20 lg:pb-0">
      <Header content={content} onAdmin={onAdmin} />
      <Hero content={content} />
      <Services content={content} />
      <BeforeAfter content={content} />
      <HowItWorks content={content} />
            <WhyUs content={content} />
      <ParentCompanySection content={content} />
      <StatsSection content={content} />
      <Pricing content={content} />
      <Testimonials content={content} />
      <Zones content={content} />
      <ContactFormSection content={content} onNewRequest={onNewRequest} />
<FAQSection content={content} />
<FinalCTA content={content} />
            <Footer content={content} onAdmin={onAdmin} onNavigate={onNavigate} />
      <MobileBar content={content} />
    </div>
  );
}
