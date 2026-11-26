"use client";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

export function Marquee({
  children,
  speed = 65,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = track.current;
      if (!el || !el.firstElementChild) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const group = el.firstElementChild as HTMLElement;
        const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
        const dist = group.offsetWidth + gap;
        const tween = gsap.to(el, {
          x: -dist,
          duration: dist / speed,
          ease: "none",
          repeat: -1,
        });
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = Math.min(Math.abs(self.getVelocity()) / 480, 3.8);
            gsap.to(tween, {
              timeScale: 1 + boost,
              duration: 0.2,
              overwrite: true,
              onComplete: () => {
                gsap.to(tween, { timeScale: 1, duration: 0.8 });
              },
            });
          },
        });
        return () => {
          st.kill();
          tween.kill();
        };
      });
    },
    { scope: root }
  );
  const row: React.CSSProperties = { display: "flex", gap: "inherit", flex: "none", alignItems: "center" };
  return (
    <div ref={root} className={className} style={{ overflow: "hidden" }}>
      <div ref={track} style={{ display: "flex", width: "max-content", columnGap: "3.5rem" }}>
        <div style={row}>{children}</div>
        <div style={row} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
