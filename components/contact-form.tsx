"use client";
import { useEffect, useState, type FormEvent } from "react";
import { company } from "@/content/company";

const fields = [
  ["fullName", "Full name", "text", true], ["organization", "Company or organization", "text"],
  ["email", "Email", "email", true], ["phone", "Phone or WhatsApp number", "tel"],
  ["service", "Service required", "text", true], ["vessel", "Vessel name, if applicable", "text"],
  ["location", "Port or location", "text"], ["preferredContact", "Preferred contact method", "text"],
] as const;
export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [service, setService] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => { const requestedService = new URLSearchParams(window.location.search).get("service"); if (requestedService && company.services.some(([name]) => name === requestedService)) setService(requestedService); }, 0); return () => window.clearTimeout(timer); }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState("sending"); setError("");
    const form = e.currentTarget; const data = Object.fromEntries(new FormData(form));
    if (window.location.hostname.endsWith("github.io")) {
      const message = Object.entries(data).filter(([key]) => key !== "website" && key !== "consent").map(([key, value]) => `${key}: ${value}`).join("\n");
      window.location.href = `mailto:ampatiag71@gmail.com?subject=${encodeURIComponent("Landseaire Logistics Assistance Request")}&body=${encodeURIComponent(message)}`;
      setState("success"); return;
    }
    try { const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const body = await res.json(); if (!res.ok) throw new Error(body.error || "Unable to send your request."); form.reset(); setService(""); setState("success"); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to send your request."); setState("error"); }
  }
  return <form onSubmit={submit} className="form-grid"><div className="form-intro wide"><span>Request details</span><p>Fields marked with an asterisk are required.</p></div>{service && <p className="selected-service wide"><span>Selected service</span>{service}</p>}
    {fields.map(([name, label, type, required]) => <label key={name}>{label}{required && <span aria-hidden="true"> *</span>}{name === "service" ? <select name={name} required={required} aria-required={required} value={service} onChange={event => setService(event.target.value)}><option value="" disabled>Select a service</option>{company.services.map(([service]) => <option key={service} value={service}>{service}</option>)}</select> : <input name={name} type={type} required={required} aria-required={required} />}</label>)}
    <label className="wide">Message *<textarea name="message" required aria-required="true" rows={5} /></label>
    <label className="trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="consent wide"><input type="checkbox" name="consent" required /> I consent to Landseaire Logistics Co. using these details to respond to my request.</label>
    <div className="wide"><button className="button" disabled={state === "sending"}>{state === "sending" ? "Sending request…" : "Send assistance request"}</button><p aria-live="polite" className={state === "error" ? "error" : "success"}>{state === "success" ? "Thank you. Your request has been received." : error}</p></div>
  </form>;
}
