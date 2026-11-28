import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Elite Web Craft — Sites dealt, not defaulted";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#EDEBE0", color: "#1F2A1F", padding: "72px 80px", borderTop: "10px solid #4C6B3C" }}>
        <div style={{ fontSize: 30, color: "#4C6B3C" }}>Elite Web Craft</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 112, lineHeight: 1, letterSpacing: "-0.03em" }}>Dealt, not defaulted.</div>
          <div style={{ fontSize: 30, color: "#667060" }}>An agent skill for Next.js sites, drawn in code and held to a lint gate.</div>
        </div>
      </div>
    ),
    size
  );
}
