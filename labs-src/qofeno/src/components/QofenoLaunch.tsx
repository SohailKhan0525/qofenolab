"use client";

import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import styles from './QofenoLaunch.module.css';

const sitePath = '/qofenolab/labs/qofeno/';
const feedURL = `https://sohailkhan0525.github.io${sitePath}updates.xml`;
const questions = [
  {
    question: 'Is this a live model?',
    answer: 'The preview uses three written examples. You can switch between them and inspect the material behind each reply. A live conversation will be part of the product we’re developing.',
  },
  {
    question: 'Can I try Qofeno with my own files?',
    answer: 'For now, the reading example includes its own sample document. The preview runs in your browser and asks for no uploads.',
  },
  {
    question: 'When will Qofeno launch?',
    answer: 'We’re still developing Qofeno. We’ll publish a release date in the launch feed when we have one.',
  },
];

// Cross-section of a collecting lens. Each dot train follows its own incident
// ray to the shared focal plane and continues beyond it on the same bearing.
function FocalPlane() {
  const rays = Array.from({ length: 23 }, (_, index) => {
    const y = 32 + 8.9 * index;
    const radius = (y - 130) / 118;
    const incidentX = 184 - 29 * Math.sqrt(Math.max(0, 1 - radius * radius));
    const exitX = 184 + 28 * Math.sqrt(Math.max(0, 1 - radius * radius));
    const endY = 130 - (y - 130) * 114 / (402 - exitX);
    return (
      <path
        key={index}
        d={`M 0 ${y.toFixed(2)} H ${incidentX.toFixed(2)} H ${exitX.toFixed(2)} L 402 130 L 516 ${endY.toFixed(2)}`}
        stroke={index % 4 === 0 ? '#f4dfbd' : '#cc8260'}
        strokeWidth={index % 4 === 0 ? 1.05 : 0.85}
        strokeDasharray={index % 4 === 0 ? '1.2 3.1' : '.5 3.3'}
        strokeLinecap="round"
      />
    );
  });
  return (
    <svg className={styles.focalDiagram} viewBox="0 0 516 260" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="qofeno-lens-grain" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx=".9" cy=".8" r=".5" fill="#df9978" />
          <circle cx="3.5" cy="3.4" r=".38" fill="#fff0d9" />
        </pattern>
      </defs>
      <path d="M0 130H516M402 13v234" stroke="#d7bf9e" strokeOpacity=".4" strokeDasharray="3 7" />
      <path d="M184 12C145 67 145 194 184 249C224 190 224 70 184 12Z" fill="#4a3630" />
      <path d="M184 12C145 67 145 194 184 249C224 190 224 70 184 12Z" fill="url(#qofeno-lens-grain)" stroke="#e5ba95" strokeWidth="1.5" />
      <path d="M184 18C169 74 169 189 184 241" stroke="#bb8b70" strokeDasharray="1 3" />
      <g>{rays}</g>
      <circle cx="402" cy="130" r="7.4" stroke="#e9ba94" strokeWidth=".9" />
      <circle cx="402" cy="130" r="2.1" fill="#f9e7d0" />
    </svg>
  );
}

export default function QofenoLaunch() {
  const sectionGroup = useRef<HTMLDivElement>(null);
  const feedInput = useRef<HTMLInputElement>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');

  useGSAP(() => {
    const motion = gsap.matchMedia();
    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const sections = sectionGroup.current?.querySelectorAll('[data-launch-section]');
      sections?.forEach(section => {
        gsap.from(section.querySelectorAll('[data-launch-enter]'), {
          y: -12,
          opacity: 0.45,
          duration: 0.7,
          stagger: 0.09,
          ease: 'power3.out',
          immediateRender: false,
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: section, start: 'top 89%', once: true },
        });
      });
    });
    return () => motion.revert();
  }, { scope: sectionGroup });

  async function copyFeed() {
    try {
      await navigator.clipboard.writeText(feedURL);
      setCopyState('copied');
    } catch {
      setCopyState('manual');
      requestAnimationFrame(() => {
        feedInput.current?.focus();
        feedInput.current?.select();
      });
    }
  }

  return (
    <div ref={sectionGroup}>
      <section id="questions" className={styles.questions} aria-labelledby="qofeno-questions" data-launch-section>
        <div className={styles.questionGrid}>
          <h2 id="qofeno-questions" className={styles.questionHeading} data-launch-enter>Before launch.</h2>
          <div className={styles.disclosures}>
            {questions.map(({ question, answer }) => (
              <details className={styles.disclosure} key={question} data-launch-enter>
                <summary><span>{question}</span><span className={styles.plus} aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section id="updates" className={styles.updates} aria-labelledby="qofeno-updates" data-launch-section>
        <div className={styles.updateGrid}>
          <div className={styles.updateCopy}>
            <h2 id="qofeno-updates" data-launch-enter>Follow the launch.</h2>
            <p data-launch-enter>Add Qofeno to your feed reader for release notes and the public launch announcement.</p>
            <div className={styles.feedActions} data-launch-enter>
              <a className={styles.importLink} href={`${sitePath}qofeno.opml`} download="qofeno.opml">
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M3 3a14 14 0 0 1 14 14M3 8a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="4" cy="16" r="1.65" fill="currentColor"/></svg>
                Import feed
              </a>
              <button className={styles.copyLink} type="button" onClick={copyFeed}>{copyState === 'copied' ? 'Link copied' : 'Copy feed link'}</button>
            </div>
            <span className={styles.visuallyHidden} role="status">{copyState === 'copied' ? 'Launch feed link copied.' : ''}</span>
            {copyState === 'manual' && (
              <label className={styles.manual}>Select and copy this feed address
                <input ref={feedInput} type="url" value={feedURL} readOnly />
              </label>
            )}
          </div>
          <div className={styles.focalArt} data-launch-enter><FocalPlane /></div>
        </div>
      </section>
    </div>
  );
}
