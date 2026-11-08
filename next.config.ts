import type { NextConfig } from "next";

const githubPagesExport = process.env.GITHUB_ACTIONS === "true";
const hostingerExport = process.env.HOSTINGER_STATIC_EXPORT === "true";
const staticExport = githubPagesExport || hostingerExport;
const githubPagesBasePath = "/landseaire-logistics";
const nextConfig: NextConfig = {
  ...(staticExport
    ? {
        output: "export",
        images: { unoptimized: true },
        assetPrefix: githubPagesExport ? githubPagesBasePath : undefined,
      }
    : {}),
  async headers() { return [{ source: "/(.*)", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }, { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }, { key: "X-Frame-Options", value: "SAMEORIGIN" }, { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }] }]; },
};

export default nextConfig;
