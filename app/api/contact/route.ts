import { NextResponse } from "next/server";
import { z } from "zod";
const formSchema = z.object({ fullName: z.string().min(2), organization: z.string().optional(), email: z.string().email(), phone: z.string().optional(), service: z.string().min(1), vessel: z.string().optional(), location: z.string().optional(), preferredContact: z.string().optional(), message: z.string().min(10).max(5000), consent: z.literal("on"), website: z.string().optional() });
export async function POST(request: Request) {
  try { const data = formSchema.parse(await request.json()); if (data.website) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Email delivery is available on the hosted website. Please contact the team by phone or email." }, { status: 503 });
  } catch { return NextResponse.json({ error: "Please check the required fields and try again." }, { status: 400 }); }
}
