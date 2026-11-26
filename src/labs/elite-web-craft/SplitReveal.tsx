"use client";
import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

export function SplitReveal({
  children,
  as = "h2",
  className,
  stagger = 0.085,
  start = "top 86%",
  immediate = false,
  delay = 0.12,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  stagger?: number;
  start?: string;
  immediate?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            return gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.05,
              delay: immediate ? delay : 0,
              ease: "expo.out",
              stagger,
              ...(immediate
                ? {}
                : { scrollTrigger: { trigger: el, start, once: true } }),
            });
          },
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { visibility: "visible" });
      });
    },
    { scope: ref }
  );
  return (
    <Tag ref={ref} className={className} data-split>
      {children}
    </Tag>
  );
}
