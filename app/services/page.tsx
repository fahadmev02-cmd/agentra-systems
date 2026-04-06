import CTASection from "@/app/components/CTASection";
import MarketingShell from "@/app/components/MarketingShell";
import PageIntro from "@/app/components/PageIntro";
import Services from "@/app/components/Services";
import SystemPulse from "@/app/components/SystemPulse";

export default function ServicesPage() {
  return (
    <MarketingShell>
      <PageIntro
        eyebrow="Services"
        title="AI systems shaped by the categories your leads are actually asking for"
        description="Services now adapt around your live lead categories, so the page reflects the kinds of automation demand already coming through the website and the AI call flow."
      />
      <SystemPulse />
      <Services />
      <CTASection />
    </MarketingShell>
  );
}