"use client";
// Ordered (Bayer 8x8) dither of a flowing wave in two colours; adapted from the skill's starter DitherField.
import { useRef } from "react";
import { useOglCanvas, hex } from "@/labs/elite-web-craft/useOglCanvas";

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse; uniform float uPx; uniform float uLevel; uniform vec3 uA; uniform vec3 uB;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++){ v += a*noise(p); p = p*2.02 + vec2(1.7, 9.2); a *= 0.5; } return v; }
float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a){ return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a){ a = mod(a, 8.0); return bayer4(0.5 * a) * 0.25 + bayer2(a); }
void main(){
  float aspect = uRes.x / uRes.y;
  vec2 uv = vUv * vec2(aspect, 1.0);
  float wave = uLevel + 0.18*sin(uv.x*3.0 + uTime*0.5) + 0.10*sin(uv.x*7.0 - uTime*0.8) + 0.2*(fbm(uv*vec2(1.3, 1.6) + uTime*0.1) - 0.5);
  float bx = (vUv.x - uMouse.x) * 3.0;
  wave += (uMouse.y - 0.5) * 0.08 * exp(-bx*bx);
  float lum = 1.0 - smoothstep(wave - 0.35, wave + 0.35, vUv.y);
  lum *= 0.92 + 0.08*noise(uv*40.0);
  float t = bayer8(gl_FragCoord.xy / uPx);
  float on = step(t, lum);
  gl_FragColor = vec4(mix(uA, uB, on), 1.0);
}`;

export function DitherField({ a, b, px = 3, level = 0.5, className }: { a: string; b: string; px?: number; level?: number; className?: string }) {
  const colours = useRef({ a, b });
  colours.current = { a, b };
  const host = useOglCanvas({
    frag: FRAG,
    uniforms: { uPx: { value: px * 2 }, uLevel: { value: level }, uA: { value: hex(a) }, uB: { value: hex(b) } },
    onFrame: (u, _t, dpr) => {
      u.uPx.value = px * dpr;
      u.uA.value = hex(colours.current.a);
      u.uB.value = hex(colours.current.b);
    },
  });
  return <div ref={host} className={className} aria-hidden="true" style={{ position: "absolute", inset: 0 }} />;
}
