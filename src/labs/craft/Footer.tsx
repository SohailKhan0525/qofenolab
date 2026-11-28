"use client";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { SKILL_HREF } from "./Hero";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const word = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const el = word.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        SplitText.create(el, {
          type: "lines,chars", mask: "lines", autoSplit: true,
          onSplit: (self) => gsap.from(self.chars, { yPercent: 120, stagger: 0.03, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }),
        });
      });
    },
    { scope: root }
  );
  return (
    <footer ref={root} className="footer">
      <div className="wrap">
        <nav aria-label="Footer" className="footLinks">
          <a href={SKILL_HREF}>Read the skill</a>
          <a href="https://github.com/SohailKhan0525/qofenolab">Source on GitHub</a>
          <a href="/">Qofeno Lab</a>
        </nav>
        <p ref={word} className="display bigWord" aria-hidden="true">Elite Web Craft</p>
      </div>
    </footer>
  );
}
