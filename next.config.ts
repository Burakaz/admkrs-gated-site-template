import type { NextConfig } from "next";

/**
 * Die Suite-Seiten sind statische HTMLs in public/ und laufen komplett
 * hinter dem Auth-Proxy (src/proxy.ts). "/" wird auf /index.html gemappt.
 */
const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/index.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
