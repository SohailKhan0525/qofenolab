"use client";

import { useId, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./QofenoApproach.module.css";

const smallSeats = [83, 117, 151, 185].flatMap(x => [141, 181].map(y => [x, y, 0]));
const largeSeats = [[328, 119, -25], [382, 103, 2], [438, 125, 35], [449, 180, 125], [390, 202, 178], [331, 188, -148]];

function FloorPlan({ uid }: { uid: string }) {
  const chair = `#${uid}-chair`;
  return (
    <div className={styles.planStage} role="img" aria-label="The small room has eight seats beside a quiet interior wall. The large room allows a wider seating arrangement and shares its right wall with a café.">
      <svg className={styles.plan} viewBox="0 0 576 324" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`${uid}-grain`} width="27" height="23" patternUnits="userSpaceOnUse">
          <path fill="currentColor" d="M2 2h.8v.8H2zM19 7h1v1h-1zM11 13h.7v.7H11zM5 20h1v1H5zM23 18h.6v.6H23z"/>
        </pattern>
        <pattern id={`${uid}-wall-dots`} width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".7" fill="currentColor"/><circle cx="3.7" cy="3.2" r=".5" fill="currentColor"/>
        </pattern>
        <g id={`${uid}-chair`}>
          <path fill="currentColor" opacity=".12" d="M-8-6q0-3 3-3H8q3 0 3 3v15q0 3-3 3H-4q-3 0-3-3z"/>
          <g stroke="currentColor" strokeWidth="1.35">
            <path fill="var(--ap-plate)" d="M-8-7q0-2 2.5-2h11q2.5 0 2.5 2v12q0 2-2.5 2h-11Q-8 7-8 5z"/>
            <path fill="none" strokeLinecap="round" d="M-9-4v10m18-10v10M-6 8v2.4m12-2.4v2.4"/>
            <path fill="currentColor" d="M-7 4.8q7 1.9 14 0v3q-7 2-14 0z"/>
          </g>
        </g>
      </defs>
      <rect width="576" height="324" fill={`url(#${uid}-grain)`} opacity=".13"/>
      <g fill="none" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" opacity=".65">
        <path d="M49 245h491M62 58v41m156-38v37m42-39v19m248-23v13M27 105h23m-23 127h23m490-158h10m-10 158h10"/>
        <path d="M36 105v128m-3-124 6-8m-6 136 6-8m493-155v158m-3-154 6-8m-6 166 6-8"/>
      </g>
      <path className={styles.smallFloor} d="M54 99h170v139H54z" />
      <path className={styles.largeFloor} d="M255 68h259v170H255z" />
      <path d="M54 99h170v139H54zM255 68h259v170H255z" fill={`url(#${uid}-grain)`} opacity=".27" />
      <g fill={`url(#${uid}-wall-dots)`} opacity=".68">
        <path d="M59 238h105v5H59zm138 0h32V104h-5v134zm63 0h32v5h-32zm70 0h189V74h-5v164z"/>
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="miter" strokeLinecap="square">
        <path d="M160 235H57V102h164v133h-25"/>
        <path d="M287 235h-29V71h253v164H327"/>
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1.05">
        <path d="M160 235v-32m0 0a32 32 0 0 1 32 32m95 0v-36m0 0a36 36 0 0 1 36 36"/>
        <path d="M63 109h151m50-31h240m1 1v115" opacity=".5"/>
        <path d="M516 82h10v140h-10" strokeDasharray="2 3" opacity=".65"/>
      </g>
      <g className={styles.smallChairs}>{smallSeats.map(([x,y,r]) => <use key={`${x}-${y}`} href={chair} transform={`translate(${x} ${y}) rotate(${r})`} />)}</g>
      <g className={styles.largeChairs}>{largeSeats.map(([x,y,r]) => <use key={x} href={chair} transform={`translate(${x} ${y}) rotate(${r})`} />)}</g>
      <g fill="none" stroke="currentColor" strokeWidth=".9" strokeLinecap="round">
        <path d="M133 93V65l-15-15H67m457 86h24V50h-42"/>
      </g>
      </svg>
      <span className={styles.quietWall}>Quiet interior wall</span>
      <span className={styles.cafeWall}>Café next door</span>
      <span className={styles.smallRoomLabel}>Small room</span>
      <span className={styles.largeRoomLabel}>Large room</span>
    </div>
  );
}

export default function QofenoApproach() {
  const uid = useId();
  const section = useRef<HTMLElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-room-plate]", {
        y: 16, rotation: -.45, transformOrigin: "center", duration: .85, immediateRender: false,
        ease: "power3.out", clearProps: "transform,transformOrigin",
        scrollTrigger: { trigger: section.current, start: "top 85%", once: true },
      });
    });
    return () => media.revert();
  }, { scope: section });
  return (
    <section id="approach" ref={section} className={styles.approach} aria-labelledby={`${uid}-heading`}>
      <div className={styles.wrap}>
        <div className={styles.copy}>
          <h2 id={`${uid}-heading`}>Change one priority.</h2>
          <p className={styles.lead}>In the Reason example, six people need a room for a listening session. Which need comes first?</p>
          <fieldset className={styles.controls}>
            <legend>Session priority</legend>
            <label><input className={styles.quiet} type="radio" name={uid} value="quiet" defaultChecked aria-describedby={`${uid}-quiet`} /><span>Quiet listening</span></label>
            <label><input className={styles.flexible} type="radio" name={uid} value="flexible" aria-describedby={`${uid}-flexible`} /><span>Flexible seating</span></label>
          </fieldset>
          <a className={styles.link} href="#preview">Try the preview
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h13M10 4l6 6-6 6"/></svg>
          </a>
        </div>
        <div className={styles.plate} data-room-plate="">
          <FloorPlan uid={uid} />
          <div className={styles.result} aria-live="polite" aria-atomic="true">
            <div className={styles.quietResult} id={`${uid}-quiet`}>
              <h3>Book the small room.</h3>
              <p>The quiet wall makes soft passages easier to hear. The smaller footprint leaves less room to spread out.</p>
            </div>
            <div className={styles.flexibleResult} id={`${uid}-flexible`}>
              <h3>Book the large room.</h3>
              <p>Movable chairs give the group more ways to sit. Check how much café noise comes through the shared wall first.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
