"use client";
import { SplitReveal } from "@/labs/elite-web-craft/SplitReveal";
import { MagneticButton } from "@/labs/elite-web-craft/MagneticButton";
import { DitherField } from "./DitherField";
import { SKILL_HREF } from "./Hero";

export function Closing() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="closingField" aria-hidden="true"><DitherField a="#1F2A1F" b="#4C6B3C" px={3} level={0.32} /></div>
      <div className="wrap closingInner">
        <SplitReveal as="h2" className="display closingTitle"><span id="closing-title">Deal your next site.</span></SplitReveal>
        <p className="lead">Read the skill, drop it into your agent, and let the roll decide where the build begins.</p>
        <MagneticButton className="btn btnLight" href={SKILL_HREF}>Read the skill</MagneticButton>
      </div>
    </section>
  );
}
