import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: no Next.js runtime on Netlify, so the Netlify Next.js plugin
  // is not needed. The briefing dashboard reads Firestore from the browser.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Always define the demo switch at build time ("0" when unset). Without this the
  // variable is left as a runtime lookup when unset, and the example-data module
  // cannot be dropped from the real build.
  env: { NEXT_PUBLIC_BRIEFING_DEMO: process.env.NEXT_PUBLIC_BRIEFING_DEMO ?? "0" },
};

export default nextConfig;
