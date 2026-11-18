import { cp, mkdir, readFile, rm } from "node:fs/promises";
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
console.log(`Hostinger package prepared: ${output}`);
