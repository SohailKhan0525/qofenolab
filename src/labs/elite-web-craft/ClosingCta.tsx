"use client";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitReveal } from "@/labs/elite-web-craft/SplitReveal";
import { OrbitalDotStage } from "@/labs/elite-web-craft/OrbitalDotStage";

export function ClosingCta() {
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-cta-card]", {
          scale: 0.96,
          autoAlpha: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
        });
      });
    },
    { scope: root }
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid work email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section id="access" ref={root} className="ewcGrain ewcCtaSection">
      <OrbitalDotStage />

      <div
        aria-hidden="true"
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(11,11,11,0.82) 0%, rgba(11,11,11,0.58) 65%, rgba(11,11,11,0.88) 100%)",
        }}
      />

      <div className="ewcContainer" style={{ position: "relative", zIndex: 10 }}>
        <div data-cta-card className="ewcCtaCard">
          <p className="ewcTag">05 // Early Access Cohort</p>
          <SplitReveal
            as="h2"
            className="ewcDisplay"
            stagger={0.08}
          >
            <span style={{ fontSize: "clamp(2rem, 4vw, 3.6rem)", display: "block", marginBottom: "20px" }}>
              Put your next agent run under contract.
            </span>
          </SplitReveal>
          <p style={{ color: "var(--muted)", margin: "0 auto 32px", maxWidth: "44ch" }}>
            We are onboarding engineering teams in weekly cohorts. Request access for CLI credentials and sample skill packs.
          </p>

          {submitted ? (
            <div
              role="status"
              aria-live="polite"
              className="ewcMono"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 22px",
                borderRadius: "4px",
                border: "1px solid var(--accent)",
                background: "var(--bg)",
                fontSize: "12px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="8" stroke="#E3FF3C" strokeWidth="1.5" />
                <path d="M5.5 9.2L7.8 11.5L12.8 6.5" stroke="#E3FF3C" strokeWidth="1.8" strokeLinecap="square" />
              </svg>
              <span>
                Request queued for <strong style={{ color: "var(--accent)" }}>{email}</strong> [demo preview]
              </span>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="ewcEmailForm">
                <label htmlFor="ewc-access-email" className="ewcSrOnly">
                  Work email
                </label>
                <input
                  id="ewc-access-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="you@company.dev"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "ewc-access-error" : undefined}
                  className="ewcEmailInput"
                />
                <button type="submit" className="ewcBtnPrimary" style={{ minHeight: "48px" }}>
                  Request access
                </button>
              </div>
              {error && (
                <p
                  id="ewc-access-error"
                  role="alert"
                  className="ewcMono"
                  style={{ maxWidth: "448px", margin: "10px auto 0", textAlign: "left", fontSize: "12px", color: "var(--accent)" }}
                >
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
