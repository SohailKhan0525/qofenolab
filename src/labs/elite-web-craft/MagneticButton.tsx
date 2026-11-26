"use client";
import { useRef, type ComponentPropsWithoutRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function MagneticButton({
  strength = 0.3,
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<"a"> & { strength?: number }) {
  const wrap = useRef<HTMLAnchorElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = wrap.current;
      const lb = label.current;
      if (!el || !lb) return;
      const mm = gsap.matchMedia();
      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const o = { duration: 0.55, ease: "elastic.out(1, 0.55)" };
          const xTo = gsap.quickTo(el, "x", o);
          const yTo = gsap.quickTo(el, "y", o);
          const lx = gsap.quickTo(lb, "x", o);
          const ly = gsap.quickTo(lb, "y", o);
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            xTo(dx * strength);
            yTo(dy * strength);
            lx(dx * strength * 0.45);
            ly(dy * strength * 0.45);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
            lx(0);
            ly(0);
          };
          const down = () => gsap.to(el, { scale: 0.97, duration: 0.12, ease: "power2.out" });
          const up = () => gsap.to(el, { scale: 1, duration: 0.18, ease: "power2.out" });
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          el.addEventListener("pointerdown", down);
          el.addEventListener("pointerup", up);
          return () => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
            el.removeEventListener("pointerdown", down);
            el.removeEventListener("pointerup", up);
          };
        }
      );
    },
    { scope: wrap }
  );
  return (
    <a ref={wrap} className={className} {...rest}>
      <span ref={label} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
        {children}
      </span>
    </a>
  );
}
