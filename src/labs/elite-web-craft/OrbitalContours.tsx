"use client";
import { useMemo, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { smoothClosedPath } from "@/lib/noise";

const CX = 860;
const CY = 360;

function orbitPoints(k: number, time: number, n = 84): [number, number][] {
  const base = 118 + k * 34;
  const amp = 4 + k * 1.45;
  return Array.from({ length: n }, (_, i) => {
    const th = (i / n) * Math.PI * 2;
    const wave =
      Math.sin(th * 2 + time * 0.42 + k * 0.55) * 0.5 +
      Math.sin(th * 3 - time * 0.28 + k * 1.1) * 0.32 +
      Math.sin(th * 5 + time * 0.18 - k * 0.8) * 0.18;
    const r = base + amp * wave;
    return [CX + Math.cos(th) * r, CY + Math.sin(th) * r * 0.88] as [number, number];
  });
}

export function OrbitalContours({
  rings = 11,
  className,
}: {
  rings?: number;
  className?: string;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const initialPaths = useMemo(
    () => Array.from({ length: rings }, (_, k) => smoothClosedPath(orbitPoints(k, 1.4))),
    [rings]
  );

  useGSAP(
    () => {
      const el = svg.current;
      if (!el) return;
      const paths = gsap.utils.toArray<SVGPathElement>("[data-orbit-ring]", el);
      const reticle = el.querySelector<SVGGElement>("[data-reticle]");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const draw = (time: number) => {
          paths.forEach((p, k) =>
            p.setAttribute("d", smoothClosedPath(orbitPoints(k, time * 0.85 + 1.4)))
          );
        };
        gsap.ticker.add(draw);

        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        let onMove: ((e: PointerEvent) => void) | undefined;
        if (fine && reticle) {
          const xTo = gsap.quickTo(reticle, "x", { duration: 0.9, ease: "power3.out" });
          const yTo = gsap.quickTo(reticle, "y", { duration: 0.9, ease: "power3.out" });
          onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            xTo(-nx * 24);
            yTo(-ny * 16);
          };
          window.addEventListener("pointermove", onMove, { passive: true });
        }

        gsap.to("[data-orbit-field]", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        return () => {
          gsap.ticker.remove(draw);
          if (onMove) window.removeEventListener("pointermove", onMove);
        };
      });
    },
    { scope: svg }
  );

  return (
    <svg
      ref={svg}
      viewBox="0 0 1200 720"
      className={className}
      style={{ width: "100%", height: "100%", display: "block", opacity: 0.9 }}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <g data-orbit-field fill="none">
        {initialPaths.map((d, k) => {
          const isSignal = k === 2 || k === 5;
          const stroke = isSignal ? "#E3FF3C" : "#F4F4EF";
          const opacity = isSignal
            ? k === 2
              ? 0.42
              : 0.24
            : Math.max(0.05, 0.22 - k * 0.015);
          const strokeWidth = k < 3 ? 1.35 : k < 7 ? 1 : 0.75;
          return (
            <path
              key={k}
              data-orbit-ring
              d={d}
              stroke={stroke}
              strokeWidth={strokeWidth}
              opacity={opacity}
              strokeDasharray={k === 4 ? "6 10" : undefined}
            />
          );
        })}

        <g data-reticle>
          <circle cx={CX} cy={CY} r={92} stroke="#E3FF3C" strokeWidth={1} opacity={0.35} />
          <line x1={CX - 480} y1={CY} x2={CX + 320} y2={CY} stroke="#F4F4EF" strokeWidth={0.75} opacity={0.1} />
          <line x1={CX} y1={CY - 320} x2={CX} y2={CY + 320} stroke="#F4F4EF" strokeWidth={0.75} opacity={0.1} />
          <circle cx={CX} cy={CY} r={4} fill="#E3FF3C" opacity={0.85} />
        </g>
      </g>
    </svg>
  );
}
