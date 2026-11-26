#!/usr/bin/env node
// Zero-dependency gate for elite-web-craft builds (Node >= 18).
// Usage: node scripts/lint.mjs [dir=.] [--strict] [--json]
// Exit 1 on any error (and on warnings with --strict). Checks the "Floor" rules it can check mechanically.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative, basename, sep } from "node:path";

const args = process.argv.slice(2);
const strict = args.includes("--strict"), asJson = args.includes("--json");
const root = args.find((a) => !a.startsWith("--")) || ".";
const SKIP = new Set(["node_modules", ".next", ".git", "dist", "out", "build", "coverage", ".turbo", ".vercel"]);
const CODE = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".scss", ".html", ".mdx"]);
const RASTER = /\.(png|jpe?g|gif|webp|avif|bmp|tiff?|heic)(?=$|[?#"'`)\s])/i;
const HOSTS = /(unsplash|pexels|picsum\.photos|placehold\.co|placeholder\.com|via\.placeholder|imgur|pravatar|cloudinary|ctfassets|dicebear)/i;
const EMOJI = /[\u{1F000}-\u{1F2FF}\u{1F300}-\u{1FAFF}\u{2728}\u{26A1}\u{2705}\u{274C}\u{2B50}\u{2764}\u{27A1}]/u;
const SLOP_COPY = /\b(supercharge[sd]?|unlock the power|seamless(ly)?|revolutioni[sz]e[sd]?|next-?gen(eration)?|cutting-?edge|game-?chang(er|ing)|elevate your|empower(s|ing)? (your|teams|everyone)|all-in-one platform|take (it|your \w+) to the next level)\b/i;
const HOOKS = /\b(useState|useEffect|useRef|useGSAP|useLayoutEffect|useReducer|useContext|useMemo|useCallback)\b/;
const APP_FILES = /^(page|layout|template|loading|error|not-found|global-error)\.(tsx|jsx)$/;

const walk = (d, out = []) => { for (const n of readdirSync(d)) { if (SKIP.has(n)) continue; const p = join(d, n), st = statSync(p); st.isDirectory() ? walk(p, out) : out.push(p); } return out; };
const findings = [];
const add = (level, id, file, line, msg) => findings.push({ level, id, file: relative(root, file) || file, line, msg });
const lineOf = (text, idx) => text.slice(0, idx).split("\n").length;

let usesGsap = false, hasReduced = false, usesLenis = false, smoothCss = false, willChange = 0, h1Seen = false;
const fonts = new Set();
const files = walk(root);

for (const f of files) {
  const rel = relative(root, f), ext = extname(f).toLowerCase();
  const inPublic = rel.split(sep)[0] === "public";
  if (inPublic && /\.(png|jpe?g|gif|webp|avif|bmp|tiff?)$/i.test(f)) add("error", "no-raster-in-public", f, 0, "Raster image in public/: draw it in code (SVG/canvas/WebGL) instead.");
  if (inPublic && /\.(mp4|webm|mov)$/i.test(f)) add("warn", "video-asset", f, 0, "Video asset: code-only rule prefers canvas/WebGL/SVG motion.");
  if (!CODE.has(ext)) continue;
  const text = readFileSync(f, "utf8"), lines = text.split("\n");
  const isJsx = ext === ".tsx" || ext === ".jsx", isCss = ext === ".css" || ext === ".scss";
  const isLibGsap = /(^|[\\/])lib[\\/]gsap\.(ts|js)$/.test(f);
  const hasUseClient = /^\s*(?:\/\/[^\n]*\n\s*|\/\*[\s\S]*?\*\/\s*)*["']use client["']/.test(text);
  const inApp = rel.split(sep).includes("app");

  if (/prefers-reduced-motion/.test(text)) hasReduced = true;
  if (/from\s+["'](gsap|@gsap\/react|@\/lib\/gsap)/.test(text)) usesGsap = true;
  if (/from\s+["']lenis/.test(text)) usesLenis = true;
  if (/scroll-behavior\s*:\s*smooth/.test(text)) smoothCss = true;
  if (/<h1[\s>]/.test(text) || /as=["']h1["']/.test(text)) h1Seen = true;
  willChange += (text.match(/will-change/g) || []).length;
  for (const m of text.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']next\/font\/google["']/g)) m[1].split(",").forEach((n) => fonts.add(n.trim().split(/\s+as\s+/)[0]));

  if (/from\s+["']next\/image["']/.test(text)) add("error", "no-next-image", f, lineOf(text, text.search(/next\/image/)), "next/image is for raster images; this site is code-only.");
  if (isJsx && !hasUseClient && /dynamic\s*\([\s\S]{0,400}?ssr\s*:\s*false/.test(text)) add("error", "ssr-false-needs-client", f, 1, "`dynamic(..., { ssr:false })` is only allowed in a Client Component: add \"use client\" or wrap it.");
  if (isJsx && inApp && APP_FILES.test(basename(f)) && !hasUseClient && HOOKS.test(text)) add("error", "missing-use-client", f, 1, "React hooks in a Server Component file: add \"use client\" or move the hook into a client island.");
  else if (isJsx && !hasUseClient && /(^|[\\/])(components|illustrations|webgl|sections)[\\/]/.test(rel) && /\b(useGSAP|useRef|useEffect|useState)\b/.test(text)) add("warn", "maybe-missing-use-client", f, 1, "Component uses hooks without \"use client\" (fine only if every importer is a client file).");
  if (isJsx && !hasUseClient && /from\s+["'](three|@react-three\/[^"']+|ogl)["']/.test(text)) add("warn", "webgl-in-server-file", f, 1, "three/OGL imported without \"use client\".");
  if (!isLibGsap && /from\s+["']gsap(\/\w+)?["']/.test(text)) add("warn", "gsap-import-direct", f, lineOf(text, text.search(/from\s+["']gsap/)), "Import gsap and plugins from \"@/lib/gsap\" so plugins are registered once.");
  if (!isLibGsap && /(scrollTrigger\s*:|ScrollTrigger\.)/.test(text) && !/@\/lib\/gsap|registerPlugin/.test(text)) add("warn", "scrolltrigger-unregistered", f, 1, "ScrollTrigger used without importing from \"@/lib/gsap\" or registering the plugin.");
  if (/useEffect\s*\(/.test(text) && /\bgsap\./.test(text) && !/useGSAP/.test(text) && !/return\s*\(\s*\)\s*=>|\.revert\(|\.kill\(|ctx\./.test(text)) add("warn", "gsap-effect-no-cleanup", f, 1, "gsap inside useEffect without cleanup: use useGSAP({ scope }).");
  if (/addEventListener\(\s*["']wheel["']/.test(text) && /preventDefault/.test(text)) add("warn", "scroll-jack", f, 1, "wheel preventDefault (scroll-jacking): keep an escape, prefer Lenis/ScrollTrigger.");
  if (isJsx) for (const m of text.matchAll(/<svg\b[^>]*>/g)) if (!/(role=|aria-hidden|aria-label)/.test(m[0]) && !/^\s*(\/\/|\*|\/\*)/.test(lines[lineOf(text, m.index) - 1])) add("warn", "svg-a11y", f, lineOf(text, m.index), "<svg> without role/aria: add role=\"img\" + aria-label, or aria-hidden for decoration.");
  for (const m of text.matchAll(/gsap\.(?:to|from|fromTo|set)\s*\(/g)) {
    const win = text.slice(m.index, m.index + 380);
    const hit = win.match(/\b(width|height|top|left|right|bottom|margin[A-Z]\w*|padding[A-Z]\w*|fontSize|borderWidth)\s*:\s*([^,}\n]+)/);
    if (hit && !/["']?auto["']?|^\s*0\s*$/.test(hit[2])) add("warn", "layout-animation", f, lineOf(text, m.index), `Animating layout property \`${hit[1]}\`: use transform/opacity/clip-path.`);
  }

  lines.forEach((ln, i) => {
    const n = i + 1, t = ln.trim();
    if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) return;
    if (/<img[\s>/]/i.test(ln)) add("error", "no-img", f, n, "<img> is not allowed: the site must be code-only.");
    if (RASTER.test(ln) && !/data:image\/svg/.test(ln) && !/\.(?:test|spec)\./.test(f)) add("error", "no-raster-ref", f, n, "Reference to a raster image file.");
    if (HOSTS.test(ln)) add("error", "remote-image-host", f, n, "Stock/placeholder image host.");
    if (/<video[\s>]|\.(mp4|webm)(?=["'`?)\s])/.test(ln)) add("warn", "video-asset", f, n, "Video asset: prefer canvas/WebGL/SVG motion.");
    if (/from\s+["'](lottie-web|lottie-react|@lottiefiles\/[^"']+|@splinetool\/[^"']+|@rive-app\/[^"']+)["']/.test(ln)) add("warn", "asset-tool", f, n, "Asset-based animation tool: rebuild with GSAP/SVG/shaders.");
    if (/lorem ipsum|dolor sit amet/i.test(ln)) add("error", "lorem", f, n, "Placeholder lorem ipsum.");
    if (!isCss && isJsx && EMOJI.test(ln)) add("warn", "emoji", f, n, "Emoji used as icon/illustration: draw it in SVG.");
    if (/(from|via|to)-(purple|violet|indigo|fuchsia|pink)-\d{2,3}/.test(ln) || (/gradient/i.test(ln) && /#(8b5cf6|7c3aed|a855f7|6366f1|c026d3)/i.test(ln))) add("warn", "slop-gradient", f, n, "Default purple/indigo/pink gradient: build from the chosen register instead.");
    if (!isCss && SLOP_COPY.test(ln) && /["'>`]/.test(ln)) add("warn", "slop-copy", f, n, "Generic AI-marketing wording.");
    if (isJsx && /Math\.random\(\)/.test(ln)) add("warn", "random-in-render", f, n, "Math.random(): use a seeded PRNG for anything rendered (hydration + determinism).");
    if (/\bconsole\.log\(/.test(ln)) add("warn", "console-log", f, n, "Leftover console.log.");
    if (/\b100vh\b/.test(ln)) add("warn", "100vh", f, n, "Use 100svh/100dvh (mobile browser UI).");
    if (/overflow-x\s*:\s*hidden|overflow-x-hidden/.test(ln)) add("warn", "overflow-x-hidden", f, n, "overflow-x:hidden breaks pin/sticky: use overflow-x:clip on a wrapper.");
  });
}
if (usesGsap && !hasReduced) add("error", "no-reduced-motion", root, 0, "GSAP is used but no `prefers-reduced-motion` handling exists anywhere.");
if (fonts.size && [...fonts].every((n) => /^Inter(_Tight)?$/.test(n))) add("warn", "default-font-only", root, 0, "Only Inter is loaded: choose a rolled type pairing (references/03).");
if (usesLenis && smoothCss) add("warn", "lenis-vs-css-smooth", root, 0, "`scroll-behavior:smooth` conflicts with Lenis.");
if (willChange > 8) add("warn", "will-change-overuse", root, 0, `${willChange} will-change declarations: use only on continuously moving elements.`);
if (files.some((f) => /\.(tsx|jsx|html|mdx)$/.test(f)) && !h1Seen) add("warn", "no-h1", root, 0, "No <h1> found (SplitReveal as=\"h1\" counts).");

const errors = findings.filter((x) => x.level === "error"), warns = findings.filter((x) => x.level === "warn");
if (asJson) console.log(JSON.stringify({ errors: errors.length, warnings: warns.length, findings }, null, 2));
else {
  const by = {}; for (const x of findings) (by[x.file] ||= []).push(x);
  for (const [file, xs] of Object.entries(by)) { console.log(`\n${file}`); for (const x of xs) console.log(`  ${x.level === "error" ? "ERROR" : "warn "} ${x.id}${x.line ? `:${x.line}` : ""}  ${x.msg}`); }
  console.log(`\n${errors.length} error(s), ${warns.length} warning(s) in ${files.length} file(s) scanned.`);
}
process.exit(errors.length || (strict && warns.length) ? 1 : 0);
