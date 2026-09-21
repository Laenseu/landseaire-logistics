# Landseaire Logistics Co. website

A responsive corporate website for Landseaire Logistics Co., built from the supplied company profile.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Lucide icons, and Zod validation.

## Run locally

Install dependencies with `npm ci`, copy `.env.example` to `.env.local`, then use `npm run dev`. Use `npm run lint` and `npm run build` before deployment.

## Contact form

`app/api/contact/route.ts` validates every request with Zod and includes a honeypot field. Set `CONTACT_RECIPIENT_EMAIL` and connect a server-side email provider such as Resend, SendGrid, or SMTP in that route. Provider keys must remain server-only environment variables. Until a provider is connected, the form displays a clear configuration error and users can use the listed phone or email links.

## Updating content

Update services, contacts, tagline, email, and address in `content/company.ts`. The approved tagline is deliberately stored as `[APPROVED_TAGLINE_REQUIRED]`. Confirm the business email `logistics@seantrepas.com.ph` before retaining it, as its domain does not match the company name.

## Deploy

Set `NEXT_PUBLIC_SITE_URL` to the approved domain, connect the form-email provider, then deploy through the selected hosting platform. Review the logo, legal/privacy content, and any supplied photography before launch.

## GitHub Pages

The included workflow publishes a static version to GitHub Pages on every push to `main`. GitHub Pages cannot run the server-side contact endpoint, so its form opens a prefilled email to the President's listed address; the server-backed deployment continues to use the API endpoint.
