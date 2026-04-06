import CTASection from "@/app/components/CTASection";
import MarketingShell from "@/app/components/MarketingShell";
import PageIntro from "@/app/components/PageIntro";

export default function ContactPage() {
  return (
    <MarketingShell>
      <PageIntro
        eyebrow="Contact"
        title="Send your business details or trigger an AI strategy call"
        description="Use the business intake form or launch the AI qualification flow instantly. Both routes feed the same live data pipeline powering the rest of the site."
      />
      <CTASection />
    </MarketingShell>
  );
}