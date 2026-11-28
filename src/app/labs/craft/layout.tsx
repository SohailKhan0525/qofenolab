import type { Metadata, Viewport } from "next";
import { siteOrigin } from "@/lib/urls";
import "./craft.css";

const url = siteOrigin + "/labs/craft/";
const title = "Elite Web Craft — Sites dealt, not defaulted";
const description = "An agent skill for Next.js sites that roll their own palette, type and hero, drawn entirely in code and held to a lint gate.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { type: "website", title, description, url, siteName: "Qofeno Lab" },
};
export const viewport: Viewport = { themeColor: "#EDEBE0" };

export default function CraftLayout({ children }: { children: React.ReactNode }) {
  return <div className="craft">{children}</div>;
}
