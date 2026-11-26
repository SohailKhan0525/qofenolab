import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { CustomEase } from "gsap/CustomEase";

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    SplitText,
    Flip,
    DrawSVGPlugin,
    MorphSVGPlugin,
    CustomEase
  );
  ScrollTrigger.config({ ignoreMobileResize: true });
  CustomEase.create("orbit-out", "0.22,1,0.36,1");
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
  registered = true;
}
registerGsap();

export {
  gsap,
  useGSAP,
  ScrollTrigger,
  SplitText,
  Flip,
  DrawSVGPlugin,
  MorphSVGPlugin,
  CustomEase,
};
export const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
