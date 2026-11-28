import { Nav } from "@/labs/craft/Nav";
import { Hero } from "@/labs/craft/Hero";
import { Facts } from "@/labs/craft/Facts";
import { Statement } from "@/labs/craft/Statement";
import { Method } from "@/labs/craft/Method";
import { Kit } from "@/labs/craft/Kit";
import { Gate } from "@/labs/craft/Gate";
import { Faq } from "@/labs/craft/Faq";
import { Closing } from "@/labs/craft/Closing";
import { Footer } from "@/labs/craft/Footer";

export default function CraftPage() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1}>
        <span id="top" />
        <Hero />
        <Facts />
        <Statement />
        <Method />
        <Kit />
        <Gate />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
