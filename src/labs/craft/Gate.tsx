"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const CHECKS = [
  "image tags, next/image, raster files and stock image hosts",
  "placeholder filler text and AI-marketing wording",
  "GSAP used outside useGSAP, or imported past the shared registry",
  "animated layout properties and scroll-jacking",
  "motion with no prefers-reduced-motion branch",
  "hooks in files missing \"use client\"",
  "SVG without a role or a label",
  "default purple gradients and Inter-only type",
];
const COMMAND = "node scripts/lint.mjs src --strict";
const RESULT = "0 error(s), 0 warning(s) in 73 file(s) scanned.";

export function Gate() {
  const root = useRef<HTMLElement>(null);
  const cmd = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const o = { n: 0 };
        const el = cmd.current!;
        el.textContent = "";
        gsap.set("[data-out]", { autoAlpha: 0, y: 8 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        tl.to(o, { n: COMMAND.length, duration: COMMAND.length * 0.03, ease: "none", onUpdate: () => { el.textContent = COMMAND.slice(0, Math.round(o.n)); } })
          .to("[data-out]", { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.5 }, "+=0.2");
      });
    },
    { scope: root }
  );
  return (
    <section id="gate" ref={root} className="gate" aria-labelledby="gate-title">
      <div className="wrap gateGrid">
        <div>
          <h2 id="gate-title" className="display h2">A gate, not a vibe check.</h2>
          <p className="lead">The skill ships a zero-dependency script. It reads your source and fails the build on the things that make a site look generated. It stops at exit 0, never at &ldquo;looks good to me&rdquo;.</p>
          <ul className="checks">{CHECKS.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
        <div className="term" role="img" aria-label={`Terminal: ${COMMAND} prints ${RESULT} and exits 0`}>
          <p className="termLine"><span className="prompt">$</span> <span ref={cmd}>{COMMAND}</span></p>
          <p className="termLine" data-out>{RESULT}</p>
          <p className="termLine ok" data-out>exit 0</p>
        </div>
      </div>
    </section>
  );
}
