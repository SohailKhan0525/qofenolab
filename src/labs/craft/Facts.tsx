import { Marquee } from "@/labs/elite-web-craft/Marquee";

const FACTS = [
  ["84", "sites measured for the benchmarks"],
  ["24", "product-type blueprints"],
  ["~50", "motion recipes, by section"],
  ["12", "type pairings"],
  ["10", "palette registers"],
  ["34", "other skills compared"],
];

export function Facts() {
  return (
    <section className="facts" aria-label="What is inside the skill">
      <Marquee className="marquee">
        {FACTS.map(([n, t]) => (
          <p key={t} className="fact"><b className="display">{n}</b><span>{t}</span></p>
        ))}
      </Marquee>
      <p className="wrap factsNote">Counts come from the skill&rsquo;s own references, audited 2026-11-21.</p>
    </section>
  );
}
