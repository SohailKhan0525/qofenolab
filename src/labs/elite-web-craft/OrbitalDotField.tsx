"use client";
import { useOglCanvas, hex } from "@/labs/elite-web-craft/useOglCanvas";

export const ORBIT_DOT_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uCell;
uniform float uEnergy;
uniform vec3 uFg;
uniform vec3 uAccent;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(
    mix(hash(i), hash(i+vec2(1.0,0.0)), f.x),
    mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x),
    f.y
  );
}

float sdRing(vec2 p, float r, float w){
  return abs(length(p) - r) - w;
}

float orbitCore(vec2 p, float t){
  float outer = sdRing(p, 0.44, 0.032);
  float mid = sdRing(p, 0.27, 0.022);
  float core = length(p) - 0.065;
  vec2 satPos = vec2(cos(t * 0.65), sin(t * 0.65)) * 0.44;
  float sat = length(p - satPos) - 0.048;
  float d = min(outer, mid);
  d = min(d, core);
  d = min(d, sat);
  return d;
}

void main(){
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 frag = gl_FragCoord.xy;
  vec2 cell = floor(frag / uCell);
  vec2 local = fract(frag / uCell) - 0.5;
  vec2 cuv = (cell + 0.5) * uCell / uRes;
  vec2 c0 = vec2(0.5, 0.5);
  vec2 p = (cuv - c0) * vec2(aspect, 1.0) * 1.15;
  vec2 mp = (uMouse - c0) * vec2(aspect, 1.0) * 1.15;

  float push = 1.0 - smoothstep(0.0, 0.34, length(p - mp));
  p += normalize(p - mp + 0.0001) * push * 0.065;

  float d = orbitCore(p, uTime);
  float body = 1.0 - smoothstep(-0.015, 0.025, d);

  float ambient = 0.16 * (0.5 + 0.5 * noise(cell * 0.18 + uTime * 0.15));
  float on = max(body * uEnergy, ambient);

  float lit = 0.5 + 0.5 * noise(cell * 0.14 - uTime * 0.2);
  float rad = mix(0.11, 0.42, lit) * on * (1.0 - push * 0.45);
  float rr = max(rad, 0.001);

  float r = length(local);
  float dotShape = 1.0 - smoothstep(max(rr - 0.06, 0.0), rr, r);
  float plusShape =
    (1.0 - smoothstep(0.045, 0.075, min(abs(local.x), abs(local.y)))) *
    (1.0 - smoothstep(rr * 0.85, rr * 1.05, max(abs(local.x), abs(local.y))));

  float shape = mix(dotShape, plusShape, step(0.24, push));
  float a = shape * step(0.03, on) * 0.65;
  vec3 col = mix(uFg, uAccent, max(push * 0.9, body * 0.55));
  gl_FragColor = vec4(col, a);
}`;

export function OrbitalDotField({
  cell = 9,
  fg = "#8C8C86",
  accent = "#E3FF3C",
  energy = 0.85,
}: {
  cell?: number;
  fg?: string;
  accent?: string;
  energy?: number;
}) {
  const host = useOglCanvas({
    frag: ORBIT_DOT_FRAG,
    uniforms: {
      uCell: { value: cell * 2 },
      uFg: { value: hex(fg) },
      uAccent: { value: hex(accent) },
      uEnergy: { value: energy },
    },
    onFrame: (u, _t, dpr) => {
      u.uCell.value = cell * dpr;
    },
  });
  return (
    <div
      ref={host}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0 }}
    />
  );
}
