"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function Counter({
  to,
  from = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.4,
  className,
}: {
  to: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (v: number) =>
    prefix +
    v.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix;
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const o = { v: from };
        el.textContent = fmt(from);
        gsap.to(o, {
          v: to,
          duration,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = fmt(o.v);
          },
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    },
    { scope: ref }
  );
  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {fmt(to)}
    </span>
  );
}
