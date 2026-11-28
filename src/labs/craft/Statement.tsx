"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

export function Statement() {
  const root = useRef<HTMLElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const el = text.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(self.words, { opacity: 0.16 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 45%", scrub: true } }),
        });
      });
    },
    { scope: root }
  );
  return (
    <section ref={root} className="promise" aria-label="Promise">
      <div className="wrap">
        <p ref={text} className="display promiseText">
          One idea, held from the hero to the footer. Drawn in code with no images, then checked by a script that fails the build when the idea slips.
        </p>
      </div>
    </section>
  );
}
