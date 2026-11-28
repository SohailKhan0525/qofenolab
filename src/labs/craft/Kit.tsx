"use client";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { Counter } from "@/labs/elite-web-craft/Counter";
import { SplitReveal } from "@/labs/elite-web-craft/SplitReveal";

const TILES = [
  { cls: "t1", n: 12, pre: "", title: "Rules that never bend", body: "No images. Every word is real DOM text. Reduced motion for every animation. Keyboard paths, 4.5:1 contrast, no invented facts." },
  { cls: "t2", n: 84, pre: "", title: "Sites measured", body: "Spacing, radii, type scales and motion timings parsed from 84 extracted design systems, so choices come from numbers instead of habit." },
  { cls: "t3", n: 24, pre: "", title: "Blueprints", body: "Section orders for 24 product types, from developer tools to restaurants, each with the pitfalls to avoid." },
  { cls: "t4", n: 50, pre: "~", title: "Motion recipes", body: "Entrances, scrubbed timelines, pins, accordions and counters, written for GSAP with useGSAP scopes and a reduced-motion branch." },
  { cls: "t5", n: 0, pre: "", title: "Starter kit", body: "Typed React components, code-drawn illustrations and OGL shader fields to adapt to your concept. Shipping them unchanged counts as a failure." },
];

export function Kit() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        gsap.set(cards, { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(cards, { start: "top 88%", once: true, onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.9 }) });
      });
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const cleanups: (() => void)[] = [];
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
          const mx = gsap.quickTo(card, "--mx", { duration: 0.35, ease: "power3.out" });
          const my = gsap.quickTo(card, "--my", { duration: 0.35, ease: "power3.out" });
          const move = (e: PointerEvent) => { const r = card.getBoundingClientRect(); mx(e.clientX - r.left); my(e.clientY - r.top); };
          card.addEventListener("pointermove", move);
          cleanups.push(() => card.removeEventListener("pointermove", move));
        });
        return () => cleanups.forEach((c) => c());
      });
    },
    { scope: root }
  );
  return (
    <section id="kit" ref={root} className="kit" aria-labelledby="kit-title">
      <div className="wrap">
        <SplitReveal as="h2" className="display h2 kitTitle"><span id="kit-title">What the agent gets to work with</span></SplitReveal>
        <ul className="bento">
          {TILES.map((t) => (
            <li key={t.title} data-card className={`card ${t.cls}`}>
              {t.n > 0 && <Counter to={t.n} prefix={t.pre} className="display cardNum" />}
              <h3 className="h3 display">{t.title}</h3>
              <p>{t.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
