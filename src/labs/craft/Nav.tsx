"use client";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { MagneticButton } from "@/labs/elite-web-craft/MagneticButton";
import { Mark } from "./Mark";
import { SKILL_HREF } from "./Hero";

const LINKS = [
  { id: "method", label: "Method" },
  { id: "kit", label: "Kit" },
  { id: "gate", label: "Gate" },
  { id: "faq", label: "FAQ" },
];

export function Nav() {
  const nav = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = nav.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.15 } });
        const show = gsap.from(el, { yPercent: -100, paused: true, duration: 0.35, ease: "power3.out" }).progress(1);
        ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => (s.scroll() > 140 && s.direction === 1 ? show.reverse() : show.play()) });
        ScrollTrigger.create({ start: 40, end: "max", onToggle: (s) => el.classList.toggle("isSolid", s.isActive) });
      });
    },
    { scope: nav }
  );
  return (
    <header ref={nav} className="nav">
      <div className="wrap navInner">
        <a className="brand" href="#top" aria-label="Elite Web Craft, top of page"><Mark /><span className="display">Elite Web Craft</span></a>
        <nav aria-label="Sections" className="navLinks">
          {LINKS.map((l) => <a key={l.id} href={`#${l.id}`}>{l.label}</a>)}
        </nav>
        <MagneticButton className="btn btnSmall" href={SKILL_HREF}>Read the skill</MagneticButton>
      </div>
      <div ref={bar} className="progress" aria-hidden="true" />
    </header>
  );
}
