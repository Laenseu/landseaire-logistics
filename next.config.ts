import type { NextConfig } from "next";

const staticExport = process.env.GITHUB_ACTIONS === "true";
const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export", images: { unoptimized: true } } : {}),
  async headers() { return [{ source: "/(.*)", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }, { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }, { key: "X-Frame-Options", value: "SAMEORIGIN" }, { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }] }]; },
};

export default nextConfig;
