import { Navbar } from "@/labs/elite-web-craft/Navbar";
import { Hero } from "@/labs/elite-web-craft/Hero";
import { EcosystemStrip } from "@/labs/elite-web-craft/EcosystemStrip";
import { PromiseStatement } from "@/labs/elite-web-craft/PromiseStatement";
import { HowItWorks } from "@/labs/elite-web-craft/HowItWorks";
import { CapabilitiesBento } from "@/labs/elite-web-craft/CapabilitiesBento";
import { RuntimeConfigurator } from "@/labs/elite-web-craft/RuntimeConfigurator";
import { FaqSection } from "@/labs/elite-web-craft/FaqSection";
import { ClosingCta } from "@/labs/elite-web-craft/ClosingCta";
import { Footer } from "@/labs/elite-web-craft/Footer";

export default function EliteWebCraftLabPage() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <EcosystemStrip />
        <PromiseStatement />
        <HowItWorks />
        <CapabilitiesBento />
        <RuntimeConfigurator />
        <FaqSection />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
