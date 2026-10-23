"use client";
import { useEffect, useState, type FormEvent } from "react";
import { company } from "@/content/company";
import { websitePackages } from "@/content/website-budget";

const fields = [
  ["fullName", "Full name", "text", true], ["organization", "Company or organization", "text"],
  ["email", "Email", "email", true], ["phone", "Phone or WhatsApp number", "tel"],
  ["service", "Service required", "text", true], ["vessel", "Vessel name, if applicable", "text"],
  ["location", "Port or location", "text"], ["preferredContact", "Preferred contact method", "text"],
] as const;
export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "email" | "error">("idle");
  const [error, setError] = useState("");
  const [service, setService] = useState("");
  const [websitePackage, setWebsitePackage] = useState("");
  const [hostingPlan, setHostingPlan] = useState("");
  const [domainAnnual, setDomainAnnual] = useState("");
  const [workspacePlan, setWorkspacePlan] = useState("");
  const [workspaceUsers, setWorkspaceUsers] = useState("");
  const [workspaceBilling, setWorkspaceBilling] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [estimatedAnnualTotal, setEstimatedAnnualTotal] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => { const query = new URLSearchParams(window.location.search); const requestedService = query.get("service"); const requestedPackage = query.get("websitePackage"); const requestedUsers = Number(query.get("workspaceUsers")); const requestedBilling = query.get("workspaceBilling"); const requestedWorkspacePlan = query.get("workspacePlan"); const requestedHostingPlan = query.get("hostingPlan"); const requestedDomainAnnual = query.get("domainAnnual"); const requestedRate = query.get("exchangeRate"); const requestedTotal = query.get("estimatedAnnualTotal"); const validUsers = Number.isInteger(requestedUsers) && requestedUsers >= 1 && requestedUsers <= 20; const validBilling = requestedBilling === "annualCommitment" || requestedBilling === "flexible"; const validWorkspacePlan = ["Business Starter", "Business Standard", "Business Plus"].includes(requestedWorkspacePlan ?? ""); if (requestedService && company.services.some(([name]) => name === requestedService)) setService(requestedService); if (requestedPackage && websitePackages.some((item) => `${item.option} — ${item.name}` === requestedPackage)) { setWebsitePackage(requestedPackage); if (requestedHostingPlan) setHostingPlan(requestedHostingPlan); if (requestedDomainAnnual) setDomainAnnual(requestedDomainAnnual); if (validWorkspacePlan) setWorkspacePlan(requestedWorkspacePlan ?? ""); if (validUsers) setWorkspaceUsers(String(requestedUsers)); if (validBilling) setWorkspaceBilling(requestedBilling); if (requestedRate) setExchangeRate(requestedRate); if (requestedTotal) setEstimatedAnnualTotal(requestedTotal); const workspaceDetails = validUsers && validBilling && validWorkspacePlan ? `\nHosting: Hostinger ${requestedHostingPlan ?? "selected plan"}.\nDomain: .com registration ₱${Number(requestedDomainAnnual ?? 0).toLocaleString("en-PH")}/year.\nGoogle Workspace: ${requestedWorkspacePlan}, ${requestedUsers} user${requestedUsers === 1 ? "" : "s"}, ${requestedBilling === "annualCommitment" ? "annual commitment" : "flexible monthly billing"}.\nEstimated annual infrastructure total: ${requestedTotal ? `₱${Number(requestedTotal).toLocaleString("en-PH", { maximumFractionDigits: 0 })}` : "not available"}.\n` : "\n"; setMessage(`Website package enquiry: ${requestedPackage}.${workspaceDetails}\nPlease send a quotation and confirm current provider checkout pricing.`); } }, 0); return () => window.clearTimeout(timer); }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("sending"); setError("");
    const form = e.currentTarget; const data = Object.fromEntries(new FormData(form));
    if (window.location.hostname.endsWith("github.io")) {
      const message = Object.entries(data).filter(([key]) => key !== "website" && key !== "consent").map(([key, value]) => `${key}: ${value}`).join("\n");
      window.location.href = `mailto:ampatiag71@gmail.com?subject=${encodeURIComponent("Landseaire Logistics Assistance Request")}&body=${encodeURIComponent(message)}`;
      setState("email"); return;
    }
    try { const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const body = await res.json() as { error?: string }; if (!res.ok) throw new Error(body.error || "Unable to send your request."); form.reset(); setService(""); setWebsitePackage(""); setHostingPlan(""); setDomainAnnual(""); setWorkspacePlan(""); setWorkspaceUsers(""); setWorkspaceBilling(""); setExchangeRate(""); setEstimatedAnnualTotal(""); setMessage(""); setState("success"); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to send your request."); setState("error"); }
  }
  return <form onSubmit={submit} className="form-grid"><div className="form-intro wide"><span>Request details</span><p>Fields marked with an asterisk are required.</p></div>{service && <p className="selected-service wide"><span>Selected service</span>{service}</p>}{websitePackage && <p className="selected-service wide"><span>Selected website package</span>{websitePackage}{workspaceUsers && <><br />Hosting: Hostinger {hostingPlan} · .com domain ₱{Number(domainAnnual).toLocaleString("en-PH")}/year<br />Google Workspace: {workspacePlan} · {workspaceUsers} user{workspaceUsers === "1" ? "" : "s"}{workspaceBilling && ` · ${workspaceBilling === "annualCommitment" ? "Annual commitment" : "Flexible monthly"}`}{estimatedAnnualTotal && ` · Estimated total ₱${Number(estimatedAnnualTotal).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`}</>}</p>}<input type="hidden" name="websitePackage" value={websitePackage}/><input type="hidden" name="hostingPlan" value={hostingPlan}/><input type="hidden" name="domainAnnual" value={domainAnnual}/><input type="hidden" name="workspacePlan" value={workspacePlan}/><input type="hidden" name="workspaceUsers" value={workspaceUsers}/><input type="hidden" name="workspaceBilling" value={workspaceBilling}/><input type="hidden" name="exchangeRate" value={exchangeRate}/><input type="hidden" name="estimatedAnnualTotal" value={estimatedAnnualTotal}/>
    {fields.map(([name, label, type, required]) => { const isRequired = required && !(name === "service" && websitePackage); return <label key={name}>{label}{isRequired && <span aria-hidden="true"> *</span>}{name === "service" ? <select name={name} required={isRequired} aria-required={isRequired} value={service} onChange={event => setService(event.target.value)}><option value="">{websitePackage ? "Not applicable to website package enquiry" : "Select a service"}</option>{company.services.map(([service]) => <option key={service} value={service}>{service}</option>)}</select> : <input name={name} type={type} required={isRequired} aria-required={isRequired} />}</label>; })}
    <label className="wide">Message *<textarea name="message" required aria-required="true" rows={5} value={message} onChange={event => setMessage(event.target.value)} /></label>
    <label className="trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="consent wide"><input type="checkbox" name="consent" required /> I consent to Landseaire Logistics Co. using these details to respond to my request.</label>
    <div className="wide"><button className="button" disabled={state === "sending"}>{state === "sending" ? "Sending request…" : "Send assistance request"}</button><p aria-live="polite" className={state === "error" ? "error" : "success"}>{state === "success" ? "Thank you. Your request has been received." : state === "email" ? "Your email app has opened with your request. Please review it and send the email." : error}</p></div>
  </form>;
}
