export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://a2landseaire.com").replace(/\/$/, "");
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function canonicalUrl(path = "/") {
  return `${siteUrl}${path}`;
}
