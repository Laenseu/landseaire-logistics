import { NextResponse } from "next/server";
import { z } from "zod";
const formSchema = z.object({ fullName: z.string().min(2), organization: z.string().optional(), email: z.string().email(), phone: z.string().optional(), service: z.string().min(2), vessel: z.string().optional(), location: z.string().optional(), preferredContact: z.string().optional(), message: z.string().min(10).max(5000), consent: z.literal("on"), website: z.string().optional() });
export async function POST(request: Request) {
  try { const data = formSchema.parse(await request.json()); if (data.website) return NextResponse.json({ ok: true });
    // Connect a provider here with server-only environment variables (e.g. RESEND_API_KEY, CONTACT_RECIPIENT_EMAIL). Never expose credentials to the browser.
    if (!process.env.CONTACT_RECIPIENT_EMAIL) return NextResponse.json({ error: "The contact service is not configured yet. Please contact the team by phone or email." }, { status: 503 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "Please check the required fields and try again." }, { status: 400 }); }
}
