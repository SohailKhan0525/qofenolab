import type { Metadata, Viewport } from "next";
import { Gloock, Schibsted_Grotesk, Space_Mono } from "next/font/google";
import { siteOrigin } from "@/lib/urls";
import "./elite-web-craft.css";

const display = Gloock({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ewc-display",
});

const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-ewc-sans",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ewc-mono",
});

const labPath = "/labs/elite-web-craft/";
const labUrl = siteOrigin + labPath;
const title = "Qofeno — Keep every coding agent run in orbit";
const description =
  "Deterministic workflow contracts, scoped skill packs, and replayable execution ledgers for AI coding agents.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: labUrl },
  openGraph: {
    type: "website",
    title,
    description,
    url: labUrl,
    siteName: "Qofeno Lab",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
};

export default function EliteWebCraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`ewcRoot ${display.variable} ${sans.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
