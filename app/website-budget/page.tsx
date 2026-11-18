import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { WebsiteBudget } from "@/components/website-budget";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Website Budget | A2 Landseaire Logistics Inc.",
  description: "Compare website hosting and Google Workspace subscription budget estimates in Philippine pesos.",
  alternates: { canonical: "/website-budget.html" },
  robots: { index: false, follow: true },
};

export default function WebsiteBudgetPage() {
  return <>
    <a className="skip" href="#website-budget">Skip to budget planner</a>
    <header className="budget-page-header">
      <a href={`${basePath}/`} aria-label="A2 Landseaire Logistics Inc. home">
        <BrandLogo basePath={basePath} />
      </a>
      <a className="budget-back" href={`${basePath}/`}>← Back to main website</a>
    </header>
    <main className="budget-page-main"><WebsiteBudget /></main>
    <footer className="budget-page-footer"><span>A2 Landseaire Logistics Inc.</span><a href={`${basePath}/`}>Main website</a></footer>
  </>;
}
