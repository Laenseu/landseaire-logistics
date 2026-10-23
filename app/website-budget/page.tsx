import type { Metadata } from "next";
import Image from "next/image";
import { WebsiteBudget } from "@/components/website-budget";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Website Budget | Landseaire Logistics Co.",
  description: "Compare website hosting and Google Workspace subscription budget estimates in Philippine pesos.",
  alternates: { canonical: "/website-budget.html" },
};

export default function WebsiteBudgetPage() {
  return <>
    <a className="skip" href="#website-budget">Skip to budget planner</a>
    <header className="budget-page-header">
      <a href={`${basePath}/`} aria-label="Landseaire Logistics Co. home">
        <Image src={`${basePath}/brand/landseaire-logo.png`} alt="Landseaire Logistics Co." width={180} height={80} />
      </a>
      <a className="budget-back" href={`${basePath}/`}>← Back to main website</a>
    </header>
    <main className="budget-page-main"><WebsiteBudget /></main>
    <footer className="budget-page-footer"><span>Landseaire Logistics Co.</span><a href={`${basePath}/`}>Main website</a></footer>
  </>;
}
