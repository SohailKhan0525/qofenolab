"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Within this single-page publication, named sections are the destinations.
// A brief ink rule marks a transition, while native anchor focus and history remain available.
export function TransitionOverlay() {
  const rule = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      let transition: gsap.core.Timeline | undefined;
      const mark = () => {
        transition?.kill();
        transition = gsap.timeline()
          .fromTo(rule.current, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: .35, ease: "power2.out" })
          .to(rule.current, { opacity: 0, duration: .22 });
      };
      window.addEventListener("hashchange", mark);
      return () => { window.removeEventListener("hashchange", mark); transition?.kill(); };
    });
    return () => media.revert();
  }, { scope: rule });
  return <div ref={rule} aria-hidden="true" className="route-ink-rule" />;
}
