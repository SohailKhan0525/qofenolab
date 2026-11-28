"use client";
import { useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { gsap, useGSAP, Flip, reduceMotion } from "@/lib/gsap";
import { SplitReveal } from "@/labs/elite-web-craft/SplitReveal";
import { MagneticButton } from "@/labs/elite-web-craft/MagneticButton";
import { DitherField } from "./DitherField";
import { AXIS_LABEL, PALETTES, START_SEED, arrangement, roll, type Axis } from "./roll";

export const SKILL_HREF = "/labs/craft/SKILL.md";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const tiles = useRef<HTMLOListElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const [seed, setSeed] = useState(START_SEED);
  const [draft, setDraft] = useState(String(START_SEED));
  const [bad, setBad] = useState(false);

  const deal = roll(seed);
  const order = arrangement(seed);
  const pal = PALETTES[deal.palette];
  const vars = { "--d-bg": pal.bg, "--d-ink": pal.ink, "--d-accent": pal.accent, "--d-spark": pal.spark } as CSSProperties;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from("[data-eyebrow]", { autoAlpha: 0, y: 12, duration: 0.8 }, 0.05)
          .from("[data-sub]", { autoAlpha: 0, y: 24, duration: 1 }, 0.5)
          .from("[data-cta] > *", { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.8 }, 0.7)
          .from("[data-panel]", { autoAlpha: 0, y: 32, duration: 1.2 }, 0.2)
          .from("[data-tile]", { autoAlpha: 0, y: 40, x: (i) => (i % 2 ? 24 : -24), stagger: 0.07, duration: 1 }, 0.5);
      });
    },
    { scope: root }
  );

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    const t = Flip.from(state, { duration: 0.85, ease: "power3.inOut", stagger: 0.03 });
    return () => {
      t.kill();
    };
  }, [seed]);

  const apply = (next: number) => {
    if (!reduceMotion() && tiles.current) flipState.current = Flip.getState(tiles.current.querySelectorAll("[data-tile]"));
    setSeed(next);
    setDraft(String(next));
    setBad(false);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{1,9}$/.test(draft.trim())) return setBad(true);
    apply(Number(draft.trim()));
  };
  const shuffle = () => apply((seed * 1103515245 + 12345) % 999999937);

  const summary = `Seed ${seed}: ${(Object.keys(AXIS_LABEL) as Axis[]).map((k) => deal[k]).join(", ")}.`;

  return (
    <section ref={root} className="hero" aria-labelledby="hero-title">
      <div className="wrap heroGrid">
        <div className="heroCopy">
          <p className="eyebrow" data-eyebrow>An agent skill for Next.js sites</p>
          <SplitReveal as="h1" immediate className="display heroTitle" >
            <span id="hero-title">Dealt, not defaulted.</span>
          </SplitReveal>
          <p className="lead" data-sub>
            Elite Web Craft makes your coding agent roll the palette, type and hero before it writes a line, then holds the build to a lint gate. Every site starts somewhere different. Try the roll yourself.
          </p>
          <div className="actions" data-cta>
            <MagneticButton className="btn" href={SKILL_HREF}>Read the skill</MagneticButton>
            <a className="textLink" href="#method">See the method</a>
          </div>
        </div>

        <div className="panel" data-panel style={vars}>
          <DitherField a={pal.ground[0]} b={pal.ground[1]} px={3} level={0.42} className="panelField" />
          <div className="panelInner">
            <form className="dealForm" onSubmit={onSubmit} noValidate>
              <label htmlFor="seed" className="dealLabel">Seed</label>
              <input id="seed" className="seedInput" inputMode="numeric" autoComplete="off" value={draft} aria-invalid={bad} aria-describedby={bad ? "seed-err" : "seed-cli"} onChange={(e) => setDraft(e.target.value)} />
              <button type="submit" className="btn btnSolid">Deal</button>
              <button type="button" className="btn btnGhost" onClick={shuffle}>New seed</button>
            </form>
            <p id="seed-err" className="seedNote" hidden={!bad} role="alert">Use digits only, up to nine.</p>
            <p id="seed-cli" className="seedNote" hidden={bad}>Same hand from the CLI: <code>node scripts/roll.mjs {seed}</code></p>
            <ol className="tiles" ref={tiles} aria-label="Dealt direction">
              {order.map((k) => (
                <li key={k} data-tile data-axis={k} className="tile">
                  <span className="tileLabel">{AXIS_LABEL[k]}</span>
                  <span className="tileValue display">{deal[k]}</span>
                  {k === "palette" && (
                    <span className="chips" aria-hidden="true">
                      {[pal.bg, pal.ink, pal.accent, pal.spark].map((c, i) => <i key={i} style={{ background: c }} />)}
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <p className="srOnly" aria-live="polite">{summary}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
