"use client";

import { useRef } from "react";

export default function SmallNav() {
  const menu = useRef<HTMLDetailsElement>(null);
  const close = () => { if (menu.current) menu.current.open = false; };
  return <details ref={menu} className="small-nav" onKeyDown={event => {
    if (event.key === "Escape" && menu.current?.open) {
      close();
      menu.current.querySelector("summary")?.focus();
    }
  }} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) close();
  }}>
    <summary aria-label="Section menu">
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 6h14M3 10h14M3 14h14" /></svg>
    </summary>
    <div className="small-nav-links">
      <a href="#approach" onClick={close}>Approach</a>
      <a href="#questions" onClick={close}>Questions</a>
      <a href="#updates" onClick={close}>Launch notes</a>
    </div>
  </details>;
}
