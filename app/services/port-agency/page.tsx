import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";
import { seoServices } from "@/content/seo-services";
import { canonicalUrl } from "@/lib/site-url";

const service = seoServices["port-agency"];
export const metadata: Metadata = {
  title: `${service.title} | A2 Landseaire Logistics Inc.`,
  description: service.description,
  alternates: { canonical: canonicalUrl("/services/port-agency.html") },
  openGraph: { title: service.title, description: service.description, url: canonicalUrl("/services/port-agency.html") },
};
export default function Page() { return <ServicePage slug="port-agency" />; }
