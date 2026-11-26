"use client";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, SplitText, reduceMotion } from "@/lib/gsap";
import { QofenoMark } from "@/labs/elite-web-craft/QofenoMark";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (wordmarkRef.current) {
          SplitText.create(wordmarkRef.current, {
            type: "chars",
            mask: "chars",
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.chars, {
                yPercent: 115,
                stagger: 0.035,
                duration: 1.05,
                ease: "expo.out",
                scrollTrigger: {
                  trigger: wordmarkRef.current,
                  start: "top 88%",
                  once: true,
                },
              });
            },
          });
        }

        if (ringRef.current) {
          gsap.fromTo(
            ringRef.current,
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              ease: "none",
              scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
            }
          );
        }
      });
    },
    { scope: root }
  );

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" });
  };

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" });
  };

  return (
    <footer ref={root} className="ewcFooter">
      <div className="ewcContainer">
        <div className="ewcFooterGrid">
          <div>
            <div className="ewcBrand" style={{ marginBottom: "14px" }}>
              <QofenoMark size={22} />
              <span>QOFENO</span>
            </div>
            <p style={{ fontSize: "14px", color: "var(--muted)", maxWidth: "36ch", margin: 0 }}>
              Deterministic workflow contracts, scoped skill packs, and replayable execution ledgers for coding agents.
            </p>
          </div>

          <div className="ewcMono" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", fontSize: "12px" }}>
            <div>
              <p style={{ color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>
                Navigation
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { id: "workflow", label: "Workflow" },
                  { id: "primitives", label: "Primitives" },
                  { id: "bench", label: "Runtime Sizer" },
                  { id: "faq", label: "FAQ" },
                ].map((l) => (
                  <li key={l.id}>
                    <a
                      href={`#${l.id}`}
                      onClick={(e) => scrollTo(e, l.id)}
                      style={{ display: "inline-flex", minHeight: "36px", alignItems: "center" }}
                    >
                      <span className="ewcRoll">
                        <span>{l.label}</span>
                        <span aria-hidden="true">{l.label}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p style={{ color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>
                Qofeno Lab
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "8px", color: "var(--muted)" }}>
                <li>
                  <Link href="/" style={{ display: "inline-flex", minHeight: "36px", alignItems: "center", color: "var(--ink)" }}>
                    All experiments
                  </Link>
                </li>
                <li>@agent-qofeno/cli</li>
                <li>qofeno.json schema</li>
                <li>
                  <a
                    href="#access"
                    onClick={(e) => scrollTo(e, "access")}
                    style={{ display: "inline-flex", minHeight: "36px", alignItems: "center", color: "var(--accent)" }}
                  >
                    Request access
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}>
            <button type="button" onClick={scrollTop} aria-label="Scroll back to top" className="ewcTopBtn">
              <svg
                viewBox="0 0 48 48"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }}
                aria-hidden="true"
              >
                <circle ref={ringRef} cx="24" cy="24" r="22" fill="none" stroke="#E3FF3C" strokeWidth="2" />
              </svg>
              <span>TOP</span>
            </button>
          </div>
        </div>

        <div style={{ containerType: "inline-size", paddingBlock: "32px 16px", userSelect: "none", overflow: "hidden" }}>
          <p
            ref={wordmarkRef}
            aria-hidden="true"
            className="ewcDisplay"
            style={{
              textAlign: "center",
              letterSpacing: "-0.04em",
              margin: 0,
              fontSize: "20.5cqi",
              lineHeight: 0.85,
            }}
          >
            QOFENO
          </p>
        </div>

        <div className="ewcMono" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "16px", paddingTop: "16px", fontSize: "11px", color: "var(--muted)" }}>
          <span>Qofeno // Orbital Agent Runtime</span>
          <span>Signal Duotone // Code-drawn architecture</span>
        </div>
      </div>
    </footer>
  );
}
