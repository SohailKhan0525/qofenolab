import type { NextConfig } from "next";
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

async function buildId() {
  const digest = createHash("sha256");
  const files = ["next.config.ts", "package-lock.json", "package.json", "tsconfig.json"];
  for (const root of ["public", "src"]) {
    const children = await readdir(root, { recursive: true });
    files.push(...children.map(file => path.join(root, file)));
  }
  for (const file of files.sort()) {
    if ((await stat(file)).isFile()) {
      digest.update(file.split(path.sep).join("/")).update("\0");
      digest.update(await readFile(file)).update("\0");
    }
  }
  return digest.digest("hex").slice(0, 24);
}

const config: NextConfig = {
  output: "export",
  basePath: "/qofenolab/labs/qofeno",
  trailingSlash: true,
  devIndicators: false,
  poweredByHeader: false,
  generateBuildId: buildId,
  experimental: { cpus: 2 },
};

export default config;
