"use client";
import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { gsap } from "@/lib/gsap";

export type Uniforms = Record<string, { value: unknown }>;

export const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const VERT = `attribute vec2 position; attribute vec2 uv; varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }`;

export function useOglCanvas({
  frag,
  uniforms: extra,
  pointer = true,
  dprMax = 2,
  onFrame,
}: {
  frag: string;
  uniforms?: Uniforms;
  pointer?: boolean;
  dprMax?: number;
  onFrame?: (u: Uniforms, t: number, dpr: number) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const dpr = Math.min(window.devicePixelRatio || 1, dprMax);
    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true, antialias: false, dpr });
    } catch {
      return;
    }
    const gl = renderer.gl;
    if (!gl) return;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.cssText = "width:100%;height:100%;display:block";
    canvas.setAttribute("aria-hidden", "true");
    el.appendChild(canvas);

    const u: Uniforms = {
      uTime: { value: 0 },
      uRes: { value: [1, 1] },
      uMouse: { value: [0.5, 0.5] },
      ...extra,
    };
    const program = new Program(gl, {
      vertex: VERT,
      fragment: frag,
      uniforms: u,
      transparent: true,
      depthTest: false,
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(el.clientWidth || 1, el.clientHeight || 1);
      u.uRes.value = [canvas.width, canvas.height];
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(el);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const m = { x: 0.5, y: 0.5 };
    const qx = gsap.quickTo(m, "x", { duration: 0.85, ease: "power3.out" });
    const qy = gsap.quickTo(m, "y", { duration: 0.85, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      qx((e.clientX - r.left) / r.width);
      qy(1 - (e.clientY - r.top) / r.height);
    };
    if (pointer && !reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    const draw = (time: number) => {
      if (!visible && !reduce) return;
      u.uTime.value = reduce ? 1.5 : time;
      u.uMouse.value = [m.x, m.y];
      onFrame?.(u, time, dpr);
      renderer.render({ scene: mesh });
    };

    if (reduce) draw(1.5);
    else gsap.ticker.add(draw);

    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return host;
}
