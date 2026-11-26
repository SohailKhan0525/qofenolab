"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/labs/elite-web-craft/SplitReveal";
import { CalibrationCore } from "@/labs/elite-web-craft/CalibrationCore";

const STEPS = [
  {
    code: "01",
    title: "Scope the orbit before the first token",
    body: "Declare which directories, commands, and skill packs an agent may touch in a single versioned qofeno.json file. Everything outside the orbit is denied at runtime.",
    spec: "file-glob allowlist · shell policy · pinned skill hashes",
  },
  {
    code: "02",
    title: "Constrain execution with deterministic gates",
    body: "Every tool invocation passes through lightweight pre- and post-hooks. Type checks, lint rules, and domain invariants run locally before the agent claims victory.",
    spec: "zero-tolerance AST checks · typed exit codes · auto-rollback",
  },
  {
    code: "03",
    title: "Verify and replay the complete diff",
    body: "Review a clean, step-indexed ledger of prompts, file mutations, and gate verdicts. Any teammate can replay the exact verification path in CI.",
    spec: "signed diff manifest · reproducible CI check · audit trail",
  },
];

export function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-step]", stage);
        const rail = stage.querySelector<HTMLElement>("[data-rail]");
        if (!panels.length) return;

        gsap.set(panels, { gridArea: "1 / 1", autoAlpha: 0, y: 40 });
        gsap.set(panels[0], { autoAlpha: 1, y: 0 });

        const n = panels.length;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top+=40",
            end: () => "+=" + window.innerHeight * (n - 0.35) * 0.9,
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            onUpdate: (self) => {
              const idx = Math.min(n - 1, Math.round(self.progress * (n - 1)));
              setActive(idx);
            },
          },
        });

        if (rail) {
          tl.fromTo(rail, { scaleY: 0 }, { scaleY: 1, duration: n - 1 }, 0);
        }
        for (let i = 1; i < n; i++) {
          tl.to(panels[i - 1], { autoAlpha: 0, y: -36, duration: 0.42 }, i - 0.55).to(
            panels[i],
            { autoAlpha: 1, y: 0, duration: 0.42 },
            i - 0.35
          );
        }
      });
    },
    { scope: root }
  );

  return (
    <section id="workflow" ref={root} className="ewcSection">
      <div className="ewcContainer ewcWorkflowHead">
        <div>
          <p className="ewcTag">01 // Calibration Sequence</p>
          <SplitReveal as="h2" className="ewcDisplay ewcH2" stagger={0.08}>
            Three phases from scatter to locked diff.
          </SplitReveal>
        </div>

        <div style={{ display: "flex", gap: "8px" }} role="group" aria-label="Jump to calibration phase">
          {STEPS.map((s, i) => (
            <button
              key={s.code}
              type="button"
              onClick={() => setActive(i)}
              className="ewcMono"
              style={{
                minHeight: "44px",
                minWidth: "44px",
                padding: "0 14px",
                borderRadius: "4px",
                fontSize: "12px",
                border: `1px solid ${active === i ? "var(--accent)" : "var(--line-strong)"}`,
                background: active === i ? "var(--accent)" : "transparent",
                color: active === i ? "var(--accent-ink)" : "var(--muted)",
                fontWeight: active === i ? 700 : 400,
              }}
            >
              {s.code}
            </button>
          ))}
        </div>
      </div>

      <div ref={stageRef} className="ewcContainer ewcWorkflowGrid">
        <div style={{ display: "grid" }}>
          {STEPS.map((step) => (
            <div key={step.code} data-step style={{ padding: "24px 0" }}>
              <div style={{ marginBottom: "16px" }}>
                <span
                  className="ewcMono"
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "4px",
                    background: "var(--surface-2)",
                    color: "var(--accent)",
                    border: "1px solid var(--line-strong)",
                  }}
                >
                  PHASE {step.code}
                </span>
              </div>
              <h3 className="ewcDisplay" style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.25rem)", margin: "0 0 16px" }}>
                {step.title}
              </h3>
              <p style={{ color: "var(--muted)", margin: "0 0 20px", maxWidth: "48ch" }}>
                {step.body}
              </p>
              <p
                className="ewcMono"
                style={{
                  fontSize: "12px",
                  borderLeft: "2px solid var(--accent)",
                  paddingLeft: "12px",
                  margin: 0,
                }}
              >
                {step.spec}
              </p>
            </div>
          ))}
        </div>

        <div className="ewcRailStage">
          <div className="ewcRailTrack">
            <div
              data-rail
              className="ewcRailFill"
              style={{ transform: `scaleY(${(active + 1) / STEPS.length})` }}
            />
          </div>
          <div className="ewcCoreBox">
            <CalibrationCore activeStep={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
