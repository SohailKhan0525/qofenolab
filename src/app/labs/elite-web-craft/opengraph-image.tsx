import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Qofeno — Deterministic workflow runtime for AI coding agents";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#0B0B0B",
          color: "#F4F4EF",
          padding: "72px 80px",
          borderTop: "6px solid #E3FF3C",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            letterSpacing: "0.08em",
            color: "#E3FF3C",
          }}
        >
          QOFENO // AGENT RUNTIME
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: 84, lineHeight: 1, letterSpacing: "-0.03em" }}>
            Keep every agent run in orbit.
          </div>
          <div style={{ fontSize: 30, color: "#8C8C86" }}>
            Scoped context, deterministic gates, and verifiable diffs from CLI to CI.
          </div>
        </div>
      </div>
    ),
    size
  );
}
