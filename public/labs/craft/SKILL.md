---
name: elite-web-craft
description: Build elite, award-grade React and Next.js websites for any kind of product, entirely in code with no images or stock photos. Concept-first design, GSAP choreography for every section, code-drawn illustration (SVG hatch, stipple, guilloche, OGL shaders, Three.js), measured design benchmarks from 84 studied sites, and anti-"AI slop" gates with a lint script. Use whenever the user asks to build, redesign or polish a landing page, marketing or product site, portfolio, hero, section, launch or brand page, or mentions elite, award-winning, Awwwards, GSAP, Three.js, WebGL, "no AI slop", generic-looking design, or illustrations and animations made with code. Works in Claude, Codex and Antigravity.
---

# Elite Web Craft

Build React/Next.js sites that look authored, not generated: one idea held from hero to footer, drawn and animated entirely in code. No images, no stock photos, no asset files.

## Operating principles
1. **Concept before code.** Award juries weight Design 40, Usability 30, Creativity 20, Content 10. Effects never compensate for a missing idea or missing fundamentals (Igloo Inc won Site of the Year yet scored 6.6 on accessibility/semantics). Decide the idea, the metaphor and the signature moment first.
2. **Code-only.** Every visual is SVG, canvas, WebGL, CSS or type. The look comes from a metaphor scene plus ONE rendering treatment (hatch, stipple, halftone, dither, contour, dot-matrix, painted ground), 2 to 3 colours, and type used as material.
3. **Motion is choreography.** One motion verb per site, one dominant mover per viewport, entrances that overlap, scrub timelines that use `ease: none`.
4. **Evidence over taste.** Use the measured benchmarks and the studied sites (`references/02`, `03`) instead of defaults. Do not let your own taste choose the palette, font or hero: roll them (`scripts/roll.mjs`) and veto only with a reason.
5. **Honesty.** Never invent metrics, logos, testimonials, awards or compliance claims. Say what you verified and what you did not.

## Workflow (in order)
0. **Project check.** Is there a Next.js (App Router) project? If not, scaffold per `references/09`. Copy `assets/starter/src/*` into `src/` rather than rewriting it, then trim `lib/gsap.ts` to the plugins you use.
1. **Intake.** Ask at most one question (what it does, for whom, the one action). Otherwise state assumptions in one line and proceed. (`01` section 1)
2. **Diagnose + dials.** Name the product type; read its blueprint in `references/04`; set MOTION / DENSITY / VARIANCE (`01` section 3).
3. **Study.** `grep -n "^### " references/02-site-study.md` then open 3 to 6 entries: same category first, plus one contrast pick; read that category's row in `03`. Extract rules (hierarchy, rhythm, restraint, signature), never copy a layout or a brand look.
4. **Concept Card.** Three concepts from different territories, scored on originality, fit and feasibility-in-code; pick one; write the card (idea, metaphor, signature moment, material, motion verb, illustration treatment, "we refuse" list). Metaphor ideas: `06` section 3. (`01` section 4)
5. **Roll.** `node scripts/roll.mjs` gives palette register, type pairing, hero archetype, layout skeleton, signature technique, motion verb and treatment. Veto only when it contradicts the Concept Card, with a one-line reason, then re-roll that axis.
6. **Plan table** (`01` section 6): section, job, layout family, recipe IDs from `05`, illustration/WebGL technique from `06`/`07`, content source. No two adjacent sections share a layout family; one live WebGL canvas at most in view.
7. **Build** in this order: tokens (`03`) -> fonts (`next/font`) -> shell (nav, footer, SmoothScroll, transition overlay) -> hero (iterate most here) -> sections top-down -> illustrations/WebGL (lazy, with poster fallback) -> page transition -> reduced-motion + mobile + keyboard. Write real, specific copy; keep ~80 words per screen.
8. **Gates.** `npx tsc --noEmit` (or `next build`), then `node scripts/lint.mjs src` must exit 0, then LOOK at the result (`09` section 9: browser screenshots if available; otherwise resvg for SVG and glslang for shaders). Check `08` section 4 finish list. Fix until clean.
9. **Report.** Sections built, the Concept Card in 3 lines, assumptions and placeholders, what was and was not verified, how to run. Do not claim awards or scores.

## The Floor (never waivable; full list in `references/08`)
No `<img>`/`next/image`/raster files/remote image hosts · all words are real DOM text · one `h1` + landmarks · `prefers-reduced-motion` branch for every motion and a static poster under every WebGL canvas · keyboard + visible focus + 44px targets · contrast >= 4.5:1 · no invented facts · works 360 to 1920 without horizontal overflow · animate transform/opacity/clip-path only · GSAP only via `useGSAP` with scope and `@/lib/gsap` · lint exits 0.

## Per-section minimum
Each section has: an entrance choreography (grammar in `05` section 0), one micro-interaction, one scroll-linked element or a deliberate stillness, a reduced-motion branch, a mobile branch, and a keyboard path. Illustration per section is encouraged when it carries the metaphor; otherwise let type and space do the work.

## Reference map (read only what the step needs)
| File | Read when |
|---|---|
| `references/01-process-and-concept.md` | Always, steps 1 to 6 and 9 (process, dials, Concept Card, roll, plan, rubric, verification grid) |
| `references/02-site-study.md` | Step 3. Grep by category/site; 84 extracted design systems + 12 award-tier sites with provenance labels |
| `references/03-benchmarks-and-tokens.md` | Choosing type, colour, spacing, radius, motion timings; contains measured numbers, verified open-source font substitutes, 12 pairings, 10 palette registers |
| `references/04-sections-by-product-type.md` | Steps 2 and 6: section library + 24 product-type blueprints |
| `references/05-gsap-catalog.md` | Writing ANY animation: grammar, ~50 recipes by section (F, T, H, N, S, C, P, E), pitfalls |
| `references/06-illustration-in-code.md` | Before drawing any hero/section art: method from the reference videos, metaphor table, tested techniques, composition + perf rules |
| `references/07-webgl-and-libraries.md` | Considering WebGL/3D or any new library: 20 Three.js neighbours with verified versions/licences/sizes, Next.js rules, budgets |
| `references/08-anti-slop-and-skills-study.md` | Step 8 and whenever output feels generic: Floor, reflex tells, finish list, 34 studied skills |
| `references/09-nextjs-setup.md` | Scaffolding, layout, client/server boundaries, tokens, metadata, a11y, perf, verification, troubleshooting |

## Starter kit (typed, strict-compiles against gsap 3.15, next 16.4, react 19.3, three 0.187, ogl 1.0)
`assets/starter/src/`: `lib/gsap.ts` (single plugin registration) · `lib/noise.ts`, `lib/stipple.ts`, `lib/guilloche.ts` · components `SmoothScroll`, `SplitReveal`, `MagneticButton`, `Marquee`, `Counter`, `PinnedSteps`, `TransitionOverlay`, `TransitionLink`, `app-template.tsx` · illustrations `HatchClouds`, `EngravedLandscape`, `PuppetStrings`, `GhostMascot`, `PaintedGround`, `StippleSphere`, `GuillochePlate` · webgl `useOglCanvas`, `DotMatrixField`, `HalftoneWave`, `DitherField`, `FlameField`, `ProductScene`, `ProductStage` · `styles/elite.css`. These are techniques to ADAPT to the Concept Card (change subject, palette, density, motion verb), not finished art. Shipping them unchanged is a failure.

## Scripts (zero dependencies, Node >= 18)
- `node scripts/roll.mjs [seed]` direction roll. · `node scripts/lint.mjs <dir> [--strict]` gate (images, raster refs, remote image hosts, lorem, GSAP leaks, layout animation, missing reduced-motion, missing `"use client"`, `ssr:false` in server files, SVG a11y, slop gradients/copy, default-font-only). · `node scripts/sniff-site.mjs <url>` extracts stack hints, fonts, colours, radii, widths, easing from a live public site's HTML/CSS (static CSS only). · `sh scripts/install.sh [--project] [claude|codex|antigravity|all]` installs this skill.

## Stack defaults (verified on the npm registry 2026-11-21; re-check with `npm view <pkg> version` if much time has passed)
Next 16.4 · React 19.3 · TypeScript 5.9 (TS 7 needs Next >= 16.3) · Tailwind 4.3 · gsap 3.15 + @gsap/react 2.1 (all plugins free; GreenSock "no charge" licence, not MIT) · lenis 1.3 · ogl 1.0 for shader backgrounds · three 0.187 + @react-three/fiber 9.8 + drei 10.7 only when real 3D is the concept. Fonts via `next/font/google` (all fonts in `03` verified to exist).

## Studying references the user provides
- **Video:** `ffmpeg -i in.mp4 -vf "fps=1,scale=1100:-1" -q:v 3 f_%02d.jpg`, view the frames, write what you see under: layout/spacing, type (scale, weight, tracking), colour, UI details, motion (what moves, easing feel, order), and illustration method (metaphor, treatment, palette, light). Map each to a technique in `05`/`06`. Reproduce the *method* with the user's subject, never their subject.
- **Screenshot/URL:** same list; for a URL with network access also run `scripts/sniff-site.mjs`.
- Say plainly what you could not see (hover states, scroll behaviour, WebGL internals).

## Common failure modes
Starter art shipped unchanged · palette/font/hero chosen by taste instead of rolled · every section animated the same way · WebGL on every section · invisible headings because the `.js` gate had no `SplitReveal` · pins without `ScrollTrigger.refresh()` after fonts · text baked into canvas · `Math.random()` during render · claiming it "looks great" without having looked.
