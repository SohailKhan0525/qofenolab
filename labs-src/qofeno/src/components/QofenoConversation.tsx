"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./QofenoConversation.module.css";

type Example = {
  id: string;
  label: string;
  prompt: string;
  sourceName: string;
  source: readonly string[];
  answer: readonly string[];
};

const examples: readonly Example[] = [
  {
    id: "read",
    label: "Read",
    prompt: "What has to happen before the pilot opens?",
    sourceName: "Sample product memo",
    source: [
      "The pilot can open once the design team signs off on keyboard navigation.",
      "Support will send the invitations after sign-off.",
      "The icon refresh can ship in a later release.",
    ],
    answer: [
      "The design team needs to sign off on keyboard navigation. Support can then send the invitations.",
      "The icon refresh can wait until after the pilot opens.",
    ],
  },
  {
    id: "write",
    label: "Write",
    prompt: "Turn these notes into a short email to the musicians.",
    sourceName: "Rough rehearsal notes",
    source: [
      "still Thursday, same studio. start at 4 pm, was 2 pm. bring the revised score. if the time is a problem tell me by Wednesday.",
    ],
    answer: [
      "Subject: Thursday rehearsal moves to 4 pm",
      "Hi everyone, Thursday’s rehearsal will start at 4 pm instead of 2 pm, in the same studio. Please bring the revised score.",
      "If the new time doesn’t work for you, please let me know by Wednesday.",
    ],
  },
  {
    id: "reason",
    label: "Reason",
    prompt: "Which room should we book for the listening session?",
    sourceName: "Room options and priorities",
    source: [
      "The priority is hearing quiet passages. Six people are coming, and a wider seating layout would be nice.",
      "The small room seats eight and has a quiet interior wall. The large room has movable seating but shares a wall with a busy café.",
    ],
    answer: [
      "Book the small room. It fits all six listeners, and the quiet wall serves the main purpose of the session.",
      "You give up flexibility in the seating plan. Choose the large room if the layout becomes more important and you can test the café noise first.",
    ],
  },
];

function TaskIcon({ task }: { task: string }) {
  const path = task === "read"
    ? "M3.5 4.5h4.3c1.4 0 2.6.5 3.2 1.4.6-.9 1.8-1.4 3.2-1.4h4.3v11.8h-4.1c-1.4 0-2.5.5-3.4 1.2-.9-.7-2-1.2-3.4-1.2H3.5zM11 6.1v11"
    : task === "write"
      ? "m4.8 13.5 9.7-9.7a1.65 1.65 0 0 1 2.3 0l1.1 1.1a1.65 1.65 0 0 1 0 2.3l-9.7 9.7-4.8 1.3zM13 5.6l3.4 3.4M4.8 13.5l3.4 3.4"
      : "M11 18.4V10m0 2.5L5 6.6m0 0v4m0-4h4m2 5.9 6-5.9m0 0v4m0-4h-4";
  return <svg aria-hidden="true" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>;
}

function Sentence({ text }: { text: string }) {
  return <>{text.split(" ").map((word, i, words) => (
    <span key={i} data-reply-token="">{word}{i < words.length - 1 ? " " : ""}</span>
  ))}</>;
}

function ConversationSheet({ example, active, enhanced, prefix }: {
  example: Example;
  active: boolean;
  enhanced: boolean;
  prefix: string;
}) {
  const sourceRef = useRef<HTMLDetailsElement>(null);
  const firstSourceLine = useRef<HTMLLIElement>(null);
  function traceSource() {
    if (!sourceRef.current || !firstSourceLine.current) return;
    sourceRef.current.open = true;
    firstSourceLine.current.focus({ preventScroll: true });
    firstSourceLine.current.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  return (
    <article className={styles.sheet} role={enhanced ? "tabpanel" : undefined}
      id={`${prefix}-sheet-${example.id}`} aria-labelledby={`${prefix}-${enhanced ? 'tab' : 'static'}-${example.id}`}
      tabIndex={enhanced ? 0 : undefined} hidden={enhanced && !active} data-selected={active}>
      <h3 className={styles.staticTitle} id={`${prefix}-static-${example.id}`} hidden={enhanced}>{example.label}</h3>
      <div className={styles.input}>
        <p className={styles.speaker}>You</p>
        <p className={styles.question}>{example.prompt}</p>
        <details className={styles.source} ref={sourceRef}>
          <summary>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 2.5h6.8l4.2 4.2v10.8h-11zM11 2.9V7h4M7.2 10.5h5.5m-5.5 3h4" /></svg>
            {example.sourceName}
            <span aria-hidden="true" className={styles.disclosureMark} />
          </summary>
          <ol className={styles.sourceLines}>
            {example.source.map((line, i) => <li ref={i === 0 ? firstSourceLine : undefined} tabIndex={-1} key={line}>{line}</li>)}
          </ol>
        </details>
      </div>
      <div className={styles.reply}>
        <p className={styles.speaker}><span className={styles.replyMark} aria-hidden="true" />Qofeno</p>
        <div className={styles.answer}>
          {example.answer.map(line => <p key={line}><Sentence text={line} /></p>)}
        </div>
        {example.id === "read" && enhanced && <button type="button" className={styles.citation} onClick={traceSource}>Trace to memo <span aria-hidden="true">[1–3]</span></button>}
      </div>
    </article>
  );
}

export default function QofenoConversation() {
  const root = useRef<HTMLElement>(null);
  const controls = useRef<Array<HTMLButtonElement | null>>([]);
  const prefix = useId();
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => { setEnhanced(true); }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-preview-head]", {
        y: -12, immediateRender: false, duration: .7, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 92%", once: true },
      });
    });
    return () => mm.revert();
  }, { scope: root });

  useGSAP(() => {
    if (!enhanced) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = root.current?.querySelectorAll('[data-selected="true"] [data-reply-token]');
      if (!words?.length) return;
      // Reveal whole words progressively. The complete selectable reply is always in the DOM.
      gsap.fromTo(words, { opacity: .8 }, {
        opacity: 1, immediateRender: false, duration: .16, stagger: Math.min(.014, .62 / words.length), ease: "none",
        scrollTrigger: { trigger: root.current?.querySelector('[data-selected="true"]'), start: "top 94%", once: true },
      });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [active, enhanced], revertOnUpdate: true });

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const destinations: Record<string, number> = {
      ArrowLeft: (index + examples.length - 1) % examples.length,
      ArrowRight: (index + 1) % examples.length,
      Home: 0, End: examples.length - 1,
    };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    const next = destinations[event.key];
    setActive(next);
    controls.current[next]?.focus();
  }

  return (
    <section className={styles.preview} id="preview" ref={root} aria-labelledby={`${prefix}-heading`}>
      <div className={styles.wrap}>
        <div className={styles.headingRow} data-preview-head="">
          <h2 id={`${prefix}-heading`}>Look inside a reply.</h2>
          <p>Choose a task and open the source to see how the answer follows from it.</p>
        </div>
        <div className={styles.folio}>
          <div className={styles.folioBar}>
            <span className={styles.previewLabel}><span className={styles.paperMark} aria-hidden="true" />Scripted preview</span>
            {enhanced && <div className={styles.tabs} role="tablist" aria-label="Example conversations">
              {examples.map((item, index) => (
                <button type="button" key={item.id} role="tab" aria-selected={active === index}
                  aria-controls={`${prefix}-sheet-${item.id}`} id={`${prefix}-tab-${item.id}`}
                  ref={el => { controls.current[index] = el; }} tabIndex={active === index ? 0 : -1}
                  onClick={() => setActive(index)} onKeyDown={event => moveTab(event, index)}>
                  <TaskIcon task={item.id} />{item.label}
                </button>
              ))}
            </div>}
          </div>
          {examples.map((example, index) => <ConversationSheet key={example.id} example={example}
            active={active === index} enhanced={enhanced} prefix={prefix} />)}
        </div>
      </div>
    </section>
  );
}
