"use client";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, reduceMotion } from "@/lib/gsap";

const ITEMS = [
  ["Does it use images?", "No. Every visual is SVG, canvas, WebGL, CSS or type. The lint script fails on img tags, next/image, raster files and stock image hosts."],
  ["Which stack does it assume?", "Next.js App Router with TypeScript, GSAP through useGSAP, Lenis for smooth scroll and OGL for shader backgrounds. Three.js comes in only when real 3D is the concept. Versions were checked against the npm registry on 2026-11-21."],
  ["What stops every site looking the same?", "The direction roll. Palette, type pairing, hero archetype, layout skeleton and signature technique are dealt mechanically, and vetoing a roll needs a written reason. Try it at the top of this page."],
  ["Does it invent metrics or testimonials?", "No. Demo content is marked as a placeholder, and the skill forbids made-up logos, awards and compliance badges."],
  ["Which agents can run it?", "Claude, Codex and Antigravity. The bundled install script sets it up for each."],
  ["Does it promise an award?", "No. It uses the Awwwards weighting (Design 40, Usability 30, Creativity 20, Content 10) as a self-review, and the final report never claims a score."],
];

export function Faq() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (i: number) => {
    const next = open === i ? null : i;
    const panels = root.current!.querySelectorAll<HTMLElement>("[data-panel-faq]");
    panels.forEach((p, idx) => {
      const show = idx === next;
      if (reduceMotion()) { gsap.set(p, { height: show ? "auto" : 0 }); return; }
      gsap.to(p, { height: show ? "auto" : 0, duration: 0.5, ease: "power3.inOut", onComplete: () => ScrollTrigger.refresh() });
    });
    setOpen(next);
  };
  return (
    <section id="faq" ref={root} className="faq" aria-labelledby="faq-title">
      <div className="wrap faqGrid">
        <h2 id="faq-title" className="display h2 faqTitle">Questions an agent would ask first</h2>
        <div className="faqList">
          {ITEMS.map(([q, a], i) => (
            <div key={q} className="faqItem">
              <h3><button type="button" aria-expanded={open === i} aria-controls={`faq-p-${i}`} id={`faq-b-${i}`} onClick={() => toggle(i)}>
                <span>{q}</span><i aria-hidden="true" className={open === i ? "plus isOpen" : "plus"} />
              </button></h3>
              <div id={`faq-p-${i}`} role="region" aria-labelledby={`faq-b-${i}`} data-panel-faq className="faqPanel"><p>{a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
