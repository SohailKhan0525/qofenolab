"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, Flip, reduceMotion } from "@/lib/gsap";
import { SplitReveal } from "@/labs/elite-web-craft/SplitReveal";
import { Counter } from "@/labs/elite-web-craft/Counter";
import { MagneticButton } from "@/labs/elite-web-craft/MagneticButton";

type ProfileId = "solo" | "squad" | "org";

const PROFILES: Record<
  ProfileId,
  { label: string; seats: number; runsPerSeat: number; note: string }
> = {
  solo: {
    label: "Solo Builder",
    seats: 1,
    runsPerSeat: 25,
    note: "Local stdio daemon + unlimited local gate checks.",
  },
  squad: {
    label: "Product Squad",
    seats: 8,
    runsPerSeat: 45,
    note: "Shared signed skill packs + CI replay manifest.",
  },
  org: {
    label: "Platform Org",
    seats: 32,
    runsPerSeat: 60,
    note: "Policy enforcement across repos + audit export.",
  },
};

export function RuntimeConfigurator() {
  const root = useRef<HTMLElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState<ProfileId>("squad");
  const [seats, setSeats] = useState(8);
  const [runsPerSeat, setRunsPerSeat] = useState(45);

  const dailyRuns = seats * runsPerSeat;
  const monthlyChecks = dailyRuns * 22;
  const retentionMb = Math.round(dailyRuns * 0.42);
  const recommendedTier =
    seats <= 2 ? "Core CLI (Free)" : seats <= 18 ? "Squad Orbit" : "Platform Mesh";

  const selectProfile = (id: ProfileId) => {
    const bar = tabBarRef.current;
    const pill = pillRef.current;
    const targetBtn = bar?.querySelector<HTMLElement>(`[data-tab="${id}"]`);

    if (pill && targetBtn && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const state = Flip.getState(pill);
      targetBtn.appendChild(pill);
      Flip.from(state, { duration: 0.42, ease: "power3.out" });
    } else if (pill && targetBtn) {
      targetBtn.appendChild(pill);
    }

    setProfile(id);
    setSeats(PROFILES[id].seats);
    setRunsPerSeat(PROFILES[id].runsPerSeat);
  };

  useEffect(() => {
    const container = barsRef.current;
    if (!container) return;
    const bars = Array.from(container.querySelectorAll<HTMLElement>("[data-bar]"));
    const norm = Math.min(1, dailyRuns / 2400);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bars.forEach((b, i) => {
        const wave = 0.25 + 0.75 * norm * (0.55 + 0.45 * Math.sin(i * 0.55 + seats * 0.2));
        b.style.transform = `scaleY(${wave.toFixed(3)})`;
      });
      return;
    }

    gsap.to(bars, {
      scaleY: (i: number) =>
        Math.max(
          0.14,
          Math.min(
            1,
            0.2 + 0.8 * norm * (0.55 + 0.45 * Math.sin(i * 0.52 + seats * 0.18 + runsPerSeat * 0.04))
          )
        ),
      duration: 0.45,
      stagger: { each: 0.012, from: "center" },
      ease: "power3.out",
      overwrite: true,
    });
  }, [dailyRuns, seats, runsPerSeat]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-bench-box]", {
          autoAlpha: 0,
          y: 28,
          duration: 0.85,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
        });
      });
    },
    { scope: root }
  );

  const scrollToAccess = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("access")?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" });
  };

  return (
    <section id="bench" ref={root} className="ewcSection ewcSectionSurface">
      <div className="ewcContainer">
        <div className="ewcWorkflowHead">
          <div>
            <p className="ewcTag">03 // Runtime Sizer</p>
            <SplitReveal as="h2" className="ewcDisplay ewcH2">
              Dial in your verification throughput.
            </SplitReveal>
          </div>

          <div
            ref={tabBarRef}
            role="tablist"
            aria-label="Team profile presets"
            style={{
              display: "inline-flex",
              padding: "4px",
              borderRadius: "4px",
              background: "var(--bg)",
              border: "1px solid var(--line-strong)",
              alignSelf: "flex-start",
            }}
          >
            {(Object.keys(PROFILES) as ProfileId[]).map((id) => {
              const active = profile === id;
              return (
                <button
                  key={id}
                  role="tab"
                  type="button"
                  data-tab={id}
                  aria-selected={active}
                  onClick={() => selectProfile(id)}
                  className="ewcMono"
                  style={{
                    position: "relative",
                    minHeight: "40px",
                    padding: "0 14px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: active ? "var(--accent-ink)" : "var(--muted)",
                    fontWeight: active ? 700 : 400,
                  }}
                >
                  {id === "squad" && (
                    <span
                      ref={pillRef}
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "var(--accent)",
                        borderRadius: "3px",
                        zIndex: 0,
                      }}
                    />
                  )}
                  <span style={{ position: "relative", zIndex: 1 }}>{PROFILES[id].label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div data-bench-box className="ewcSizerCard">
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
                <label htmlFor="ewc-seats" className="ewcMono" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Engineering Seats
                </label>
                <span className="ewcMono" style={{ fontSize: "18px", color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>
                  {seats} {seats === 1 ? "seat" : "seats"}
                </span>
              </div>
              <input
                id="ewc-seats"
                type="range"
                min={1}
                max={50}
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="ewcRange"
              />
              <div className="ewcMono" style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--muted)", marginTop: "8px" }}>
                <span>1</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
                <label htmlFor="ewc-runs" className="ewcMono" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Agent Runs / Seat / Day
                </label>
                <span className="ewcMono" style={{ fontSize: "18px", color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>
                  {runsPerSeat} runs
                </span>
              </div>
              <input
                id="ewc-runs"
                type="range"
                min={5}
                max={120}
                step={5}
                value={runsPerSeat}
                onChange={(e) => setRunsPerSeat(Number(e.target.value))}
                className="ewcRange"
              />
              <div className="ewcMono" style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--muted)", marginTop: "8px" }}>
                <span>5</span>
                <span>60</span>
                <span>120</span>
              </div>
            </div>

            <p style={{ fontSize: "14px", color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: "18px", margin: 0 }}>
              {PROFILES[profile].note} Figures below are calculated directly from your slider inputs{" "}
              <span className="ewcMono" style={{ fontSize: "11px", color: "var(--ink)" }}>[model]</span>.
            </p>
          </div>

          <div className="ewcSizerRight" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "28px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span className="ewcMono" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>
                  Gate Signal Load (24-band)
                </span>
                <span className="ewcMono" style={{ fontSize: "11px", color: "var(--accent)" }}>
                  {recommendedTier}
                </span>
              </div>

              <div ref={barsRef} aria-hidden="true" className="ewcBarsBox">
                {Array.from({ length: 24 }, (_, i) => (
                  <span
                    key={i}
                    data-bar
                    className="ewcBar"
                    style={{ opacity: 0.45 + (i % 4) * 0.15, transform: "scaleY(0.35)" }}
                  />
                ))}
              </div>
            </div>

            <div className="ewcMetrics3">
              <div>
                <p className="ewcMono" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", margin: "0 0 4px" }}>
                  Daily Gate Runs
                </p>
                <p className="ewcDisplay" style={{ fontSize: "34px", margin: 0, fontVariantNumeric: "tabular-nums" }}>
                  {dailyRuns.toLocaleString("en-US")}
                </p>
              </div>
              <div>
                <p className="ewcMono" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", margin: "0 0 4px" }}>
                  Monthly Verified
                </p>
                <p className="ewcDisplay" style={{ fontSize: "34px", margin: 0 }}>
                  <Counter to={monthlyChecks} duration={0.6} />
                </p>
              </div>
              <div>
                <p className="ewcMono" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", margin: "0 0 4px" }}>
                  Daily Ledger [est]
                </p>
                <p className="ewcDisplay" style={{ fontSize: "34px", margin: 0, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>
                  {retentionMb} MB
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
              <span className="ewcMono" style={{ fontSize: "12px", color: "var(--muted)" }}>
                Contract pack ready for {seats} {seats === 1 ? "seat" : "seats"}
              </span>
              <MagneticButton href="#access" onClick={scrollToAccess} className="ewcBtnPrimary">
                Request access
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
