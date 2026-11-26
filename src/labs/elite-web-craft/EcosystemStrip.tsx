"use client";
import { Marquee } from "@/labs/elite-web-craft/Marquee";

const TARGETS = [
  "CLAUDE CODE",
  "CURSOR",
  "GITHUB ACTIONS",
  "LOCAL SHELL",
  "ANTIGRAVITY",
  "CODEX CLI",
  "CI RUNNERS",
];

export function EcosystemStrip() {
  return (
    <section aria-label="Supported agent environments" className="ewcMarqueeBand">
      <div
        className="ewcContainer"
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <span className="ewcMono" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)" }}>
          Drops into your existing agent loop
        </span>
        <span className="ewcMono" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)" }}>
          CLI // MCP // CI
        </span>
      </div>
      <Marquee speed={55}>
        {TARGETS.map((name) => (
          <span key={name} className="ewcMarqueeItem">
            <span>{name}</span>
            <span
              aria-hidden="true"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "999px",
                background: "var(--line-strong)",
              }}
            />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
