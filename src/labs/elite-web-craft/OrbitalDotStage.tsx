"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const OrbitalDotField = dynamic(
  () => import("@/labs/elite-web-craft/OrbitalDotField").then((m) => m.OrbitalDotField),
  { ssr: false }
);

export function OrbitalDotStage() {
  const root = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "320px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at 50% 50%, rgb(227 255 60 / 0.08) 0%, rgb(227 255 60 / 0.02) 38%, transparent 68%)",
      }}
    >
      {near && <OrbitalDotField />}
    </div>
  );
}
