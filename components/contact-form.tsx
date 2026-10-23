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
  const [state, setState] = useState<"idle" | "sending" | "success" | "email" | "error">("idle");
  const [error, setError] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const requestedService = new URLSearchParams(window.location.search).get("service");
      if (requestedService && company.services.some(([name]) => name === requestedService)) setService(requestedService);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (window.location.hostname.endsWith("github.io")) {
      const body = Object.entries(data).filter(([key]) => key !== "website" && key !== "consent").map(([key, value]) => `${key}: ${value}`).join("\n");
      window.location.href = `mailto:ampatiag71@gmail.com?subject=${encodeURIComponent("Landseaire Logistics Assistance Request")}&body=${encodeURIComponent(body)}`;
      setState("email");
      return;
    }
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to send your request.");
      form.reset();
      setService("");
      setMessage("");
      setState("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to send your request.");
      setState("error");
    }
  }

  return <form onSubmit={submit} className="form-grid">
    <div className="form-intro wide"><span>Request details</span><p>Fields marked with an asterisk are required.</p></div>
    {service && <p className="selected-service wide"><span>Selected service</span>{service}</p>}
    {fields.map(([name, label, type, required]) => <label key={name}>{label}{required && <span aria-hidden="true"> *</span>}{name === "service" ? <select name={name} required aria-required="true" value={service} onChange={event => setService(event.target.value)}><option value="">Select a service</option>{company.services.map(([item]) => <option key={item} value={item}>{item}</option>)}</select> : <input name={name} type={type} required={Boolean(required)} aria-required={Boolean(required)} />}</label>)}
    <label className="wide">Message *<textarea name="message" required aria-required="true" rows={5} value={message} onChange={event => setMessage(event.target.value)} /></label>
    <label className="trap" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label className="consent wide"><input type="checkbox" name="consent" required /> I consent to Landseaire Logistics Co. using these details to respond to my request.</label>
    <div className="wide"><button className="button" disabled={state === "sending"}>{state === "sending" ? "Sending request…" : "Send assistance request"}</button><p aria-live="polite" className={state === "error" ? "error" : "success"}>{state === "success" ? "Thank you. Your request has been received." : state === "email" ? "Your email app has opened with your request. Please review it and send the email." : error}</p></div>
  </form>;
}
