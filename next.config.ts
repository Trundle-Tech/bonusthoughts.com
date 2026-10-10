import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: no Next.js runtime on Netlify, so the Netlify Next.js plugin
  // is not needed. The briefing dashboard reads Firestore from the browser.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
