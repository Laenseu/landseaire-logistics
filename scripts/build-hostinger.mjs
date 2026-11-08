import { spawnSync } from "node:child_process";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl || !/^https:\/\/[^/]+\/?$/.test(siteUrl)) {
  throw new Error("Set NEXT_PUBLIC_SITE_URL to the final HTTPS domain before building for Hostinger.");
}

const result = spawnSync(process.execPath, ["scripts/run-framework.mjs", "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    GITHUB_ACTIONS: "false",
    HOSTINGER_STATIC_EXPORT: "true",
    NEXT_PUBLIC_BASE_PATH: "",
    NEXT_PUBLIC_SITE_URL: siteUrl.replace(/\/$/, ""),
    NEXT_PUBLIC_CONTACT_ENDPOINT: "/api/contact.php",
  },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
