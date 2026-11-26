"use client";

import { useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const desktopMotion = "(min-width: 900px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
    <path d={diagonal ? "M5.5 18.5 18 6M7 6h11v11" : "M4 12h15m-6-6 6 6-6 6"} />
  </svg>;
}

export default function QofenoHero({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLElement>(null);
  const [assembled, setAssembled] = useState(false);
  const { contextSafe } = useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-intro]", { opacity: .72, y: -12, duration: .64, stagger: .065, clearProps: "opacity,transform" });
    });
    media.add(desktopMotion, () => {
      gsap.fromTo(".optic-drawing", { y: 0 }, { y: 21, ease: "none", scrollTrigger: {
        trigger: stage.current, start: "top top", end: "bottom top", scrub: true,
      } });
    });
    return () => media.revert();
  }, { scope: stage });

  const arrange = contextSafe((together: boolean) => {
    setAssembled(together);
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.current?.querySelectorAll<SVGGElement>("[data-lens-part]").forEach(part => {
      gsap.to(part, { x: together ? Number(part.dataset.closedX) : 0,
        duration: instant ? 0 : .72, ease: "power3.inOut", overwrite: "auto" });
    });
  });
  return (
    <section ref={stage} className="opening" aria-labelledby="opening-title">
      <div className="shell opening-grid">
        <div className="opening-copy">
          <p className="launch-status" data-intro><span aria-hidden="true" />Launching soon</p>
          <h1 id="opening-title" data-intro>A second lens <br />on your ideas<span className="accent-period">.</span></h1>
          <p className="opening-description" data-intro>Qofeno is a conversational AI in development. Bring it a dense read, a rough draft, or a decision you’re turning over.</p>
          <div className="opening-actions" data-intro>
            <a className="button" href="#preview">Try the preview <Arrow /></a>
            <a className="text-link" href="#updates">Launch notes <Arrow diagonal /></a>
          </div>
        </div>

        <figure className="optic-plate">
          <div className="optic-stage">
            <div className="optic-drawing">{children}</div>
            <i className="register top-left" aria-hidden="true" /><i className="register top-right" aria-hidden="true" />
            <i className="register bottom-left" aria-hidden="true" /><i className="register bottom-right" aria-hidden="true" />
          </div>
          <figcaption className="optic-caption">
            <span className="plate-name"><span className="plate-symbol" aria-hidden="true" />Focus study</span>
            <div className="optic-controls" role="group" aria-label="Lens arrangement">
              <button type="button" aria-pressed={!assembled} onClick={() => arrange(false)}>Exploded</button>
              <button type="button" aria-pressed={assembled} onClick={() => arrange(true)}>Assembled</button>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
