import CaseStudy from "@/app/components/CaseStudy";
import CTASection from "@/app/components/CTASection";
import MarketingShell from "@/app/components/MarketingShell";
import PageIntro from "@/app/components/PageIntro";
import UseCases from "@/app/components/UseCases";

export default function UseCasesPage() {
  return (
    <MarketingShell>
      <PageIntro
        eyebrow="Use Cases"
        title="Use cases that evolve with the businesses entering your pipeline"
        description="This page now adapts around the most common categories found in your live leads, so the strongest use cases on the site are aligned with current demand."
      />
      <UseCases />
      <CaseStudy />
      <CTASection />
    </MarketingShell>
  );
}