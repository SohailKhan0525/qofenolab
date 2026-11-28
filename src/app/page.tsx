import type { Metadata } from "next";
import { SailCover, DayframeCover, EliteCraftCover, CraftCover } from "@/illustrations/LabCovers";
import QofenoOptic from "@/illustrations/QofenoOptic";
import { siteOrigin } from "@/lib/urls";
import styles from "./directory.module.css";

const title = "Qofeno Lab — Browser experiments";
const description = "An open collection of interactive experiments in real-time graphics, photography and conversational AI.";
export const metadata: Metadata = {
  title, description,
  alternates: { canonical: siteOrigin },
  icons: { icon: "/labs/qofeno/icon.svg" },
  openGraph: { type: "website", title, description, url: siteOrigin, siteName: "Qofeno Lab" },
};

const labs = [
  {
    slug: "sailboat", name: "Under Sail", category: "Interactive 3D",
    description: "Orbit a pirate ship as it cuts through a rolling sea at sunset.",
    cover: <SailCover />,
  },
  {
    slug: "skill", name: "Dayframe", category: "Photography tool",
    description: "Plan a shoot around the changing light, from blue hour to the last glow of evening.",
    cover: <DayframeCover />,
  },
  {
    slug: "qofeno", name: "Qofeno", category: "AI preview",
    description: "Explore three scripted conversations about reading closely, shaping a draft, and making a decision.",
    cover: <QofenoOptic />,
  },
  {
    slug: "elite-web-craft", name: "Qofeno Orbit", category: "Agent runtime",
    description: "Inspect scoped skill packs, deterministic pre-commit gates, and a live runtime sizer for coding agents.",
    cover: <EliteCraftCover />,
  },
  {
    slug: "craft", name: "Elite Web Craft", category: "Agent skill",
    description: "Deal a palette, type pairing and hero for a Next.js build, then see how the lint gate holds it.",
    cover: <CraftCover />,
  },
];

function DiagonalArrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19 18.7 5.3M6.7 5.2h12.1v12.1" /></svg>;
}

function LabMark() {
  return <svg viewBox="0 0 36 36" width="32" height="32" aria-hidden="true" fill="none">
    <circle cx="16.5" cy="16.5" r="13.5" stroke="currentColor" strokeWidth="2" />
    <circle cx="16.5" cy="16.5" r="9.3" stroke="currentColor" strokeWidth="1" />
    <path d="M5 20 20 5m-9 22L27 11M23 23l9 9" stroke="currentColor" strokeWidth="2" />
  </svg>;
}

export default function LabDirectory() {
  return <div className={styles.directory}>
    <header className={styles.header}>
      <div className={styles.width}>
        <span className={styles.brand}><LabMark />Qofeno Lab</span>
        <a className={styles.source} href="https://github.com/SohailKhan0525/qofenolab">View source <DiagonalArrow /></a>
      </div>
    </header>
    <main id="main" tabIndex={-1} className={styles.main}>
      <div className={styles.intro}>
        <h1>Browser<br /> experiments<span>.</span></h1>
        <p>Qofeno Lab is a collection of hands-on projects in graphics, photography, and AI. Pick a project below to try it in your browser.</p>
      </div>
      <ul className={styles.grid} aria-label="Experiments">
        {labs.map(lab => <li key={lab.slug}>
          <a className={styles.card} href={`/labs/${lab.slug}/`} aria-labelledby={`title-${lab.slug}`} aria-describedby={`desc-${lab.slug}`}>
            <div aria-hidden="true" className={`${styles.cover} ${lab.slug === "qofeno" ? styles.optic : ""}`}>{lab.cover}</div>
            <div className={styles.info}>
              <span className={styles.category}>{lab.category}</span>
              <div className={styles.heading}><h2 id={`title-${lab.slug}`}>{lab.name}</h2><span className={styles.arrow}><DiagonalArrow /></span></div>
              <p id={`desc-${lab.slug}`}>{lab.description}</p>
            </div>
          </a>
        </li>)}
      </ul>
    </main>
  </div>;
}
