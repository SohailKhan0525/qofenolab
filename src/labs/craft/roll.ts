// Port of scripts/roll.mjs from the skill, so `node scripts/roll.mjs <seed>` and this page agree.
export const AXES = {
  palette: ["Cobalt Engraving", "Ghost Night", "Oxblood Brush", "Teal Stipple", "Ember Dusk", "Paper and Ink", "Signal Duotone", "Glacier Mono", "Moss and Bone", "Chrome Noir"],
  type: ["Instrument Serif / Geist / Geist Mono", "Fraunces / Hanken Grotesk / JetBrains Mono", "Bricolage Grotesque / Instrument Sans / DM Mono", "Anton / Archivo / IBM Plex Mono", "Newsreader / Inter Tight / Martian Mono", "Gloock / Schibsted Grotesk / Space Mono", "Big Shoulders Display / Barlow / JetBrains Mono", "DM Serif Display / DM Sans / DM Mono", "Cormorant Garamond / Figtree", "Syne / Onest / Geist Mono", "Unbounded / Albert Sans / Space Mono", "Young Serif / Public Sans"],
  hero: ["A type-as-hero", "B illustration scene", "C live product UI", "D WebGL field/object", "E split editorial", "F bento brand wall", "G pinned story", "H interactive tool"],
  layout: ["1 centred stack", "2 text-left / art-right", "3 full-bleed scene + overlay type", "4 asymmetric 12-col with offsets", "5 bento-first", "6 editorial columns with side-notes"],
  signature: ["dot-matrix / ASCII dissolve", "halftone / dither shader", "engraved hatch illustration", "stipple field", "text-as-material strings", "contour / topographic rings", "pinned scroll film", "horizontal journey", "cursor-reactive mesh", "kinetic variable-font type", "Flip layout morph", "SVG morph mascot"],
  verb: ["unfold", "tighten", "assemble", "drift", "ignite", "descend", "tune", "weave", "surface", "orbit", "settle", "unspool"],
  treatment: ["engraving / hatch", "stipple", "halftone", "ordered dither", "contour lines", "dot-matrix", "painted ground", "ember / smoke", "guilloche", "blueprint line art"],
} as const;

export type Axis = keyof typeof AXES;
export const AXIS_KEYS = Object.keys(AXES) as Axis[];
export const AXIS_LABEL: Record<Axis, string> = {
  palette: "Palette register", type: "Type pairing", hero: "Hero archetype", layout: "Layout skeleton",
  signature: "Signature technique", verb: "Motion verb", treatment: "Illustration treatment",
};

export type Palette = { bg: string; ink: string; accent: string; spark: string; ground: [string, string] };
// bg / ink / accent / spark from references/03 section 7; ground = two inks of the same register for the dither.
export const PALETTES: Record<string, Palette> = {
  "Cobalt Engraving": { bg: "#F1EADA", ink: "#12206B", accent: "#2A4BD7", spark: "#E85D3A", ground: ["#12206B", "#2A4BD7"] },
  "Ghost Night": { bg: "#0A0A0B", ink: "#FFFFFF", accent: "#9FC8FF", spark: "#FF9F88", ground: ["#121214", "#4E527C"] },
  "Oxblood Brush": { bg: "#7A0F16", ink: "#F6EDE4", accent: "#F6EDE4", spark: "#FFD9B0", ground: ["#5E0B11", "#D9B3AC"] },
  "Teal Stipple": { bg: "#0D2A3A", ink: "#F2E8D3", accent: "#C8643B", spark: "#8F9A4A", ground: ["#123648", "#C8643B"] },
  "Ember Dusk": { bg: "#120305", ink: "#FFF1EA", accent: "#FF5A1F", spark: "#FFB36B", ground: ["#1E070A", "#FF5A1F"] },
  "Paper and Ink": { bg: "#F6F1E7", ink: "#1B1B18", accent: "#C4552D", spark: "#1B1B18", ground: ["#1B1B18", "#C4552D"] },
  "Signal Duotone": { bg: "#0B0B0B", ink: "#F4F4EF", accent: "#E3FF3C", spark: "#FFFFFF", ground: ["#151515", "#E3FF3C"] },
  "Glacier Mono": { bg: "#FAFAF9", ink: "#0F1115", accent: "#3B5BFF", spark: "#0F1115", ground: ["#0F1115", "#3B5BFF"] },
  "Moss and Bone": { bg: "#EDEBE0", ink: "#1F2A1F", accent: "#4C6B3C", spark: "#D8A47F", ground: ["#1F2A1F", "#D8A47F"] },
  "Chrome Noir": { bg: "#08090A", ink: "#ECEDEE", accent: "#B8C0CC", spark: "#D6A85B", ground: ["#111214", "#B8C0CC"] },
};

function mulberry32(a: number) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Deal = { seed: number } & Record<Axis, string>;

export function roll(seed: number): Deal {
  const rnd = mulberry32(seed);
  const out = { seed } as Deal;
  for (const k of AXIS_KEYS) out[k] = AXES[k][Math.floor(rnd() * AXES[k].length)];
  return out;
}

/** Seeded arrangement of the seven tiles (Fisher-Yates on a second stream). */
export function arrangement(seed: number): Axis[] {
  const rnd = mulberry32(seed ^ 0x9e3779b9);
  const a = [...AXIS_KEYS];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const START_SEED = 2711;
