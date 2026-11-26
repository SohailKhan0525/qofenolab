import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Qofeno. A second lens on your ideas. A drawing of an exploded optical lens.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const ink = "#28231d";
const paper = "#f6f1e7";
const rust = "#a34125";
const indices = (count: number) => Array.from({ length: count }, (_, i) => i);

// A side-on optical assembly, drawn specifically for the wider social card.
function OpticalAssembly() {
  const rings = [
    { x: 419, r: 40, width: 9, glass: false },
    { x: 371, r: 58, width: 15, glass: false },
    { x: 324, r: 52, width: 6, glass: true },
    { x: 125, r: 73, width: 7, glass: true },
    { x: 62, r: 82, width: 12, glass: false },
  ];
  return <svg aria-hidden="true" width="524" height="340" viewBox="0 0 524 340" fill="none">
    <defs>
      <linearGradient id="rim" x1="0%" y1="0%" x2="0%" y2="100%"><stop stopColor="#a99f87"/><stop offset=".18" stopColor="#f4e7cc"/><stop offset=".5" stopColor="#ae9e82"/><stop offset=".84" stopColor="#776d5a"/><stop offset="1" stopColor="#dfd5bb"/></linearGradient>
      <linearGradient id="barrel" x1="0%" y1="0%" x2="0%" y2="100%"><stop stopColor="#211e19"/><stop offset=".15" stopColor="#8a806a"/><stop offset=".37" stopColor="#b8ab92"/><stop offset=".59" stopColor="#706856"/><stop offset=".85" stopColor="#39362e"/><stop offset="1" stopColor="#585244"/></linearGradient>
      <radialGradient id="glass" cx="30%" cy="25%" r="84%"><stop stopColor="#f9e6c4"/><stop offset=".6" stopColor="#d4a379"/><stop offset="1" stopColor="#984c31"/></radialGradient>
    </defs>
    <g transform="translate(252 175) rotate(-23) translate(-248 0)">
      <path d="M4 0H504" stroke="#9e927e" strokeWidth="1" strokeDasharray="8 5 2 5"/>
      {rings.slice(0, 3).map(ring => drawRing(ring.x, ring.r, ring.width, ring.glass))}
      <path d="M215-88h48a36 88 0 0 1 0 176h-48a36 88 0 0 0 0-176Z" fill="url(#barrel)" stroke={ink} strokeWidth="2"/>
      <path d="M187-87h28a36 87 0 0 1 0 174h-28a36 87 0 0 0 0-174Z" fill="url(#rim)" stroke={ink} strokeWidth="2"/>
      {indices(32).map(i => {
        const angle = -1.47 + i * 2.94 / 31;
        const x = 215 + 36 * Math.cos(angle);
        const y = 88 * Math.sin(angle);
        return <g key={i}><path d={`M${x} ${y}h47`} stroke={ink} strokeWidth="1.8"/><path d={`M${x + 1.5} ${y + 1.15}h44`} stroke="#d4c9b0" strokeWidth=".8"/></g>;
      })}
      <ellipse cx="187" rx="36" ry="87" fill="url(#rim)" stroke={ink} strokeWidth="2"/>
      <g transform="translate(187 0) scale(.42 1)">
        <circle r="72" fill="#49463c" stroke={ink} strokeWidth="2"/>
        {indices(9).map(i => <path key={i} transform={`rotate(${i * 40})`} d="M-3-60A61 61 0 0 1 40-46L20-8 6-20Q11-38-3-60Z" fill="#918876" stroke={ink} strokeWidth="1.6"/>)}
        <circle r="18" fill={ink}/>
        {[78, 81].map(r => <circle key={r} r={r} fill="none" stroke="#69614f"/>)}
      </g>
      {rings.slice(3).map(ring => drawRing(ring.x, ring.r, ring.width, ring.glass))}
    </g>
  </svg>;
}

function drawRing(x: number, r: number, width: number, glass: boolean) {
  const rx = r * .39;
  const hole = r - 8;
  const front = (radius: number) => `M${x} ${-radius}a${radius * .39} ${radius} 0 1 1 -.01 0Z`;
  return <g key={x}>
    <path d={`M${x} ${-r}h${width}a${rx} ${r} 0 0 1 0 ${2*r}h${-width}a${rx} ${r} 0 0 0 0 ${-2*r}Z`} fill={glass ? "#b47855" : "url(#rim)"} stroke={ink} strokeWidth="1.6"/>
    <path d={front(r) + (glass ? "" : front(hole))} fill={glass ? "url(#glass)" : "url(#rim)"} fillRule="evenodd" stroke={ink} strokeWidth="1.6"/>
    <path d={`M${x - rx * .53} ${r * .8}A${rx - 1.7} ${r - 2} 0 0 1 ${x - 2} ${-r + 2}`} stroke="#fbefda" strokeWidth="2"/>
  </g>;
}

export default async function OpenGraphImage() {
  const font = await readFile(join(process.cwd(), "src/app/fonts/young-serif-social.woff"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "54px 64px", background: paper, color: ink, fontFamily: "Young Serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 15, borderBottom: "1.5px solid #c7bca8", paddingBottom: 24, fontSize: 44, letterSpacing: -2 }}>
        <svg aria-hidden="true" width="37" height="37" viewBox="0 0 40 40" fill="none" stroke={rust}><circle cx="18" cy="18" r="14" strokeWidth="3"/><circle cx="18" cy="18" r="9.5" strokeWidth="1.6"/><path d="m23 24 10 10" strokeWidth="3" strokeLinecap="round"/></svg>
        Qofeno
      </div>
      <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 22 }}>
        <div style={{ width: 532, display: "flex", flexDirection: "column", fontSize: 72, letterSpacing: "-3.7px", lineHeight: 1.12 }}>
          <div>A second lens</div>
          <div style={{ display: "flex" }}>on your ideas<span style={{ color: rust }}>.</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 520, height: 346, border: "1px solid #c6baa4", backgroundColor: "#efe7d5" }}>
          <OpticalAssembly />
        </div>
      </div>
    </div>,
    { ...size, fonts: [{ name: "Young Serif", data: font, weight: 400, style: "normal" }] },
  );
}
