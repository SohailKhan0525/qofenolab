import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TransitionOverlay } from "@/components/TransitionOverlay";
import "@/styles/elite.css";
import "./globals.css";

// Latin webfonts distributed by Fontsource under the licenses in ./fonts.
const youngSerif = localFont({ src: "./fonts/young-serif.woff2", weight: "400", variable: "--font-display", display: "swap" });
const publicSans = localFont({ src: "./fonts/public-sans.woff2", weight: "100 900", variable: "--font-body", display: "swap" });
const title = "Qofeno — A conversational AI in development";
const description = "Meet Qofeno, an upcoming conversational AI assistant. Explore three scripted examples for reading, writing and reasoning, and follow the public launch notes.";
const url = "https://sohailkhan0525.github.io/qofenolab/labs/qofeno/";
export const metadata: Metadata = {
  title, description,
  metadataBase: new URL(url),
  alternates: { canonical: url, types: { "application/atom+xml": `${url}updates.xml` } },
  openGraph: { type: "website", title, description, url, siteName: "Qofeno" },
};
export const viewport: Viewport = { themeColor: "#f6f1e7" };

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en" className={`${youngSerif.variable} ${publicSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: "document.documentElement.classList.add('js');setTimeout(function(){document.documentElement.classList.add('js-fail')},5000)"}} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <TransitionOverlay />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
