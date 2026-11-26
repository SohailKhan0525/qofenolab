import SmallNav from "@/components/SmallNav";
import QofenoHero, { Arrow } from "@/components/QofenoHero";
import QofenoOptic from "@/illustrations/QofenoOptic";
import QofenoConversation from "@/components/QofenoConversation";
import QofenoApproach from "@/components/QofenoApproach";
import QofenoLaunch from "@/components/QofenoLaunch";

function Aperture() {
  return <svg viewBox="0 0 36 36" aria-hidden="true" focusable="false" fill="none">
    <circle cx="17.5" cy="17" r="14.3" stroke="currentColor" strokeWidth="2.7" />
    <g fill="currentColor">{Array.from({ length: 6 }, (_, i) =>
      <path key={i} d="M18 4.6A12.6 12.6 0 0 1 27 8.7L18 11.3l-6.5 3.5z" transform={`rotate(${60 * i} 17.5 17)`} />
    )}</g>
    <path d="m23 24 9 9" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
  </svg>;
}

export default function Home() {
  return (
    <>
      <header id="top" className="site-header">
        <div className="shell nav-inner">
          <a href="#top" className="wordmark" aria-label="Qofeno, back to top"><Aperture />Qofeno</a>
          <nav aria-label="Main navigation">
            <SmallNav />
            <a className="nav-section" href="#approach">Approach</a>
            <a className="nav-section" href="#questions">Questions</a>
            <a className="nav-preview" href="#preview">Try the preview <Arrow /></a>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <QofenoHero><QofenoOptic /></QofenoHero>
        <QofenoConversation />
        <QofenoApproach />
        <QofenoLaunch />
      </main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <a className="footer-name" href="#top" aria-label="Qofeno, back to top">Qofeno<span>.</span></a>
          <div className="footer-actions">
            <a href="#preview">Try the preview <Arrow /></a>
            <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </footer>
    </>
  );
}
