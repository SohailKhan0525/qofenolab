import type { NextConfig } from "next";

const config: NextConfig = {
  trailingSlash: true,
  devIndicators: false,
  poweredByHeader: false,
  experimental: { cpus: 2 },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [{ source: "/labs/:slug/", destination: "/labs/:slug/index.html" }],
    };
  },
  async headers() {
    return [{
      source: "/labs/qofeno/updates.xml",
      headers: [{ key: "Content-Type", value: "application/atom+xml; charset=utf-8" }],
    }];
  },
};

export default config;
