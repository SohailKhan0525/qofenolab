"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, reduceMotion } from "@/lib/gsap";
import { QofenoMark } from "@/labs/elite-web-craft/QofenoMark";
import { MagneticButton } from "@/labs/elite-web-craft/MagneticButton";

const LINKS = [
  { id: "workflow", label: "Workflow" },
  { id: "primitives", label: "Primitives" },
  { id: "bench", label: "Sizer" },
  { id: "faq", label: "FAQ" },
];

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useGSAP(
    () => {
      const nav = navRef.current;
      const bar = progressRef.current;
      if (!nav) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (bar) {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { start: 0, end: "max", scrub: 0.15 },
            }
          );
        }

        const show = gsap
          .from(nav, {
            yPercent: -100,
            paused: true,
            duration: 0.35,
            ease: "power3.out",
          })
          .progress(1);

        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (s) => {
            if (s.scroll() > 140 && s.direction === 1) show.reverse();
            else show.play();
          },
        });

        ScrollTrigger.create({
          start: 40,
          end: "max",
          onToggle: (s) => nav.classList.toggle("is-solid", s.isActive),
        });

        LINKS.forEach(({ id }) => {
          const sec = document.getElementById(id);
          if (!sec) return;
          ScrollTrigger.create({
            trigger: sec,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (s) => {
              if (s.isActive) setActive(id);
            },
          });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        ScrollTrigger.create({
          start: 40,
          end: "max",
          onToggle: (s) => nav.classList.toggle("is-solid", s.isActive),
        });
      });
    },
    { scope: navRef }
  );

  useGSAP(
    () => {
      const menu = menuRef.current;
      if (!menu) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        menuTl.current = gsap
          .timeline({ paused: true })
          .set(menu, { display: "grid" })
          .fromTo(
            menu,
            { clipPath: "circle(0% at calc(100% - 36px) 36px)" },
            {
              clipPath: "circle(150% at calc(100% - 36px) 36px)",
              duration: 0.75,
              ease: "expo.inOut",
            }
          )
          .from(
            "[data-menu-link]",
            { yPercent: 110, autoAlpha: 0, stagger: 0.06, duration: 0.65, ease: "expo.out" },
            "-=0.4"
          );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        menuTl.current = gsap
          .timeline({ paused: true })
          .set(menu, { display: "grid", clipPath: "none" });
      });
    },
    { scope: menuRef }
  );

  useEffect(() => {
    const main = document.getElementById("main");
    if (main) {
      if (open) main.setAttribute("inert", "");
      else main.removeAttribute("inert");
    }

    if (open) menuTl.current?.play();
    else menuTl.current?.reverse();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      main?.removeAttribute("inert");
    };
  }, [open]);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" });
  };

  return (
    <>
      <header ref={navRef} className="ewcNav">
        <div ref={progressRef} aria-hidden="true" className="ewcProgress" />
        <div className="ewcContainer ewcNavInner">
          <div className="ewcBrandGroup">
            <a
              href="#top"
              onClick={(e) => scrollTo(e, "top")}
              className="ewcBrand"
            >
              <QofenoMark size={24} />
              <span>QOFENO</span>
            </a>
            <Link href="/" className="ewcBackLab" aria-label="Back to Qofeno Lab directory">
              Lab Index
            </Link>
          </div>

          <nav aria-label="Primary" className="ewcNavLinks">
            {LINKS.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollTo(e, item.id)}
                  className={`ewcNavLink ${isActive ? "is-active" : ""}`}
                >
                  <span className="ewcRoll">
                    <span>{item.label}</span>
                    <span aria-hidden="true">{item.label}</span>
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="ewcNavActions">
            <MagneticButton
              href="#access"
              onClick={(e) => scrollTo(e, "access")}
              className="ewcBtnPrimary ewcNavCtaDesktop"
            >
              Request access
            </MagneticButton>

            <button
              type="button"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              aria-controls="ewc-mobile-nav"
              onClick={() => setOpen((v) => !v)}
              className="ewcMenuBtn"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <div
        id="ewc-mobile-nav"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        style={{ display: "none" }}
        className="ewcMobileMenu"
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {LINKS.map((item, idx) => (
            <div key={item.id} style={{ overflow: "hidden" }}>
              <a
                data-menu-link
                href={`#${item.id}`}
                onClick={(e) => scrollTo(e, item.id)}
                className="ewcMobileLink"
              >
                <span>{item.label}</span>
                <span className="ewcMono" style={{ fontSize: "12px", color: "var(--accent)" }}>
                  0{idx + 1}
                </span>
              </a>
            </div>
          ))}
        </nav>

        <div style={{ paddingTop: "32px" }}>
          <a
            href="#access"
            onClick={(e) => scrollTo(e, "access")}
            className="ewcBtnPrimary"
            style={{ width: "100%", minHeight: "48px" }}
          >
            Request access
          </a>
        </div>
      </div>
    </>
  );
}
