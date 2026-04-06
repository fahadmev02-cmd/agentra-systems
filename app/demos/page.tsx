import AIPlayground from "@/app/components/AIPlayground";
import BotBuilder from "@/app/components/BotBuilder";
import DemoShowroom from "@/app/components/DemoShowroom";
import CTASection from "@/app/components/CTASection";
import MarketingShell from "@/app/components/MarketingShell";
import PageIntro from "@/app/components/PageIntro";

export default function DemosPage() {
  return (
    <MarketingShell>
      <PageIntro
        eyebrow="Live Demos"
        title="Try interactive AI demos and review workflow activity"
        description="This page combines clickable demo agents with your live workflow showcase, so visitors can test responses in real time before they book a strategy call."
      />
      <AIPlayground />
      <BotBuilder />
      <DemoShowroom />
      <CTASection />
    </MarketingShell>
  );
}