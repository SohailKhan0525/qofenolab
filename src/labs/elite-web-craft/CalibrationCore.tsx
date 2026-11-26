"use client";
import { useEffect, useRef } from "react";
import { gsap, useGSAP, MorphSVGPlugin } from "@/lib/gsap";

const SHAPES = [
  "M220 74 L276 142 L348 164 L288 228 L314 316 L220 274 L124 322 L154 226 L88 172 L168 140 Z",
  "M220 82 L339 151 L339 289 L220 358 L101 289 L101 151 Z",
  "M172 96 L268 96 L344 172 L344 268 L268 344 L172 344 L96 268 L96 172 Z",
];

const LABELS = ["PHASE 01 // SCATTER", "PHASE 02 // ORBIT LOCK", "PHASE 03 // VERIFIED DIFF"];

export function CalibrationCore({
  activeStep,
  className,
}: {
  activeStep: number;
  className?: string;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const prevStep = useRef(0);

  useGSAP(
    () => {
      const el = svg.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-outer-ring]", {
          rotation: 360,
          duration: 36,
          repeat: -1,
          ease: "none",
          transformOrigin: "220px 220px",
        });
      });
    },
    { scope: svg }
  );

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const core = el.querySelector<SVGPathElement>("[data-morph-core]");
    const check = el.querySelector<SVGPathElement>("[data-verify-mark]");
    if (!core) return;

    const idx = Math.max(0, Math.min(2, activeStep));
    if (prevStep.current === idx && idx === 0) return;
    prevStep.current = idx;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      core.setAttribute("d", SHAPES[idx]);
      if (check) check.style.opacity = idx === 2 ? "1" : "0.2";
      return;
    }

    if (typeof MorphSVGPlugin !== "undefined") {
      gsap.to(core, {
        morphSVG: SHAPES[idx],
        duration: 0.75,
        ease: "expo.out",
      });
    } else {
      core.setAttribute("d", SHAPES[idx]);
    }

    if (check) {
      gsap.to(check, {
        opacity: idx === 2 ? 1 : 0.18,
        scale: idx === 2 ? 1 : 0.85,
        duration: 0.5,
        ease: "expo.out",
        transformOrigin: "220px 220px",
      });
    }
  }, [activeStep]);

  return (
    <div className={className} style={{ position: "relative" }}>
      <svg
        ref={svg}
        viewBox="0 0 440 440"
        className="ewcCoreSvg"
        role="img"
        aria-label={`Qofeno orbital calibration core: ${LABELS[activeStep] ?? LABELS[0]}`}
      >
        <circle cx="220" cy="220" r="192" fill="none" stroke="#F4F4EF" strokeOpacity="0.12" strokeWidth="1" />
        <circle
          data-outer-ring
          cx="220"
          cy="220"
          r="168"
          fill="none"
          stroke="#F4F4EF"
          strokeOpacity="0.24"
          strokeWidth="1.2"
          strokeDasharray="4 10"
        />
        <circle
          cx="220"
          cy="220"
          r="138"
          fill="none"
          stroke="#E3FF3C"
          strokeOpacity={activeStep >= 1 ? 0.55 : 0.2}
          strokeWidth="1.25"
        />
        {[0, 90, 180, 270].map((deg) => (
          <line
            key={deg}
            x1="220"
            y1="16"
            x2="220"
            y2="32"
            stroke="#E3FF3C"
            strokeWidth="1.5"
            opacity="0.7"
            transform={`rotate(${deg} 220 220)`}
          />
        ))}
        <line x1="28" y1="220" x2="412" y2="220" stroke="#F4F4EF" strokeOpacity="0.1" strokeWidth="1" />
        <line x1="220" y1="28" x2="220" y2="412" stroke="#F4F4EF" strokeOpacity="0.1" strokeWidth="1" />
        <path
          data-morph-core
          d={SHAPES[0]}
          fill="#E3FF3C"
          fillOpacity={activeStep === 2 ? 0.14 : 0.08}
          stroke="#E3FF3C"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          data-verify-mark
          d="M192 222 L212 242 L252 198"
          fill="none"
          stroke="#E3FF3C"
          strokeWidth="3.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity={activeStep === 2 ? 1 : 0.18}
        />
        <text
          x="220"
          y="424"
          textAnchor="middle"
          fill="#8C8C86"
          fontFamily="var(--font-ewc-mono), monospace"
          fontSize="11"
          letterSpacing="2"
        >
          {LABELS[activeStep] ?? LABELS[0]}
        </text>
      </svg>
    </div>
  );
}
