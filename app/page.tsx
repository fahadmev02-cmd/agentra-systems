import AIPlayground from "@/app/components/AIPlayground";
import BotBuilder from "@/app/components/BotBuilder";
import CaseStudy from "@/app/components/CaseStudy";
import CTASection from "@/app/components/CTASection";
import DemoShowroom from "@/app/components/DemoShowroom";
import HeroSection from "@/app/components/HeroSection";
import HowItWorks from "@/app/components/HowItWorks";
import MarketingShell from "@/app/components/MarketingShell";
import Services from "@/app/components/Services";
import SystemPulse from "@/app/components/SystemPulse";
import UseCases from "@/app/components/UseCases";

export default function Home() {
  return (
    <MarketingShell>
        <HeroSection />
        <SystemPulse />
        <DemoShowroom />
        <BotBuilder />
        <Services />
        <UseCases />
        <CaseStudy />
        <AIPlayground />
        <HowItWorks />
        <CTASection />
    </MarketingShell>
  );
}
