"use client";

import { useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function SmoothScroll({children}: {children: ReactNode}) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const conditions = gsap.matchMedia();
    let mounted = true;
    document.fonts.ready.then(() => { if (mounted) ScrollTrigger.refresh(); });
    conditions.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
      const lenis = new Lenis({ duration: 0.8, smoothWheel: true, autoRaf: false, anchors: false });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (seconds: number) => lenis.raf(seconds * 1000);
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => { mounted = false; conditions.revert(); };
  }, {scope: root});
  return <div ref={root}>{children}</div>;
}
