import DemoShowroom from "@/app/components/DemoShowroom";
import CTASection from "@/app/components/CTASection";
import MarketingShell from "@/app/components/MarketingShell";
import PageIntro from "@/app/components/PageIntro";

export default function DemosPage() {
  return (
    <MarketingShell>
      <PageIntro
        eyebrow="Live Demos"
        title="See live captured leads and AI workflow activity"
        description="This page shows the live lead feed, recent pipeline records, and the AI workflows already being captured through your website and voice system."
      />
      <DemoShowroom />
      <CTASection />
    </MarketingShell>
  );
}