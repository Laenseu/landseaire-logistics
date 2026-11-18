import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://a2landseaire.com").replace(/\/$/, "");
const paths = ["", "/services/port-agency.html", "/services/customs-brokerage.html", "/services/freight-forwarding.html"];
const xmlEscape = value => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(path => `  <url><loc>${xmlEscape(`${siteUrl}${path}`)}</loc></url>`).join("\n")}\n</urlset>\n`;
writeFileSync(`${publicDirectory}sitemap.xml`, sitemap);
writeFileSync(`${publicDirectory}robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
