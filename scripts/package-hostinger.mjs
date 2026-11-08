import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve, sep } from "node:path";

const root = process.cwd();
const output = resolve(root, "hostinger-ready");
if (!output.startsWith(root + sep)) throw new Error("Unsafe package output path.");
const publicHtml = resolve(output, "public_html");
const build = resolve(root, "dist/client");
const hostinger = resolve(root, "hostinger");
const html = await readFile(resolve(build, "index.html"), "utf8");
const domain = "https://a2landseaire.com";
if (!html.includes(domain) || !html.includes('action="/api/contact.php"')) {
  throw new Error("Build the Hostinger site for a2landseaire.com before packaging.");
}
await rm(output, { recursive: true, force: true });
await mkdir(publicHtml, { recursive: true });
await cp(build, publicHtml, { recursive: true });
await cp(resolve(hostinger, "public_html"), publicHtml, { recursive: true });
await cp(resolve(hostinger, "vendor"), resolve(publicHtml, "api/vendor"), { recursive: true });
await cp(resolve(hostinger, "contact-config.php.example"), resolve(output, "contact-config.php.example"));
await writeFile(resolve(publicHtml, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${domain}/sitemap.xml\n`);
await writeFile(resolve(publicHtml, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${domain}/</loc></url>\n  <url><loc>${domain}/website-budget</loc></url>\n</urlset>\n`);
console.log(`Hostinger package prepared: ${output}`);
