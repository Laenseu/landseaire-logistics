export const pricingReferenceDate = "2026-10-23";

export const pricingSources = {
  hosting: { provider: "Hostinger", url: "https://www.hostinger.com/ph/pricing", classification: "Regular monthly reference-price estimate" },
  domain: { provider: "Hostinger", url: "https://www.hostinger.com/ph/tld/com-domain", classification: "Annual planning estimate" },
  workspace: { provider: "Google Workspace", url: "https://workspace.google.com/pricing", classification: "Published USD standard rate converted to PHP" },
  workspaceBilling: { provider: "Google Workspace billing", url: "https://knowledge.workspace.google.com/admin/billing/compare-flexible-and-annual-fixed-term-payment-plans", classification: "Published payment-plan terms and USD rates" },
  resend: { provider: "Resend", url: "https://resend.com/pricing", classification: "Free-tier assumption" },
  cloudflare: { provider: "Cloudflare", url: "https://www.cloudflare.com/plans/", classification: "Free-tier assumption" },
} as const;

export const annualDomainBudget = 1019;
export const workspaceReference = { usdToPhp: 63.4644, exchangeRateReferenceDate: pricingReferenceDate } as const;

export const workspacePlans = [
  { id: "starter", name: "Business Starter", annualCommitment: { label: "Annual commitment", usdPerUserPerMonth: 7, annualUsdPerUser: 84 }, flexible: { label: "Flexible monthly", usdPerUserPerMonth: 8.4, annualUsdPerUser: 100.8 }, storage: "30 GB pooled storage per user", meet: "Up to 100 participants", recording: "Not included", mailMerge: "Not included", gemini: "Gemini AI assistant in Gmail and Gemini app", vault: "Not included", security: "Basic security and administration controls" },
  { id: "standard", name: "Business Standard", annualCommitment: { label: "Annual commitment", usdPerUserPerMonth: 14, annualUsdPerUser: 168 }, flexible: { label: "Flexible monthly", usdPerUserPerMonth: 16.8, annualUsdPerUser: 201.6 }, storage: "2 TB pooled storage per user", meet: "Up to 150 participants", recording: "Included", mailMerge: "Included", gemini: "Gemini AI in Gmail, Docs, Meet, and more", vault: "Not included", security: "Starter controls plus advanced collaboration" },
  { id: "plus", name: "Business Plus", annualCommitment: { label: "Annual commitment", usdPerUserPerMonth: 22, annualUsdPerUser: 264 }, flexible: { label: "Flexible monthly", usdPerUserPerMonth: 26.4, annualUsdPerUser: 316.8 }, storage: "5 TB pooled storage per user", meet: "Up to 500 participants", recording: "Included", mailMerge: "Included", gemini: "Standard-plan Gemini features", vault: "Google Vault and eDiscovery", security: "Enhanced security and administration controls" },
] as const;

export type WorkspacePlanId = (typeof workspacePlans)[number]["id"];
export type WorkspaceBillingPlan = "annualCommitment" | "flexible";

export const websitePackages = [
  { id: "basic", option: "Option A", name: "Basic", hostingPlan: "Single", hostingAnnual: 3348, monthlyReference: 279, websites: "1 website", storage: "10 GB SSD", backups: "Weekly", description: "Best for one simple React company profile website.", recommended: false },
  { id: "business", option: "Option B", name: "Business", hostingPlan: "Premium", hostingAnnual: 5628, monthlyReference: 469, websites: "3 websites", storage: "20 GB SSD", backups: "Weekly", description: "Best for companies that need increased hosting capacity and room for additional websites.", recommended: true },
  { id: "advanced", option: "Option C", name: "Advanced", hostingPlan: "Unlimited", hostingAnnual: 6228, monthlyReference: 519, websites: "Unlimited websites", storage: "50 GB NVMe", backups: "Daily", description: "Best for companies planning to host multiple websites with greater resource requirements.", recommended: false },
] as const;

export type WebsitePackage = (typeof websitePackages)[number];

export function workspaceBudget(planId: WorkspacePlanId = "starter", users = 1, billingPlan: WorkspaceBillingPlan = "annualCommitment") {
  const plan = workspacePlans.find((item) => item.id === planId) ?? workspacePlans[0];
  const licenses = Math.max(1, Math.min(20, Math.floor(users)));
  const billing = plan[billingPlan];
  const monthlyUsd = licenses * billing.usdPerUserPerMonth;
  const annualUsd = licenses * billing.annualUsdPerUser;
  return { plan, users: licenses, billingPlan, billing, monthlyUsd, annualUsd, annualPhp: annualUsd * workspaceReference.usdToPhp };
}

export function annualPackageBudget(plan: WebsitePackage, workspacePlan: WorkspacePlanId = "starter", users = 1, billingPlan: WorkspaceBillingPlan = "annualCommitment") {
  return plan.hostingAnnual + annualDomainBudget + workspaceBudget(workspacePlan, users, billingPlan).annualPhp;
}
