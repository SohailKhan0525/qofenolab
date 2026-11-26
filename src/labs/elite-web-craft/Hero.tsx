"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, reduceMotion } from "@/lib/gsap";
import { OrbitalContours } from "@/labs/elite-web-craft/OrbitalContours";
import { SplitReveal } from "@/labs/elite-web-craft/SplitReveal";
import { MagneticButton } from "@/labs/elite-web-craft/MagneticButton";

type ModeKey = "scope" | "gate" | "trace";

const MODES: Record<
  ModeKey,
  {
    label: string;
    command: string;
    status: string;
    lines: { tag: string; text: string; tone: "muted" | "ink" | "accent" }[];
  }
> = {
  scope: {
    label: "01 Scope",
    command: "qofeno run --pack auth-audit --scope src/auth/**",
    status: "Locking orbital boundary to 14 matching modules...",
    lines: [
      { tag: "CONTRACT", text: "write_allow: [src/auth/**, tests/auth/**]", tone: "ink" },
      { tag: "DENY", text: "blocked shell: rm, curl, git push --force", tone: "muted" },
      { tag: "SKILL", text: "loaded @agent-qofeno/verify-jwt@1.4.0", tone: "ink" },
      { tag: "ORBIT", text: "context pinned · 14 files · 0 wildcards", tone: "accent" },
    ],
  },
  gate: {
    label: "02 Gate",
    command: "qofeno check --strict --contract auth-audit.qfn",
    status: "Evaluating deterministic pre-commit assertions...",
    lines: [
      { tag: "TYPE", text: "tsc --noEmit · 0 diagnostics in 184ms", tone: "ink" },
      { tag: "DIFF", text: "2 files touched · +38 -11 · inside orbit", tone: "ink" },
      { tag: "SPEC", text: "rotation-window test: 12/12 assertions pass", tone: "ink" },
      { tag: "SEAL", text: "gate hash 9f3a8c · ready for merge", tone: "accent" },
    ],
  },
  trace: {
    label: "03 Trace",
    command: "qofeno replay run_84c1 --verify",
    status: "Replaying ledger frame 04/04 from local store...",
    lines: [
      { tag: "STEP 01", text: "read src/auth/session.ts (sha256: 41b9e)", tone: "muted" },
      { tag: "STEP 02", text: "patch applied -> invariant check OK", tone: "ink" },
      { tag: "STEP 03", text: "unit suite executed in isolated worktree", tone: "ink" },
      { tag: "LEDGER", text: "deterministic replay matched byte-for-byte", tone: "accent" },
    ],
  },
};

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const streamRef = useRef<HTMLParagraphElement>(null);
  const [mode, setMode] = useState<ModeKey>("scope");
  const [runSeed, setRunSeed] = useState(0);
  const [copied, setCopied] = useState(false);

  const active = MODES[mode];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from("[data-hero-illus]", { scale: 1.05, autoAlpha: 0, duration: 1.6, ease: "power3.out" }, 0)
          .from("[data-hero-eyebrow]", { autoAlpha: 0, y: 14, duration: 0.7 }, 0.08)
          .from("[data-hero-sub]", { autoAlpha: 0, y: 20, duration: 0.9 }, 0.42)
          .from("[data-hero-cta] > *", { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.75 }, 0.58)
          .from("[data-hero-panel]", { autoAlpha: 0, y: 26, duration: 1.0 }, 0.35)
          .from("[data-divider]", { scaleY: 0, transformOrigin: "top", stagger: 0.1, duration: 0.9 }, 0.7)
          .from("[data-stat]", { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.8 }, 0.78);
      });
    },
    { scope: root }
  );

  useEffect(() => {
    const el = streamRef.current;
    if (!el) return;
    const text = active.command;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }
    const obj = { n: 0 };
    el.textContent = "";
    const tween = gsap.to(obj, {
      n: text.length,
      duration: Math.max(0.55, text.length * 0.022),
      ease: "none",
      onUpdate: () => {
        el.textContent = text.slice(0, Math.round(obj.n));
      },
    });
    return () => {
      tween.kill();
    };
  }, [active.command, runSeed]);

  const copyCli = async () => {
    try {
      await navigator.clipboard.writeText("npx @agent-qofeno/cli init");
    } catch {
      // Clipboard may be blocked in insecure contexts; still show feedback.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const scrollToAccess = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("access");
    target?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" });
  };

  return (
    <section id="top" ref={root} className="ewcGrain ewcHero">
      <div data-hero-illus aria-hidden="true" className="ewcHeroBg">
        <OrbitalContours />
        <div className="ewcHeroBgScrim" />
      </div>

      <div className="ewcContainer ewcHeroGrid">
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "flex-start" }}>
          <div data-hero-eyebrow className="ewcEyebrowBadge">
            <span className="ewcDot" aria-hidden="true" />
            <span>Qofeno Runtime // v0.9 Early Access</span>
          </div>

          <SplitReveal as="h1" immediate delay={0.14} className="ewcDisplay ewcH1">
            Keep every agent run in orbit.
          </SplitReveal>

          <p data-hero-sub className="ewcHeroSub">
            Qofeno wraps coding agents in scoped skill packs, deterministic gates, and live execution traces before a single line lands on main.
          </p>

          <div data-hero-cta className="ewcCtaRow">
            <MagneticButton href="#access" onClick={scrollToAccess} className="ewcBtnPrimary">
              Request access
            </MagneticButton>

            <button
              type="button"
              onClick={copyCli}
              className="ewcCopyBtn"
              aria-label="Copy CLI install command"
            >
              <span style={{ color: "var(--accent)" }}>$</span>
              <span>npx @agent-qofeno/cli init</span>
              <span
                style={{
                  color: "var(--muted)",
                  paddingLeft: "10px",
                  borderLeft: "1px solid var(--line)",
                }}
              >
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          </div>
        </div>

        <div data-hero-panel className="ewcBenchPanel">
          <div className="ewcBenchBar">
            <div role="tablist" aria-label="Qofeno runtime stages" className="ewcTabList">
              {(Object.keys(MODES) as ModeKey[]).map((key) => (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  aria-selected={mode === key}
                  onClick={() => setMode(key)}
                  className="ewcTabBtn"
                >
                  {MODES[key].label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setRunSeed((n) => n + 1)}
              className="ewcMono"
              style={{
                minHeight: "36px",
                padding: "0 12px",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--muted)",
              }}
            >
              Replay
            </button>
          </div>

          <div className="ewcBenchBody">
            <div className="ewcBenchCmd">
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>&gt;</span>
              <p
                ref={streamRef}
                style={{
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                aria-live="polite"
              >
                {active.command}
              </p>
            </div>

            <p className="ewcShimmer" style={{ margin: 0, fontSize: "12px" }}>
              {active.status}
            </p>

            <ul className="ewcBenchLines">
              {active.lines.map((line, i) => (
                <li key={`${mode}-${i}`} className="ewcBenchLine">
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      color: line.tone === "accent" ? "var(--accent)" : "var(--muted)",
                      fontWeight: line.tone === "accent" ? 700 : 400,
                    }}
                  >
                    {line.tag}
                  </span>
                  <span
                    style={{
                      color: line.tone === "muted" ? "var(--muted)" : "var(--ink)",
                      fontWeight: line.tone === "accent" ? 700 : 400,
                    }}
                  >
                    {line.text}
                  </span>
                </li>
              ))}
            </ul>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "var(--muted)",
                paddingTop: "4px",
              }}
            >
              <span>CONTRACT: auth-audit.qfn [sample]</span>
              <span style={{ color: "var(--accent)" }}>ORBIT LOCKED</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ewcContainer">
        <div className="ewcStatStrip">
          <div data-stat className="ewcStatItem">
            <p className="ewcMono" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", margin: "0 0 4px" }}>
              Write Boundary [spec]
            </p>
            <p className="ewcDisplay" style={{ fontSize: "30px", margin: 0 }}>
              Zero unverified writes
            </p>
          </div>

          <div data-stat className="ewcStatItem">
            <div data-divider aria-hidden="true" className="ewcDivider" />
            <p className="ewcMono" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", margin: "0 0 4px" }}>
              Execution Ledger [spec]
            </p>
            <p className="ewcDisplay" style={{ fontSize: "30px", margin: 0 }}>
              100% deterministic replay
            </p>
          </div>

          <div data-stat className="ewcStatItem">
            <div data-divider aria-hidden="true" className="ewcDivider" />
            <p className="ewcMono" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", margin: "0 0 4px" }}>
              Local Overhead [target]
            </p>
            <p className="ewcDisplay" style={{ fontSize: "30px", margin: 0, color: "var(--accent)" }}>
              &lt; 12ms gate check
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
