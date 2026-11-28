"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const STEPS = [
  { title: "Name the idea", body: "Three concepts from different territories, scored on originality, fit and feasibility in code. One survives as a ten-line Concept Card: idea, metaphor, signature moment, material, motion verb, treatment, and what you refuse.", spec: "territories: the thing it replaces, the before and after, a craft, a formal system, the verb" },
  { title: "Deal the direction", body: "A script assigns palette, type pairing, hero, layout and signature technique. You may veto a roll only when it contradicts the card, and the reason goes in writing.", spec: "seven axes, seeded, reproducible" },
  { title: "Plan every section", body: "A table before any code: the job, layout family, recipes and illustration for each section. No two neighbours share a layout family, and at most one live WebGL canvas is in view.", spec: "one choreographed entrance and one micro-interaction per section" },
  { title: "Build in order", body: "Tokens, fonts, shell, hero, then sections top to bottom. Illustration and WebGL come after, then the page transition, then reduced motion, mobile and keyboard.", spec: "the hero is iterated the most" },
  { title: "Pass the gate", body: "Type-check or build, run the lint script until it exits 0, then look at the page at 1440, 768 and 390 pixels. The report says what was verified and what was not.", spec: "no claim of a visual result you did not look at" },
];

function bayer(n: number): number[][] {
  if (n === 1) return [[0]];
  const m = bayer(n / 2);
  const top = m.map((r) => [...r.map((v) => 4 * v), ...r.map((v) => 4 * v + 2)]);
  const bot = m.map((r) => [...r.map((v) => 4 * v + 3), ...r.map((v) => 4 * v + 1)]);
  return [...top, ...bot];
}
const B8 = bayer(8);

function Assembled({ level }: { level: number }) {
  const cells = [];
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++)
    if (B8[y][x] < level * 64) cells.push(<rect key={`${x}-${y}`} x={x * 12} y={y * 12} width="10" height="10" />);
  return <svg viewBox="0 0 94 94" className="assembled" aria-hidden="true" fill="currentColor">{cells}</svg>;
}

export function Method() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-step]", el);
        const rail = el.querySelector<HTMLElement>("[data-rail]");
        const n = panels.length;
        gsap.set(panels, { gridArea: "1 / 1", autoAlpha: 0, y: 40 });
        gsap.set(panels[0], { autoAlpha: 1, y: 0 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el, start: "top top+=40", end: () => "+=" + window.innerHeight * (n - 0.35) * 0.9,
            pin: true, scrub: 0.55, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: (s) => setActive(Math.min(n - 1, Math.round(s.progress * (n - 1)))),
          },
        });
        if (rail) tl.fromTo(rail, { scaleY: 0 }, { scaleY: 1, duration: n - 1 }, 0);
        for (let i = 1; i < n; i++) {
          tl.to(panels[i - 1], { autoAlpha: 0, y: -36, duration: 0.42 }, i - 0.55).to(panels[i], { autoAlpha: 1, y: 0, duration: 0.42 }, i - 0.35);
        }
        return () => { setActive(0); };
      });
    },
    { scope: root }
  );
  return (
    <section id="method" ref={root} className="method" aria-labelledby="method-title">
      <div className="wrap">
        <h2 id="method-title" className="display h2">Five steps. The picture assembles as you go.</h2>
        <div ref={stage} className="methodStage">
          <ol className="methodList" aria-label="Steps">
            <span className="rail" aria-hidden="true"><i data-rail /></span>
            {STEPS.map((s, i) => (
              <li key={s.title} className={i === active ? "isActive" : ""}><span className="num display">0{i + 1}</span>{s.title}</li>
            ))}
          </ol>
          <div className="methodPanels">
            {STEPS.map((s, i) => (
              <article key={s.title} data-step className="step">
                <Assembled level={(i + 1) / STEPS.length} />
                <div>
                  <h3 className="display h3">{s.title}</h3>
                  <p>{s.body}</p>
                  <p className="spec">{s.spec}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
