"use client";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SplitReveal } from "@/labs/elite-web-craft/SplitReveal";

const FAQS = [
  {
    q: "How is Qofeno different from putting rules in a Markdown prompt?",
    a: "Markdown instructions are advisory—an agent under long context pressure can ignore them. Qofeno compiles your boundaries into pre/post tool hooks and deterministic verification checks that run outside the model's context window.",
  },
  {
    q: "Which coding agents and editors does Qofeno work with?",
    a: "Qofeno wraps CLI agents and MCP-capable hosts including Claude Code, Cursor, Codex CLI, and Antigravity, and exports identical verification contracts to GitHub Actions or any Linux CI runner.",
  },
  {
    q: "Does my source code leave our machines?",
    a: "No. Skill packs, boundary gates, and trace ledgers run inside your local shell or private CI environment. Qofeno does not proxy your repository through third-party model servers.",
  },
  {
    q: "How fast is the gate overhead on each edit?",
    a: "Scope and AST pattern checks execute locally in single-digit milliseconds; heavier type-checking or test suites are scoped strictly to the files touched inside the declared orbit.",
  },
  {
    q: "Can we adopt Qofeno incrementally in an existing monorepo?",
    a: "Yes. Drop a minimal qofeno.json into one package directory first. Unscoped directories behave normally while scoped packages enforce your contract and generate replayable traces.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const toggle = (idx: number) => {
    const next = openIdx === idx ? null : idx;
    const prev = openIdx;
    setOpenIdx(next);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ScrollTrigger.refresh();
      return;
    }

    if (prev !== null && prev !== next) {
      const prevPanel = panelRefs.current[prev];
      const prevIcon = iconRefs.current[prev];
      if (prevPanel) {
        gsap.to(prevPanel, {
          height: 0,
          duration: 0.4,
          ease: "power3.inOut",
          onComplete: () => ScrollTrigger.refresh(),
        });
      }
      if (prevIcon) gsap.to(prevIcon, { rotation: 0, duration: 0.3, ease: "power2.out" });
    }

    if (next !== null) {
      const nextPanel = panelRefs.current[next];
      const nextIcon = iconRefs.current[next];
      if (nextPanel) {
        gsap.to(nextPanel, {
          height: "auto",
          duration: 0.45,
          ease: "power3.inOut",
          onComplete: () => ScrollTrigger.refresh(),
        });
      }
      if (nextIcon) gsap.to(nextIcon, { rotation: 45, duration: 0.3, ease: "power2.out" });
    }
  };

  return (
    <section id="faq" className="ewcSection">
      <div className="ewcContainer ewcFaqGrid">
        <div className="ewcFaqSticky">
          <p className="ewcTag">04 // Engineering FAQ</p>
          <SplitReveal as="h2" className="ewcDisplay ewcH2">
            Questions teams ask before wiring it in.
          </SplitReveal>
          <p style={{ color: "var(--muted)", marginTop: "20px", maxWidth: "38ch" }}>
            Straight answers on runtime isolation, CI parity, and adopting contracts without slowing down iteration.
          </p>
        </div>

        <div style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            const panelId = `ewc-faq-panel-${idx}`;
            return (
              <div
                key={item.q}
                style={{
                  borderTop: idx === 0 ? "none" : "1px solid var(--line)",
                  paddingBlock: "6px",
                }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(idx)}
                  className="ewcFaqBtn"
                >
                  <span className="ewcDisplay" style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)" }}>
                    {item.q}
                  </span>
                  <span
                    ref={(el) => {
                      iconRefs.current[idx] = el;
                    }}
                    aria-hidden="true"
                    className="ewcFaqIcon"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    +
                  </span>
                </button>
                <div
                  id={panelId}
                  ref={(el) => {
                    panelRefs.current[idx] = el;
                  }}
                  style={{ height: isOpen ? "auto" : 0, overflow: "hidden" }}
                >
                  <p style={{ paddingBottom: "22px", paddingRight: "40px", margin: 0, color: "var(--muted)", maxWidth: "60ch" }}>
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
