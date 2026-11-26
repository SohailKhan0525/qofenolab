"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

export function PromiseStatement() {
  const root = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = textRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        SplitText.create(el, {
          type: "words",
          autoSplit: true,
          onSplit(self) {
            return gsap.fromTo(
              self.words,
              { opacity: 0.16 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.08,
                scrollTrigger: {
                  trigger: root.current,
                  start: "top 72%",
                  end: "bottom 52%",
                  scrub: true,
                },
              }
            );
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-label="Engineering premise"
      className="ewcSection ewcSectionSurface"
      style={{ overflowX: "clip" }}
    >
      <svg
        viewBox="0 0 1440 36"
        style={{ width: "100%", height: "28px", marginBottom: "48px", opacity: 0.4, display: "block" }}
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 73 }, (_, i) => {
          const x = i * 20;
          const major = i % 6 === 0;
          return (
            <line
              key={i}
              x1={x}
              y1={0}
              x2={x}
              y2={major ? 22 : 10}
              stroke={major ? "#E3FF3C" : "#F4F4EF"}
              strokeOpacity={major ? 0.8 : 0.25}
              strokeWidth={major ? 1.5 : 1}
            />
          );
        })}
      </svg>

      <div className="ewcContainer">
        <div style={{ maxWidth: "960px", marginLeft: "clamp(0px, 8vw, 108px)" }}>
          <p className="ewcTag">00 // The Premise</p>
          <p
            ref={textRef}
            className="ewcDisplay"
            style={{
              fontSize: "clamp(2rem, 1.2rem + 3.4vw, 4.35rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Prompts are guesses. Contracts are engineering. Qofeno turns stochastic agent loops into repeatable, inspectable runs you can ship at speed.
          </p>
        </div>
      </div>
    </section>
  );
}
