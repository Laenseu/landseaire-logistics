import { BrandLogo } from "@/components/brand-logo";
import { basePath } from "@/lib/site-url";
import { company } from "@/content/company";
import { seoServices, type SeoServiceSlug } from "@/content/seo-services";

export function ServicePage({ slug }: { slug: SeoServiceSlug }) {
  const service = seoServices[slug];
  const contactHref = `${basePath}/?service=${encodeURIComponent(service.contactService)}#contact`;

  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className="service-page-header">
      <a href={`${basePath}/`} aria-label={`${company.name} home`}><BrandLogo basePath={basePath} /></a>
      <nav aria-label="Service navigation"><a href={`${basePath}/#services`}>All services</a><a href={`${basePath}/#contact`}>Contact</a></nav>
    </header>
    <main id="main" className="service-page-main">
      <section className="service-page-hero">
        <p className="eyebrow">{service.eyebrow}</p>
        <h1>{service.title}</h1>
        <p>{service.lead}</p>
        <a className="button" href={contactHref}>Request assistance</a>
      </section>
      <section className="service-page-section" aria-labelledby="support-heading">
        <p className="eyebrow">How we can help</p>
        <h2 id="support-heading">Support for your operation</h2>
        <div className="service-page-grid">{service.offerings.map(([name, detail]) => <article key={name}><h3>{name}</h3><p>{detail}</p></article>)}</div>
      </section>
      <section className="service-page-section service-page-request" aria-labelledby="request-heading">
        <div><p className="eyebrow">Get in touch</p><h2 id="request-heading">Tell us what you need</h2><p>{service.nextStep}</p></div>
        <a className="button" href={contactHref}>Contact our team</a>
      </section>
      <nav className="service-page-related" aria-label="Other services"><h2>Explore our services</h2><div>{Object.entries(seoServices).filter(([other]) => other !== slug).map(([other, item]) => <a key={other} href={`${basePath}/services/${other}.html`}>{item.title} →</a>)}</div></nav>
    </main>
    <footer className="service-page-footer"><span>{company.name}</span><span>{company.address.join(", ")}</span><a href={`${basePath}/`}>Back to homepage</a></footer>
  </>;
}
