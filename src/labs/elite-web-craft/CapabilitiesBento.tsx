"use client";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { SplitReveal } from "@/labs/elite-web-craft/SplitReveal";

const PRIMITIVES = [
  {
    id: "packs",
    spanClass: "ewcSpan7",
    tag: "01 // SKILL PACKS",
    title: "Versioned capabilities, not prompt drift.",
    body: "Bundle verified skills, schema checks, and repository conventions as immutable npm or git packages. Pin exact hashes across every developer laptop and CI runner.",
    snippet: "@agent-qofeno/nextjs-gate@1.4.2",
    diagram: (
      <svg viewBox="0 0 240 84" style={{ width: "100%", height: "80px", display: "block" }} aria-hidden="true">
        <rect x="6" y="16" width="60" height="52" rx="4" fill="none" stroke="#8C8C86" strokeWidth="1.2" />
        <rect x="90" y="16" width="60" height="52" rx="4" fill="none" stroke="#E3FF3C" strokeWidth="1.5" />
        <rect x="174" y="16" width="60" height="52" rx="4" fill="none" stroke="#F4F4EF" strokeOpacity="0.45" strokeWidth="1.2" />
        <path d="M66 42 H90 M150 42 H174" stroke="#E3FF3C" strokeWidth="1.4" strokeDasharray="3 3" />
        <circle cx="120" cy="42" r="8" fill="#E3FF3C" fillOpacity="0.2" stroke="#E3FF3C" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id: "gates",
    spanClass: "ewcSpan5",
    tag: "02 // DETERMINISTIC GATES",
    title: "Fail fast before the PR opens.",
    body: "Enforce file-glob boundaries, forbidden-pattern rules, and strict compilation automatically after every agent write.",
    snippet: "exit 0 // 0 errors · 11ms",
    diagram: (
      <svg viewBox="0 0 200 84" style={{ width: "100%", height: "80px", display: "block" }} aria-hidden="true">
        <circle cx="100" cy="42" r="30" fill="none" stroke="#F4F4EF" strokeOpacity="0.25" strokeWidth="1.2" />
        <circle cx="100" cy="42" r="20" fill="none" stroke="#E3FF3C" strokeWidth="1.5" strokeDasharray="44 12" />
        <path d="M91 42 L98 49 L111 35" fill="none" stroke="#E3FF3C" strokeWidth="2.2" strokeLinecap="square" />
      </svg>
    ),
  },
  {
    id: "replay",
    spanClass: "ewcSpan5",
    tag: "03 // TRACE LEDGER",
    title: "Every tool call hashed and replayable.",
    body: "Inspect exact file reads, shell exits, and diff checkpoints in a compact local ledger instead of scrolling through raw terminal walls.",
    snippet: "qofeno replay run_84c1 --step 4",
    diagram: (
      <svg viewBox="0 0 200 84" style={{ width: "100%", height: "80px", display: "block" }} aria-hidden="true">
        {[18, 34, 50, 66].map((y, idx) => (
          <g key={y}>
            <line x1="20" y1={y} x2="180" y2={y} stroke="#F4F4EF" strokeOpacity="0.16" strokeWidth="1" />
            <rect
              x={28 + idx * 24}
              y={y - 4}
              width={46}
              height={8}
              rx="2"
              fill={idx === 2 ? "#E3FF3C" : "#8C8C86"}
              fillOpacity={idx === 2 ? 0.9 : 0.45}
            />
          </g>
        ))}
      </svg>
    ),
  },
  {
    id: "cli",
    spanClass: "ewcSpan7",
    tag: "04 // ZERO-CONFIG CLI",
    title: "Local daemon. Zero cloud lock-in.",
    body: "Run Qofeno directly inside your repository over stdio or MCP. Keep source trees, secrets, and verification logs on hardware you control.",
    snippet: "qofeno.json -> stdio + mcp + github-action",
    diagram: (
      <svg viewBox="0 0 240 84" style={{ width: "100%", height: "80px", display: "block" }} aria-hidden="true">
        <path d="M16 60 C58 20, 92 64, 130 34 C164 8, 194 52, 224 24" fill="none" stroke="#E3FF3C" strokeWidth="1.8" />
        <circle cx="16" cy="60" r="3.5" fill="#F4F4EF" />
        <circle cx="130" cy="34" r="3.5" fill="#E3FF3C" />
        <circle cx="224" cy="24" r="3.5" fill="#E3FF3C" />
      </svg>
    ),
  },
];

export function CapabilitiesBento() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-bento]", el);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(cards, { autoAlpha: 0, y: 36 });
        ScrollTrigger.batch(cards, {
          start: "top 86%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              autoAlpha: 1,
              y: 0,
              stagger: 0.09,
              duration: 0.85,
              ease: "expo.out",
            }),
        });
      });

      const cleanups: (() => void)[] = [];
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        cards.forEach((card) => {
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.45, ease: "power3.out" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.45, ease: "power3.out" });
          gsap.set(card, { transformPerspective: 900 });

          const onMove = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            card.style.setProperty("--mx", `${px * 100}%`);
            card.style.setProperty("--my", `${py * 100}%`);
            rx((0.5 - py) * 5);
            ry((px - 0.5) * 5);
          };
          const onLeave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          });
        });
        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: root }
  );

  return (
    <section id="primitives" ref={root} className="ewcSection">
      <div className="ewcContainer">
        <div className="ewcWorkflowHead">
          <div>
            <p className="ewcTag">02 // Core Primitives</p>
            <SplitReveal as="h2" className="ewcDisplay ewcH2">
              Four primitives for disciplined agents.
            </SplitReveal>
          </div>
          <p style={{ color: "var(--muted)", maxWidth: "40ch", margin: 0 }}>
            Built for teams running coding agents in real repositories—where file boundaries and verification matter more than vibes.
          </p>
        </div>

        <div className="ewcBentoGrid">
          {PRIMITIVES.map((item) => (
            <article key={item.id} data-bento className={`ewcSpotlight ${item.spanClass}`}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>
                  <span className="ewcMono" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent)" }}>
                    {item.tag}
                  </span>
                  <span className="ewcMono" style={{ fontSize: "11px", color: "var(--muted)" }}>
                    {item.snippet}
                  </span>
                </div>
                <h3 className="ewcDisplay" style={{ fontSize: "clamp(1.45rem, 2.2vw, 1.85rem)", margin: "0 0 12px" }}>
                  {item.title}
                </h3>
                <p style={{ color: "var(--muted)", margin: 0, maxWidth: "52ch" }}>{item.body}</p>
              </div>
              <div style={{ paddingTop: "16px", borderTop: "1px solid var(--line)" }}>{item.diagram}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
